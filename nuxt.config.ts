// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  app: {
    head: {
      title: "Gustavo C Lacerda",
      charset: "UTF-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "pt-br",
      },
    },
  },
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxt/image",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
  ],
  css: ["primeicons/primeicons.css", "~/assets/css/tailwind.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      "tailwindcss/nesting": "postcss-nesting",
      "postcss-import": {},
    },
  },
  plugins: ["~/plugins/tippy.ts"],
  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
  },
  shadcn: {
    componentDir: "components/shadcn/",
  },
});
