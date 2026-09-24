/**
 * § II: CPython. Everything here is sourced (see the research notes); keep it
 * that way. Descriptions may use `backticks` for inline code.
 *
 * The counts (merged PRs, commits, rank) come from `generated/cpython.json` and
 * the PEP list comes from `generated/peps.json`. A GitHub Action refreshes both
 * every day. Only the PEP descriptions and the featured set are curated here.
 */

import cpythonData from "./generated/cpython.json";
import pepsData from "./generated/peps.json";

/* ───────────────────────── types ───────────────────────── */

export interface Stat {
  /** big numeral, already formatted */
  value: string;
  /** small label under it */
  label: string;
}

/** One row in the list of roles. */
export interface Office {
  role: string;
  /** human readable range, e.g. "2018 to now" */
  range: string;
  href?: string;
}

/** Statuses from PEP 1. The generated data can in principle carry others. */
export type PepStatus =
  | "Draft"
  | "Active"
  | "Accepted"
  | "Provisional"
  | "Final"
  | "Deferred"
  | "Rejected"
  | "Withdrawn"
  | "Superseded";

export interface Pep {
  number: number;
  /** from the PEP index; may use `backticks` for inline code */
  title: string;
  status: PepStatus;
  /** "Standards Track", "Informational" or "Process" */
  type: string;
  /** Python version from the PEP header; null when it has none (e.g. process PEPs) */
  version: string | null;
  /** version was only ever a target (rejected / withdrawn / deferred / superseded) */
  target?: boolean;
  coauthors: string[];
  /** curated; empty for a PEP that has no entry in `pepNotes` yet */
  description: string;
  /** larger plate */
  featured?: boolean;
  url: string;
}

export interface Source {
  label: string;
  href: string;
}

export interface Feature {
  name: string;
  description: string;
  sources: Source[];
  /** cross-reference to a PEP plate above */
  pep?: number;
  /** when the work spans several releases */
  span?: string;
}

export type LineKind =
  | "cmd" // $ shell command
  | "prompt" // >>> REPL input
  | "src" // echoed source line
  | "out" // plain output
  | "caret" // ~~~^^^ markers
  | "err" // ExceptionName: message
  | "blank";

export interface DemoLine {
  k: LineKind;
  t?: string;
}

export interface DemoPane {
  /** mono caption over the pane, e.g. "python3.9" */
  label: string;
  /** "before" panes are dimmed */
  before?: boolean;
  lines: DemoLine[];
}

export interface Demo {
  title: string;
  caption: string;
  panes: DemoPane[];
}

export interface Release {
  version: string;
  /** release year, or the scheduled date for an unreleased version */
  when: string;
  upcoming?: boolean;
  /** I was the release manager */
  rm?: boolean;
  features: Feature[];
  demo?: Demo;
}

/* ───────────────────────── helpers ───────────────────────── */

/** Turn a source URL into a short mono label (bpo-12345, gh-12345, PEP 617…). */
function src(href: string): Source {
  let m: RegExpMatchArray | null;
  if ((m = href.match(/bugs\.python\.org\/issue(\d+)/))) return { label: `bpo-${m[1]}`, href };
  if ((m = href.match(/github\.com\/python\/cpython\/issues\/(\d+)/))) return { label: `gh-${m[1]}`, href };
  if ((m = href.match(/peps\.python\.org\/pep-0*(\d+)/))) return { label: `PEP ${m[1]}`, href };
  if ((m = href.match(/docs\.python\.org\/(3\.\d+)\/whatsnew/))) return { label: `What's New ${m[1]}`, href };
  if (href.includes("docs.python.org")) return { label: "docs", href };
  return { label: new URL(href).hostname, href };
}
const sources = (...urls: string[]) => urls.map(src);

export const pepUrl = (n: number) => `https://peps.python.org/pep-${String(n).padStart(4, "0")}/`;

/* ───────────────────────── head ───────────────────────── */

export const intro = {
  num: "II",
  title: "CPython",
  kicker: "python/cpython",
  lede: "I became a CPython core developer in June 2018. This section lists my roles, my PEPs and my changes to each release since 3.8.",
};

/* ───────────────────────── numbers ───────────────────────── */

const BUILT = new Date();
const CORE_DEV_SINCE = new Date("2018-06-06");
const yearsAsCoreDev = Math.floor(
  (BUILT.getTime() - CORE_DEV_SINCE.getTime()) / (365.2425 * 24 * 3600 * 1000),
);

const fetchedAt = new Date(cpythonData.fetchedAt);
/** The year of the snapshot is still in progress, so its bar is partial. */
const partialYear = String(fetchedAt.getUTCFullYear());
const fmt = (n: number) => n.toLocaleString("en-US");

export const stats: Stat[] = [
  { value: String(yearsAsCoreDev), label: "years as a core developer" },
  { value: fmt(cpythonData.mergedPRs), label: "merged pull requests" },
  { value: String(pepsData.peps.length), label: "PEPs as author or co-author" },
  { value: `#${cpythonData.contributorRank}`, label: "all-time contributor rank" },
];

/** Merged pull requests per year (by year opened), for the small bar chart. */
export const prsByYear: { year: string; n: number; partial?: boolean }[] =
  cpythonData.mergedPRsByYear.map((d) => ({
    year: d.year,
    n: d.count,
    partial: d.year === partialYear || undefined,
  }));

export const statsSource = `GitHub, queried ${fetchedAt.toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})}`;

/* ───────────────────────── roles ───────────────────────── */

export const offices: Office[] = [
  {
    role: "Core developer",
    range: "2018 to now",
    href: "https://devguide.python.org/core-team/team-log/",
  },
  {
    role: "PSF Fellow",
    range: "2019",
    href: "https://www.python.org/psf/fellows/",
  },
  {
    role: "Release manager, 3.10 and 3.11",
    range: "2020 to now",
    href: pepUrl(619),
  },
  {
    role: "Steering Council, six terms",
    range: "2021 to 2026",
    href: "https://peps.python.org/pep-8107/",
  },
];

/* ───────────────────────── PEPs ───────────────────────── */

/**
 * Curated text for each PEP, keyed by number. The list itself, the titles,
 * statuses, versions and co-authors come from `generated/peps.json`. A new PEP
 * in that file renders without a description until it gets an entry here.
 */
const pepNotes: Record<number, { description: string; featured?: boolean }> = {
  570: {
    description:
      "The `/` in `def f(a, b, /)`. I co-wrote the PEP and implemented it.",
  },
  617: {
    description:
      "Guido, Lysandros and I replaced the old LL(1) parser with a PEG parser.",
    featured: true,
  },
  619: {
    description:
      "The release schedule I followed for 3.10, from the first alpha to the security-only releases.",
  },
  657: {
    description:
      "Tracebacks mark the exact expression that failed with `^^^^^`.",
    featured: true,
  },
  664: {
    description:
      "The release schedule I followed for 3.11.",
  },
  679: {
    description:
      "A proposal to make `assert(x, \"msg\")` check `x`. Today that line always passes. The Steering Council rejected the PEP.",
  },
  701: {
    description:
      "f-strings are part of the grammar. You can reuse quotes inside them.",
    featured: true,
  },
  758: {
    description:
      "`except TimeoutError, ConnectionRefusedError:` is valid syntax. You do not need the parentheses.",
  },
  760: {
    description:
      "Brett and I proposed to remove bare `except:`. Many people disagreed, so we withdrew it.",
  },
  762: {
    description:
      "The reasons for the new REPL in Python 3.13. It is written in Python and has colors, multiline editing and paste mode.",
  },
  768: {
    description:
      "Debuggers can attach to a running process. `pdb -p PID` uses it.",
    featured: true,
  },
  799: {
    description:
      "A new `profiling` package. It includes Tachyon, a sampling profiler.",
    featured: true,
  },
  810: {
    description:
      "`lazy import json` loads the module only when you first use it.",
    featured: true,
  },
  831: {
    description:
      "From 3.15, CPython builds with frame pointers by default. Native profilers and debuggers can then walk Python's native stacks.",
  },
  8001: {
    description:
      "Guido stepped down in 2018. I co-wrote the process that the core team used to vote on a new governance model.",
  },
};

/** "Pablo Galindo Salgado" and plain "Pablo Galindo", as in scripts/refresh/peps.mjs. */
const IS_ME = /^Pablo Galindo( Salgado)?$/;

/** No shipped version: the version in the header was only ever a target. */
const NOT_SHIPPED = new Set(["Rejected", "Withdrawn", "Deferred", "Superseded"]);

export const peps: Pep[] = [...pepsData.peps]
  .sort((a, b) => a.number - b.number)
  .map((p) => {
    const note = pepNotes[p.number];
    return {
      number: p.number,
      // the PEP index uses reST ``literals``; the component renders `code`
      title: p.title.replace(/``([^`]+)``/g, "`$1`"),
      status: p.status as PepStatus,
      type: p.type,
      version: p.python_version,
      target: NOT_SHIPPED.has(p.status) || undefined,
      coauthors: p.authors.filter((a) => !IS_ME.test(a.trim())),
      description: note?.description ?? "",
      featured: note?.featured,
      url: p.url || pepUrl(p.number),
    };
  });

/* Status tally and the sentence above the plates, both from the data. */

const STATUS_ORDER: string[] = [
  "Final",
  "Active",
  "Accepted",
  "Provisional",
  "Draft",
  "Deferred",
  "Rejected",
  "Withdrawn",
  "Superseded",
];

/** Count per status, in PEP 1 order; statuses with no PEPs are left out. */
export const pepTally: { n: number; status: string }[] = (() => {
  const counts = new Map<string, number>();
  for (const p of peps) counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
  const rank = (s: string) => (STATUS_ORDER.includes(s) ? STATUS_ORDER.indexOf(s) : STATUS_ORDER.length);
  return [...counts]
    .sort((a, b) => rank(a[0]) - rank(b[0]))
    .map(([status, n]) => ({ n, status }));
})();

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
  "eighteen", "nineteen", "twenty",
];
const word = (n: number) => WORDS[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const be = (n: number) => (n === 1 ? "is" : "are");
const and = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

/**
 * For example: "My name is on 15 PEPs. Eleven are final. Two are the release
 * schedules for 3.10 and 3.11. One is rejected and one is withdrawn."
 */
export const pepSummary: string = (() => {
  const total = peps.length;
  const out = [`My name is on ${total} ${total === 1 ? "PEP" : "PEPs"}.`];

  const final = peps.filter((p) => p.status === "Final").length;
  if (final > 0) out.push(`${cap(word(final))} ${be(final)} final.`);

  const schedules = peps.filter((p) => p.status === "Active" && /release schedule/i.test(p.title));
  if (schedules.length > 0) {
    const vs = schedules.map((p) => p.title.match(/\d+\.\d+/)?.[0]).filter((v): v is string => !!v);
    const n = schedules.length;
    const what = n === 1 ? "the release schedule" : "the release schedules";
    out.push(`${cap(word(n))} ${be(n)} ${what}${vs.length ? ` for ${and(vs)}` : ""}.`);
  }

  const rest = pepTally
    .filter((t) => t.status !== "Final")
    .map((t) => ({
      ...t,
      n: t.status === "Active" ? t.n - schedules.length : t.n,
    }))
    .filter((t) => t.n > 0)
    .map(({ n, status }) =>
      status === "Draft"
        ? n === 1
          ? "one is a draft"
          : `${word(n)} are drafts`
        : `${word(n)} ${be(n)} ${status.toLowerCase()}`,
    );
  if (rest.length > 0) out.push(`${cap(and(rest))}.`);

  return out.join(" ");
})();

/** The version that has not shipped yet (final scheduled for 2026-10-01, PEP 790). */
export const upcomingVersion = "3.15";

/* ───────────────────────── changelog ───────────────────────── */

export const releases: Release[] = [
  {
    version: "3.8",
    when: "2019",
    features: [
      {
        name: "Positional-only parameters",
        pep: 570,
        description: "I implemented the `/` syntax for positional-only parameters.",
        sources: sources(
          "https://docs.python.org/3.8/whatsnew/3.8.html#positional-only-parameters",
          "https://bugs.python.org/issue36540",
        ),
      },
      {
        name: "math.prod and smaller changes",
        description:
          "I added `math.prod()` and `gc.get_objects(generation=...)`. I also helped make namedtuple field lookups and class variable writes faster.",
        sources: sources(
          "https://docs.python.org/3.8/whatsnew/3.8.html",
          "https://bugs.python.org/issue35606",
          "https://bugs.python.org/issue36016",
        ),
      },
      {
        name: "Garbage collector work",
        span: "3.8 to 3.12",
        description:
          "I worked on the garbage collector from 3.8 to 3.12. 3.8 got `gc.get_objects(generation)`. 3.9 got correct handling of resurrected objects and `gc.is_finalized`. 3.10 got GC audit hooks. In 3.12, GC runs moved from object allocation to the eval breaker.",
        sources: sources(
          "https://docs.python.org/3.9/whatsnew/3.9.html",
          "https://bugs.python.org/issue38379",
          "https://github.com/python/cpython/issues/97922",
        ),
      },
    ],
  },
  {
    version: "3.9",
    when: "2020",
    features: [
      {
        name: "The PEG parser",
        pep: 617,
        description:
          "The new PEG parser became the default in 3.9. We deleted the old LL(1) parser in 3.10.",
        sources: sources(
          "https://docs.python.org/3.9/whatsnew/3.9.html#new-parser",
          "https://bugs.python.org/issue40334",
        ),
      },
      {
        name: "graphlib and ast.unparse",
        description:
          "I wrote the `graphlib` module (topological sorting) with Tim Peters and Larry Hastings. I wrote `ast.unparse()` with Batuhan Taskaya.",
        sources: sources(
          "https://docs.python.org/3.9/whatsnew/3.9.html",
          "https://bugs.python.org/issue17005",
          "https://bugs.python.org/issue38870",
        ),
      },
    ],
  },
  {
    version: "3.10",
    when: "2021",
    rm: true,
    features: [
      {
        name: "Better error messages and “Did you mean” suggestions",
        span: "3.10 onwards",
        description:
          "In 3.10 I rewrote many SyntaxErrors, for example \"expected ':'\", \"Perhaps you forgot a comma?\" and unclosed brackets. I also added \"Did you mean\" suggestions for NameError and AttributeError. I improve them in every release. 3.12 added import suggestions. 3.14 added keyword typo suggestions like \"Did you mean 'while'?\".",
        sources: sources(
          "https://docs.python.org/3.10/whatsnew/3.10.html#better-error-messages",
          "https://docs.python.org/3.12/whatsnew/3.12.html",
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-improved-error-messages",
          "https://bugs.python.org/issue38530",
        ),
      },
      {
        name: "Parenthesized context managers",
        description:
          "With the new parser, multi-line `with (a() as x, b() as y):` became official syntax.",
        sources: sources(
          "https://docs.python.org/3.10/whatsnew/3.10.html",
          "https://bugs.python.org/issue12782",
        ),
      },
      {
        name: "LOAD_ATTR opcode cache",
        description:
          "Yury Selivanov and I added a per-opcode cache. It made attribute access about 36% faster (44% for slots).",
        sources: sources(
          "https://docs.python.org/3.10/whatsnew/3.10.html",
          "https://bugs.python.org/issue42093",
        ),
      },
    ],
  },
  {
    version: "3.11",
    when: "2022",
    rm: true,
    features: [
      {
        name: "Fine-grained error locations in tracebacks",
        pep: 657,
        description: "Tracebacks underline the exact expression that failed. Before 3.11, they showed only the line.",
        sources: sources(
          "https://docs.python.org/3.11/whatsnew/3.11.html#whatsnew311-pep657",
          "https://bugs.python.org/issue43950",
        ),
      },
      {
        name: "Inlined Python-to-Python calls",
        description:
          "Mark Shannon and I made Python-to-Python calls stop using the C stack. Simple recursive code became about 1.7x faster.",
        sources: sources(
          "https://docs.python.org/3.11/whatsnew/3.11.html",
          "https://bugs.python.org/issue45256",
        ),
      },
    ],
    demo: {
      title: "Carets under the failing expression",
      caption: "The tildes mark the operands. The carets mark the operator that failed.",
      panes: [
        {
          label: "python3.11",
          lines: [
            { k: "cmd", t: "python3.11 area.py" },
            { k: "out", t: "Traceback (most recent call last):" },
            { k: "out", t: '  File "/tmp/area.py", line 4, in <module>' },
            { k: "src", t: '    area({"width": 4, "height": None})' },
            { k: "out", t: '  File "/tmp/area.py", line 2, in area' },
            { k: "src", t: '    return shape["width"] * shape["height"]' },
            { k: "caret", t: "           ~~~~~~~~~~~~~~~^~~~~~~~~~~~~~~~~" },
            { k: "err", t: "TypeError: unsupported operand type(s) for *: 'int' and 'NoneType'" },
          ],
        },
      ],
    },
  },
  {
    version: "3.12",
    when: "2023",
    features: [
      {
        name: "f-strings in the grammar",
        pep: 701,
        description:
          "f-strings are now part of the grammar. The tokenize module also became up to 64% faster.",
        sources: sources(
          "https://docs.python.org/3.12/whatsnew/3.12.html#whatsnew312-pep701",
          "https://github.com/python/cpython/issues/102856",
        ),
      },
      {
        name: "Linux perf profiler support",
        description:
          "I designed and wrote support for the Linux `perf` profiler (`-X perf`). With it, Python function names show up in native profiles. 3.13 added `-X perf_jit`, which works without frame pointers.",
        sources: sources(
          "https://docs.python.org/3/howto/perf_profiling.html",
          "https://github.com/python/cpython/issues/96123",
          "https://github.com/python/cpython/issues/118518",
        ),
      },
      {
        name: "threading.settrace_all_threads and setprofile_all_threads",
        description: "You can now install a tracer or profiler on every thread at once.",
        sources: sources(
          "https://docs.python.org/3.12/whatsnew/3.12.html",
          "https://github.com/python/cpython/issues/93503",
        ),
      },
    ],
  },
  {
    version: "3.13",
    when: "2024",
    features: [
      {
        name: "A new interactive REPL, and colored tracebacks",
        pep: 762,
        description:
          "Łukasz, Lysandros and I built the new default REPL, based on the PyPy REPL. I also made tracebacks colored by default.",
        sources: sources(
          "https://docs.python.org/3.13/whatsnew/3.13.html#whatsnew313-better-interactive-interpreter",
          "https://github.com/python/cpython/issues/111201",
          "https://github.com/python/cpython/issues/112730",
        ),
      },
      {
        name: "PyRefTracer C API",
        description: "New C API hooks that report when objects are created and destroyed. Memory profilers can use them.",
        sources: sources(
          "https://docs.python.org/3.13/whatsnew/3.13.html",
          "https://github.com/python/cpython/issues/93502",
        ),
      },
    ],
  },
  {
    version: "3.14",
    when: "2025",
    features: [
      {
        name: "Remote debugging: sys.remote_exec and pdb -p",
        pep: 768,
        description:
          "`sys.remote_exec()` and `python -m pdb -p PID` let you attach to a live Python process and debug it without restarting.",
        sources: sources(
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-remote-debugging",
          "https://github.com/python/cpython/issues/131591",
        ),
      },
      {
        name: "asyncio introspection: python -m asyncio ps and pstree",
        description:
          "Run them against a running process to see which tasks wait on which. I also added `asyncio.capture_call_graph()` and `print_call_graph()`.",
        sources: sources(
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-asyncio-introspection",
          "https://github.com/python/cpython/issues/91048",
        ),
      },
      {
        name: "Template strings",
        description: "I was one of the people who implemented t-strings (PEP 750). I worked mainly on the parser.",
        sources: sources(
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-template-string-literals",
          "https://github.com/python/cpython/issues/132661",
        ),
      },
      {
        name: "Bracketless except",
        pep: 758,
        description: "You can write `except A, B:` without parentheses.",
        sources: sources(
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-bracketless-except",
          "https://github.com/python/cpython/issues/131831",
        ),
      },
    ],
  },
  {
    version: "3.15",
    when: "final due 1 Oct 2026",
    upcoming: true,
    features: [
      {
        name: "Tachyon and the profiling package",
        pep: 799,
        description:
          "Tachyon (`profiling.sampling`) is a high-frequency sampling profiler. It can attach to running processes. `cProfile` moves to `profiling.tracing`. László Kiss Kollár and I built Tachyon.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-sampling-profiler",
          "https://docs.python.org/3.15/library/profiling.sampling.html",
          "https://github.com/python/cpython/issues/135953",
        ),
      },
      {
        name: "Explicit lazy imports",
        pep: 810,
        description: "The new `lazy import` statement. Dino Viehland and I implemented it.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-lazy-imports",
          "https://github.com/python/cpython/issues/142349",
        ),
      },
      {
        name: "Frame pointers by default",
        pep: 831,
        description:
          "CPython builds with frame pointers by default. Native profilers and debuggers can then walk through Python frames.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-frame-pointers",
          "https://github.com/python/cpython/issues/149201",
        ),
      },
      {
        name: "JIT unwind info for GDB and backtrace",
        description:
          "Native debuggers can unwind through JIT-compiled frames. Before, they stopped at the generated code. Diego Russo and I did this work.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-jit",
          "https://github.com/python/cpython/issues/146071",
        ),
      },
    ],
  },
];
