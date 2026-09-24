// cpython.json: merged PRs (total and by year opened), commits and rank among
// python/cpython contributors, and the first merged PR.

import { github, nextLink, githubSearchCount, log, SourceError } from "./lib.mjs";

export const file = "cpython.json";

const USER = "pablogsal";
const REPO = "python/cpython";
const FIRST_YEAR = 2017;

export async function refresh() {
  const base = `repo:${REPO} author:${USER} is:pr is:merged`;

  // Total, and the oldest one (search sorted by created asc).
  const total = await githubSearchCount(base);
  const first = total.items?.[0];
  if (!first) throw new SourceError("search returned no merged PRs");

  // Per-year counts by creation date: one search per year.
  const thisYear = new Date().getUTCFullYear();
  const mergedPRsByYear = [];
  for (let y = FIRST_YEAR; y <= thisYear; y++) {
    const r = await githubSearchCount(`${base} created:${y}-01-01..${y}-12-31`);
    mergedPRsByYear.push({ year: String(y), count: r.total_count });
  }

  // Contributors are sorted by contributions; walk pages until we find him.
  let url = `/repos/${REPO}/contributors?per_page=100&anon=0`;
  let rank = 0;
  let commits = null;
  while (url && commits === null) {
    const { data, res } = await github(url);
    if (!Array.isArray(data)) throw new SourceError("contributors: expected an array");
    for (const c of data) {
      rank++;
      if (c.login?.toLowerCase() === USER) {
        commits = c.contributions;
        break;
      }
    }
    url = nextLink(res);
  }
  if (commits === null) throw new SourceError(`${USER} not found among ${REPO} contributors`);

  const out = {
    mergedPRs: total.total_count,
    mergedPRsByYear,
    commits,
    contributorRank: rank,
    firstMergedPR: {
      number: first.number,
      title: first.title,
      url: first.html_url,
      createdAt: first.created_at,
      mergedAt: first.pull_request?.merged_at ?? null,
    },
  };
  log("cpython", `${out.mergedPRs} merged PRs, ${commits} commits, rank #${rank}`);
  return out;
}

export function validate(data) {
  if (!(data.mergedPRs > 1000)) return "merged PR count implausibly low";
  if (!(data.commits > 900)) return "commit count implausibly low";
  if (!(data.contributorRank >= 1 && data.contributorRank <= 100)) return "implausible contributor rank";
  const sum = data.mergedPRsByYear.reduce((a, b) => a + b.count, 0);
  if (Math.abs(sum - data.mergedPRs) > 5) return `per-year counts sum to ${sum}, total is ${data.mergedPRs}`;
  return null;
}
