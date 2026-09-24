// corepy.json: core.py episodes from the podcast RSS feed, with YouTube links
// matched from the channel feed.

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  ROOT, fetchText, log, warn, SourceError,
  xmlTag, xmlAttr, xmlBlocks, htmlToText, normalizeTitle,
} from "./lib.mjs";

export const file = "corepy.json";

const RSS = "https://anchor.fm/s/eb6edc3c/podcast/rss";
const YT_CHANNEL = "UCUo9ht5EiVMMHceR5RvxneQ";
const YT_FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL}`;
const PINS = join(ROOT, "scripts/refresh/corepy-youtube.json");
const MIN_EPISODES = 31;

// "Episode 26.1: Foo", "Episode 6 - Foo", "Ep. 5: Foo"
const NUMBER_PREFIX = /^(?:episode|ep\.?)\s*(\d+(?:\.\d+)?)\s*(?:[:\-–—|]\s*)?/i;

/** Episode number from the title, if it has one. */
export function numberFromTitle(title) {
  const m = NUMBER_PREFIX.exec(title.trim());
  return m ? m[1] : null;
}

export function stripNumber(title) {
  return title.trim().replace(NUMBER_PREFIX, "").trim();
}

/** "HH:MM:SS", "MM:SS" or plain seconds → seconds. */
export function parseDuration(s) {
  if (!s) return null;
  const parts = s.trim().split(":").map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return null;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

/** First sentence(s) of the first paragraph, at least ~40 chars, at most 220. */
export function summarize(text, max = 220) {
  const para = text.split("\n").find((l) => l.trim()) ?? "";
  // Split after . ! ? followed by a space, but not after an initial ("Greg P. Smith").
  const sentences = para.split(/(?<=(?<!\b[A-Z])[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    out = (out + " " + s.trim()).trim();
    if (out.length >= 40) break;
  }
  if (out.length <= max) return out;
  const cut = out.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : cut.length).replace(/[\s,;:]+$/, "") + "…";
}

/** podcasters.spotify.com/pod/show/X redirects to creators.spotify.com/pod/profile/X. */
function canonicalEpisodeUrl(url) {
  return url?.replace(/^https?:\/\/podcasters\.spotify\.com\/pod\/show\//, "https://creators.spotify.com/pod/profile/") ?? null;
}

export function parseRss(xml) {
  const items = xmlBlocks(xml, "item");
  return items.map((item) => {
    const title = xmlTag(item, "title")?.trim();
    const guid = xmlTag(item, "guid")?.trim();
    const pubDate = xmlTag(item, "pubDate");
    if (!title || !guid || !pubDate) throw new SourceError("RSS item missing title/guid/pubDate");
    const when = new Date(pubDate);
    if (Number.isNaN(when.getTime())) throw new SourceError(`bad pubDate ${pubDate}`);
    const tagged = xmlTag(item, "itunes:episode")?.trim() || null;
    const description = htmlToText(xmlTag(item, "description") ?? "");
    return {
      guid,
      title,
      shortTitle: stripNumber(title) || title,
      // The feed's itunes:episode tags are wrong in places (12 tagged 140,
      // 5 tagged 4, 26.2 tagged 27), so the title wins when it has a number.
      number: numberFromTitle(title) ?? tagged,
      date: when.toISOString().slice(0, 10),
      timestamp: when.getTime(),
      durationSeconds: parseDuration(xmlTag(item, "itunes:duration")),
      url: canonicalEpisodeUrl(xmlTag(item, "link")?.trim()),
      audioUrl: xmlAttr(item, "enclosure", "url"),
      description,
      summary: summarize(description),
    };
  });
}

export function parseYouTubeFeed(xml) {
  return xmlBlocks(xml, "entry").map((e) => {
    const id = xmlTag(e, "yt:videoId");
    const title = xmlTag(e, "title") ?? "";
    return { id, title, url: `https://www.youtube.com/watch?v=${id}` };
  }).filter((v) => /^[\w-]{11}$/.test(v.id ?? ""));
}

/** Match a video to an episode: same episode number, else same normalized title. */
export function matchVideo(episode, videos) {
  if (episode.number) {
    const byNumber = videos.find((v) => numberFromTitle(v.title) === episode.number);
    if (byNumber) return byNumber;
  }
  const full = normalizeTitle(episode.title);
  const short = normalizeTitle(episode.shortTitle);
  return videos.find((v) => {
    const vt = normalizeTitle(v.title);
    const vs = normalizeTitle(stripNumber(v.title));
    return vt === full || (short.length >= 6 && vs === short);
  }) ?? null;
}

async function readPins() {
  try {
    return JSON.parse(await readFile(PINS, "utf8")).episodes ?? {};
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
}

const numCmp = (a, b) => {
  const [a1, a2 = 0] = String(a ?? "0").split(".").map(Number);
  const [b1, b2 = 0] = String(b ?? "0").split(".").map(Number);
  return a1 - b1 || a2 - b2;
};

export async function refresh(previous) {
  const xml = await fetchText(RSS);
  const episodes = parseRss(xml);

  let videos = [];
  try {
    videos = parseYouTubeFeed(await fetchText(YT_FEED));
    log("corepy", `${videos.length} videos in the YouTube channel feed`);
  } catch (err) {
    if (!(err instanceof SourceError)) throw err;
    warn("corepy", `YouTube feed failed (${err.message}); keeping previous links`);
  }

  const pins = await readPins();
  const prevYoutube = new Map((previous?.episodes ?? []).map((e) => [e.guid, e.youtube]));

  for (const ep of episodes) {
    const pinned = ep.number ? pins[ep.number] : undefined;
    const matched = matchVideo(ep, videos)?.url;
    if (pinned && matched && pinned !== matched) {
      warn("corepy", `episode ${ep.number}: pinned ${pinned} but the feed suggests ${matched}; using the pin`);
    }
    ep.youtube = pinned ?? matched ?? prevYoutube.get(ep.guid) ?? null;
  }

  episodes.sort((a, b) => b.timestamp - a.timestamp || numCmp(b.number, a.number));
  for (const ep of episodes) delete ep.timestamp;

  const show = {
    title: xmlTag(xml, "title")?.trim() ?? "core.py",
    image: xmlAttr(xml, "itunes:image", "href"),
    rss: RSS,
    youtubeChannel: `https://www.youtube.com/channel/${YT_CHANNEL}`,
  };

  const out = {
    show,
    episodeCount: episodes.length,
    totalDurationSeconds: episodes.reduce((a, e) => a + (e.durationSeconds ?? 0), 0),
    latestEpisodeDate: episodes[0]?.date ?? null,
    episodes,
  };
  const withYt = episodes.filter((e) => e.youtube).length;
  log("corepy", `${episodes.length} episodes, ${withYt} with YouTube links`);
  return out;
}

export function validate(data) {
  const eps = data.episodes;
  if (eps.length < MIN_EPISODES) return `only ${eps.length} episodes (expected >= ${MIN_EPISODES})`;
  if (eps.some((e) => !e.number)) return "an episode has no number";
  const nums = eps.map((e) => e.number);
  if (new Set(nums).size !== nums.length) return `duplicate episode numbers: ${nums.join(", ")}`;
  if (eps.some((e) => !e.audioUrl || !e.url || !(e.durationSeconds > 0))) return "episode missing url/audio/duration";
  return null;
}
