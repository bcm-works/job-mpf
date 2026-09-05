import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  dir: {
    "app": "src/app",
    "assets": "src/app/assets",
    "layouts": "src/app/layouts",
    "middleware": "src/app/middleware",
    "pages": "src/app/pages",
    "plugins": "src/app/plugins",
    "public": "src/public",
    "shared": "src/shared",
  },

  serverDir: "src/server",

  nitro: {
    preset: "deno_server",
    // @ts-ignore
    output: {
      dir: "dist"
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  // @ts-ignore
  css: ['~/src/app/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  icon: {
    // Only bundle the icons the app actually uses rather than loading the full
    // @iconify-json/simple-icons collection (4.8 MB, 3500+ icons) at build time.
    customCollections: [
      {
        prefix: 'simple-icons',
        dir: fileURLToPath(new URL('./app/assets/icons/simple-icons', import.meta.url))
      }
    ]
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
