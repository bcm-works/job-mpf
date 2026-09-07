//
// Nuxt config - https://nuxt.com/docs/api/configuration/nuxt-config
//

import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],
  devtools: {
    enabled: false
  },
  css: ['~/assets/css/main.css'],
  appConfig: {
    appId: 'job-mpf'
  },
  dir: {
    public: 'src/public',
    shared: 'src/shared',
    modules: 'src/modules'
  },
  srcDir: 'src/app/',
  serverDir: 'src/server',
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  },
  routeRules: {
    '/': { prerender: true }
  },
  compatibilityDate: '2026-06-30',
  nitro: {
    preset: 'deno_server',
    output: {
      dir: 'dist'
    }
  },
  telemetry: false,
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
