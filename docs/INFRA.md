# Infrastructure

This project uses [Deno Deploy](https://deno.com/deploy) for deployment and hosting.

## Initial Setup

- Login to [Deno Deploy](https://console.deno.com/)
- Create (or navigate to) the Organisation, then the App
- Setup/confirm the App configuration
  - App Directory: `(root)`
  - Framework preset: `No Preset`
  - Install command: `pnpm install`
  - Build command: `pnpm run build`
  - Pre-deploy command: `(empty)`
  - Runtime Configuration: `Dynamic App`
  - Runtime Configuration > Entrypoint: `.output/server/index.mjs`
  - Runtime Configuration > Memory Limit: `512MiB`
  - Build Memory Limit: `2GiB`
  - Deploy from GitHub: `(link to this repository)`
- Create (or navigate to) the Organisation
- Setup/confirm the Organisation configuration
  - Domains
    - Setup each domain manually
    - Link each domain to the App
