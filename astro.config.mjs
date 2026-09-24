import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pablogsal.com",
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  // One page, ~8 KB of gzipped CSS: inlining it removes the only
  // render-blocking request. GitHub Pages caches every file for 10 minutes
  // anyway, so a separate stylesheet would not gain much from caching.
  build: { inlineStylesheets: "always" },
  compressHTML: true,
});
