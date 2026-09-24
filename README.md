# pablogsal.com

The source of [pablogsal.com](https://pablogsal.com). It is an Astro 5 site.
GitHub Pages hosts it.

```sh
npm install
npm run dev      # local server
npm run build    # static site in dist/
```

## Data that updates itself

The build never uses the network. It reads JSON snapshots from
`src/data/generated/`. Git tracks these files.

| File           | Contents                                              | Source                          |
|----------------|-------------------------------------------------------|---------------------------------|
| `github.json`  | Stars, forks and metadata for repos, and profile data | GitHub API                      |
| `cpython.json` | Merged PRs (total and per year), commits, rank        | GitHub search and contributors  |
| `peps.json`    | The PEPs I wrote or co-wrote                          | peps.python.org/api/peps.json   |
| `corepy.json`  | core.py episodes, with YouTube links                  | Podcast RSS and YouTube feed    |

To update the snapshots on your computer:

```sh
GITHUB_TOKEN=$(gh auth token) npm run refresh    # all sources
node scripts/refresh/index.mjs corepy            # one source
```

The token is optional. Without it, the GitHub API limits are lower.
When a source fails, the script keeps the old file and shows a warning.
The `fetchedAt` field changes only when the data changes.

The scripts are in `scripts/refresh/`. They use only Node 22 built-ins.
The file `scripts/refresh/corepy-youtube.json` pins YouTube links for older
core.py episodes. The YouTube feed only lists the 15 most recent uploads.

## Workflows

- `refresh.yml` runs every day. It updates the snapshots. If they changed,
  it commits them and starts `deploy.yml`.
- `discover.yml` runs every Monday. It searches Apple Podcasts and YouTube
  for talks and episodes that the site does not list. It puts the results
  in one open issue, "New talk/podcast candidates". To remove an item, add
  it to `src/data/talks.ts` or `src/data/podcasts.ts`. If the item is not
  about me, add its URL to `scripts/refresh/discover-ignore.json`.
- `deploy.yml` builds and deploys the site on every push to `main`.

The YouTube search needs a `YOUTUBE_API_KEY` repository secret (a YouTube
Data API v3 key). Without it, the workflow searches only Apple Podcasts.
To run the search on your computer: `node scripts/refresh/discover.mjs`.
