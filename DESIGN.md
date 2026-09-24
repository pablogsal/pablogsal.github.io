# pablogsal.com: design brief

> **UPDATE: the direction is now PIXEL ART and LESS BUSY. The section
> "Pixel art direction" at the end overrides older rules above where they
> conflict (fonts, grain, sigils, hairline density, figures).**

**Concept: a grimoire of the interpreter.**
Pablo Galindo Salgado is a CPython core developer, Steering Council
member (2021 to 2026), release manager, author of the PEG parser, f-string grammar, and
fine-grained tracebacks, co-creator of memray and pystack ("forbidden magic"),
co-host of core.py, and a former black-hole physicist. His portrait is a
black-and-white photo in an ornate gothic mask. His talk titles quote Dante
("¡Oh vosotros los que entráis, abandonad toda esperanza!"), Monty Python
("Nobody expects the Spanish inquisition"), and "The soul of the beast".

The site should feel like an occult printed book about interpreter internals.
Engraved, high-contrast, monochrome, with one ember-red accent used sparingly,
the way a rubricator uses red ink. Serious craft with a sense of humor.
Not a SaaS landing page, not a generic dev portfolio, not neon cyberpunk.

## Tokens (src/styles/global.css defines them, always use the vars)

| token           | value     | use |
|-----------------|-----------|-----|
| `--ink`         | `#0a0908` | page background |
| `--ink-2`       | `#121110` | raised surfaces / cards |
| `--ink-3`       | `#1b1a18` | hover surfaces |
| `--line`        | `#2a2825` | hairlines, borders (1px) |
| `--line-2`      | `#3a3733` | stronger borders |
| `--bone`        | `#ece6da` | primary text |
| `--ash`         | `#9a948a` | secondary text |
| `--dust`        | `#6b665e` | tertiary text, meta |
| `--ember`       | `#e0442e` | THE accent: carets, rubrics, active states |
| `--ember-dim`   | `#7a2a1f` | ember at low emphasis |
| `--gold`        | `#c9a86a` | very rare: Python-version tags, stars |

Fonts (loaded in the layout from Google Fonts):
- `--f-display`: "Grenze Gotisch" (blackletter). Big headlines and section
  titles ONLY. Never for body. Weights 400 to 900.
- `--f-serif`: "EB Garamond". Body copy, descriptions, italics for poetry.
- `--f-mono`: "JetBrains Mono". Code, labels, metadata, dates, nav, tracebacks.

Scale: `--step--1` … `--step-5` fluid clamp() sizes exist in global.css.
Spacing: `--space-1`…`--space-8`. Content max width: `--measure: 72rem`.

## Motifs (reuse these; they create the world)
1. **Rubrics**: section numbers are Roman numerals in ember mono, e.g. `§ III`.
2. **Tracebacks with carets**: PEP 657 style `^^^^^` underlines in ember
   under the key phrase. Use `.caret` (see global.css) on inline spans.
3. **Hairline engraving**: 1px `--line` borders, no rounded corners
   (radius 0 or 2px max), no drop shadows, no gradients except in hero art.
4. **Sigils**: thin-stroke SVG circles with text on a path (circular text of
   Python keywords or dates), slowly rotating (respect reduced motion).
5. **Marginalia**: small mono uppercase labels (`.label`) in `--dust`,
   letter-spacing .12em, like printed marginal notes.
6. **REPL lines**: `>>>` prompts in ember as a voice device.
7. **Grain**: a subtle noise overlay on the whole page (in layout).

## Rules
- Dark only. Body background `--ink`, text `--bone`.
- Links: bone with a 1px underline in `--line-2`, turns ember on hover.
- Focus rings visible: 1px ember outline + 2px offset.
- Motion: slow and subtle; everything honors `prefers-reduced-motion`.
- Mobile first: must look intentional at 360px wide, 16px gutters, no
  horizontal scroll.
- Images: YouTube thumbnails from `https://i.ytimg.com/vi/<id>/hqdefault.jpg`
  shown grayscale (`filter: grayscale(1) contrast(1.1)`), revealing color on hover.
- Voice: see "Writing rules" below. They are mandatory for all copy.

## Architecture
Astro 5, zero UI frameworks, hand-written CSS (component `<style>` blocks,
scoped). Content lives in typed data files under `src/data/*.ts` so Pablo can
edit without touching markup. Sections are components in `src/components/`.
Client JS: small inline `<script>` tags per component, vanilla TS.

## Writing rules (ASD-STE100 Simplified Technical English, adapted)

All visible text follows these rules.

NO FORCED JOKES. Pablo dislikes cute filler: quirky captions ("The author,
dressed for a release day"), winks, puns, "fun facts", clever section
subtitles. Do not write any. Captions and labels state plain facts or are
removed. Humor is allowed only when it is Pablo's own words (for example his
GitHub bio line) or a real fact.

1. Sentences are short: 20 words or fewer. Descriptions can go to 25.
2. One idea per sentence. Paragraphs have 4 sentences or fewer.
3. Use the active voice. "I wrote the PEG parser", not "The PEG parser was written".
4. Use simple verb tenses: present, simple past, simple future.
5. Use simple, common words. "use" not "utilize", "wrote" not "authored",
   "help" not "facilitate", "is" not "serves as" / "stands as".
6. Use the same word for the same thing every time (e.g. always "Memray",
   never "the profiler" in one place and "the tool" in another for the same thing).
7. Keep articles ("a", "the"). Do not write in telegraph style.
8. State facts. Give numbers, versions, dates, names. No adjectives that only praise.
9. First person, plain, dry. Humor comes from specific facts, not from hype.

Do NOT use these AI-writing patterns:
- Puffery words: pivotal, crucial, vital, key (adjective), robust, seamless,
  groundbreaking, renowned, vibrant, rich, profound, powerful, cutting-edge,
  innovative, comprehensive, meticulous, intricate, tapestry, landscape,
  testament, delve, dive into, deep dive, journey, realm, leverage, empower,
  unlock, elevate, showcase, highlight (verb), underscore, foster, enhance,
  boast, garner, bolster, navigate (figurative), craft (verb for software).
- "Serves as", "stands as", "marks", "represents", "features", "offers" when "is"/"has" works.
- Negative parallelisms: "not just X, but Y", "not X, it is Y", "no X, no Y, just Z".
- Rule-of-three lists used for rhythm ("fast, simple, and elegant").
- Trailing "-ing" analysis clauses (", making it...", ", ensuring...", ", highlighting...").
- Claims about importance, legacy, impact, or "the community".
- Em dashes. Use a period, a comma, a colon or parentheses.
- Exclamation marks, emoji, rhetorical questions in prose.
- Title Case In Headings (use sentence case, except proper names).

## Pixel art direction (overrides older rules)

Same world (dark, ink/bone/ember, black hole, interpreter internals), now
drawn as pixel art, like 1-bit dithered engravings (Return of the Obra Dinn,
Playdate). Calm and sparse.

Type:
- `--f-display`: "Jacquard 24", a pixel blackletter. Big titles only.
- `--f-pixel`: "Silkscreen". Labels, tags, nav, buttons, small caps. Uppercase, small.
- `--f-body`: "JetBrains Mono". All body text. (`--f-serif` is an alias for it.)

Pixel rules:
- Square corners. Borders are 2px solid (`--line-2` or `--bone`), no 1px hairlines
  for boxes. Rules between list rows can stay 1px `--line`.
- Shadows: only a hard offset (`4px 4px 0 var(--ink-3)` or ember), never blur.
- Images: pixelated. Downscale, then upscale with `image-rendering: pixelated`.
  Grayscale or 1-bit dithered. The portrait is a pre-dithered 1-bit PNG.
- Illustrations: small pixel sprites (inline SVG with `shape-rendering="crispEdges"`
  on an integer grid, or CSS grids of squares). Few colors: ink, grey, bone, ember.
- Dithered fills (`.dither` utility in global.css) instead of gradients.
- Motion: stepped, not smooth. For example `steps()` easing and blink cursors. Keep it rare.

Less busy:
- At most ONE decorative element per section.
- No rotating sigils, no text on paths, no grain overlay, no sky grids.
- Each section: title, one short lede, one main block, and optionally one
  secondary list. Collapse long lists behind "show all" (8 to 12 rows visible).
- At most 3 text styles per section. More empty space between blocks.
