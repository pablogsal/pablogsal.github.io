/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // use any standard tailwind colors from here https://tailwindcss.com/docs/customizing-colors
        // or generate with https://uicolors.app/create
        primary: 
        {
        '50': '#fff2ff',
        '100': '#fde3ff',
        '200': '#fbc6ff',
        '300': '#fc99ff',
        '400': '#fc5dff',
        '500': '#f221ff',
        '600': '#e100ff',
        '700': '#bb00cf',
        '800': '#9b00a9',
        '900': '#810689',
        '950': '#57005e',
        },
        base: colors.neutral,
        info: colors.sky["500"],
        "info-content": colors.sky["950"],
        success: "#52e840",
        "success-content": "#043102",
        warning: colors.yellow["500"],
        "warning-content": colors.yellow["950"],
        error: colors.red["500"],
        "error-content": colors.red["950"],
      },
    },
    fontFamily: {
      sans: [
        "BlinkMacSystemFont",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica",
        "Arial",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
      ],
      serif: [
        "Iowan Old Style",
        "Apple Garamond",
        "Baskerville",
        "Times New Roman",
        "Droid Serif",
        "Times",
        "Source Serif Pro",
        "serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
      ],
      mono: [
        "JetBrains Mono",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
