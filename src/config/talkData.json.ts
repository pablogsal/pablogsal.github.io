export interface TalkItem {
  title: string;
  conference: string;
  date: Date;
  youtubeId: string;
  href: URL;
}

export const talkData: TalkItem[] = [
  {
    conference: "PyConES",
    title: "Profiling a la velocidad de la luz",
    date: new Date("2023-10-02"),
    youtubeId: "YJWQ0hHfajs",
    href: new URL("https://www.youtube.com/watch?v=YJWQ0hHfajs"),
  },
  {
    conference: "EuroPython",
    title: "f\"yeah!\" - How we are supercharging f-strings in Python 3.12",
    date: new Date("2023-07-19"),
    youtubeId: "JAG9oIFklA8",
    href: new URL("https://www.youtube.com/watch?v=JAG9oIFklA8"),
  },
  {
    conference: "EuroPython",
    title: "Core Developer Panel",
    date: new Date("2023-07-19"),
    youtubeId: "CSJv_nfVBZk",
    href: new URL("https://www.youtube.com/watch?v=CSJv_nfVBZk"),
  },
  {
    conference: "PyCon US",
    title: "Steering Council Keynote",
    date: new Date("2023-04-21"),
    youtubeId: "fYXAbfHZmRg",
    href: new URL("https://www.youtube.com/watch?v=fYXAbfHZmRg"),
  },
  {
    conference: "PyCon US",
    title: "How memory profilers work",
    date: new Date("2023-04-21"),
    youtubeId: "mqu66lg79X8",
    href: new URL("https://www.youtube.com/watch?v=mqu66lg79X8"),
  },
  {
    conference: "PyConES",
    title: "Faster CPython project",
    date: new Date("2022-10-02"),
    youtubeId: "94jLt3CX5Dc",
    href: new URL("https://www.youtube.com/watch?v=94jLt3CX5Dc"),
  },
  {
    conference: "EuroPython",
    title: "Core Developer Panel",
    date: new Date("2022-07-13"),
    youtubeId: "0m2Cy5X6lcE",
    href: new URL("https://www.youtube.com/watch?v=0m2Cy5X6lcE"),
  },
  {
    conference: "EuroPython",
    title: "Making Python better one error message at a time",
    date: new Date("2022-07-13"),
    youtubeId: "aFfyQGa6Me8",
    href: new URL("https://www.youtube.com/watch?v=aFfyQGa6Me8"),
  },
  {
    conference: "PyCon US",
    title: "Making Python better one error message at a time",
    date: new Date("2022-04-30"),
    youtubeId: "5eYOQxqqWl8",
    href: new URL("https://www.youtube.com/watch?v=5eYOQxqqWl8"),
  },
  {
    conference: "PyCon US",
    title: "Steering Council Keynote",
    date: new Date("2022-04-30"),
    youtubeId: "m2R5shF1pLc",
    href: new URL("https://www.youtube.com/watch?v=m2R5shF1pLc"),
  },
  {
    conference: "EuroPython",
    title: "Nobody expects the Spanish inquisition",
    date: new Date("2021-07-28"),
    youtubeId: "DLn9J93--BY",
    href: new URL("https://www.youtube.com/watch?v=DLn9J93--BY"),
  },
  {
    conference: "PyCon US",
    title: "Steering Council Keynote",
    date: new Date("2021-05-15"),
    youtubeId: "xEkuOtCQ6vA",
    href: new URL("https://www.youtube.com/watch?v=xEkuOtCQ6vA"),
  },
  {
    conference: "PyConES",
    title: "Metaclases: exactamente qué y (sobre todo) por qué",
    date: new Date("2019-10-06"),
    youtubeId: "n2Ma5lT99pM",
    href: new URL("https://www.youtube.com/watch?v=n2Ma5lT99pM"),
  },
  {
    conference: "PyConES",
    title: "Keynote",
    date: new Date("2019-10-06"),
    youtubeId: "qcvZOaY1emk",
    href: new URL("https://www.youtube.com/watch?v=qcvZOaY1emk"),
  },
  {
    conference: "EuroPython",
    title: "The soul of the beast",
    date: new Date("2019-07-12"),
    youtubeId: "1_23AVsiQEc",
    href: new URL("https://www.youtube.com/watch?v=1_23AVsiQEc"),
  },
  {
    conference: "PyLondinium",
    title: "The soul of the beast",
    date: new Date("2019-06-15"),
    youtubeId: "avLK67SHeAs",
    href: new URL("https://www.youtube.com/watch?v=avLK67SHeAs"),
  },
  {
    conference: "PyCon US",
    title: "Time to take out the rubbish: garbage collector",
    date: new Date("2019-05-04"),
    youtubeId: "CLW5Lyc1FN8",
    href: new URL("https://www.youtube.com/watch?v=CLW5Lyc1FN8"),
  },
  {
    conference: "PyConES",
    title: "Hora de sacar la basura: garbage collector",
    date: new Date("2018-10-07"),
    youtubeId: "7wZpMCvlPU0",
    href: new URL("https://www.youtube.com/watch?v=7wZpMCvlPU0"),
  },
  {
    conference: "PyConES",
    title: "¡Oh vosotros los que entráis, abandonad toda esperanza!",
    date: new Date("2018-10-06"),
    youtubeId: "vOGacccUsog",
    href: new URL("https://www.youtube.com/watch?v=vOGacccUsog"),
  },
  {
    conference: "PyConES",
    title: "Los closures que emocionaron a Spielberg",
    date: new Date("2016-10-09"),
    youtubeId: "rrL3CQNOFRc",
    href: new URL("https://www.youtube.com/watch?v=rrL3CQNOFRc"),
  },
  {
    conference: "PyConES",
    title: "Agujeros negros y optimización de código en python",
    date: new Date("2015-10-07"),
    youtubeId: "XUNU63tZNQI",
    href: new URL("https://www.youtube.com/watch?v=XUNU63tZNQI"),
  },
] as const;

export default talkData;
