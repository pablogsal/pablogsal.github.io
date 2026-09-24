// peps.json: every PEP Pablo authored or co-authored, from the PEP index API.

import { fetchJson, log, SourceError } from "./lib.mjs";

export const file = "peps.json";

const API = "https://peps.python.org/api/peps.json";
// "Pablo Galindo Salgado" (and plain "Pablo Galindo"), but not other Pablos.
const IS_PABLO = /^Pablo Galindo( Salgado)?$/;

const MONTHS = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

/** "13-Jun-2000" → "2000-06-13" (left as-is if it does not parse). */
function isoDate(s) {
  const m = /^(\d{1,2})-([A-Z][a-z]{2})-(\d{4})$/.exec(s?.trim() ?? "");
  if (!m || !MONTHS[m[2]]) return s ?? null;
  return `${m[3]}-${String(MONTHS[m[2]]).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

export async function refresh() {
  const all = await fetchJson(API);
  if (!all || typeof all !== "object") throw new SourceError("unexpected PEP index payload");

  const peps = Object.values(all)
    .filter((p) => {
      const names = p.author_names ?? String(p.authors ?? "").split(/,\s*/);
      return names.some((n) => IS_PABLO.test(n.trim()));
    })
    .map((p) => ({
      number: p.number,
      title: p.title,
      status: p.status,
      type: p.type,
      python_version: p.python_version || null,
      created: isoDate(p.created),
      authors: p.author_names ?? String(p.authors).split(/,\s*/),
      url: p.url,
    }))
    .sort((a, b) => a.number - b.number);

  log("peps", `${peps.length} PEPs: ${peps.map((p) => p.number).join(", ")}`);
  return { peps };
}

export function validate(data) {
  if (data.peps.length < 10) return "fewer than 10 PEPs";
  if (!data.peps.some((p) => p.number === 617)) return "PEP 617 missing";
  return null;
}
