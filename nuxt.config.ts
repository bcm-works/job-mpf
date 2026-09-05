import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  // @ts-ignore
  css: ['~/assets/css/main.css'],

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
