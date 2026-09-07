# Architecture Decision Records Guide

> An Architecture Decision Record (ADR) is a short document that captures and explains a single decision relevant to a product or ecosystem. Documents should be short, just a couple of pages, and contain the decision, the context for making it, and significant ramifications. They should not be modified if the decision is changed, but linked to a superseding decision.

_[Martin Fowler - Architecture Decision Record](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)_

# Rules

All ADRs must:

- Contain valid Markdown syntax.
- Be located in the `docs/adrs` directory.
- Follow the file naming convention: `xxx-very-short-summary.md`.
- Use a sequential three number prefix in the file name, where `001` is the oldest.
- Follow the structure detailed in the `Content` section below.
- Not be edited once it has a `Status` of `Approved`.
- Reference other ADRs using Markdown links if relevant.

# Content

Based on the [Decision Record Template by Michael Nygard](https://github.com/architecture-decision-record/architecture-decision-record/blob/main/locales%2Fen%2Ftemplates%2Fdecision-record-template-by-michael-nygard%2Findex.md).

```
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
```
