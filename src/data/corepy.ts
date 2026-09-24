/**
 * core.py, the podcast Łukasz Langa and I host.
 *
 * Source: the show's RSS feed plus the Apple / Spotify / YouTube listings,
 * retrieved 2026-09-24. Episodes are newest first. To add an episode, prepend an
 * entry to `episodes`; the section picks the first one as "latest" and
 * recomputes the counts and total runtime.
 *
 * Numbering quirks (from the feed):
 * - Episode 26 was released in two parts, 26.1 and 26.2, so there are 31
 *   feed items for episodes numbered 1 to 30.
 * - Episodes 22 to 24 have no number in their titles; their numbers come
 *   from the feed's itunes:episode tag.
 * - Episode 28 has no YouTube upload.
 */

export interface CorePyEpisode {
  /** Episode number as a string, because of 26.1 and 26.2. */
  number: string;
  /** Title without the "Episode N:" prefix. */
  title: string;
  /** Publication date from the feed, ISO yyyy-mm-dd. */
  date: string;
  /** Runtime as in the feed, HH:MM:SS. */
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
  /** First feed pubDate, ISO yyyy-mm-dd. */
  startDate: string;
  /** Local copy of the cover art (800px). */
  cover: string;
  links: {
    apple: string;
    spotify: string;
    youtube: string;
    pocketCasts: string;
    rss: string;
    spotifyForCreators: string;
  };
}

export const corepy: CorePyShow = {
  name: "core.py",
  hosts: ["Pablo Galindo Salgado", "Łukasz Langa"],
  tagline:
    "We talk about Python internals, because we work on Python internals. We joke about stuff, because we’re jokers.",
  startDate: "2023-10-30",
  cover: "/img/corepy/cover.webp",
  links: {
    apple: "https://podcasts.apple.com/us/podcast/core-py/id1712665877",
    spotify: "https://open.spotify.com/show/1PGRfdrLEwgXjQbPBNk1pW",
    youtube: "https://www.youtube.com/@core_py-ht5gb",
    pocketCasts: "https://pocketcasts.com/podcast/corepy/6e1dbb50-50a9-013c-9eb7-0acc26574db2",
    rss: "https://anchor.fm/s/eb6edc3c/podcast/rss",
    spotifyForCreators: "https://creators.spotify.com/pod/profile/corepy/",
  },
};

export const episodes: CorePyEpisode[] = [
  {
    number: "30",
    title: "Live from EuroPython, an Interview with Guido van Rossum",
    date: "2026-07-28",
    duration: "00:42:47",
    seconds: 2567,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-30-Live-from-EuroPython--an-Interview-with-Guido-van-Rossum-e3mm0qt",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/123453725/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-6-28%2Fcc25a7c4-428d-edf1-fad2-864d4e45e278.mp3",
    summary:
      "Short live episode recorded at EuroPython 2026: an interview with Guido van Rossum covering the Grail web browser, how his beliefs changed over time, aesthetics in coding, Rietveld, and his taste in music.",
    youtube: "https://www.youtube.com/watch?v=0I0eklx-lEQ",
  },
  {
    number: "29",
    title: "Is CPython developed with AI now?",
    date: "2026-04-17",
    duration: "02:09:18",
    seconds: 7758,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-29-Is-CPython-developed-with-AI-now-e3i18ic",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/118579212/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-3-17%2F7397f246-0157-848c-e6d5-963830df3df0.mp3",
    summary:
      "What it really means in practice that AI tools are now used in the CPython repository, with first-hand opinions on AI-assisted PRs, security-report floods and reputation, plus personal news.",
    youtube: "https://www.youtube.com/watch?v=7foVLeNc36g",
  },
  {
    number: "28",
    title: "2025 In Review",
    date: "2026-01-03",
    duration: "01:16:43",
    seconds: 4603,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-28-2025-In-Review-e3d4qra",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/113453354/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2026-0-3%2F022eef66-727c-7504-3557-cff2dd914096.mp3",
    summary:
      "A lighter look back at 2025 in Python: the good (free threading, remote debugging, the Windows install manager), the uncertain (the JIT, SC elections, another type checker), and the disgusting.",
  },
  {
    number: "27",
    title: "Calling Things, Part 1",
    date: "2025-12-07",
    duration: "02:05:40",
    seconds: 7540,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-27-Calling-Things--Part-1-e3c0f62",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/112261762/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-11-7%2F57367fa1-35af-c571-f1d0-7a1994721c3b.mp3",
    summary:
      "How synchronous Python function calls work across the system call stack, the CPython frame stack and the interpreter evaluation stack, including how exceptions fit into the execution model.",
    youtube: "https://www.youtube.com/watch?v=zOFmlUUsU-U",
  },
  {
    number: "26.2",
    title: "CPython Sprint Week in Cambridge UK, Part 2",
    date: "2025-10-25",
    duration: "02:18:19",
    seconds: 8299,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-26-2-CPython-Sprint-Week-in-Cambridge-UK--Part-2-e3a1hot",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/110200029/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-9-25%2F353d6e9a-adde-0004-c345-9bef1c5f39e8.mp3",
    summary:
      "More interviews from the September 2025 CPython core sprint in Cambridge, UK, with Greg P. Smith, Thomas Wouters, Guido van Rossum, Brett Cannon, Yury Selivanov, organizer Diego Russo and others.",
    youtube: "https://www.youtube.com/watch?v=uQdsYph6SIE",
  },
  {
    number: "26.1",
    title: "CPython Sprint Week in Cambridge UK, Part 1",
    date: "2025-10-15",
    duration: "02:24:53",
    seconds: 8693,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-26-1-CPython-Sprint-Week-in-Cambridge-UK--Part-1-e39jabg",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/109733680/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-9-15%2F3622a118-da91-8116-c7a2-fa7fed837f84.mp3",
    summary:
      "First batch of interviews (18 of the 30 recorded) from the September 2025 CPython core sprint in Cambridge, UK, including Sam Gross, Steve Dower, Petr Viktorin, Brandt Bucher, Victor Stinner and Mark Shannon.",
    youtube: "https://www.youtube.com/watch?v=V3-BS-fL9G4",
  },
  {
    number: "25",
    title: "A Python That Never Was",
    date: "2025-08-26",
    duration: "02:01:23",
    seconds: 7283,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-25-A-Python-That-Never-Was-e37bk50",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/107384416/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-7-26%2Fd5a0c91b-d1e8-4bf0-3ad9-6cbe8a6c95f4.mp3",
    summary:
      "An alternate-history tour of ten rejected PEPs (syntactic macros, None-aware operators, late-bound defaults and more) imagining how Python would look had they been accepted.",
    youtube: "https://www.youtube.com/watch?v=wmA_WBV3Rsc",
  },
  {
    number: "24",
    title: "The Megahertz",
    date: "2025-07-12",
    duration: "01:42:23",
    seconds: 6143,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/The-Megahertz-e35ffoi",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/105413842/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-6-12%2F678d4e25-46a6-e92e-4100-83ded67fff04.mp3",
    summary:
      "The first big feature of Python 3.15, a built-in sampling profiler for Linux, macOS and Windows, plus perf support improvements and memory.python.org.",
    youtube: "https://www.youtube.com/watch?v=veigyI2oK7c",
  },
  {
    number: "23",
    title: "PyCon US 2025 Recap",
    date: "2025-06-13",
    duration: "01:36:11",
    seconds: 5771,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/PyCon-US-2025-Recap-e347dc3",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/104100675/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-5-13%2Fb281ac3a-b0ec-49b9-b31d-7a90031e910d.mp3",
    summary:
      "A recap of PyCon US 2025 from the hosts' perspective: the Language Summit, favorite talks and keynotes, and a warning not to upgrade to Python 3.13.4.",
    youtube: "https://www.youtube.com/watch?v=ABfToJtAY8Y",
  },
  {
    number: "22",
    title: "Beta Frenzy",
    date: "2025-05-06",
    duration: "01:19:11",
    seconds: 4751,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Beta-Frenzy-e32fe2m",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/102266390/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-4-6%2Fc4f214a2-a3fc-153c-b1d5-d2061d26923c.mp3",
    summary:
      "The last-minute features landing before the Python 3.14 beta 1 feature freeze: template strings, asyncio introspection, REPL syntax highlighting and color themes, remote pdb, and the Windows install manager.",
    youtube: "https://www.youtube.com/watch?v=Q-RWVrM7elI",
  },
  {
    number: "21",
    title: "A Garbage Episode",
    date: "2025-04-17",
    duration: "01:57:34",
    seconds: 7054,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-21-A-Garbage-Episode-e31lbg6",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/101411782/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-3-17%2F52f68e0f-8cd6-4bab-c016-c605f226174a.mp3",
    summary:
      "Garbage collection in CPython in full: reference cycles, generations, delayed untracking, weak references, and how the GC works in free-threaded builds.",
    youtube: "https://www.youtube.com/watch?v=c6kbhAoqcd4",
  },
  {
    number: "20",
    title: "Remote Code Execution By Design",
    date: "2025-03-24",
    duration: "01:44:20",
    seconds: 6260,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-20-Remote-Code-Execution-By-Design-e30j8hi",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/100294642/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-2-24%2Febf9f075-b70a-6281-0f82-062c7cf108d8.mp3",
    summary:
      "Pablo's latest PEP, which lets tools safely run code inside a running Python process via sys.remote_exec(), plus the refcounting bet resolution and PyREPL syntax highlighting.",
    youtube: "https://www.youtube.com/watch?v=XyarRmNyeD0",
  },
  {
    number: "19",
    title: "Async hacks, unicorns and velociraptors",
    date: "2025-03-08",
    duration: "02:07:21",
    seconds: 7641,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-19-Async-hacks--unicorns-and-velociraptors-e2vs6gp",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/99538905/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-2-8%2F3252af2b-4c9a-3840-c4f0-c98a8edb8720.mp3",
    summary:
      "Interview with core developer Yury Selivanov on asyncio's past and future, adding async/await to Python, contextvars, uvloop, composable design and the Gel database.",
    youtube: "https://www.youtube.com/watch?v=9lOYMl4wJgk",
  },
  {
    number: "18",
    title: "Reference Counting",
    date: "2025-01-24",
    duration: "01:39:07",
    seconds: 5947,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-18-Reference-Counting-e2tuqnq",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/97527994/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2025-0-24%2Fe461f41c-02fa-7005-794b-af9421d4a4d3.mp3",
    summary:
      "Reference counting in CPython: sys.getrefcount, TraceRefs, advantages and disadvantages, reference cycles, leaks and double frees, plus recent Python changes.",
    youtube: "https://www.youtube.com/watch?v=P7F81Axwu4Y",
  },
  {
    number: "17",
    title: "Argparse, JIT, and balloons with Savannah Ostrowski",
    date: "2024-11-19",
    duration: "01:45:06",
    seconds: 6306,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-17-Argparse--JIT--and-balloons-with-Savannah-Ostrowski-e2r61lh",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/94618737/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-10-18%2F9cb9c0d7-2b51-f4b2-46ce-f619ae928adb.mp3",
    summary:
      "Interview with the newest core developer Savannah Ostrowski about her path to CPython, her work on argparse and the JIT, and favorite and least favorite PEPs.",
    youtube: "https://www.youtube.com/watch?v=1x3QRueDPXY",
  },
  {
    number: "16",
    title: "Memory Allocation",
    date: "2024-10-29",
    duration: "01:45:52",
    seconds: 6352,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-16-Memory-Allocation-e2qai66",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/93718150/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-9-29%2F2f12e874-c0ec-7d6f-66f2-b866029fca43.mp3",
    summary:
      "How and why CPython does custom memory allocation: malloc and the heap, pymalloc and its arenas, debugging aids, tracemalloc and memray.",
    youtube: "https://www.youtube.com/watch?v=w7MkHceZOJo",
  },
  {
    number: "15",
    title: "Core sprint at Meta",
    date: "2024-10-03",
    duration: "01:56:03",
    seconds: 6963,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-15-Core-sprint-at-Meta-e2p64tc",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/92524908/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-9-3%2F6007765b-8d7a-8eba-fff5-8c6280a1ddfa.mp3",
    summary:
      "Interviews with about half of the 40+ core developers at the 2024 core sprint hosted by Meta in Bellevue, WA, finishing Python 3.13 and planning 3.14.",
    youtube: "https://www.youtube.com/watch?v=G9A0kh-iomY",
  },
  {
    number: "14",
    title: "Integration Events",
    date: "2024-09-03",
    duration: "01:30:50",
    seconds: 5450,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-14-Integration-Events-e2nuru6",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/91237766/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-8-3%2Fdccb3c88-811c-87b1-fa92-f55ebae8e939.mp3",
    summary:
      "Highlights from EuroPython and PyCon PL 2024, including the hosts' own talks and the new PyREPL, recorded in person in Łukasz's home studio in Poznań.",
    youtube: "https://www.youtube.com/watch?v=-zAVqa6CK2U",
  },
  {
    number: "13",
    title: "A Legit Episode",
    date: "2024-06-29",
    duration: "01:51:55",
    seconds: 6715,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-13-A-Legit-Episode-e2lepe4",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/88613764/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-5-29%2F643595b2-50ef-aef7-d065-e2f907a54151.mp3",
    summary:
      "Interview with core developer Brandt Bucher about pattern matching, the copy-and-patch JIT, the n-body benchmark and when Python will get faster.",
    youtube: "https://www.youtube.com/watch?v=IGYxMsHw9iw",
  },
  {
    number: "12",
    title: "WTF Python",
    date: "2024-06-10",
    duration: "01:24:55",
    seconds: 5095,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-12-WTF-Python-e2kn1rj",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/87835955/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-5-10%2F2a870e96-1fab-1ead-b6ff-de00612cee0d.mp3",
    summary:
      "A tour of surprising Python behaviors (integer and string interning, return in finally, all([[]]), hash(-1)) plus news on Python 3.13 beta 2 and pyrepl.",
    youtube: "https://www.youtube.com/watch?v=YJeJS-ONZQ4",
  },
  {
    number: "11",
    title: "Live from PyCon 2024",
    date: "2024-05-28",
    duration: "00:30:30",
    seconds: 1830,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-11-Live-from-PyCon-2024-e2k75mc",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/87315596/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-4-28%2F124ede78-4b5c-b238-35d1-e41fd528457a.mp3",
    summary:
      "The first sub-hour episode, recorded live at PyCon US 2024: Language Summit topics such as bugfix-release length, CalVer and the C API, plus audience Q&A.",
    youtube: "https://www.youtube.com/watch?v=Ly591SITDvQ",
  },
  {
    number: "10",
    title: "The Interactive REPL",
    date: "2024-05-03",
    duration: "01:22:51",
    seconds: 4971,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-10-The-Interactive-REPL-e2j788i",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/86269650/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-4-3%2Fe9c4ad28-de5d-9f38-5ad5-fd1c5be5b2d2.mp3",
    summary:
      "The history of terminals and how Python's interactive interpreter works today, leading up to the new PyREPL the hosts built together for Python 3.13.",
    youtube: "https://www.youtube.com/watch?v=R7uggbpQ0Z0",
  },
  {
    number: "9",
    title: "Py Day with Emily Morehouse-Valcarcel",
    date: "2024-03-14",
    duration: "01:09:44",
    seconds: 4184,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-9-Py-Day-with-Emily-Morehouse-Valcarcel-e2h2tt9",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/84030825/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-2-14%2F539bdd2d-8cee-bd09-870d-4a7fad535a06.mp3",
    summary:
      "Guest Emily Morehouse-Valcarcel talks about the Steering Council, running a small consultancy, implementing the walrus operator (PEP 572) and her pet peeves.",
    youtube: "https://www.youtube.com/watch?v=6QGZ17h2bpM",
  },
  {
    number: "8",
    title: "The New Parser",
    date: "2024-03-01",
    duration: "01:42:36",
    seconds: 6156,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-8-The-New-Parser-e2ggih4",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/83429348/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-2-1%2F36e7862c-ac39-7e83-220f-90220fb85900.mp3",
    summary:
      "How Python's current PEG parser works: what PEG is, why it replaced LL(1) instead of LALR, memoization, soft keywords and what it meant for Black.",
    youtube: "https://www.youtube.com/watch?v=epHP0TRv1mk",
  },
  {
    number: "7",
    title: "The Old Parser",
    date: "2024-01-31",
    duration: "01:23:24",
    seconds: 5004,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-7-The-Old-Parser-e2f6qmj",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/82061459/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-0-31%2Fc82ce83e-c06e-d9af-8ae1-137c02a23854.mp3",
    summary:
      "How Python historically parsed source code: the original tokenizer, grammars, LL(1) parsing and the tricks used to stretch it beyond its limits.",
    youtube: "https://www.youtube.com/watch?v=BJLM1LYoFSM",
  },
  {
    number: "6",
    title: "An Exceptional Episode",
    date: "2024-01-08",
    duration: "01:31:25",
    seconds: 5485,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-6---An-Exceptional-Episode-e2e5pkk",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/80979028/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2024-0-8%2Fe98148b7-c8cd-916f-1538-dc51b6319280.mp3",
    summary:
      "How exceptions work in CPython and how they evolved, from string exceptions through exception chaining to exception groups.",
    youtube: "https://www.youtube.com/watch?v=cqiAt9CEQQw",
  },
  {
    number: "5",
    title: "Cinder with Carl Meyer",
    date: "2023-12-11",
    duration: "01:21:19",
    seconds: 4879,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-5---Cinder-with-Carl-Meyer-e2d2m7l",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/79828661/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-11-10%2Fa6c8187d-6327-7c82-4cc8-a451b8cab1d6.mp3",
    summary:
      "Guest Carl Meyer from Meta explains Cinder, Static Python, the Cinder JIT, and what has been upstreamed to CPython such as comprehension inlining and immortal objects.",
    youtube: "https://www.youtube.com/watch?v=17anUeGntpo",
  },
  {
    number: "4",
    title: "Frame Evaluation",
    date: "2023-11-29",
    duration: "01:13:20",
    seconds: 4400,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-4---Frame-Evaluation-e2cjdrn",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/79328567/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-10-29%2Fb8940936-0147-715c-92a5-89c2f34d0762.mp3",
    summary:
      "What makes Python an interpreter: ceval.c and frame evaluation from Python 2.6 to today, computed gotos, the generated interpreter, the upcoming JIT and the eval breaker.",
    youtube: "https://www.youtube.com/watch?v=ffQ0395qBZw",
  },
  {
    number: "3",
    title: "Imports, frozen modules, Python news",
    date: "2023-11-13",
    duration: "01:11:44",
    seconds: 4304,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-3---Imports--frozen-modules--Python-news-e2bs56d",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/78566029/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-10-13%2Fc590f8d3-6d5f-5054-46bd-e53562b3ef55.mp3",
    summary:
      "What happens when you import a module, how frozen and deep-frozen modules work, and recent CPython news such as biased refcounting and mimalloc landing.",
    youtube: "https://www.youtube.com/watch?v=kGMzA8Lc4wU",
  },
  {
    number: "2",
    title: "PEP 703: Removing the GIL",
    date: "2023-10-30",
    duration: "01:14:39",
    seconds: 4479,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-2---PEP-703-Removing-the-GIL-e2b8egi",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/77920210/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-9-30%2Fd19337c2-7234-2df4-ee69-84912b1b5ad7.mp3",
    summary:
      "A walkthrough of PEP 703 on making the GIL optional, covering past GIL-removal attempts and the techniques (biased refcounting, mimalloc, GC changes) the PEP relies on.",
    youtube: "https://www.youtube.com/watch?v=jHOtyx3PSJQ",
  },
  {
    number: "1",
    title: "Core Sprint in Brno & Python 3.13.0 alpha 1",
    date: "2023-10-30",
    duration: "01:11:59",
    seconds: 4319,
    url: "https://creators.spotify.com/pod/profile/corepy/episodes/Episode-1---Core-Sprint-in-Brno--Python-3-13-0-alpha-1-e2apebk",
    audio: "https://anchor.fm/s/eb6edc3c/podcast/play/77428532/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2023-9-19%2F351808790-44100-2-f58d5f9bf50b8.m4a",
    summary:
      "Recap of the 2023 CPython core developer sprint in Brno: the copy-and-patch JIT prototype, REPL improvements, C API work, and the Python 3.13.0 alpha 1 release.",
    youtube: "https://www.youtube.com/watch?v=AfHa0yW-5MQ",
  },
];
