// @ts-ignore-file
//
// Nuxt config - https://nuxt.com/docs/api/configuration/nuxt-config
//

import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  appConfig: {
    appId: "job-mpf"
  },
  telemetry: false,
  serverDir: "src/server",
  srcDir: "src/app/",
  dir: {
    "public": "src/public",
    "shared": "src/shared",
    "modules": "src/modules",
  },
  nitro: {
    preset: "deno_server",
    output: {
      dir: "dist"
    }
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],
  devtools: {
    enabled: false
  },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/': { prerender: true }
  },
  compatibilityDate: '2026-06-30',
  icon: {
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
