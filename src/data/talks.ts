/**
 * § V Talks: every conference talk, keynote, panel and Language Summit
 * session, newest first.
 *
 * Sources: pyvideo.org, conference programmes (PyCon US, EuroPython,
 * PyConES pretalx, PyCon Portugal pretalx), PSF blog Language Summit
 * write-ups and YouTube. Every `youtubeId` was checked on 2026-09-24.
 *
 * Rules for this file:
 * - Show only what is confirmed. If a title is unknown, set `title: null`.
 * - If the exact day is unknown, keep a best-guess `date` for sorting and set
 *   `dateLabel` to the text that is safe to print (e.g. "Nov").
 * - Abstracts follow the writing rules in DESIGN.md: short, plain, factual.
 */

export type TalkKind =
  | "keynote"
  | "talk"
  | "panel"
  | "summit"
  | "tutorial"
  | "meetup";

/** Spoken language of the talk (not of the title). */
export type TalkLanguage = "en" | "es" | "pt";

export interface Talk {
  /** Event name as printed, e.g. "PyCon US 2026". */
  conference: string;
  year: number;
  /** ISO date, used for sorting and <time datetime>. */
  date: string;
  /** Printed in place of the day when the exact day is not confirmed. */
  dateLabel?: string;
  /** Original title, in its original language. `null` if not confirmed. */
  title: string | null;
  /** Small print after the title, e.g. "lightning talk", "moderator". */
  format?: string;
  language: TalkLanguage;
  kind: TalkKind;
  youtubeId?: string;
  /** Start offset in seconds, when the video holds more than this talk. */
  youtubeStart?: number;
  /** Event or schedule page. */
  url?: string;
  slidesUrl?: string;
  /** PSF blog write-up (Language Summit sessions are not recorded). */
  writeupUrl?: string;
  coSpeakers?: string[];
  /** One to three short sentences. Empty if no abstract was published. */
  abstract: string;
}

/** YouTube IDs of the keynotes shown as large plates, in display order. */
export const featuredIds: string[] = [
  "e8uozuvRf7g", // PyCon US 2026, Horizonte de sucesos
  "9ZuZfG8_jH8", // EuroPython 2026, core.py live
  "esfK0YBWiMc", // PyCon Greece 2025
  "SULSRtrHdk0", // PyCon Portugal 2025
  "DLn9J93--BY", // EuroPython 2021
  "qcvZOaY1emk", // PyConES 2019
];

export const languageNames: Record<TalkLanguage, string> = {
  en: "English",
  es: "Spanish",
  pt: "Portuguese",
};

export const talks: Talk[] = [
  // ───────────────────────── 2026
  {
    conference: "EuroPython 2026",
    year: 2026,
    date: "2026-07-17",
    title: "Lazy imports and the art of interpreter procrastination",
    language: "en",
    kind: "talk",
    youtubeId: "SavVPtsqUf0",
    url: "https://ep2026.europython.eu/session/lazy-imports-and-the-art-of-interpreter-procrastination",
    coSpeakers: ["Noah Kim"],
    abstract:
      "How PEP 810 brought explicit lazy imports to Python 3.15. We follow them from the bytecode to the proxy objects that load a module on first use.",
  },
  {
    conference: "EuroPython 2026",
    year: 2026,
    date: "2026-07-15",
    title: "Core.py live with Guido van Rossum",
    language: "en",
    kind: "keynote",
    youtubeId: "9ZuZfG8_jH8",
    url: "https://ep2026.europython.eu/session/core-py-recording-with-guido-van-rossum",
    coSpeakers: ["Łukasz Langa", "Guido van Rossum"],
    abstract:
      "Łukasz Langa and I recorded an episode of the core.py podcast live on the EuroPython main stage. Guido van Rossum was our guest.",
  },
  {
    conference: "Python Language Summit 2026 (EuroPython)",
    year: 2026,
    date: "2026-07-14",
    title: "One namespace to namespacing them all",
    language: "en",
    kind: "summit",
    url: "https://ep2026.europython.eu/language-summit/",
    abstract:
      "I proposed to move the standard library into its own top-level namespace, apart from PyPI packages. I asked if the multi-year migration is worth it.",
  },
  {
    conference: "PyCon US 2026",
    year: 2026,
    date: "2026-05-17",
    title: "Python Steering Council Panel",
    language: "en",
    kind: "panel",
    youtubeId: "arE9g0uMDq4",
    url: "https://us.pycon.org/2026/schedule/",
    coSpeakers: [
      "Barry Warsaw",
      "Donghee Na",
      "Savannah Ostrowski",
      "Thomas Wouters",
    ],
    abstract:
      "The 2026 Python Steering Council answers questions about the state of Python, CPython governance and the core team.",
  },
  {
    conference: "PyCon US 2026",
    year: 2026,
    date: "2026-05-16",
    title: "Tachyon: Python 3.15's sampling profiler is faster than your code",
    language: "en",
    kind: "talk",
    youtubeId: "f1x4X83CDSA",
    url: "https://us.pycon.org/2026/schedule/presentation/31/",
    coSpeakers: ["László Kiss Kollár"],
    abstract:
      "Tachyon is the sampling profiler in Python 3.15. It reads the memory of a running process without stopping it and decodes the interpreter state from outside.",
  },
  {
    conference: "PyCon US 2026",
    year: 2026,
    date: "2026-05-16",
    title: "Horizonte de sucesos / Event Horizon",
    language: "es",
    kind: "keynote",
    youtubeId: "e8uozuvRf7g",
    url: "https://us.pycon.org/2026/about/keynote-speakers/",
    abstract:
      "The first keynote in Spanish at PyCon US, with live English captions and audio. It is about how a large group of people builds Python, and what AI-generated contributions mean for the core team.",
  },
  {
    conference: "PyAI London at AI Engineer Europe 2026",
    year: 2026,
    date: "2026-04-08",
    dateLabel: "Apr",
    title: "Maintaining OSS in the age of AI",
    language: "en",
    kind: "talk",
    youtubeId: "4J-YZ-IMcJU",
    coSpeakers: ["David Hewitt"],
    abstract:
      "AI-generated pull requests are fast to submit and slow to review. We talk about what this does to open source maintainers.",
  },

  // ───────────────────────── 2025
  {
    conference: "PyConES 2025",
    year: 2025,
    date: "2025-10-19",
    title: "Cómo todo va a cambiar para los debuggers en Python 3.14",
    language: "es",
    kind: "talk",
    youtubeId: "QkZvfOgpRRE",
    url: "https://pretalx.com/pycones-2025/talk/YBMEL7/",
    abstract:
      "PEP 768 lets debuggers attach safely to a running Python 3.14 process, at no performance cost. I explain why we needed it and how it works, with pdb attached live.",
  },
  {
    conference: "PyCon Greece 2025",
    year: 2025,
    date: "2025-08-29",
    dateLabel: "Aug",
    title: "Parsers, Threads and Labyrinths",
    language: "en",
    kind: "keynote",
    youtubeId: "esfK0YBWiMc",
    url: "https://2025.pycon.gr/en/",
    abstract: "",
  },
  {
    conference: "PyCon Portugal 2025",
    year: 2025,
    date: "2025-07-25",
    title: "Um Siri fazendo barra",
    language: "en",
    kind: "keynote",
    youtubeId: "SULSRtrHdk0",
    url: "https://pretalx.evolutio.pt/pycon-portugal-2025/talk/7QLPMN/",
    abstract:
      "The talk compares a crab doing pull-ups, Python and PEG parsers. Each one tries ordered alternatives, backtracks when needed and commits to what works.",
  },
  {
    conference: "PyCon Portugal 2025",
    year: 2025,
    date: "2025-07-25",
    title: "Pablo does random stuff",
    language: "en",
    kind: "talk",
    youtubeId: "QlbSIv6t0T8",
    url: "https://pretalx.evolutio.pt/pycon-portugal-2025/talk/TC8ZAX/",
    abstract: "Several unrelated Python topics.",
  },
  {
    conference: "EuroPython 2025",
    year: 2025,
    date: "2025-07-17",
    title: "A new safe external debugger interface for CPython",
    language: "en",
    kind: "talk",
    youtubeId: "w_NEFI_mqlo",
    url: "https://programme.europython.eu/europython-2025/talk/LHE38S/",
    abstract:
      "PEP 768 is a safe interface in Python 3.14 that lets debuggers and profilers attach to live processes with no overhead. It replaces unsafe tricks that can crash the interpreter.",
  },
  {
    conference: "EuroPython 2025",
    year: 2025,
    date: "2025-07-17",
    title: "CPython Core Development Panel",
    format: "co-host",
    language: "en",
    kind: "panel",
    youtubeId: "0j8euKVjirg",
    url: "https://ep2025.europython.eu/session/cpython-core-development-panel",
    coSpeakers: [
      "Łukasz Langa",
      "Emily Morehouse-Valcarcel",
      "Savannah Bailey",
      "Brett Cannon",
      "Mark Shannon",
      "Hugo van Kemenade",
    ],
    abstract:
      "Łukasz Langa and I hosted a panel of core developers. They talked about Python 3.14 and later versions, and how people can contribute.",
  },
  {
    conference: "PyCon US 2025",
    year: 2025,
    date: "2025-05-18",
    title: "Python Steering Council Panel",
    language: "en",
    kind: "panel",
    youtubeId: "BrEjbbDdQsM",
    url: "https://us.pycon.org/2025/schedule/",
    coSpeakers: ["Barry Warsaw", "Donghee Na", "Gregory P. Smith"],
    abstract:
      "The 2025 Python Steering Council answers questions from the audience.",
  },
  {
    conference: "PyCon US 2025",
    year: 2025,
    date: "2025-05-17",
    title: "A new safe external debugger interface for CPython",
    language: "en",
    kind: "talk",
    youtubeId: "1N5BgXdO6SI",
    url: "https://us.pycon.org/2025/schedule/presentation/134/",
    coSpeakers: ["Ivona Stojanovic"],
    abstract:
      "PEP 768 is a safe way for debuggers and profilers to attach to running CPython processes, with no overhead. It is new in Python 3.14.",
  },
  {
    conference: "PyCon US 2025",
    year: 2025,
    date: "2025-05-17",
    title: "Zoom, Enhance: Asyncio's New Introspection Powers",
    language: "en",
    kind: "talk",
    youtubeId: "RrsVi1P6n0w",
    url: "https://us.pycon.org/2025/speaker/profile/151/",
    coSpeakers: ["Yury Selivanov"],
    abstract:
      "Python 3.14 can inspect a running asyncio program from another process. You can debug and profile async code in production with no overhead. We show how it works.",
  },
  {
    conference: "Python Language Summit 2025 (PyCon US)",
    year: 2025,
    date: "2025-05-14",
    dateLabel: "May",
    title: "Let's benchmark memory as well",
    format: "lightning talk",
    language: "en",
    kind: "summit",
    writeupUrl:
      "https://pyfound.blogspot.com/2025/06/python-language-summit-2025-lightning-talks.html",
    abstract:
      "I said that CPython does not measure its memory use. We should track memory together with speed, with memory benchmarks and the infrastructure to run them.",
  },

  // ───────────────────────── 2024
  {
    conference: "PyConES 2024",
    year: 2024,
    date: "2024-10-05",
    title: "Cómo estamos eliminando el GIL en CPython",
    language: "es",
    kind: "talk",
    youtubeId: "Sa0GU60mkAQ",
    url: "https://pretalx.com/pycones-2024/talk/ESYBVA/",
    abstract:
      "How we remove the GIL from CPython, starting in Python 3.13, without breaking compatibility or single-thread speed. I explain what changes for programmers and extension authors.",
  },
  {
    conference: "PyCon PL 2024",
    year: 2024,
    date: "2024-08-29",
    dateLabel: "Aug–Sep",
    title: null,
    language: "en",
    kind: "keynote",
    url: "https://pl.pycon.org/2024/en/prelegenci/",
    abstract: "I gave a keynote at PyCon PL in Gliwice.",
  },
  {
    conference: "EuroPython 2024",
    year: 2024,
    date: "2024-07-12",
    title: "Tales from the abyss: some of the most obscure CPython bugs",
    language: "en",
    kind: "talk",
    youtubeId: "Y4cnr_OhbCY",
    url: "https://programme.europython.eu/europython-2024/talk/VFV7HU/",
    abstract:
      "Some of the strangest bugs we found in CPython, and how we fixed them. I also show debugging tricks that you can use in your own code.",
  },
  {
    conference: "EuroPython 2024",
    year: 2024,
    date: "2024-07-10",
    title: "CPython Core Development Panel",
    language: "en",
    kind: "panel",
    youtubeId: "t_lEA9GQb30",
    url: "https://programme.europython.eu/europython-2024/talk/8NYTHE/",
    abstract:
      "Core developers talk about Python 3.13 and later versions, and how people can contribute.",
  },
  {
    conference: "PyCon US 2024",
    year: 2024,
    date: "2024-05-19",
    title: "Python Steering Council Panel",
    language: "en",
    kind: "panel",
    youtubeId: "81ZpbKdlvh0",
    url: "https://us.pycon.org/2024/schedule/",
    abstract:
      "The 2024 Python Steering Council answers questions from the audience.",
  },
  {
    conference: "PyCon US 2024",
    year: 2024,
    date: "2024-05-18",
    title: "A Fireside Chat With the Hosts of the Core.py Podcast",
    language: "en",
    kind: "panel",
    url: "https://us.pycon.org/2024/schedule/presentation/140/",
    coSpeakers: ["Łukasz Langa"],
    abstract:
      "A live chat with Łukasz Langa and invited core developers about the new features in Python 3.13.",
  },
  {
    conference: "PyCon US 2024",
    year: 2024,
    date: "2024-05-17",
    title: "Profiling at the speed of light",
    language: "en",
    kind: "talk",
    youtubeId: "CjG_Ub_gCL4",
    url: "https://us.pycon.org/2024/speaker/profile/81/index.html",
    abstract:
      "Python 3.12 supports the Linux perf profiler with a small JIT compiler. I show how it works and how to profile Python and native code together.",
  },
  {
    conference: "Python Language Summit 2024 (PyCon US)",
    year: 2024,
    date: "2024-05-15",
    title: "Python's security model after the xz-utils backdoor",
    language: "en",
    kind: "summit",
    writeupUrl:
      "https://pyfound.blogspot.com/2024/06/python-language-summit-2024-python-security-model-after-xz.html",
    abstract:
      "I asked how the CPython contribution and release process would resist a social-engineering attack like the xz-utils backdoor.",
  },
  {
    conference: "Python Language Summit 2024 (PyCon US)",
    year: 2024,
    date: "2024-05-15",
    title: "PyREPL: New default REPL written in Python",
    language: "en",
    kind: "summit",
    coSpeakers: ["Łukasz Langa", "Lysandros Nikolaou"],
    writeupUrl:
      "https://pyfound.blogspot.com/2024/06/python-language-summit-2024-pyrepl-new-default-repl-for-python.html",
    abstract:
      "We presented a new interactive REPL written in Python, based on the pyrepl of PyPy. It became the default REPL in Python 3.13.",
  },
  {
    conference: "Python Language Summit 2024 (PyCon US)",
    year: 2024,
    date: "2024-05-15",
    title: "Making asserts cooler in 3.14",
    format: "lightning talk",
    language: "en",
    kind: "summit",
    writeupUrl:
      "https://pyfound.blogspot.com/2024/06/python-language-summit-2024-lightning-talks.html",
    abstract:
      "A 90-second demo of a plan to make a failing assert statement show the values in it.",
  },

  // ───────────────────────── 2023
  {
    conference: "PyCon Ireland 2023",
    year: 2023,
    date: "2023-11-11",
    dateLabel: "Nov",
    title: "The snake of Theseus",
    language: "en",
    kind: "talk",
    youtubeId: "TQDzaMYTkYU",
    abstract:
      "How Python keeps its identity while it changes. I talk about new ideas and compatibility, language design, and a larger and more varied group of users.",
  },
  {
    conference: "PyConES 2023",
    year: 2023,
    date: "2023-10-08",
    title: "Profiling a la velocidad de la luz",
    language: "es",
    kind: "talk",
    youtubeId: "YJWQ0hHfajs",
    url: "https://charlas.2023.es.pycon.org/pycones-2023/talk/7KDMK8/",
    abstract:
      "Python 3.12 supports the Linux perf profiler with a small JIT compiler. I show how it works and how to profile Python and native code together.",
  },
  {
    conference: "PyCon Taiwan 2023",
    year: 2023,
    date: "2023-09-02",
    title: "The snake of Theseus",
    language: "en",
    kind: "keynote",
    youtubeId: "0C4eKA5DXFs",
    url: "https://tw.pycon.org/2023/",
    abstract:
      "How Python keeps its identity while it changes. I talk about new ideas and compatibility, language design, and a larger and more varied group of users.",
  },
  {
    conference: "EuroPython 2023",
    year: 2023,
    date: "2023-07-19",
    title: 'f"yeah!" - How we are supercharging f-strings in Python 3.12',
    language: "en",
    kind: "talk",
    youtubeId: "JAG9oIFklA8",
    url: "https://programme.europython.eu/europython-2023/talk/BCDBBR/",
    coSpeakers: ["Marta Gómez Macías"],
    abstract:
      "PEP 701 moved f-string parsing into the PEG grammar in Python 3.12. We explain how, which old limits it removed, and what f-strings can do now.",
  },
  {
    conference: "EuroPython 2023",
    year: 2023,
    date: "2023-07-19",
    title: "CPython Core Developer Panel",
    language: "en",
    kind: "panel",
    youtubeId: "CSJv_nfVBZk",
    url: "https://programme.europython.eu/europython-2023/talk/AAJLRW/",
    abstract:
      "Core developers talk about recent and future changes in CPython, and how to get involved.",
  },
  {
    conference: "PyCon US 2023",
    year: 2023,
    date: "2023-04-22",
    title: "How memory profilers work",
    language: "en",
    kind: "talk",
    youtubeId: "mqu66lg79X8",
    abstract:
      "How memory profilers such as Memray track allocations in Python and native code. I show how to use them to find leaks and high memory use.",
  },
  {
    conference: "PyCon US 2023",
    year: 2023,
    date: "2023-04-22",
    title: "Python Steering Council Keynote",
    language: "en",
    kind: "keynote",
    youtubeId: "fYXAbfHZmRg",
    abstract:
      "The Python Steering Council keynote panel, about the state of the language and how it is governed.",
  },
  {
    conference: "PyCon US 2023",
    year: 2023,
    date: "2023-04-20",
    title: "Python & Bloomberg: An Open Source Duo",
    format: "sponsor session",
    language: "en",
    kind: "talk",
    youtubeId: "ZuN05nCmYqo",
    abstract:
      "A Bloomberg sponsor session with several speakers, about the open source Python work of Bloomberg. It includes Memray and PyStack.",
  },

  // ───────────────────────── 2022
  {
    conference: "PyConES 2022",
    year: 2022,
    date: "2022-10-02",
    title: "Faster CPython project: Cómo estamos haciendo Python 3.11 más rápido",
    language: "es",
    kind: "talk",
    youtubeId: "94jLt3CX5Dc",
    abstract:
      "Python 3.11 is between 10% and 60% faster. I explain the interpreter that specializes and adapts itself to the program that it runs.",
  },
  {
    conference: "EuroPython 2022",
    year: 2022,
    date: "2022-07-13",
    title: "Making Python better one error message at a time",
    language: "en",
    kind: "talk",
    youtubeId: "aFfyQGa6Me8",
    url: "https://programme.europython.eu/europython-2022/talk/CJYTER/",
    abstract:
      "The story of the better error messages in Python 3.10 and 3.11. I show how the parser and the interpreter make them, and what makes a good error message.",
  },
  {
    conference: "EuroPython 2022",
    year: 2022,
    date: "2022-07-13",
    title: "CPython Developer Panel",
    language: "en",
    kind: "panel",
    youtubeId: "0m2Cy5X6lcE",
    url: "https://programme.europython.eu/europython-2022/talk/X3CQ77/",
    abstract:
      "Core developers talk about the state and future of CPython, and how to contribute.",
  },
  {
    conference: "PyCon US 2022",
    year: 2022,
    date: "2022-04-30",
    title: "Making Python better one error message at a time",
    language: "en",
    kind: "talk",
    youtubeId: "5eYOQxqqWl8",
    abstract:
      "The story of the better error messages in Python 3.10 and 3.11, and how they help both new learners and experienced developers.",
  },
  {
    conference: "PyCon US 2022",
    year: 2022,
    date: "2022-04-30",
    title: "Python Steering Council Keynote",
    language: "en",
    kind: "keynote",
    youtubeId: "m2R5shF1pLc",
    abstract: "The Python Steering Council keynote panel.",
  },
  {
    conference: "PyCon US 2022 Typing Summit",
    year: 2022,
    date: "2022-04-27",
    title: "Panel: Typing-sig and Python Core Dev",
    language: "en",
    kind: "panel",
    youtubeId: "BNTkWQfqP_c",
    youtubeStart: 10244,
    coSpeakers: [
      "Guido van Rossum",
      "Thomas Wouters",
      "Jelle Zijlstra",
      "Pradeep Kumar Srinivasan",
      "Matthew Rahtz",
    ],
    abstract:
      "Members of typing-sig and core developers talk about how typing features are designed and how they get into the language.",
  },
  {
    conference: "Python Language Summit 2022 (PyCon US)",
    year: 2022,
    date: "2022-04-27",
    title: "F-strings in the grammar",
    language: "en",
    kind: "summit",
    writeupUrl:
      "https://pyfound.blogspot.com/2022/05/the-2022-python-language-summit-f.html",
    abstract:
      "I proposed to move f-string parsing out of about 1,400 lines of hand-written C and into the PEG grammar. This became PEP 701.",
  },

  // ───────────────────────── 2021
  {
    conference: "EuroPython 2021",
    year: 2021,
    date: "2021-07-28",
    title: "Nobody expects the Spanish inquisition",
    language: "en",
    kind: "keynote",
    youtubeId: "DLn9J93--BY",
    url: "https://ep2021.europython.eu/profiles/pablo-galindo-salgado/",
    abstract:
      "Stories of how CPython is made: who works on it, how we develop it, and our fights with some of the most obscure bugs.",
  },
  {
    conference: "PyCon US 2021 (online)",
    year: 2021,
    date: "2021-05-15",
    title: "Python Steering Council Keynote",
    language: "en",
    kind: "keynote",
    youtubeId: "xEkuOtCQ6vA",
    coSpeakers: ["Carol Willing", "Thomas Wouters", "Brett Cannon", "Barry Warsaw"],
    abstract: "The Python Steering Council keynote panel.",
  },
  {
    conference: "Python Language Summit 2021 (online)",
    year: 2021,
    date: "2021-05-11",
    dateLabel: "May",
    title: "PEP 657: Fine-grained error locations in tracebacks",
    language: "en",
    kind: "summit",
    coSpeakers: ["Batuhan Taskaya"],
    writeupUrl: "https://pyfound.blogspot.com/2021/06/the-2021-python-language-summit.html",
    abstract:
      "We proposed to store column information for bytecode, so that tracebacks can point at the exact expression that failed. It shipped in Python 3.11.",
  },

  // ───────────────────────── 2020
  {
    conference: "Python Madrid (online meetup)",
    year: 2020,
    date: "2020-04-23",
    title: "Un nuevo PEG parser para Python",
    language: "es",
    kind: "meetup",
    url: "https://www.meetup.com/es-ES/python-madrid/events/270081246/",
    abstract:
      "An online talk for Python Madrid about the new PEG parser in CPython (PEP 617).",
  },
  {
    conference: "Python Language Summit 2020 (online)",
    year: 2020,
    date: "2020-04-15",
    dateLabel: "Apr",
    title: "Replacing CPython's parser with a PEG-based parser",
    language: "en",
    kind: "summit",
    coSpeakers: ["Guido van Rossum", "Lysandros Nikolaou"],
    writeupUrl: "https://pyfound.blogspot.com/2020/04/replacing-cpythons-parser-python.html",
    abstract:
      "We presented pegen and PEP 617, the plan to replace the LL(1) parser of CPython with a PEG parser.",
  },

  // ───────────────────────── 2019
  {
    conference: "Codemotion Madrid 2019",
    year: 2019,
    date: "2019-11-05",
    dateLabel: "Nov",
    title: "The soul of the beast: Everything about Python's grammar",
    language: "en",
    kind: "talk",
    youtubeId: "QTAgRNk9cD8",
    abstract:
      "What makes Python easy to learn and read. I show how the grammar and the parser are built, and why it is hard to design new syntax.",
  },
  {
    conference: "PyConES 2019",
    year: 2019,
    date: "2019-10-06",
    title: "Inside Python: through the eyes of a core developer",
    language: "en",
    kind: "keynote",
    youtubeId: "qcvZOaY1emk",
    abstract: "How CPython is developed, seen from the inside by a core developer.",
  },
  {
    conference: "Bloomberg Python Core Dev Sprint 2019 (London)",
    year: 2019,
    date: "2019-09-13",
    title: "Python Core Developer Q&A",
    format: "moderator",
    language: "en",
    kind: "panel",
    youtubeId: "QcfSYNCBNoA",
    coSpeakers: [
      "Guido van Rossum",
      "Carol Willing",
      "Michael Foord",
      "Steve Dower",
      "Emily Morehouse",
      "Brett Cannon",
    ],
    abstract:
      "I organized and moderated a Q&A with core developers after the core dev sprint at Bloomberg London.",
  },
  {
    conference: "EuroPython 2019",
    year: 2019,
    date: "2019-07-12",
    title: "The soul of the beast",
    language: "en",
    kind: "talk",
    youtubeId: "1_23AVsiQEc",
    abstract:
      "Everything about the grammar of Python: how the parser is generated, how it works, and what makes Python easy to read.",
  },
  {
    conference: "PyLondinium 2019",
    year: 2019,
    date: "2019-06-15",
    title: "The soul of the beast: Everything about Python's grammar",
    language: "en",
    kind: "talk",
    youtubeId: "avLK67SHeAs",
    abstract:
      "What makes Python easy to learn and read. I show how the Python grammar and parser are generated and how they work.",
  },
  {
    conference: "PyCon US 2019",
    year: 2019,
    date: "2019-05-04",
    title: "Time to take out the rubbish: garbage collector",
    language: "en",
    kind: "talk",
    youtubeId: "CLW5Lyc1FN8",
    abstract:
      "How CPython manages memory with reference counting and a cyclic garbage collector, and why this matters for your programs.",
  },
  {
    conference: "Python Language Summit 2019 (PyCon US)",
    year: 2019,
    date: "2019-05-01",
    title: "The Night's Watch is fixing the CIs in the darkness for you",
    format: "lightning talk",
    language: "en",
    kind: "summit",
    writeupUrl:
      "https://pyfound.blogspot.com/2019/06/pablo-galindo-salgado-nights-watch-is.html",
    abstract:
      "About the work of keeping the CPython CI and buildbots green, and the problems that flaky tests cause.",
  },

  // ───────────────────────── 2018
  {
    conference: "PyConES 2018",
    year: 2018,
    date: "2018-10-07",
    title: "Hora de sacar la basura: garbage collector",
    language: "es",
    kind: "talk",
    youtubeId: "G9wOSExzs5g",
    coSpeakers: ["Víctor Terrón"],
    abstract:
      "How CPython manages the memory of your objects: reference counting and the cyclic garbage collector.",
  },
  {
    conference: "PyConES 2018",
    year: 2018,
    date: "2018-10-06",
    title: "¡Oh vosotros los que entráis, abandonad toda esperanza!",
    language: "es",
    kind: "talk",
    youtubeId: "vOGacccUsog",
    abstract:
      "How Python works on the inside, from the source code to its execution in the interpreter.",
  },

  // ───────────────────────── 2017
  {
    conference: "PyConES 2017",
    year: 2017,
    date: "2017-09-23",
    title: "Metaclases: exactamente qué y (sobre todo) por qué",
    language: "es",
    kind: "talk",
    youtubeId: "n2Ma5lT99pM",
    slidesUrl: "https://github.com/pablogsal/pycones2017",
    coSpeakers: ["Víctor Terrón"],
    abstract:
      "What metaclasses are and, more importantly, why they exist, with examples that are easy to follow.",
  },
  {
    conference: "PyConES 2017",
    year: 2017,
    date: "2017-09-22",
    title: "Parallel and non parallel stuff",
    language: "es",
    kind: "tutorial",
    youtubeId: "0sgw0054KVY",
    abstract:
      "A workshop on parallel and asynchronous programming in Python from the start: threads, processes, the GIL and asyncio.",
  },

  // ───────────────────────── 2016
  {
    conference: "PyConES 2016",
    year: 2016,
    date: "2016-10-09",
    title: "Los closures que emocionaron a Spielberg",
    language: "es",
    kind: "talk",
    youtubeId: "rrL3CQNOFRc",
    coSpeakers: ["Víctor Terrón"],
    abstract: "An explanation of closures in Python.",
  },

  // ───────────────────────── 2015
  {
    conference: "PyConES 2015",
    year: 2015,
    date: "2015-11-21",
    dateLabel: "Nov",
    title: "Agujeros negros y optimización de código en Python",
    language: "es",
    kind: "talk",
    youtubeId: "XUNU63tZNQI",
    abstract:
      "I built a relativistic ray tracer in Python that draws black holes like the ones in Interstellar. Then I made the code as fast as I could.",
  },
];

/* ───────── helpers used by the component ───────── */

/** The filter group a kind belongs to. Tutorials and meetups count as talks. */
export type KindGroup = "keynote" | "talk" | "panel" | "summit";

export function kindGroup(kind: TalkKind): KindGroup {
  if (kind === "tutorial" || kind === "meetup") return "talk";
  return kind;
}

export function youtubeUrl(t: Talk): string | undefined {
  if (!t.youtubeId) return undefined;
  const start = t.youtubeStart ? `&t=${t.youtubeStart}s` : "";
  return `https://www.youtube.com/watch?v=${t.youtubeId}${start}`;
}

/**
 * YouTube thumbnail. The default size is the 120x90 "default.jpg": the page
 * scales it up with `image-rendering: pixelated` for the pixel-art look.
 */
export function thumbUrl(
  id: string,
  size: "default" | "mqdefault" | "hqdefault" = "default",
): string {
  return `https://i.ytimg.com/vi/${id}/${size}.jpg`;
}
