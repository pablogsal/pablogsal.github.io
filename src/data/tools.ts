/**
 * § III Instruments: the tools section.
 *
 * Star counts are a snapshot from the GitHub API (see `starsFetched`).
 * Every description here was checked against the project's README or docs.
 */

export type ToolVisual = "flame" | "stack" | "sampling" | "budget" | "tree";

export interface ToolLink {
  label: string;
  href: string;
}

export interface FeaturedTool {
  id: string;
  /** Plate numeral, printed as "Pl. I" */
  plate: string;
  name: string;
  /** Secondary name shown in mono under the title, e.g. the module path */
  alias?: string;
  /** Short mono margin note: my role on the project */
  role: string;
  tagline: string;
  description: string;
  /** Wrap code in `backticks` to render it in mono */
  features: string[];
  /** Shell commands, rendered with a `$` prompt each */
  commands: string[];
  stars?: number;
  /** Shown in place of stars when the tool has no repo of its own */
  badge?: string;
  language: string;
  links: ToolLink[];
  visual: ToolVisual;
  /** Figure caption, printed like an engraving plate caption */
  caption: string;
}

export interface Experiment {
  name: string;
  href: string;
  /** Wrap code in `backticks` to render it in mono */
  description: string;
  language: string;
  stars: number;
}

export const starsFetched = "2026-09-24";

export const toolsIntro = {
  num: "III",
  title: "Instruments",
  kicker: "$ ls ~/forbidden-magic",
  lede:
    "I build tools that look inside running Python processes: the memory they allocate, the stacks they run, and the native frames underneath. The README calls it forbidden magic. Mostly it is reading memory very carefully.",
};

export const featured: FeaturedTool[] = [
  {
    id: "memray",
    plate: "I",
    name: "Memray",
    role: "Co-creator & maintainer · with Matt Wozniski at Bloomberg",
    tagline: "A memory profiler for Python",
    description:
      "Tracks every allocation in Python code, in native extension modules and in the interpreter itself. When a process eats all the RAM, Memray tells you exactly who ordered it.",
    features: [
      "Traces every call instead of sampling, so the call stacks are exact",
      "Follows native C, C++ and Rust frames, so the whole stack shows up",
      "Flame graphs, tables, trees, a live TUI, and attaching to running processes",
    ],
    commands: [
      "memray run my_script.py",
      "memray flamegraph memray-my_script.py.2369.bin",
      "memray run --live my_script.py",
    ],
    stars: 15241,
    language: "Python · C++",
    links: [
      { label: "Source", href: "https://github.com/bloomberg/memray" },
      { label: "Docs", href: "https://bloomberg.github.io/memray/" },
    ],
    visual: "flame",
    caption: "Allocations by call stack. The widest path is where the memory went.",
  },
  {
    id: "tachyon",
    plate: "II",
    name: "Tachyon",
    alias: "profiling.sampling",
    role: "Co-author · with László Kiss Kollár · PEP 799",
    tagline: "The sampling profiler in Python 3.15's standard library",
    description:
      "A statistical profiler that reads the call stack straight out of a process's memory. Attach to a live server by PID, collect samples, and detach without the application ever knowing it was observed.",
    features: [
      "Wall-clock, CPU, GIL and exception modes, with async-aware stacks",
      "Flame graphs, differential flame graphs, line heatmaps, pstats and Firefox Profiler output",
      "A live TUI, plus a binary format you record now and replay later",
    ],
    commands: [
      "python -m profiling.sampling run --flamegraph -o profile.html script.py",
      "python -m profiling.sampling attach --live 12345",
    ],
    badge: "stdlib · 3.15",
    language: "Python · C",
    links: [
      { label: "Docs", href: "https://docs.python.org/3.15/library/profiling.sampling.html" },
      { label: "PEP 799", href: "https://peps.python.org/pep-0799/" },
      { label: "Source", href: "https://github.com/python/cpython/tree/main/Lib/profiling/sampling" },
    ],
    visual: "sampling",
    caption: "One stack read per tick. Enough ticks and the hot path draws itself.",
  },
  {
    id: "pystack",
    plate: "III",
    name: "PyStack",
    role: "Co-creator & maintainer · with Matt Wozniski at Bloomberg",
    tagline: "Like pstack, but for Python",
    description:
      "Prints the stack of a running Python process or a core dump, so you can see what it is doing, or what it was doing when it died, without decoding CPython internals by hand.",
    features: [
      "Live processes and core files, with Python and native frames interleaved",
      "Shows who holds the GIL, who is collecting garbage, and local variables",
      "Never writes to the target; reads core files about 10x faster than GDB",
    ],
    commands: ["pystack remote 12345", "pystack remote 12345 --native --locals", "pystack core ./core.12345"],
    stars: 1218,
    language: "C++ · Python",
    links: [
      { label: "Source", href: "https://github.com/bloomberg/pystack" },
      { label: "Docs", href: "https://bloomberg.github.io/pystack" },
    ],
    visual: "stack",
    caption: "Python and C frames, one stack, top to bottom.",
  },
  {
    id: "pytest-memray",
    plate: "IV",
    name: "pytest-memray",
    role: "Maintainer",
    tagline: "Memray, as a pytest plugin",
    description:
      "Add one flag and the test suite reports who allocated what. Give a test a memory budget and it fails when it goes over, or when it leaks.",
    features: [
      "`--memray` prints a per-test allocation report",
      "`@pytest.mark.limit_memory(\"24 MB\")` enforces a budget",
      "`@pytest.mark.limit_leaks(\"1 MB\")` catches leaks",
    ],
    commands: ["pytest --memray tests/", "pytest --memray --most-allocations=10 tests/"],
    stars: 424,
    language: "Python",
    links: [
      { label: "Source", href: "https://github.com/bloomberg/pytest-memray" },
      { label: "Docs", href: "https://pytest-memray.readthedocs.io/en/latest/" },
    ],
    visual: "budget",
    caption: "Three tests, one budget, one failure.",
  },
  {
    id: "pegen",
    plate: "V",
    name: "pegen",
    role: "Co-author · PEP 617",
    tagline: "The parser generator behind CPython",
    description:
      "CPython builds its own parser from a PEG grammar with pegen. This is the standalone version, so you can point it at grammars of your own.",
    features: [
      "PEG grammars in, Python parsers out",
      "Left-recursive rules and memoization",
      "Ships example grammars, including one for Python",
    ],
    commands: ["python -m pegen my_grammar.gram -o parser.py", "python parser.py input.txt"],
    stars: 202,
    language: "Python",
    links: [
      { label: "Source", href: "https://github.com/we-like-parsers/pegen" },
      { label: "Docs", href: "https://we-like-parsers.github.io/pegen/" },
    ],
    visual: "tree",
    caption: "expr: expr '+' term | term, and the tree it grows.",
  },
];

export const experiments: Experiment[] = [
  {
    name: "python-horror-show",
    href: "https://github.com/pablogsal/python-horror-show",
    description: "Strange Python snippets, explained. Meant to mess with your head; may teach you how Python works.",
    language: "Python",
    stars: 368,
  },
  {
    name: "memory.python.org",
    href: "https://github.com/python/memory.python.org",
    description: "Memory benchmarking for CPython development, tracked across commits and build configurations.",
    language: "Python",
    stars: 19,
  },
  {
    name: "slowlify",
    href: "https://github.com/pablogsal/slowlify",
    description: "Turns a fast laptop into an overloaded CI runner, to reproduce the failures that only happen there.",
    language: "Shell",
    stars: 25,
  },
  {
    name: "stackpulse",
    href: "https://github.com/pablogsal/stackpulse",
    description: "A Rust library for building Linux profilers on perf_event, resolving native, Python, JIT and kernel frames.",
    language: "Rust",
    stars: 6,
  },
  {
    name: "gsym-rs",
    href: "https://github.com/pablogsal/gsym-rs",
    description: "Pure-Rust reader, writer and ELF/DWARF converter for LLVM's GSYM symbolization format.",
    language: "Rust",
    stars: 2,
  },
  {
    name: "libunwinder",
    href: "https://github.com/pablogsal/libunwinder",
    description: "Answers \"who called me?\" for profilers, on top of a vendored libunwind.",
    language: "Rust",
    stars: 1,
  },
  {
    name: "ghost_unwind",
    href: "https://github.com/pablogsal/ghost_unwind",
    description: "GhostStack: shadow-stack unwinding as a drop-in replacement for `unw_backtrace()`.",
    language: "C++",
    stars: 3,
  },
  {
    name: "cpython-unwind",
    href: "https://github.com/pablogsal/cpython-unwind",
    description: "Unwinds the native stack three ways (GNU backtrace, libunwind, libdw) so you can compare them.",
    language: "C",
    stars: 6,
  },
  {
    name: "hexforge",
    href: "https://github.com/pablogsal/hexforge",
    description: "patchelf reimplemented as a compiler pass: lift the ELF into a typed IR, validate, transform, validate again.",
    language: "Rust",
    stars: 0,
  },
  {
    name: "unrepair",
    href: "https://github.com/pablogsal/unrepair",
    description: "For when `auditwheel repair` is a little too helpful. Points an extension back at the system library.",
    language: "Rust",
    stars: 0,
  },
  {
    name: "symbol_renamer",
    href: "https://github.com/pablogsal/symbol_renamer",
    description: "Renames dynamic symbols in extension modules and their shared libraries to settle symbol clashes.",
    language: "Python",
    stars: 1,
  },
  {
    name: "fenix",
    href: "https://github.com/pablogsal/fenix",
    description: "Writes debugger-friendly core dumps when your code dies of an uncaught exception. No overhead until then.",
    language: "Python",
    stars: 0,
  },
  {
    name: "gdb-emoji",
    href: "https://github.com/pablogsal/gdb-emoji",
    description: "Shows your pointers as emojis in GDB. 0x7ffd5e8c is hard to remember; a cat is not.",
    language: "Python",
    stars: 5,
  },
  {
    name: "ShadowEngine",
    href: "https://github.com/pablogsal/ShadowEngine",
    description: "A raytracer for the Kerr spacetime, in CUDA: what light does around a spinning black hole.",
    language: "CUDA",
    stars: 0,
  },
];

export const toolsProfile = {
  github: "https://github.com/pablogsal",
  handle: "pablogsal",
  bio: "I hate symbols but I love linkers.",
};

/** 15241 -> "15.2k", 424 -> "424" */
export function formatStars(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 100 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
}
