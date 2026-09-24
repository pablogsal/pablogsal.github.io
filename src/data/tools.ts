/**
 * § III Tools.
 *
 * Star counts come from `generated/github.json`, refreshed daily by a GitHub
 * Action (see `starsFetched`). The `stars` written below are only fallbacks,
 * used when a repo is missing from that snapshot. Descriptions are curated by
 * hand and checked against each project's README or docs.
 */

import github from "./generated/github.json";

export type ToolVisual = "flame" | "stack" | "sampling" | "budget" | "tree";

export interface ToolLink {
  label: string;
  href: string;
}

export interface FeaturedTool {
  id: string;
  name: string;
  /** Secondary name shown in mono next to the title, e.g. the module path */
  alias?: string;
  /** One short label: my role on the project */
  role: string;
  /** One or two short sentences */
  description: string;
  /** One example shell command, rendered with a `$` prompt */
  command: string;
  /** "owner/name" on GitHub; live stars are looked up by this key */
  repo?: string;
  stars?: number;
  /** Shown in place of stars when the tool has no repo of its own */
  badge?: string;
  language: string;
  links: ToolLink[];
  /** Which pixel sprite to draw */
  visual: ToolVisual;
}

export interface Experiment {
  name: string;
  href: string;
  /** Wrap code in `backticks` to render it in mono */
  description: string;
  language: string;
  /** "owner/name" on GitHub; live stars are looked up by this key */
  repo: string;
  stars: number;
}

/** How many experiments show before the "show all" toggle */
export const experimentsVisible = 8;

/** Snapshot repos, keyed by "owner/name". */
const liveRepos: Record<string, { stars: number } | undefined> = github.repos;

/** Live star count for `repo`, or `fallback` if the snapshot lacks it. */
const liveStars = (repo: string, fallback: number): number =>
  liveRepos[repo]?.stars ?? fallback;

/** Date of the star snapshot, as YYYY-MM-DD */
export const starsFetched: string = github.fetchedAt?.slice(0, 10) ?? "2026-09-24";

export const toolsIntro = {
  num: "III",
  title: "Tools",
  kicker: "profilers and debuggers",
  lede:
    "I build tools that inspect running Python processes. They read the memory, the call stacks and the native frames of the process.",
};

const featuredFallback: FeaturedTool[] = [
  {
    id: "memray",
    name: "Memray",
    role: "Co-creator, with Matt Wozniski at Bloomberg",
    description:
      "A memory profiler for Python. It tracks every allocation in Python code, in native extension modules and in the interpreter.",
    command: "memray run my_script.py",
    repo: "bloomberg/memray",
    stars: 15241,
    language: "Python · C++",
    links: [
      { label: "Source", href: "https://github.com/bloomberg/memray" },
      { label: "Docs", href: "https://bloomberg.github.io/memray/" },
    ],
    visual: "flame",
  },
  {
    id: "tachyon",
    name: "Tachyon",
    alias: "profiling.sampling",
    role: "Co-author, PEP 799",
    description:
      "The sampling profiler in the Python 3.15 standard library. It reads the call stack from the memory of a running process.",
    command: "python -m profiling.sampling attach --live 12345",
    badge: "stdlib 3.15",
    language: "Python · C",
    links: [
      { label: "Docs", href: "https://docs.python.org/3.15/library/profiling.sampling.html" },
      { label: "PEP 799", href: "https://peps.python.org/pep-0799/" },
      { label: "Source", href: "https://github.com/python/cpython/tree/main/Lib/profiling/sampling" },
    ],
    visual: "sampling",
  },
  {
    id: "pystack",
    name: "PyStack",
    role: "Co-creator, with Matt Wozniski at Bloomberg",
    description:
      "Prints the stack of a running Python process or a core dump. It shows the Python frames and the native frames together.",
    command: "pystack remote 12345",
    repo: "bloomberg/pystack",
    stars: 1218,
    language: "C++ · Python",
    links: [
      { label: "Source", href: "https://github.com/bloomberg/pystack" },
      { label: "Docs", href: "https://bloomberg.github.io/pystack" },
    ],
    visual: "stack",
  },
  {
    id: "pytest-memray",
    name: "pytest-memray",
    role: "Maintainer",
    description:
      "A pytest plugin for Memray. It reports the allocations of each test and fails a test that goes over its memory limit.",
    command: "pytest --memray tests/",
    repo: "bloomberg/pytest-memray",
    stars: 424,
    language: "Python",
    links: [
      { label: "Source", href: "https://github.com/bloomberg/pytest-memray" },
      { label: "Docs", href: "https://pytest-memray.readthedocs.io/en/latest/" },
    ],
    visual: "budget",
  },
  {
    id: "pegen",
    name: "pegen",
    role: "Co-author, PEP 617",
    description:
      "The PEG parser generator that builds the CPython parser. This standalone version works with your own grammars.",
    command: "python -m pegen my_grammar.gram -o parser.py",
    repo: "we-like-parsers/pegen",
    stars: 202,
    language: "Python",
    links: [
      { label: "Source", href: "https://github.com/we-like-parsers/pegen" },
      { label: "Docs", href: "https://we-like-parsers.github.io/pegen/" },
    ],
    visual: "tree",
  },
];

const experimentsFallback: Experiment[] = [
  {
    name: "python-horror-show",
    href: "https://github.com/pablogsal/python-horror-show",
    repo: "pablogsal/python-horror-show",
    description: "Strange Python snippets, with an explanation of how each one works.",
    language: "Python",
    stars: 368,
  },
  {
    name: "slowlify",
    href: "https://github.com/pablogsal/slowlify",
    repo: "pablogsal/slowlify",
    description: "Makes a fast laptop behave like an overloaded CI runner, to reproduce failures that only happen in CI.",
    language: "Shell",
    stars: 25,
  },
  {
    name: "memory.python.org",
    href: "https://github.com/python/memory.python.org",
    repo: "python/memory.python.org",
    description: "Memory benchmarks for CPython, tracked across commits and build configurations.",
    language: "Python",
    stars: 19,
  },
  {
    name: "stackpulse",
    href: "https://github.com/pablogsal/stackpulse",
    repo: "pablogsal/stackpulse",
    description: "A Rust library for Linux profilers on perf_event. It resolves native, Python, JIT and kernel frames.",
    language: "Rust",
    stars: 6,
  },
  {
    name: "cpython-unwind",
    href: "https://github.com/pablogsal/cpython-unwind",
    repo: "pablogsal/cpython-unwind",
    description: "Unwinds the native stack with GNU backtrace, libunwind and libdw, so you can compare them.",
    language: "C",
    stars: 6,
  },
  {
    name: "gdb-emoji",
    href: "https://github.com/pablogsal/gdb-emoji",
    repo: "pablogsal/gdb-emoji",
    description: "Shows pointers as emoji in GDB, so you can tell them apart.",
    language: "Python",
    stars: 5,
  },
  {
    name: "ghost_unwind",
    href: "https://github.com/pablogsal/ghost_unwind",
    repo: "pablogsal/ghost_unwind",
    description: "Shadow-stack unwinding. It is a drop-in replacement for `unw_backtrace()`.",
    language: "C++",
    stars: 3,
  },
  {
    name: "gsym-rs",
    href: "https://github.com/pablogsal/gsym-rs",
    repo: "pablogsal/gsym-rs",
    description: "A Rust reader, writer and ELF/DWARF converter for the LLVM GSYM symbol format.",
    language: "Rust",
    stars: 2,
  },
  {
    name: "libunwinder",
    href: "https://github.com/pablogsal/libunwinder",
    repo: "pablogsal/libunwinder",
    description: "A native stack unwinder for profilers, built on a vendored libunwind.",
    language: "Rust",
    stars: 1,
  },
  {
    name: "symbol_renamer",
    href: "https://github.com/pablogsal/symbol_renamer",
    repo: "pablogsal/symbol_renamer",
    description: "Renames dynamic symbols in extension modules and their shared libraries to fix symbol clashes.",
    language: "Python",
    stars: 1,
  },
  {
    name: "hexforge",
    href: "https://github.com/pablogsal/hexforge",
    repo: "pablogsal/hexforge",
    description: "patchelf, rewritten as a compiler pass. It lifts the ELF file into a typed IR, then checks and changes it.",
    language: "Rust",
    stars: 0,
  },
  {
    name: "unrepair",
    href: "https://github.com/pablogsal/unrepair",
    repo: "pablogsal/unrepair",
    description: "Undoes part of `auditwheel repair`. It points an extension module back at the system library.",
    language: "Rust",
    stars: 0,
  },
  {
    name: "fenix",
    href: "https://github.com/pablogsal/fenix",
    repo: "pablogsal/fenix",
    description: "Writes a core dump for the debugger when a program stops on an uncaught exception. It has no cost until then.",
    language: "Python",
    stars: 0,
  },
  {
    name: "ShadowEngine",
    href: "https://github.com/pablogsal/ShadowEngine",
    repo: "pablogsal/ShadowEngine",
    description: "A CUDA raytracer for the Kerr spacetime. It shows how light moves around a spinning black hole.",
    language: "CUDA",
    stars: 0,
  },
];

export const featured: FeaturedTool[] = featuredFallback.map((t) =>
  t.repo ? { ...t, stars: liveStars(t.repo, t.stars ?? 0) } : t,
);

export const experiments: Experiment[] = experimentsFallback.map((e) => ({
  ...e,
  stars: liveStars(e.repo, e.stars),
}));

export const toolsProfile = {
  github: "https://github.com/pablogsal",
  handle: "pablogsal",
};

/** 15241 -> "15.2k", 424 -> "424" */
export function formatStars(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}
