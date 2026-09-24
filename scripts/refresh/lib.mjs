// Shared helpers for the data refreshers. Node 22 built-ins only.

import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

export { sleep };

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const GENERATED_DIR = join(ROOT, "src/data/generated");

const USER_AGENT = "pablogsal.com-refresh (+https://github.com/pablogsal/pablogsal.github.io)";

/**
 * An expected, external failure: network error, HTTP error, rate limit,
 * unexpected payload, failed validation. The runner keeps the previous
 * snapshot and carries on. Anything that is NOT a SourceError is treated as a
 * bug in our code and makes the run exit non-zero.
 */
export class SourceError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "SourceError";
  }
}

export function log(scope, ...args) {
  console.log(`[${scope}]`, ...args);
}

export function warn(scope, ...args) {
  console.warn(`::warning title=${scope}::`, ...args);
}

/* ─────────────────────────── HTTP ─────────────────────────── */

/**
 * fetch() with a timeout and a couple of retries on network errors and 5xx.
 * Returns the Response for any status < 500 so callers can inspect 4xx.
 */
export async function request(url, { headers = {}, timeoutMs = 30_000, retries = 2 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(1000 * 2 ** attempt);
    try {
      const res = await fetch(url, {
        headers: { "user-agent": USER_AGENT, ...headers },
        signal: AbortSignal.timeout(timeoutMs),
        redirect: "follow",
      });
      if (res.status >= 500) {
        lastError = new SourceError(`HTTP ${res.status} for ${url}`);
        continue;
      }
      return res;
    } catch (err) {
      lastError = new SourceError(`fetch failed for ${url}: ${err.message}`, { cause: err });
    }
  }
  throw lastError;
}

export async function fetchText(url, opts) {
  const res = await request(url, opts);
  if (!res.ok) throw new SourceError(`HTTP ${res.status} for ${url}`);
  return res.text();
}

export async function fetchJson(url, opts) {
  const text = await fetchText(url, opts);
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new SourceError(`invalid JSON from ${url}`, { cause: err });
  }
}

/* ─────────────────────────── GitHub API ─────────────────────────── */

const GITHUB_API = "https://api.github.com";
export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

function githubHeaders() {
  const h = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
  };
  if (GITHUB_TOKEN) h.authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

/**
 * GET a GitHub API path. Waits out primary/secondary rate limits (up to ~2
 * minutes per wait) and retries. Returns { data, res }.
 */
export async function github(pathOrUrl, { allow404 = false } = {}) {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${GITHUB_API}${pathOrUrl}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await request(url, { headers: githubHeaders() });
    if (res.status === 404 && allow404) return { data: null, res };
    if (res.status === 403 || res.status === 429) {
      const remaining = res.headers.get("x-ratelimit-remaining");
      const retryAfter = Number(res.headers.get("retry-after"));
      const reset = Number(res.headers.get("x-ratelimit-reset"));
      let waitS = 0;
      if (retryAfter > 0) waitS = retryAfter;
      else if (remaining === "0" && reset) waitS = reset - Date.now() / 1000 + 1;
      else if (res.status === 429) waitS = 30;
      if (waitS > 0 && waitS <= 130 && attempt < 3) {
        log("github", `rate limited on ${url}, waiting ${Math.ceil(waitS)}s`);
        await sleep(Math.ceil(waitS) * 1000);
        continue;
      }
      const body = await res.text();
      throw new SourceError(`GitHub ${res.status} for ${url}: ${body.slice(0, 200)}`);
    }
    if (!res.ok) {
      const body = await res.text();
      throw new SourceError(`GitHub ${res.status} for ${url}: ${body.slice(0, 200)}`);
    }
    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new SourceError(`invalid JSON from ${url}`, { cause: err });
    }
    return { data, res };
  }
  throw new SourceError(`GitHub: gave up on ${url} after repeated rate limiting`);
}

export function nextLink(res) {
  const link = res.headers.get("link") || "";
  const m = link.match(/<([^>]+)>;\s*rel="next"/);
  return m ? m[1] : null;
}

/** Yield every item of a paginated GitHub list endpoint. */
export async function* githubPages(path) {
  let url = path;
  while (url) {
    const { data, res } = await github(url);
    if (!Array.isArray(data)) throw new SourceError(`expected an array from ${url}`);
    yield* data;
    url = nextLink(res);
  }
}

/** GitHub search: 30 req/min authenticated, 10 unauthenticated. */
let lastSearchAt = 0;
export async function githubSearchCount(query) {
  const gap = GITHUB_TOKEN ? 2_100 : 6_100;
  const wait = lastSearchAt + gap - Date.now();
  if (wait > 0) await sleep(wait);
  lastSearchAt = Date.now();
  const q = encodeURIComponent(query);
  const { data } = await github(`/search/issues?q=${q}&per_page=1&sort=created&order=asc`);
  if (typeof data?.total_count !== "number") throw new SourceError(`bad search response for ${query}`);
  if (data.incomplete_results) throw new SourceError(`incomplete search results for ${query}`);
  return data;
}

/* ─────────────────────────── snapshots ─────────────────────────── */

/** JSON with recursively sorted object keys, 2-space indent, trailing newline. */
export function stableStringify(value) {
  const sort = (v) => {
    if (Array.isArray(v)) return v.map(sort);
    if (v && typeof v === "object") {
      const out = {};
      for (const k of Object.keys(v).sort()) {
        if (v[k] !== undefined) out[k] = sort(v[k]);
      }
      return out;
    }
    return v;
  };
  return JSON.stringify(sort(value), null, 2) + "\n";
}

export async function readSnapshot(name) {
  try {
    return JSON.parse(await readFile(join(GENERATED_DIR, name), "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

/**
 * Write `data` (without fetchedAt) to src/data/generated/<name>. fetchedAt is
 * only bumped when something else changed, so no-op runs produce no diff.
 * Returns true when the file changed.
 */
export async function writeSnapshot(name, data, previous) {
  const strip = (obj) => {
    if (!obj) return null;
    const { fetchedAt, ...rest } = obj;
    return rest;
  };
  if (previous && stableStringify(strip(previous)) === stableStringify(strip(data))) {
    return false;
  }
  const out = stableStringify({ ...data, fetchedAt: new Date().toISOString() });
  const file = join(GENERATED_DIR, name);
  await mkdir(GENERATED_DIR, { recursive: true });
  const tmp = `${file}.tmp`;
  await writeFile(tmp, out);
  await rename(tmp, file);
  return true;
}

/* ─────────────────────────── XML / text ─────────────────────────── */

const NAMED_ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
  hellip: "…", mdash: "—", ndash: "–",
};

export function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : m;
    }
    return NAMED_ENTITIES[e.toLowerCase()] ?? m;
  });
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Text content of the first <tag> in xml (CDATA unwrapped, entities decoded). */
export function xmlTag(xml, tag) {
  const m = xml.match(new RegExp(`<${esc(tag)}(?:\\s[^>]*)?>([\\s\\S]*?)</${esc(tag)}>`));
  if (!m) return null;
  let body = m[1].trim();
  const cdata = body.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return cdata ? cdata[1] : decodeEntities(body);
}

/** Attribute value of the first <tag ... attr="..."> in xml. */
export function xmlAttr(xml, tag, attr) {
  const m = xml.match(new RegExp(`<${esc(tag)}\\s[^>]*?\\b${esc(attr)}="([^"]*)"`));
  return m ? decodeEntities(m[1]) : null;
}

/** All raw blocks <tag>...</tag>. */
export function xmlBlocks(xml, tag) {
  const re = new RegExp(`<${esc(tag)}(?:\\s[^>]*)?>([\\s\\S]*?)</${esc(tag)}>`, "g");
  return [...xml.matchAll(re)].map((m) => m[1]);
}

/** Minimal HTML → plain text, keeping paragraph breaks as newlines. */
export function htmlToText(html) {
  const text = decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, ""),
  );
  return text
    .split("\n")
    .map((l) => l.replace(/[ \t ]+/g, " ").trim())
    .filter((l, i, arr) => l !== "" || (i > 0 && arr[i - 1] !== ""))
    .join("\n")
    .trim();
}

/** Lowercase, strip accents and punctuation, collapse whitespace. */
export function normalizeTitle(s) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
