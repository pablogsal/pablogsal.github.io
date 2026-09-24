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

export const finalError = {
  type: "CuriosityError",
  msg: "fell into the interpreter and never came back",
  hint: "pablogsal",
};

export const bio: string[] = [
  "Most days I work on the Python interpreter, on the parts you only notice when something goes wrong: the parser, the error messages, the tracebacks, and the machinery that lets debuggers and profilers look inside a running process.",
  "I came to software from theoretical physics. My PhD was on general relativity and black holes, and I picked up Python to glue together C simulation code. Eventually the glue became more interesting than the simulation.",
  "I have been a CPython core developer since 2018, have served on the Python Steering Council every term since 2021, and was the release manager for Python 3.10 and 3.11. I spent years on Bloomberg's Python Infrastructure team, where Memray and PyStack were born. These days I am on the Python team at Hudson River Trading, in London.",
  "I hate symbols but I love linkers. <em>My cat, BMO, does not code.</em>",
];

export const facts: { k: string; v: string }[] = [
  { k: "Core developer", v: "since 2018" },
  { k: "Steering Council", v: "2021 to 2026" },
  { k: "Release manager", v: "3.10 and 3.11" },
  { k: "PSF Fellow", v: "since 2019" },
  { k: "Works at", v: "Hudson River Trading" },
  { k: "Based in", v: "London" },
];
