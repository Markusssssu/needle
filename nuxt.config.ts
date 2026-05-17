import { ruRU } from "@clerk/localizations";
import { dark, neobrutalism } from "@clerk/ui/themes";

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

  runtimeConfig: {
    talkjsSecretKey: process.env.TALKJS_SECRET_KEY,

    clerk: {
      secretKey: process.env.NUXT_CLERK_SECRET_KEY || "",
    },
    public: {
      talkjsAppId: process.env.NUXT_PUBLIC_TALKJS_APP_ID,
      clerk: {
        publishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
      },
    },
  },

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
      theme: [dark],
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
