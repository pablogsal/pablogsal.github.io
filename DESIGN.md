# pablogsal.com: design brief

**Concept: a grimoire of the interpreter.**
Pablo Galindo Salgado is a CPython core developer, former Steering Council
member, release manager, author of the PEG parser, f-string grammar, and
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
- Voice: first person, confident, dry humor, brief. No marketing fluff,
  no exclamation-mark hype. Accuracy over flourish: only claim verified facts.
- No em dashes in copy.

## Architecture
Astro 5, zero UI frameworks, hand-written CSS (component `<style>` blocks,
scoped). Content lives in typed data files under `src/data/*.ts` so Pablo can
edit without touching markup. Sections are components in `src/components/`.
Client JS: small inline `<script>` tags per component, vanilla TS.
