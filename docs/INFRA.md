# Infrastructure

This project uses [Deno Deploy](https://deno.com/deploy) for deployment and hosting.

## Initial Setup

- Login to [Deno Deploy](https://console.deno.com/)
- Create (or navigate to) the Organisation, then the App
- Setup/confirm the App configuration
  - App Directory: `(root)`
  - Framework preset: `No Preset`
  - Install command: `deno install`
  - Build command: `deno task build`
  - Pre-deploy command: `(empty)`
  - Runtime Configuration: `Dynamic App`
  - Runtime Configuration > Entrypoint: `./dist/server/index.mjs`
  - Runtime Configuration > Memory Limit: `768 MiB`
  - Build Memory Limit: `3 GiB`
  - Deploy from GitHub: `(link to this repository)`
  - Settings > Environment Variables: `(production values for all items in .sample.env)`
- Create (or navigate to) the Organisation
- Setup/confirm the Organisation configuration
  - Domains
    - Setup each domain manually
    - Link each domain to the App

## Deno KV

The API uses [Deno KV](https://docs.deno.com/deploy/reference/deno_kv/). No code or environment variable changes are needed, but a database must be manually provisioned and assigned:

- Login to [Deno Deploy](https://console.deno.com/) and navigate to the Organisation dashboard
- Click `Databases` in the navigation bar, then `Provision Database`
- Choose `Deno KV` as the database engine, provide a memorable name, and save
- Click `Assign` next to the new database and select the App
- Confirm the status changes to `Connected` (click `Fix` to retry on error)

Notes:

- Deploy automatically creates a separate database per timeline, so production data stays isolated.
- Local dev needs no setup: it uses a SQLite file (`.data/kv.db`, overridable via `DENO_KV_PATH`).
- Deno KV data is stored in and transits through the US, so it is not suitable for workloads requiring EU-only data residency.
