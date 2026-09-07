# 001 - Initial infrastructure

## Status

`Approved on 7 Sep 2026`

## Context

We need an automatic deployment system that doesn't require ongoing maintenance or updates.

We don't yet have a dedicated colleague to manage infrastructure for this project.

## Decisions

1. Use [Deno Deploy](https://deno.com/deploy)
2. Setup a new Deno Deploy account using the [Free plan](https://deno.com/deploy/pricing)
2. Setup manually and use their built-in auto deployment via the GitHub repo

## Consequences

- Deployments to other environments, like Staging, will require further manual setup
- Depending on real-world use requirements, this project may incur an ongoing cost. See [Deno Deploy pricing](https://deno.com/deploy/pricing) for more details
