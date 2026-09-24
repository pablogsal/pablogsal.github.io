/**
 * § VI: podcasts, streams and interviews on other people's shows, plus
 * Esferas Invisibles, the Spanish science podcast I co-host.
 *
 * Sources (retrieved 2026-09-24):
 * - Guest list: each episode page or RSS feed lists me as a guest. Talk
 *   Python pages were all fetched; the feeds of about 35 other shows were
 *   scanned for "Galindo" / "pablogsal". Mentions of my work in news
 *   segments are not guest appearances and are not here.
 * - Esferas Invisibles: the show's RSS feed
 *   (https://anchor.fm/s/83dd8d98/podcast/rss) and the Apple Podcasts
 *   listing (id 1615442557).
 *
 * To add an appearance, add an entry to `appearances` (any order; the
 * section sorts by date). `kind: "audio"` goes in the main index,
 * `kind: "video"` goes in "Streams and interviews". Show names live in
 * `shows` so that the counts per show stay correct.
 */

export type Lang = "en" | "es";

export interface Show {
  /** Display name. */
  name: string;
  /** Home page of the show, if it has a stable one. */
  href?: string;
}

export interface Appearance {
  /** Key into `shows`. */
  show: ShowId;
  /** Episode number as printed by the show, without "#". */
  episode?: string;
  /** Episode title exactly as the show publishes it. */
  title: string;
  /** Publication date, ISO yyyy-mm-dd. */
  date: string;
  /** Main link: the episode page, or the video for streams. */
  url: string;
  lang: Lang;
  /** audio = podcast episode; video = livestream or video interview. */
  kind: "audio" | "video";
  /** Finer label for video items. */
  format?: "livestream" | "interview";
  host: string;
  /** Other guests in the same episode. */
  with?: string[];
  /** Plain summary in my voice. Short. Facts from the episode page only. */
  summary: string;
  /** YouTube video id, for a thumbnail or a "video" link. */
  youtube?: string;
  /** Extra links, e.g. the podcast version of a video. */
  alt?: { label: string; href: string }[];
  /**
   * Set when the episode is a rerun of another entry in this list. The
   * value is the `key` of the original. Reruns are not counted as
   * separate recordings.
   */
  rerunOf?: string;
  /** Stable key so that reruns can point at the original. */
  key?: string;
}

export const shows = {
  talkpython: { name: "Talk Python To Me", href: "https://talkpython.fm/" },
  realpython: { name: "The Real Python Podcast", href: "https://realpython.com/podcasts/rpp/" },
  stackoverflow: { name: "The Stack Overflow Podcast", href: "https://stackoverflow.blog/podcast/" },
  pythonbytes: { name: "Python Bytes", href: "https://pythonbytes.fm/" },
  changelog: { name: "The Changelog", href: "https://changelog.com/podcast" },
  pythonshow: { name: "The Python Show", href: "https://www.pythonshow.com/" },
  behindthecommit: { name: "Behind the Commit" },
  podcastinit: { name: "Podcast.__init__", href: "https://www.pythonpodcast.com/" },
  republicaweb: { name: "República Web" },
  pythondiscord: { name: "Python Discord", href: "https://www.youtube.com/@PythonDiscord" },
  anthonywritescode: { name: "anthonywritescode", href: "https://www.youtube.com/@anthonywritescode" },
  cschats: { name: "Computer Science Chats" },
  feregrino: { name: "Feregrino" },
  codebasics: { name: "codebasics", href: "https://www.youtube.com/@codebasics" },
} satisfies Record<string, Show>;

export type ShowId = keyof typeof shows;

export const appearances: Appearance[] = [
  {
    // The stream title says only "with Pablo". The topic is Tachyon, the
    // sampling profiler I wrote for Python 3.15.
    show: "anthonywritescode",
    title: "python's sampling profiler with Pablo",
    date: "2026-01-31",
    url: "https://www.youtube.com/watch?v=YNrlZ6lkubc",
    youtube: "YNrlZ6lkubc",
    lang: "en",
    kind: "video",
    format: "livestream",
    host: "Anthony Sottile",
    summary:
      "Anthony Sottile and I look at Tachyon, the sampling profiler that is new in Python 3.15.",
  },
  {
    show: "behindthecommit",
    title: "Behind the Python Release: Motivation, Fails & Rituals",
    date: "2025-10-14",
    url: "https://podcasts.apple.com/us/podcast/behind-the-python-release-motivation-fails-rituals/id1845604486",
    youtube: "BHUWyM2cxwE",
    lang: "en",
    kind: "audio",
    host: "Mia Bajić",
    with: ["Łukasz Langa", "Hugo van Kemenade"],
    summary:
      "Recorded live at EuroPython 2025 in Prague. Three CPython release managers talk about how a release works, our best and worst releases, and our release rituals. We also talk about how to pay for open source.",
  },
  {
    show: "pythondiscord",
    title: "Python 3.13 Release Stream",
    date: "2024-10-09",
    url: "https://www.youtube.com/watch?v=7MAPzvv3ZG0",
    youtube: "7MAPzvv3ZG0",
    lang: "en",
    kind: "video",
    format: "livestream",
    host: "KeithTheEE",
    with: ["Łukasz Langa", "Brandt Bucher"],
    summary:
      "A stream for the Python 3.13 release. We talk about free threading, the JIT, the new REPL and how to contribute to CPython.",
  },
  {
    show: "changelog",
    episode: "611",
    title: "Free-threaded Python",
    date: "2024-10-02",
    url: "https://changelog.com/podcast/611",
    lang: "en",
    kind: "audio",
    host: "Jerod Santo",
    with: ["Łukasz Langa"],
    summary:
      "Before Python 3.13 came out, Łukasz and I talked about the free-threaded build, the new JIT, the yearly release cycle and iOS support.",
  },
  {
    show: "pythonshow",
    episode: "16",
    title: "Python Core Development with Pablo Salgado",
    date: "2023-09-27",
    url: "https://www.pythonshow.com/p/16-python-core-development-with-pablo",
    lang: "en",
    kind: "audio",
    host: "Mike Driscoll",
    summary:
      "Just before Python 3.12, I talk about core development, the Steering Council, release management and Memray.",
  },
  {
    show: "talkpython",
    episode: "425",
    title: "Memray: The endgame Python memory profiler",
    date: "2023-08-04",
    url: "https://talkpython.fm/episodes/show/425/memray-the-endgame-python-memory-profiler",
    youtube: "wn_2e33KaYQ",
    lang: "en",
    kind: "audio",
    host: "Michael Kennedy",
    with: ["Matt Wozniski"],
    summary:
      "Matt Wozniski and I explain Memray, the tracing memory profiler for Python and native extensions that we wrote at Bloomberg.",
  },
  {
    show: "stackoverflow",
    episode: "593",
    title: "How the Python team is adapting the language for an AI future",
    date: "2023-07-25",
    url: "https://stackoverflow.blog/2023/07/25/how-the-python-team-is-adapting-the-language-for-an-ai-future-ep-593/",
    lang: "en",
    kind: "audio",
    host: "Ben Popper and Kyle Mitofsky",
    summary:
      "Part two. We talk about how Python changes for AI and data science, how we design the language, the GIL and the Faster CPython work.",
  },
  {
    show: "stackoverflow",
    episode: "592",
    title: "What it's like to be on the Python Steering Council",
    date: "2023-07-21",
    url: "https://stackoverflow.blog/2023/07/21/what-its-like-to-be-on-the-python-steering-council-ep-592/",
    lang: "en",
    kind: "audio",
    host: "Ben Popper and Kyle Mitofsky",
    summary:
      "Part one. I went from a PhD on rotating black holes to CPython, and from typo fixes to core developer. Then we talk about the Steering Council.",
  },
  {
    show: "talkpython",
    episode: "419",
    title: "Debugging Python in Production with PyStack",
    date: "2023-06-14",
    url: "https://talkpython.fm/episodes/show/419/debugging-python-in-production-with-pystack",
    youtube: "ZivfDMbeTgk",
    lang: "en",
    kind: "audio",
    host: "Michael Kennedy",
    with: ["Matt Wozniski"],
    summary:
      "Matt Wozniski and I show how PyStack inspects hung processes and core dumps, with mixed Python and C++ stacks and local variables.",
  },
  {
    show: "pythonbytes",
    episode: "316",
    title: "Python 3.11 is here and it's fast (crossover)",
    date: "2022-12-30",
    url: "https://pythonbytes.fm/episodes/show/316/python-3.11-is-here-and-its-fast-crossover",
    lang: "en",
    kind: "audio",
    host: "Michael Kennedy and Brian Okken",
    with: ["Irit Katriel", "Mark Shannon", "Brandt Bucher"],
    summary: "The same recording as Talk Python To Me #388, aired again on Python Bytes.",
    rerunOf: "talkpython-388",
  },
  {
    key: "talkpython-388",
    show: "talkpython",
    episode: "388",
    title: "Python 3.11 is here and it's fast",
    date: "2022-11-02",
    url: "https://talkpython.fm/episodes/show/388/python-3.11-is-here-and-its-fast",
    youtube: "Iak-6AsMLsU",
    lang: "en",
    kind: "audio",
    host: "Michael Kennedy",
    with: ["Irit Katriel", "Mark Shannon", "Brandt Bucher"],
    summary:
      "I was the 3.11 release manager. Four core developers talk about the release process, the Faster CPython work, the better error messages and exception groups.",
  },
  {
    show: "pythondiscord",
    title: "Python 3.11 Release Stream",
    date: "2022-10-24",
    url: "https://www.youtube.com/watch?v=PGZPSWZSkJI",
    youtube: "PGZPSWZSkJI",
    lang: "en",
    kind: "video",
    format: "livestream",
    host: "Leon Sandøy",
    with: ["Brandt Bucher", "Mark Shannon", "Irit Katriel", "Łukasz Langa"],
    summary:
      "As the release manager, I release Python 3.11.0 live on the stream. The other guests present the new features. I talk about the new tracebacks and tomllib.",
  },
  {
    show: "realpython",
    episode: "130",
    title: "Fostering an Internal Python Community & Managing the 3.11 Release",
    date: "2022-10-21",
    url: "https://realpython.com/podcasts/rpp/130/",
    lang: "en",
    kind: "audio",
    host: "Christopher Bailey",
    summary:
      "I talk about the Python Guild, the internal Python community at Bloomberg. Then I talk about how I manage the Python 3.11 release.",
  },
  {
    show: "realpython",
    episode: "128",
    title: "Using a Memory Profiler in Python & What It Can Teach You",
    date: "2022-10-07",
    url: "https://realpython.com/podcasts/rpp/128/",
    lang: "en",
    kind: "audio",
    host: "Christopher Bailey",
    summary:
      "I come back to talk about Memray, a tracing memory profiler, and what a profile can tell you about a codebase.",
  },
  {
    show: "cschats",
    title: "Computer Science Chats - Pablo Galindo Salgado",
    date: "2022-09-08",
    url: "https://www.youtube.com/watch?v=pBxY3nwylUM",
    youtube: "pBxY3nwylUM",
    lang: "en",
    kind: "video",
    format: "interview",
    host: "Computer Science Chats",
    summary:
      "An interview about my work in open source and on Python. We also talk about the hard problems in open source and how companies can help.",
  },
  {
    show: "realpython",
    episode: "105",
    title: "Creating Better Error Messages for Python 3.10 & 3.11",
    date: "2022-04-08",
    url: "https://realpython.com/podcasts/rpp/105/",
    lang: "en",
    kind: "audio",
    host: "Christopher Bailey",
    summary:
      "How the PEG parser helps to find the location of a syntax error. Also, the work behind the better error messages in Python 3.10 and 3.11.",
  },
  {
    show: "talkpython",
    episode: "350",
    title: "Python Steering Council 2021 Retrospective",
    date: "2022-01-26",
    url: "https://talkpython.fm/episodes/show/350/python-steering-council-2021-retrospective",
    lang: "en",
    kind: "audio",
    host: "Michael Kennedy",
    with: ["Barry Warsaw", "Carol Willing", "Brett Cannon", "Thomas Wouters"],
    summary:
      "The 2021 Steering Council looks back at the decisions of the year, at governance and at release management.",
  },
  {
    show: "pythondiscord",
    title: "Python 3.10 Release Stream",
    date: "2021-10-04",
    url: "https://www.youtube.com/watch?v=AHT2l3hcIJg",
    youtube: "AHT2l3hcIJg",
    lang: "en",
    kind: "video",
    format: "livestream",
    host: "Leon Sandøy",
    summary: "As the 3.10 release manager, I release Python 3.10 live and talk about the new features.",
  },
  {
    show: "republicaweb",
    episode: "República Python II",
    title: "Trabajar en el core de Python con Pablo Galindo",
    date: "2021-10-02",
    url: "https://www.ivoox.com/en/trabajar-core-python-pablo-audios-mp3_rf_76268858_1.html",
    alt: [
      {
        label: "Apple Podcasts",
        href: "https://podcasts.apple.com/dk/podcast/trabajar-en-el-core-de-python-con-pablo/id1124975855?i=1000537305590",
      },
    ],
    lang: "es",
    kind: "audio",
    host: "Andros Fenollosa",
    summary:
      "In Spanish. How I went from physics to CPython, how Python gets its money and what a core developer does each day. We also talk about the PEP process and new features.",
  },
  {
    show: "feregrino",
    title: "Desarrollando Core Python, platicando con Pablo Galindo",
    date: "2021-08-22",
    url: "https://www.youtube.com/watch?v=-zxehG7kvL8",
    youtube: "-zxehG7kvL8",
    lang: "es",
    kind: "video",
    format: "livestream",
    host: "Antonio Feregrino",
    summary:
      "In Spanish. How I started to program, what I work on now and my role on the Python Steering Council.",
  },
  {
    show: "codebasics",
    title: "Conversation With a Python Steering Council Member",
    date: "2021-02-20",
    url: "https://www.youtube.com/watch?v=b23kMqp2M7A",
    youtube: "b23kMqp2M7A",
    alt: [
      {
        label: "Podcast version",
        href: "https://podcasters.spotify.com/pod/show/codebasics/episodes/Conversation-With-a-Python-Steering-Council-Member-e1gfhm3",
      },
    ],
    lang: "en",
    kind: "video",
    format: "interview",
    host: "Dhaval Patel",
    summary: "What the Python Steering Council does and how the Python project makes decisions.",
  },
  {
    show: "podcastinit",
    episode: "285",
    title: "The Journey To Replace Python's Parser And What It Means For The Future",
    date: "2020-10-19",
    url: "https://www.pythonpodcast.com/cpython-parser-replacement-episode-285/",
    lang: "en",
    kind: "audio",
    host: "Tobias Macey",
    with: ["Lysandros Nikolaou"],
    summary:
      "Lysandros, Guido van Rossum and I replaced the LL(1) parser of CPython with a PEG parser in Python 3.9. We explain how, and what it makes possible, such as pattern matching.",
  },
];

/* ───────── Esferas Invisibles ───────── */

export interface EsferasEpisode {
  season: number;
  episode: number;
  /** Title as in the feed (Spanish). */
  title: string;
  /** Feed pubDate, ISO yyyy-mm-dd. */
  date: string;
  /** Runtime from itunes:duration. */
  seconds: number;
  /** Episode page on Spotify for Creators. */
  url: string;
}

export interface OwnShow {
  name: string;
  lang: Lang;
  hosts: string[];
  /** Apple Podcasts category. */
  category: string;
  /** The show's own line from the feed, in Spanish. */
  tagline: string;
  /** My English translation of `tagline`. */
  taglineEn: string;
  /** What the show is, in plain English. */
  about: string;
  /** Local copy of the cover art, 80px grayscale, shown pixelated. */
  cover: string;
  links: { label: string; href: string }[];
}

export const esferas: OwnShow = {
  name: "Esferas Invisibles",
  lang: "es",
  hosts: ["Pablo Galindo", "Braulio Valdivielso"],
  category: "Science",
  tagline: "Esferas Invisibles es como deambular por wikipedia, pero en audio.",
  taglineEn: "Esferas Invisibles is like a walk through Wikipedia, but in audio.",
  about:
    "Esferas Invisibles is a science podcast in Spanish. Braulio Valdivielso and I host it. Topics include black holes, the abc conjecture, leap seconds, mantis shrimp and AI girlfriends.",
  cover: "/img/podcasts/esferas-invisibles-80.png",
  links: [
    { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/esferas-invisibles/id1615442557" },
    { label: "Spotify", href: "https://open.spotify.com/show/4CaZ0lY24Dly2R4QkmJNVw" },
    { label: "RSS feed", href: "https://anchor.fm/s/83dd8d98/podcast/rss" },
  ],
};

/**
 * Newest first, from the feed. The feed also has a 55-second trailer
 * (2022-02-13), which is not listed. Season 2 has no episode 11.
 */
export const esferasEpisodes: EsferasEpisode[] = [
  { season: 2, episode: 13, title: "Novias artificiales", date: "2023-10-16", seconds: 2419, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Novias-artificiales-e2al4to" },
  { season: 2, episode: 12, title: "¿Es posible destruir un agujero negro?", date: "2023-09-19", seconds: 3500, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Es-posible-destruir-un-agujero-negro-e29gvih" },
  { season: 2, episode: 10, title: "¿Será este episodio del podcast el más escuchado en 2023? (30%)", date: "2023-08-19", seconds: 3338, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Ser-este-episodio-del-podcast-el-ms-escuchado-en-2023--30-e289jsk" },
  { season: 2, episode: 9, title: "Las mareas no son cosa menor. Dicho de otra manera: son cosa mayor", date: "2023-07-17", seconds: 4055, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Las-mareas-no-son-cosa-menor--Dicho-de-otra-manera-son-cosa-mayor-e271iuv" },
  { season: 2, episode: 8, title: "Alienígenas agarrones", date: "2023-06-20", seconds: 2977, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Aliengenas-agarrones-e25ugqk" },
  { season: 2, episode: 7, title: "La dramática historia de la escalera relativista y el cobertizo", date: "2023-06-08", seconds: 3304, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/La-dramtica-historia-de-la-escalera-relativista-y-el-cobertizo-e25f79b" },
  { season: 2, episode: 6, title: "¿Es que nadie va a pensar en los 2 billones de niños?", date: "2022-12-30", seconds: 2433, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Es-que-nadie-va-a-pensar-en-los-2-billones-de-nios-e1st4pa" },
  { season: 2, episode: 5, title: "Espaguetis estelares y lasañas cósmicas", date: "2022-12-11", seconds: 3223, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Espaguetis-estelares-y-lasaas-csmicas-e1s24k7" },
  { season: 2, episode: 4, title: "Lo que no hace la maquina es fabricar otras maquinas", date: "2022-11-30", seconds: 2377, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Lo-que-no-hace-la-maquina-es-fabricar-otras-maquinas-e1rgqjh" },
  { season: 2, episode: 3, title: "¡Camarero! ¡Este café que me ha puesto tiene temperatura negativa!", date: "2022-11-11", seconds: 3116, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Camarero--Este-caf-que-me-ha-puesto-tiene-temperatura-negativa-e1qjl4k" },
  { season: 2, episode: 2, title: "404 - Not Found", date: "2022-11-04", seconds: 1950, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/404---Not-Found-e1q78lh" },
  { season: 2, episode: 1, title: "Todo esta mal con el comienzo del universo", date: "2022-10-14", seconds: 2553, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Todo-esta-mal-con-el-comienzo-del-universo-e1p8nqc" },
  { season: 1, episode: 7, title: "23:59:60", date: "2022-05-17", seconds: 2522, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/235960-e1im3oh" },
  { season: 1, episode: 6, title: "Las palabras que las mujeres conocen pero los hombres no", date: "2022-05-02", seconds: 601, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Las-palabras-que-las-mujeres-conocen-pero-los-hombres-no-e1hv744" },
  { season: 1, episode: 5, title: "El crustáceo asesino que ve más colores que tu", date: "2022-04-16", seconds: 2461, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/El-crustceo-asesino-que-ve-ms-colores-que-tu-e1h5ccg" },
  { season: 1, episode: 4, title: "El pan vertical es más caro que el pan horizontal...¡la razón te sorprenderá!", date: "2022-04-02", seconds: 2314, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/El-pan-vertical-es-ms-caro-que-el-pan-horizontal---la-razn-te-sorprender-e1gfng8" },
  { season: 1, episode: 3, title: "El gobierno nos oculta que el sol es verde", date: "2022-03-21", seconds: 2746, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/El-gobierno-nos-oculta-que-el-sol-es-verde-e1g0h36" },
  { season: 1, episode: 2, title: "Esta teoría inter-universal demuestra la conjetura abc - los matemáticos la odian", date: "2022-03-01", seconds: 1796, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Esta-teora-inter-universal-demuestra-la-conjetura-abc---los-matemticos-la-odian-e1f2bud" },
  { season: 1, episode: 1, title: "Gravedad repulsiva", date: "2022-02-14", seconds: 1963, url: "https://podcasters.spotify.com/pod/show/esferas-invisibles/episodes/Gravedad-repulsiva-e1ed68g" },
];
