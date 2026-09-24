import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://pablogsal.com",
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
