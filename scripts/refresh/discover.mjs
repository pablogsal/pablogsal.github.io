#!/usr/bin/env node
// Look for talks and podcast episodes with Pablo that the site does not list
// yet, and write a Markdown report for a GitHub issue.
//
//   node scripts/refresh/discover.mjs                      # report on stdout
//   node scripts/refresh/discover.mjs --out report.md      # write a file (only if there are candidates)
//   node scripts/refresh/discover.mjs --previous body.md   # keep ticked boxes from the current issue
//
// Sources: the Apple iTunes Search API (no key) and, if YOUTUBE_API_KEY is
// set, the YouTube Data API v3. Items already in src/data/ or in
// scripts/refresh/discover-ignore.json are left out.
//
// With GITHUB_OUTPUT set, it writes `count` (number of candidates) and `ok`
// (true when every source answered) for the workflow.

import { readFile, readdir, writeFile, appendFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
  ROOT, fetchJson, log, warn, sleep, SourceError, decodeEntities, normalizeTitle,
} from "./lib.mjs";

const { values: args } = parseArgs({
  options: { out: { type: "string" }, previous: { type: "string" } },
});

const IGNORE_FILE = join(ROOT, "scripts/refresh/discover-ignore.json");
const DATA_DIR = join(ROOT, "src/data");

const ITUNES_TERMS = ["pablo galindo", "pablogsal", "Pablo Galindo Salgado"];
const YOUTUBE_QUERIES = ["Pablo Galindo Salgado", "Pablo Galindo python"];
const COREPY_APPLE_ID = 1712665877;
const COREPY_YT_CHANNEL = "UCUo9ht5EiVMMHceR5RvxneQ";

// "Pablo Galindo" is a common name. Keep items that also look like Python.
const MENTIONS_PABLO = /galindo|pablogsal/i;
const LOOKS_TECHNICAL =
  /python|cpython|pycon|pydata|pyday|europython|pyladies|interpreter|core dev|steering council|memray|pystack|parser|\bpep\b|programming|software|developer|compiler/i;
// Some shows only link to their own notes. A title about one of Pablo's
// projects is worth a look even when the text does not name him.
const PROJECT_TITLE = /\bmemray\b|\bpystack\b|core\.py|\bpegen\b/i;

function relevant(title, text, context = "") {
  if (PROJECT_TITLE.test(title)) return true;
  return MENTIONS_PABLO.test(text) && LOOKS_TECHNICAL.test(`${text} ${context}`);
}

/* ─────────────────────────── known items ─────────────────────────── */

const YT_ID_IN_URL = /(?:[?&]v=|youtu\.be\/|\/embed\/|\/shorts\/|\/vi\/|\/live\/)([\w-]{11})(?![\w-])/g;
const QUOTED_YT_ID = /["'`]([\w-]{11})["'`]/g;
const URL_RE = /https?:\/\/[^\s"'`<>)\]]+/g;
const STRING_LITERAL = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`([^`]*)`/g;

/** Canonical form of a URL for comparison. */
export function normalizeUrl(raw) {
  try {
    const u = new URL(raw.trim());
    u.hash = "";
    u.hostname = u.hostname.toLowerCase().replace(/^(www|m)\./, "");
    for (const k of [...u.searchParams.keys()]) {
      if (/^utm_|^uo$|^si$|^feature$|^t$/.test(k)) u.searchParams.delete(k);
    }
    return (u.origin + u.pathname).replace(/\/+$/, "") + (u.search || "");
  } catch {
    return raw.trim();
  }
}

async function listDataFiles(dir) {
  let out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return out;
    throw err;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out = out.concat(await listDataFiles(p));
    else if (/\.(ts|js|mjs|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

/**
 * Everything the site already mentions: URLs, YouTube ids, Apple episode ids
 * and titles, scanned with regexes from src/data (talks.ts, podcasts.ts,
 * corepy.ts, generated/*.json and the rest), plus the ignore list.
 */
async function loadKnown() {
  const known = { urls: new Set(), ids: new Set(), titles: [] };
  const addText = (text, { titles }) => {
    for (const m of text.matchAll(URL_RE)) {
      known.urls.add(normalizeUrl(m[0]));
      const apple = m[0].match(/[?&]i=(\d+)/);
      if (apple) known.ids.add(apple[1]);
    }
    for (const m of text.matchAll(YT_ID_IN_URL)) known.ids.add(m[1]);
    for (const m of text.matchAll(QUOTED_YT_ID)) known.ids.add(m[1]);
    if (titles) {
      for (const m of text.matchAll(STRING_LITERAL)) {
        const n = normalizeTitle(m[1] ?? m[2] ?? m[3] ?? "");
        if (n.length >= 12) known.titles.push(n);
      }
    }
  };

  for (const f of await listDataFiles(DATA_DIR)) {
    addText(await readFile(f, "utf8"), { titles: true });
  }

  let ignore = [];
  try {
    ignore = JSON.parse(await readFile(IGNORE_FILE, "utf8"));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  if (!Array.isArray(ignore)) throw new Error(`${IGNORE_FILE} must be a JSON array`);
  for (const entry of ignore) {
    const value = typeof entry === "string" ? entry : entry?.url ?? entry?.id;
    if (!value) continue;
    if (/^https?:/.test(value)) addText(value, { titles: false });
    else known.ids.add(String(value).trim());
  }
  return known;
}

function isKnown(c, known) {
  if (c.ids.some((id) => known.ids.has(id))) return true;
  if (c.urls.some((u) => known.urls.has(normalizeUrl(u)))) return true;
  const t = normalizeTitle(c.title);
  return t.length >= 12 && known.titles.some((k) => k === t || k.includes(t));
}

/* ─────────────────────────── sources ─────────────────────────── */

function snippet(text, max = 200) {
  const s = decodeEntities(String(text ?? "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  return s.length <= max ? s : s.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

async function searchItunes() {
  const found = [];
  for (const term of ITUNES_TERMS) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=podcastEpisode&limit=200`;
    const data = await fetchJson(url);
    for (const r of data.results ?? []) {
      if (r.collectionId === COREPY_APPLE_ID || /eb6edc3c/.test(r.feedUrl ?? "")) continue;
      const text = `${r.trackName} ${r.description ?? ""} ${r.shortDescription ?? ""}`;
      if (!relevant(r.trackName, text, r.collectionName)) continue;
      const trackUrl = r.trackViewUrl?.replace(/&uo=\d+/, "");
      found.push({
        kind: "podcast",
        title: r.trackName,
        where: r.collectionName,
        date: r.releaseDate?.slice(0, 10) ?? "",
        url: trackUrl,
        urls: [trackUrl, r.episodeUrl].filter(Boolean),
        ids: [String(r.trackId)],
        snippet: snippet(r.shortDescription || r.description),
      });
    }
    await sleep(3000); // iTunes allows roughly 20 calls a minute
  }
  return found;
}

async function searchYouTube(key) {
  const found = [];
  for (const q of YOUTUBE_QUERIES) {
    const params = new URLSearchParams({ part: "snippet", type: "video", maxResults: "50", q, key });
    const data = await fetchJson(`https://www.googleapis.com/youtube/v3/search?${params}`);
    for (const item of data.items ?? []) {
      const id = item.id?.videoId;
      const s = item.snippet ?? {};
      if (!id || s.channelId === COREPY_YT_CHANNEL) continue;
      const title = decodeEntities(s.title ?? "");
      const description = decodeEntities(s.description ?? "");
      const text = `${title} ${description} ${s.channelTitle ?? ""}`;
      if (!relevant(title, text)) continue;
      const url = `https://www.youtube.com/watch?v=${id}`;
      found.push({
        kind: "video",
        title,
        where: decodeEntities(s.channelTitle ?? ""),
        date: s.publishedAt?.slice(0, 10) ?? "",
        url,
        urls: [url],
        ids: [id],
        snippet: snippet(description),
      });
    }
  }
  return found;
}

/* ─────────────────────────── report ─────────────────────────── */

function dedupe(items) {
  const seen = new Set();
  return items.filter((c) => {
    const key = `${c.kind}|${normalizeTitle(c.title)}|${c.date}`;
    if (seen.has(key) || seen.has(c.url)) return false;
    seen.add(key);
    seen.add(c.url);
    return true;
  });
}

async function previouslyTicked() {
  if (!args.previous) return new Set();
  try {
    const body = await readFile(args.previous, "utf8");
    const ticked = new Set();
    for (const line of body.split("\n")) {
      const m = line.match(/^\s*- \[[xX]\] .*?(https?:\/\/\S+?)\)?\s*$/);
      if (m) ticked.add(normalizeUrl(m[1]));
    }
    return ticked;
  } catch (err) {
    if (err.code === "ENOENT") return new Set();
    throw err;
  }
}

const escapeMd = (s) => String(s ?? "").replace(/([\\`*_[\]<>|])/g, "\\$1");

function render(candidates, notes, ticked) {
  const lines = [
    "The weekly discovery workflow found these possible talks and podcast episodes.",
    "The site does not list them yet.",
    "",
    "For each item:",
    "",
    "- If you are in it, add it to `src/data/talks.ts` or `src/data/podcasts.ts`.",
    "- If it is not, add its URL to `scripts/refresh/discover-ignore.json`.",
    "",
    "The next run removes the items that are in the site data or in the ignore list.",
    "Ticked boxes stay ticked between runs.",
  ];
  const groups = [
    ["Podcast episodes", candidates.filter((c) => c.kind === "podcast")],
    ["Videos", candidates.filter((c) => c.kind === "video")],
  ];
  for (const [heading, items] of groups) {
    if (!items.length) continue;
    lines.push("", `### ${heading} (${items.length})`, "");
    for (const c of items) {
      const box = ticked.has(normalizeUrl(c.url)) ? "x" : " ";
      lines.push(`- [${box}] **${escapeMd(c.title)}** (${escapeMd(c.where)}, ${c.date}) ${c.url}`);
      if (c.snippet) lines.push(`  <br><sub>${escapeMd(c.snippet)}</sub>`);
    }
  }
  lines.push("", "---", "");
  for (const n of notes) lines.push(`- ${n}`);
  return lines.join("\n") + "\n";
}

/* ─────────────────────────── main ─────────────────────────── */

const known = await loadKnown();
log("discover", `known: ${known.urls.size} URLs, ${known.ids.size} ids, ${known.titles.length} strings`);

let ok = true;
const notes = [`Last run: ${new Date().toISOString().slice(0, 10)}.`];
let raw = [];

try {
  const items = await searchItunes();
  log("discover", `iTunes: ${items.length} relevant results`);
  raw = raw.concat(items);
  notes.push("Apple Podcasts search: done.");
} catch (err) {
  if (!(err instanceof SourceError)) throw err;
  ok = false;
  warn("discover", `iTunes search failed: ${err.message}`);
  notes.push(`Apple Podcasts search failed: ${err.message}`);
}

const ytKey = process.env.YOUTUBE_API_KEY;
if (ytKey) {
  try {
    const items = await searchYouTube(ytKey);
    log("discover", `YouTube: ${items.length} relevant results`);
    raw = raw.concat(items);
    notes.push("YouTube search: done.");
  } catch (err) {
    if (!(err instanceof SourceError)) throw err;
    ok = false;
    warn("discover", `YouTube search failed: ${err.message.replace(ytKey, "***")}`);
    notes.push("YouTube search failed. Check the `YOUTUBE_API_KEY` secret.");
  }
} else {
  log("discover", "YOUTUBE_API_KEY is not set; skipping YouTube");
  notes.push("YouTube search did not run: the `YOUTUBE_API_KEY` secret is not set.");
}

const candidates = dedupe(raw)
  .filter((c) => !isKnown(c, known))
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

log("discover", `${candidates.length} new candidates`);
const report = render(candidates, notes, await previouslyTicked());

if (args.out) {
  if (candidates.length) await writeFile(args.out, report);
} else {
  process.stdout.write(report);
}
if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `count=${candidates.length}\nok=${ok}\n`);
}
