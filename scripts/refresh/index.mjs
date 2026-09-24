#!/usr/bin/env node
// Refresh the committed data snapshots in src/data/generated/.
//
//   node scripts/refresh/index.mjs            # all sources
//   node scripts/refresh/index.mjs corepy     # only some sources
//
// A source that fails (network, rate limit, bad payload, failed validation)
// keeps its previous snapshot and logs a warning. The exit code is non-zero
// only for bugs (errors that are not SourceError).

import * as githubSource from "./github.mjs";
import * as cpythonSource from "./cpython.mjs";
import * as pepsSource from "./peps.mjs";
import * as corepySource from "./corepy.mjs";
import { readSnapshot, writeSnapshot, log, warn, SourceError, GITHUB_TOKEN } from "./lib.mjs";

const SOURCES = {
  github: githubSource,
  cpython: cpythonSource,
  peps: pepsSource,
  corepy: corepySource,
};

const wanted = process.argv.slice(2);
for (const name of wanted) {
  if (!SOURCES[name]) {
    console.error(`unknown source "${name}"; choose from: ${Object.keys(SOURCES).join(", ")}`);
    process.exit(2);
  }
}

if (!GITHUB_TOKEN) log("refresh", "GITHUB_TOKEN is not set; using unauthenticated GitHub API limits");

let bugs = 0;
const summary = [];
for (const [name, source] of Object.entries(SOURCES)) {
  if (wanted.length && !wanted.includes(name)) continue;
  const previous = await readSnapshot(source.file);
  try {
    const data = await source.refresh(previous);
    const problem = source.validate?.(data);
    if (problem) throw new SourceError(`validation failed: ${problem}`);
    const changed = await writeSnapshot(source.file, data, previous);
    summary.push(`${source.file}: ${changed ? "updated" : "unchanged"}`);
  } catch (err) {
    if (err instanceof SourceError) {
      warn(name, `${err.message}; keeping the previous ${source.file}`);
      summary.push(`${source.file}: FAILED, kept previous (${err.message})`);
    } else {
      bugs++;
      console.error(`[${name}] bug:`, err);
      summary.push(`${source.file}: BUG (${err.message})`);
    }
  }
}

console.log("\n" + summary.join("\n"));
process.exitCode = bugs ? 1 : 0;
