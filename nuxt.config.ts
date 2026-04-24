import { ruRU } from "@clerk/localizations";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@clerk/nuxt",
    "nuxt-qrcode",
    "@nuxtjs/mcp-toolkit",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
  ],

  ui: {
    safelistColors: [
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
    ],
  },

  pinia: {
    storesDirs: ["./stores/**", "./custom-folder/stores/**"],
  },

  clerk: {
    appearance: {
      baseTheme: undefined,
      layout: {
        socialButtonsVariant: "iconButton",
      },
    },

    localization: ruRU,
  },

  mcp: {
    name: "Needle Агент",
    prefix: "/_mcp",
  },

  devtools: {
    enabled: true,
  },

  components: [
    {
      path: "~/components/home",
      pathPrefix: false,
    },
    {
      path: "~/components/scanner",
      pathPrefix: false,
    },
    {
      path: "~/components/settings",
      pathPrefix: false,
    },
    {
      path: "~/components/inbox",
      pathPrefix: false,
    },
    {
      path: "~/components/appearance",
      pathPrefix: false,
    },
    {
      path: "~/components/chat",
      pathPrefix: false,
    },

    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/api/**": {
      cors: true,
    },
  },

  nitro: {
    experimental: {
      tasks: true,
    },
  },

  compatibilityDate: "2024-07-11",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
