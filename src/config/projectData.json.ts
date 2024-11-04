export interface ProjectItem {
  image: ImageMetadata; // an imported image
  title: string;
  description: string;
  href: URL;
}

// images
import Python from "@images/projects/python.png";
import Memray from "@images/projects/memray.png";
import Pystack from "@images/projects/pystack.png";

export const projectData: ProjectItem[] = [
  {
    image: Python,
    title: "Cpython",
    description: `The default implementation of the Python programming language.`,
    href: new URL("https://github.com/python/cpython"),
  },
  {
    image: Memray,
    title: "Memray",
    description: `Memray is a memory profiler for Python. It can track memory allocations
    in Python code, in native extension modules, and in the Python interpreter
    itself. 
    `,
    href: new URL("https://github.com/bloomberg/memray"),
  },
  {
    image: Pystack,
    title: "Pystack",
    description: `PyStack is a tool that uses forbidden magic to let you inspect
    the stack frames of a running Python process or a Python core dump, helping
    you quickly and easily learn what it's doing.
    `,
    href: new URL("https://github.com/bloomberg/pystack"),
  },
];

export default projectData;
