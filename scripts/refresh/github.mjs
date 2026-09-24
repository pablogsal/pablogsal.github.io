// github.json: stars and metadata for the repos the site mentions, plus the
// GitHub profile numbers.

import { github, githubPages, log, warn, SourceError } from "./lib.mjs";

export const file = "github.json";

const USER = "pablogsal";

/** Repos outside github.com/pablogsal that the site talks about. */
const EXTRA_REPOS = [
  "bloomberg/memray",
  "bloomberg/pystack",
  "bloomberg/pytest-memray",
  "we-like-parsers/pegen",
  "python/memory.python.org",
];

function pick(r) {
  return {
    stars: r.stargazers_count,
    forks: r.forks_count,
    description: r.description || null,
    language: r.language || null,
    pushedAt: r.pushed_at,
    htmlUrl: r.html_url,
    homepage: r.homepage || null,
  };
}

export async function refresh(previous) {
  const { data: user } = await github(`/users/${USER}`);
  const profile = {
    login: user.login,
    followers: user.followers,
    publicRepos: user.public_repos,
    bio: user.bio || null,
    htmlUrl: user.html_url,
  };

  const repos = {};
  for await (const r of githubPages(`/users/${USER}/repos?type=owner&per_page=100`)) {
    if (r.fork || r.archived) continue;
    repos[r.full_name] = pick(r);
  }

  for (const name of EXTRA_REPOS) {
    try {
      const { data } = await github(`/repos/${name}`);
      repos[name] = pick(data);
    } catch (err) {
      if (!(err instanceof SourceError)) throw err;
      const old = previous?.repos?.[name];
      if (!old) throw err;
      warn("github", `${name}: ${err.message}; keeping previous entry`);
      repos[name] = old;
    }
  }

  log("github", `${Object.keys(repos).length} repos, ${profile.followers} followers`);
  return { profile, repos };
}

export function validate(data) {
  const memray = data.repos["bloomberg/memray"];
  if (!memray || !(memray.stars > 10_000)) return "bloomberg/memray stars missing or implausibly low";
  if (Object.keys(data.repos).length < 10) return "fewer than 10 repos";
  if (!(data.profile.followers > 100)) return "implausible follower count";
  return null;
}
