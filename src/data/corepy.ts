/**
 * core.py, the podcast Łukasz Langa and I host.
 *
 * The episode list comes from src/data/generated/corepy.json. A daily GitHub
 * Action writes that file from the show's RSS feed and the YouTube channel.
 * Do not add episodes here: they appear when the feed has them. The JSON is
 * the source for the order (newest first), numbers, titles, dates, runtimes,
 * links and counts.
 *
 * This file keeps what the feed does not have:
 * - the show metadata (listen-on links, cover art, tagline);
 * - a short summary for each episode (`summaries`), 25 words or fewer.
 *   An episode without an entry uses the first sentence of its feed
 *   description.
 *
 * Numbering quirks (from the feed):
 * - Episode 26 was released in two parts, 26.1 and 26.2.
 * - Episodes 22 to 24 have no number in their titles; their numbers come
 *   from the feed's itunes:episode tag.
 * - Episode 28 has no YouTube upload.
 */

import feed from "./generated/corepy.json";

export interface CorePyEpisode {
  /** Episode number as a string, because of 26.1 and 26.2. */
  number: string;
  /** Title without the "Episode N:" prefix. */
  title: string;
  /** Publication date from the feed, ISO yyyy-mm-dd. */
  date: string;
  /** Runtime as HH:MM:SS. */
  duration: string;
  /** Runtime in seconds. */
  seconds: number;
  /** Episode page on Spotify for Creators. */
  url: string;
  /** Direct audio enclosure URL from the RSS feed. */
  audio: string;
  summary: string;
  youtube?: string;
}

export interface CorePyShow {
  name: string;
  hosts: string[];
  /** The show's own description line from the feed. */
  tagline: string;
  /** Date of the oldest feed item, ISO yyyy-mm-dd. */
  startDate: string;
  /** Local copy of the cover art (800px). */
  cover: string;
  /** 112px, 4-tone ordered-dither version of the cover, for pixel display. */
  coverPixel: string;
  links: {
    apple: string;
    spotify: string;
    youtube: string;
    pocketCasts: string;
    rss: string;
    spotifyForCreators: string;
  };
}

/** One entry of generated/corepy.json `episodes`. */
interface FeedEpisode {
  guid: string;
  number: string;
  title: string;
  shortTitle: string;
  date: string;
  durationSeconds: number;
  url: string;
  audioUrl: string;
  description: string;
  summary: string;
  youtube: string | null;
}

/**
 * Hand-written summaries. An entry applies to the feed item with the same
 * guid. If the guid changes (for example, the feed moves to a new host), the
 * entry applies to the item with the same number.
 */
const summaries: { number: string; guid: string; summary: string }[] = [
  {
    number: "30",
    guid: "5780f163-fa22-482a-9159-24a9da2e7ba5",
    summary:
      "A short live episode from EuroPython 2026. We interview Guido van Rossum about the Grail web browser, Rietveld, aesthetics in code, and music.",
  },
  {
    number: "29",
    guid: "c6ad3b77-123f-4937-b636-01314cdcc169",
    summary:
      "CPython developers now use AI tools. We talk about AI-assisted pull requests, floods of security reports, and reputation. Also, personal news.",
  },
  {
    number: "28",
    guid: "ffa1fbec-ad19-4e70-bf74-9b3f28ed6311",
    summary:
      "We look back at Python in 2025: free threading, remote debugging, the Windows install manager, the JIT, and the Steering Council election.",
  },
  {
    number: "27",
    guid: "7a7da830-b60f-482c-8170-9bbf7b2658bd",
    summary:
      "How a Python function call moves through the native call stack, the CPython frame stack, and the evaluation stack. We also cover exceptions.",
  },
  {
    number: "26.2",
    guid: "311e3cdc-014d-4a39-aff4-7f3416ede875",
    summary:
      "More interviews from the September 2025 core sprint in Cambridge, UK. Guests include Greg P. Smith, Thomas Wouters, Guido van Rossum, and Brett Cannon.",
  },
  {
    number: "26.1",
    guid: "8e35141c-a244-4046-9043-222ac670a042",
    summary:
      "Interviews from the September 2025 core sprint in Cambridge, UK. This part has 18 of the 30 interviews, with Sam Gross, Steve Dower, and others.",
  },
  {
    number: "25",
    guid: "d7b6e311-9092-4715-aef8-b19d69282e63",
    summary:
      "Ten rejected PEPs, such as syntactic macros, None-aware operators, and late-bound defaults. We imagine how Python would look if they had been accepted.",
  },
  {
    number: "24",
    guid: "6bda710d-15e0-4288-bc41-b6fddec4d7cf",
    summary:
      "The first big feature of Python 3.15: a built-in sampling profiler for Linux, macOS, and Windows. Also, perf support and memory.python.org.",
  },
  {
    number: "23",
    guid: "723f5397-012b-4625-bb73-0b1874a39754",
    summary:
      "Our recap of PyCon US 2025: the Language Summit, talks and keynotes we liked, and why you should not upgrade to Python 3.13.4.",
  },
  {
    number: "22",
    guid: "acf19b12-8f44-4234-b6cf-c5d7124280a3",
    summary:
      "Features that landed just before the Python 3.14 beta 1 freeze: template strings, asyncio introspection, REPL syntax highlighting, and remote pdb.",
  },
  {
    number: "21",
    guid: "3c481480-dd62-45ae-8bf2-944df4a99648",
    summary:
      "How garbage collection works in CPython: reference cycles, generations, delayed untracking, weak references, and the GC in free-threaded builds.",
  },
  {
    number: "20",
    guid: "f7f32acc-2b6a-4360-a683-942fee64a28a",
    summary:
      "My PEP 768 lets tools run code inside a running Python process with sys.remote_exec(). Also, the refcounting bet and PyREPL syntax highlighting.",
  },
  {
    number: "19",
    guid: "c13edf63-f350-423b-8008-7d71cd3b6886",
    summary:
      "Yury Selivanov talks about the past and future of asyncio, adding async/await to Python, contextvars, uvloop, and the Gel database.",
  },
  {
    number: "18",
    guid: "af4ecc03-6306-4d51-bc74-e625cc0d0e99",
    summary:
      "Reference counting in CPython: sys.getrefcount, TraceRefs, reference cycles, leaks, and double frees. We also cover recent changes in Python.",
  },
  {
    number: "17",
    guid: "ac35a75f-dc01-4265-8977-721dd42f9157",
    summary:
      "Core developer Savannah Ostrowski talks about how she started on CPython, her work on argparse and the JIT, and her favorite PEPs.",
  },
  {
    number: "16",
    guid: "bf5dbcd9-5b2f-44d2-8bf7-cc2ecc0cdbb3",
    summary:
      "Why and how CPython allocates memory: malloc and the heap, pymalloc and its arenas, debug tools, tracemalloc, and Memray.",
  },
  {
    number: "15",
    guid: "e362f9ac-62d5-4f69-91d0-bc17d6f196a9",
    summary:
      "We interview about half of the 40+ core developers at the 2024 core sprint at Meta in Bellevue, WA. They finish 3.13 and plan 3.14.",
  },
  {
    number: "14",
    guid: "9612feef-cd96-4947-9328-30b0201ac2fc",
    summary:
      "Notes from EuroPython and PyCon PL 2024, with our own talks and the new PyREPL. We recorded it in Łukasz's home studio in Poznań.",
  },
  {
    number: "13",
    guid: "332f6aba-d19c-4ad8-8eab-f591382f6318",
    summary:
      "Brandt Bucher talks about pattern matching, the copy-and-patch JIT, the n-body benchmark, and when Python will get faster.",
  },
  {
    number: "12",
    guid: "0ee9991c-2631-4718-90e0-dad7434cd3aa",
    summary:
      "Surprising Python behavior: integer and string interning, return in finally, all([[]]), and hash(-1). Also, news on Python 3.13 beta 2.",
  },
  {
    number: "11",
    guid: "d3a40df1-8c77-4234-9da9-cd7ce8dc81b4",
    summary:
      "Our first episode under one hour, recorded live at PyCon US 2024. We cover Language Summit topics and answer questions from the audience.",
  },
  {
    number: "10",
    guid: "5afafa80-dc18-4245-ac30-da1db6afedaf",
    summary:
      "The history of terminals and how the Python interactive interpreter works. This leads to the new PyREPL that we wrote for Python 3.13.",
  },
  {
    number: "9",
    guid: "7f53a9c3-f559-4085-b954-c6fb0d528ddf",
    summary:
      "Emily Morehouse-Valcarcel talks about the Steering Council, her small consultancy, the walrus operator (PEP 572) she implemented, and her pet peeves.",
  },
  {
    number: "8",
    guid: "33e871a4-ebdc-4c20-bc4d-ae0c6e7955e4",
    summary:
      "How the PEG parser in Python works: what PEG is, why it replaced LL(1) and not LALR, memoization, soft keywords, and the effect on Black.",
  },
  {
    number: "7",
    guid: "a36797ba-9a4a-416e-8a65-e544cb1c297b",
    summary:
      "How Python parsed source code before PEG: the original tokenizer, grammars, LL(1) parsing, and the workarounds for its limits.",
  },
  {
    number: "6",
    guid: "e8d4a815-6ff7-4b01-bc23-98f9f4753a67",
    summary:
      "How exceptions work in CPython and how they changed, from string exceptions to exception chaining to exception groups.",
  },
  {
    number: "5",
    guid: "f54410aa-6a46-4b32-8186-3d391fc03384",
    summary:
      "Carl Meyer from Meta explains Cinder, Static Python, and the Cinder JIT. He also covers the parts that moved to CPython, such as immortal objects.",
  },
  {
    number: "4",
    guid: "f88445f6-7af9-436f-9322-d50f21165054",
    summary:
      "What makes Python an interpreter: ceval.c and frame evaluation from Python 2.6 to today, computed gotos, the generated interpreter, and the JIT.",
  },
  {
    number: "3",
    guid: "c0d3b87d-ee69-48d1-9f3d-e686b1cd0365",
    summary:
      "What happens when you import a module, and how frozen and deep-frozen modules work. Also, CPython news: biased refcounting and mimalloc.",
  },
  {
    number: "2",
    guid: "100ff6af-7d5f-4241-beb2-f6742aa52aaf",
    summary:
      "PEP 703 makes the GIL optional. We cover past attempts to remove the GIL and what the PEP uses: biased refcounting, mimalloc, and GC changes.",
  },
  {
    number: "1",
    guid: "422bbdba-a4d7-4f76-b3f7-ee8dfaa1baaf",
    summary:
      "Our recap of the 2023 core sprint in Brno: the copy-and-patch JIT prototype, REPL work, C API work, and the Python 3.13.0 alpha 1 release.",
  },
];

const byGuid = new Map(summaries.map((s) => [s.guid, s.summary]));
const byNumber = new Map(summaries.map((s) => [s.number, s.summary]));

/** 2567 -> "00:42:47" */
function hms(seconds: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
}

const feedEpisodes: FeedEpisode[] = feed.episodes;

export const episodes: CorePyEpisode[] = feedEpisodes.map((e) => ({
  number: e.number,
  title: e.shortTitle || e.title,
  date: e.date,
  duration: hms(e.durationSeconds),
  seconds: e.durationSeconds,
  url: e.url,
  audio: e.audioUrl,
  summary: byGuid.get(e.guid) ?? byNumber.get(e.number) ?? e.summary,
  youtube: e.youtube ?? undefined,
}));

export const corepy: CorePyShow = {
  name: "core.py",
  hosts: ["Pablo Galindo Salgado", "Łukasz Langa"],
  tagline:
    "We talk about Python internals, because we work on Python internals. We joke about stuff, because we’re jokers.",
  startDate: episodes.at(-1)?.date ?? "2023-10-30",
  cover: "/img/corepy/cover.webp",
  coverPixel: "/img/corepy/cover-px.png",
  links: {
    apple: "https://podcasts.apple.com/us/podcast/core-py/id1712665877",
    spotify: "https://open.spotify.com/show/1PGRfdrLEwgXjQbPBNk1pW",
    youtube: "https://www.youtube.com/@core_py-ht5gb",
    pocketCasts: "https://pocketcasts.com/podcast/corepy/6e1dbb50-50a9-013c-9eb7-0acc26574db2",
    rss: "https://anchor.fm/s/eb6edc3c/podcast/rss",
    spotifyForCreators: "https://creators.spotify.com/pod/profile/corepy/",
  },
};
