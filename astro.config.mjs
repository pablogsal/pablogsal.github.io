import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import compress from "astro-compress";
import AutoImport from "astro-auto-import";
import icon from "astro-icon"; // https://www.astroicon.dev/guides/upgrade/v1/

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const expressiveCodeOptions = {
  // You can set configuration options here\
  themes: ["slack-dark"],
  styleOverrides: {
    // You can also override styles https://expressive-code.com/reference/style-overrides/
    borderRadius: "0",
    borderColor: "#525252", // neutral-600
    codeBackground: "#171717", // neutral-900
    scrollbarThumbColor: "#525252", // neutral-600
    // scrollbarThumbHoverColor: "#20C20E",
    focusBorder: "#20C20E",
    codeFontFamily:
      "JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    frames: {
      editorActiveTabIndicatorBottomColor: "#20C20E",
      editorActiveTabBackground: "#262626", // neutral-800
      editorBackground: "#262626", // neutral-800
      editorTabBarBackground: "#171717", // neutral-900
      frameBoxShadowCssValue: "0",
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://pablogsal.com",
  trailingSlash: "always",
  integrations: [
    // example auto import component into blog post mdx files
    AutoImport({
      imports: [
        // https://github.com/delucis/astro-auto-import
        "@components/Admonition/Admonition.astro",
        "@components/Cta/NewsletterCta.astro",
      ],
    }),
    icon({
      // I include only the icons I use. This is because if you use SSR, ALL icons will be included (no bueno)
      // https://www.astroicon.dev/reference/configuration#include
      tdesign: [
        "chevron-left-double-s",
        "chevron-right-double-s",
        "chevron-down",
        "close",
        "play",
        "plus",
        "lightbulb-circle",
        "lightbulb",
        "error-triangle",
        "close-circle",
        "info-circle",
        "mail",
        "filter",
        "download",
        "work-history",
        "share",
      ],
    }),
    expressiveCode(expressiveCodeOptions),
    mdx(),
    tailwind(),
    sitemap(),
    compress(),
  ],
});
