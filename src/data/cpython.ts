/**
 * § II: CPython. Everything here is sourced (see the research notes); keep it
 * that way. Descriptions may use `backticks` for inline code.
 */

/* ───────────────────────── types ───────────────────────── */

export interface Stat {
  /** big numeral, already formatted */
  value: string;
  /** small mono label under it */
  label: string;
  /** optional dust-coloured footnote */
  note?: string;
  /** optional gold Python-version tags shown under the label */
  versions?: string[];
  /** optional per-year series drawn as a tiny bar chart */
  series?: { year: string; n: number }[];
}

/** A role drawn as a bar on the timeline. Years are fractional (2020.4 ≈ May 2020). */
export interface Office {
  role: string;
  from: number;
  /** omitted = still ongoing */
  to?: number;
  /** human readable range, also used for screen readers */
  range: string;
  note?: string;
  /** draw as N equal segments (one per term) */
  segments?: number;
  /** ember instead of bone: the headline office */
  accent?: boolean;
  href?: string;
}

/** A single dated event, shown as a keyed tick on the timeline axis. */
export interface Milestone {
  at: number;
  date: string;
  title: string;
  detail?: string;
  href?: string;
}

export type PepStatus = "Final" | "Active" | "Rejected" | "Withdrawn";

export interface Pep {
  number: number;
  title: string;
  status: PepStatus;
  /** Python version it shipped in; null for process PEPs */
  version: string | null;
  /** version was only ever a target (rejected / withdrawn) */
  target?: boolean;
  coauthors: string[];
  description: string;
  /** larger plate */
  featured?: boolean;
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
  title: "The Interpreter",
  kicker: "import cpython",
  lede: "I got my commit bit in 2018 and have been poking at the interpreter's guts ever since. This is the paper trail: the offices, the proposals, and the things that shipped.",
};

/* ───────────────────────── numbers ───────────────────────── */

const CORE_DEV_SINCE = new Date("2018-06-06");
const yearsAsCoreDev = Math.floor(
  (Date.now() - CORE_DEV_SINCE.getTime()) / (365.2425 * 24 * 3600 * 1000),
);

export const stats: Stat[] = [
  {
    value: String(yearsAsCoreDev),
    label: "years as a core developer",
    note: "commit bit since 6 June 2018",
  },
  {
    value: "6",
    label: "Steering Council terms",
    note: "2021 through 2026, in a row",
  },
  {
    value: "2",
    label: "releases managed",
    versions: ["3.10", "3.11"],
  },
  {
    value: "15",
    label: "PEPs written",
    note: "authored or co-authored",
  },
  {
    value: "1,118",
    label: "merged pull requests",
    note: "python/cpython, by year opened",
    series: [
      { year: "2017", n: 14 },
      { year: "2018", n: 62 },
      { year: "2019", n: 132 },
      { year: "2020", n: 190 },
      { year: "2021", n: 259 },
      { year: "2022", n: 96 },
      { year: "2023", n: 79 },
      { year: "2024", n: 67 },
      { year: "2025", n: 133 },
      { year: "2026", n: 87 },
    ],
  },
  {
    value: "#29",
    label: "all-time contributor",
    note: "958 commits on main",
  },
];

export const statsSource = "GitHub, queried 24 September 2026";

/* ───────────────────────── timeline ───────────────────────── */

export const axis = { from: 2017, to: 2027, now: 2026.73 };

export const offices: Office[] = [
  {
    role: "Core developer",
    from: 2018.43,
    range: "June 2018 to now",
    href: "https://devguide.python.org/core-team/team-log/",
  },
  {
    role: "PSF Fellow",
    from: 2019.85,
    range: "2019 to now",
    href: "https://www.python.org/psf/fellows/",
  },
  {
    role: "Release manager, 3.10",
    from: 2020.38,
    range: "2020 to 2026",
    note: "last security releases",
    href: pepUrl(619),
  },
  {
    role: "Release manager, 3.11",
    from: 2021.34,
    range: "2021 to now",
    href: pepUrl(664),
  },
  {
    role: "Faster CPython",
    from: 2021.34,
    to: 2022.81,
    range: "the 3.11 cycle",
    note: "part-time, funded by Bloomberg",
    href: "https://docs.python.org/3.11/whatsnew/3.11.html#whatsnew311-faster-cpython-about",
  },
  {
    role: "Steering Council",
    from: 2021,
    range: "six terms, 2021 through 2026",
    segments: 6,
    accent: true,
    href: "https://peps.python.org/pep-8107/",
  },
];

export const milestones: Milestone[] = [
  {
    at: 2017.66,
    date: "28 Aug 2017",
    title: "First merged pull request",
    detail: "A fix to the ZeroMQ logging examples. Everyone starts somewhere.",
    href: "https://github.com/python/cpython/pull/3229",
  },
  {
    at: 2018.43,
    date: "6 Jun 2018",
    title: "Commit bit",
    detail: "Promoted to core developer.",
    href: "https://devguide.python.org/core-team/team-log/",
  },
  {
    at: 2018.9,
    date: "2018",
    title: "PEP 8001",
    detail: "After Guido stepped down, I co-wrote the process we used to vote on how Python is governed.",
    href: pepUrl(8001),
  },
  {
    at: 2019.85,
    date: "Q4 2019",
    title: "PSF Fellow",
    href: "https://www.python.org/psf/fellows/",
  },
  {
    at: 2020.3,
    date: "2020",
    title: "Language Summit: the PEG parser",
    href: "https://us.pycon.org/2020/events/languagesummit/",
  },
  {
    at: 2022.3,
    date: "2022",
    title: "Language Summit: f-strings in the grammar",
    href: "https://us.pycon.org/2022/events/language-summit/",
  },
  {
    at: 2024.35,
    date: "2024",
    title: "Language Summit: the new REPL",
    href: "https://us.pycon.org/2024/events/language-summit/",
  },
  {
    at: 2026.38,
    date: "2026",
    title: "PyCon US keynote",
    detail: "“Horizonte de sucesos / Event Horizon”, in Spanish with live English translation.",
    href: "https://us.pycon.org/2026/about/keynote-speakers/",
  },
];

/* ───────────────────────── PEPs ───────────────────────── */

export const peps: Pep[] = [
  {
    number: 570,
    title: "Python Positional-Only Parameters",
    status: "Final",
    version: "3.8",
    coauthors: ["Larry Hastings", "Mario Corchero", "Eric N. Vander Weele"],
    description: "The `/` in `def f(a, b, /)`. I co-wrote the PEP and implemented it.",
  },
  {
    number: 617,
    title: "New PEG parser for CPython",
    status: "Final",
    version: "3.9",
    coauthors: ["Guido van Rossum", "Lysandros Nikolaou"],
    description:
      "Guido, Lysandros and I swapped out CPython's 30-year-old LL(1) parser for a PEG one, which opened the door to new syntax and much better error messages.",
    featured: true,
  },
  {
    number: 619,
    title: "Python 3.10 Release Schedule",
    status: "Active",
    version: "3.10",
    coauthors: [],
    description: "The calendar I ran 3.10 by, from alpha to security-only.",
  },
  {
    number: 657,
    title: "Include Fine Grained Error Locations in Tracebacks",
    status: "Final",
    version: "3.11",
    coauthors: ["Batuhan Taskaya", "Ammar Askar"],
    description:
      "Those little `^^^^^` markers in your tracebacks that point at the exact expression that blew up.",
    featured: true,
  },
  {
    number: 664,
    title: "Python 3.11 Release Schedule",
    status: "Active",
    version: "3.11",
    coauthors: [],
    description: "The same thing again, this time for 3.11.",
  },
  {
    number: 679,
    title: "New assert statement syntax with parentheses",
    status: "Rejected",
    version: "3.15",
    target: true,
    coauthors: ["Stan Ulbrych"],
    description:
      "An attempt to make `assert(x, \"msg\")` do what people expect instead of always passing. The Steering Council said no, which happens.",
  },
  {
    number: 701,
    title: "Syntactic formalization of f-strings",
    status: "Final",
    version: "3.12",
    coauthors: ["Batuhan Taskaya", "Lysandros Nikolaou", "Marta Gómez Macías"],
    description:
      "f-strings moved into the real grammar, so you can nest quotes, use backslashes and comments, and get proper error messages inside them.",
    featured: true,
  },
  {
    number: 758,
    title: "Allow except and except* expressions without parentheses",
    status: "Final",
    version: "3.14",
    coauthors: ["Brett Cannon"],
    description: "`except TimeoutError, ConnectionRefusedError:` is valid again, with no brackets needed.",
  },
  {
    number: 760,
    title: "No More Bare Excepts",
    status: "Withdrawn",
    version: "3.14",
    target: true,
    coauthors: ["Brett Cannon"],
    description:
      "Brett and I proposed getting rid of bare `except:`. The community pushed back, and we withdrew it.",
  },
  {
    number: 762,
    title: "REPL-acing the default REPL",
    status: "Final",
    version: "3.13",
    coauthors: ["Łukasz Langa", "Lysandros Nikolaou", "Emily Morehouse-Valcarcel"],
    description:
      "Why Python 3.13 ships a new REPL, written in Python, with colors, multiline editing and paste mode.",
  },
  {
    number: 768,
    title: "Safe external debugger interface for CPython",
    status: "Final",
    version: "3.14",
    coauthors: ["Matt Wozniski", "Ivona Stojanovic"],
    description:
      "A safe, zero-overhead way for debuggers to attach to a running Python process and run code in it. It's what powers `sys.remote_exec` and `python -m pdb -p PID`.",
    featured: true,
  },
  {
    number: 799,
    title: "A dedicated profiling package for organizing Python profiling tools",
    status: "Final",
    version: "3.15",
    coauthors: ["László Kiss Kollár"],
    description:
      "A new `profiling` package to hold Python's profilers, including Tachyon, the new sampling profiler.",
    featured: true,
  },
  {
    number: 810,
    title: "Explicit lazy imports",
    status: "Final",
    version: "3.15",
    coauthors: [
      "Germán Méndez Bravo",
      "Thomas Wouters",
      "Dino Viehland",
      "Brittany Reynoso",
      "Noah Kim",
      "Tim Stumbaugh",
    ],
    description:
      "`lazy import json`: the module only loads when you actually use it, so startup gets faster.",
    featured: true,
  },
  {
    number: 831,
    title: "Frame Pointers Everywhere: Enabling System-Level Observability for Python",
    status: "Final",
    version: "3.15",
    coauthors: ["Ken Jin", "Savannah Ostrowski", "Diego Russo"],
    description:
      "CPython now builds with frame pointers by default, so system profilers and debuggers can walk Python's native stacks.",
  },
  {
    number: 8001,
    title: "Python Governance Voting Process",
    status: "Final",
    version: null,
    coauthors: [
      "Brett Cannon",
      "Christian Heimes",
      "Donald Stufft",
      "Eric Snow",
      "Gregory P. Smith",
      "Łukasz Langa",
      "Mariatta",
      "Nathaniel J. Smith",
      "Raymond Hettinger",
      "Tal Einat",
      "Tim Peters",
      "Zachary Ware",
    ],
    description:
      "After Guido stepped down in 2018, I co-wrote the process the core team used to vote on how Python would be governed.",
  },
];

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
        name: "math.prod and other odds and ends",
        description:
          "I added `math.prod()`, `gc.get_objects(generation=...)`, and helped speed up namedtuple field lookups and class variable writes.",
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
          "Years of GC work: `gc.get_objects(generation)` (3.8), handling resurrected objects correctly and `gc.is_finalized` (3.9), GC audit hooks (3.10), and moving GC runs onto the eval breaker instead of object allocations (3.12).",
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
          "The new PEG-based parser became the default in 3.9, and the old LL(1) parser was deleted in 3.10.",
        sources: sources(
          "https://docs.python.org/3.9/whatsnew/3.9.html#new-parser",
          "https://bugs.python.org/issue40334",
        ),
      },
      {
        name: "graphlib and ast.unparse",
        description:
          "I co-created the `graphlib` module (topological sorting) with Tim Peters and Larry Hastings, and `ast.unparse()` with Batuhan Taskaya.",
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
          "I rewrote a large share of SyntaxErrors (\"expected ':'\", \"Perhaps you forgot a comma?\", unclosed brackets) and added \"Did you mean\" suggestions for NameError and AttributeError. I've kept improving them in every release since: import suggestions in 3.12, keyword typo suggestions like \"Did you mean 'while'?\" in 3.14.",
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
          "Multi-line `with (a() as x, b() as y):` became officially supported, thanks to the new parser.",
        sources: sources(
          "https://docs.python.org/3.10/whatsnew/3.10.html",
          "https://bugs.python.org/issue12782",
        ),
      },
      {
        name: "LOAD_ATTR opcode cache",
        description:
          "A per-opcode cache that made attribute access about 36% faster (44% for slots). I built it with Yury Selivanov.",
        sources: sources(
          "https://docs.python.org/3.10/whatsnew/3.10.html",
          "https://bugs.python.org/issue42093",
        ),
      },
    ],
    demo: {
      title: "Error messages that know what went wrong",
      caption: "Same file, one release apart.",
      panes: [
        {
          label: "python3.9",
          before: true,
          lines: [
            { k: "cmd", t: "python3.9 orbits.py" },
            { k: "out", t: '  File "/tmp/orbits.py", line 4' },
            { k: "src", t: "    print(orbits)" },
            { k: "caret", t: "    ^" },
            { k: "err", t: "SyntaxError: invalid syntax" },
          ],
        },
        {
          label: "python3.10",
          lines: [
            { k: "cmd", t: "python3.10 orbits.py" },
            { k: "out", t: '  File "/tmp/orbits.py", line 1' },
            { k: "src", t: '    orbits = {"mercury": 88, "venus": 225,' },
            { k: "caret", t: "             ^" },
            { k: "err", t: "SyntaxError: '{' was never closed" },
            { k: "blank" },
            { k: "cmd", t: "python3.10 typo.py" },
            { k: "out", t: "Traceback (most recent call last):" },
            { k: "out", t: '  File "/tmp/typo.py", line 2, in <module>' },
            { k: "src", t: "    pint(math.tau)" },
            { k: "err", t: "NameError: name 'pint' is not defined. Did you mean: 'print'?" },
          ],
        },
      ],
    },
  },
  {
    version: "3.11",
    when: "2022",
    rm: true,
    features: [
      {
        name: "Fine-grained error locations in tracebacks",
        pep: 657,
        description: "Tracebacks now underline the exact expression that failed, not just the line.",
        sources: sources(
          "https://docs.python.org/3.11/whatsnew/3.11.html#whatsnew311-pep657",
          "https://bugs.python.org/issue43950",
        ),
      },
      {
        name: "Inlined Python-to-Python calls",
        description:
          "With Mark Shannon I made Python function calls stop consuming C stack, which gave about a 1.7x speedup on simple recursive code.",
        sources: sources(
          "https://docs.python.org/3.11/whatsnew/3.11.html",
          "https://bugs.python.org/issue45256",
        ),
      },
    ],
    demo: {
      title: "Which one was None?",
      caption: "The tildes cover the operands, the carets the operator that failed.",
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
          "f-strings got a proper grammar, and the tokenize module became up to 64% faster along the way.",
        sources: sources(
          "https://docs.python.org/3.12/whatsnew/3.12.html#whatsnew312-pep701",
          "https://github.com/python/cpython/issues/102856",
        ),
      },
      {
        name: "Linux perf profiler support",
        description:
          "I designed and built support for `perf` (`-X perf`) so Python function names show up in native profiles. 3.13 added `-X perf_jit`, which works without frame pointers.",
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
    demo: {
      title: "Quotes inside quotes",
      caption: "Reusing the same quote inside the braces was a SyntaxError before 3.12.",
      panes: [
        {
          label: "python3.12",
          lines: [
            { k: "prompt", t: 'songs = ["Take me back to Eden", "Alkaline", "Ascensionism"]' },
            { k: "prompt", t: 'f"This is the playlist: {", ".join(songs)}"' },
            { k: "out", t: "'This is the playlist: Take me back to Eden, Alkaline, Ascensionism'" },
          ],
        },
      ],
    },
  },
  {
    version: "3.13",
    when: "2024",
    features: [
      {
        name: "A new interactive REPL, and colored tracebacks",
        pep: 762,
        description:
          "Łukasz, Lysandros and I built the new default REPL (based on PyPy's), and I made tracebacks colored by default.",
        sources: sources(
          "https://docs.python.org/3.13/whatsnew/3.13.html#whatsnew313-better-interactive-interpreter",
          "https://github.com/python/cpython/issues/111201",
          "https://github.com/python/cpython/issues/112730",
        ),
      },
      {
        name: "PyRefTracer C API",
        description: "C API hooks for tracking object creation and destruction, useful for memory profilers.",
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
          "Point it at a running process and see which tasks are waiting on which. Also added `asyncio.capture_call_graph()` and `print_call_graph()`.",
        sources: sources(
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-asyncio-introspection",
          "https://github.com/python/cpython/issues/91048",
        ),
      },
      {
        name: "Template strings",
        description: "One of the team that implemented t-strings (PEP 750), mainly on the parser side.",
        sources: sources(
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-template-string-literals",
          "https://github.com/python/cpython/issues/132661",
        ),
      },
      {
        name: "Bracketless except",
        pep: 758,
        description: "`except A, B:` without parentheses.",
        sources: sources(
          "https://docs.python.org/3.14/whatsnew/3.14.html#whatsnew314-bracketless-except",
          "https://github.com/python/cpython/issues/131831",
        ),
      },
    ],
  },
  {
    version: "3.15",
    when: "due 1 Oct 2026",
    upcoming: true,
    features: [
      {
        name: "Tachyon and the profiling package",
        pep: 799,
        description:
          "Tachyon (`profiling.sampling`) is a high-frequency statistical profiler that can attach to running processes, and `cProfile` finds a new home as `profiling.tracing`. Built with László Kiss Kollár.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-sampling-profiler",
          "https://docs.python.org/3.15/library/profiling.sampling.html",
          "https://github.com/python/cpython/issues/135953",
        ),
      },
      {
        name: "Explicit lazy imports",
        pep: 810,
        description: "The `lazy import` statement, implemented with Dino Viehland.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-lazy-imports",
          "https://github.com/python/cpython/issues/142349",
        ),
      },
      {
        name: "Frame pointers by default",
        pep: 831,
        description:
          "CPython builds with frame pointers by default, so native profilers and debuggers can see through Python.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-frame-pointers",
          "https://github.com/python/cpython/issues/149201",
        ),
      },
      {
        name: "JIT unwind info for GDB and backtrace",
        description:
          "Native debuggers can unwind through JIT-compiled frames instead of stopping at generated code. Done with Diego Russo.",
        sources: sources(
          "https://docs.python.org/3.15/whatsnew/3.15.html#whatsnew315-jit",
          "https://github.com/python/cpython/issues/146071",
        ),
      },
    ],
  },
];
