export interface Frame {
  file: string;
  line: number;
  fn: string;
  /** source line, split around the highlighted expression */
  pre: string;
  hl: string;
  post: string;
}

// Each frame is a real event; the "line" is the year it happened.
export const traceback: Frame[] = [
  {
    // Galindo & Mars, Class. Quantum Grav. 31 (2014) 245008
    file: "~/granada/phd/geodesics.py",
    line: 2014,
    fn: "regularize",
    pre: "orbit = ",
    hl: "mcgehee(spherically_symmetric_spacetime)",
    post: "",
  },
  {
    // python/cpython#3229, my first merged PR
    file: "~/cpython/Doc/howto/logging-cookbook.rst",
    line: 2017,
    fn: "first_pr",
    pre: "fix(",
    hl: "ZeroMQSocketHandler",
    post: ")  # bpo-31294",
  },
  {
    file: "~/cpython/Parser/parser.c",
    line: 2020,
    fn: "replace_the_parser",
    pre: "parser = ",
    hl: "PEG(grammar)",
    post: "  # PEP 617",
  },
  {
    file: "~/cpython/Python/pythonrun.c",
    line: 2021,
    fn: "print_exception",
    pre: "print(",
    hl: "'Did you mean: ...?'",
    post: ")",
  },
  {
    file: "~/cpython/Python/sysmodule.c",
    line: 2025,
    fn: "sys_remote_exec",
    pre: "sys.remote_exec(",
    hl: "pid",
    post: ", script)  # PEP 768",
  },
];

export const bio: string[] = [
  "Most days I work on the Python interpreter. I work on the parts you see when something goes wrong: the parser, the error messages and the tracebacks. I also work on the code that lets debuggers and profilers look inside a running process.",
  "I came to software from theoretical physics. My PhD was on general relativity and black holes. I learned Python to glue together C simulation code. Later, Python itself became more interesting to me than the simulations.",
  "I have been a CPython core developer since 2018. I have been on the Python Steering Council every term since 2021. I was the release manager for Python 3.10 and 3.11.",
  "I work on the Python team at Hudson River Trading, in London.",
];

export const facts: { k: string; v: string }[] = [
  { k: "Core developer", v: "since 2018" },
  { k: "Steering Council", v: "2021 to 2026" },
  { k: "Release manager", v: "3.10 and 3.11" },
  { k: "PSF Fellow", v: "since 2019" },
  { k: "Works at", v: "Hudson River Trading" },
  { k: "Based in", v: "London" },
];
