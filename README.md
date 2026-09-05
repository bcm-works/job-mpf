# Front End Technical Test

Technical test submission for Miroma Project Factory by [Brendan Murty](https://bcm.works).

This project uses data from [The Movie Database](https://www.themoviedb.org/) and includes:

- Movie search
- 

## Structure

- [.claude](.claude/) - Project specific config for [Claude Code](https://claude.com/product/claude-code).
- [.github](.github/) - Project specific config for GitHub.
- [.prototypes](.prototypes/) - Ideas and half-built prototypes.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [.vscode](.vscode/) - Customised [VS Code](https://code.visualstudio.com/) project configuration.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture Decision Records as Markdown files.
- [docs/ADR.md](docs/ADR.md) - Rules for Architecture Decision Records.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [docs/INFRA.md](docs/INFRA.md) - Infrastructure setup documentation.
- [src](src/) - Application and server source code.
- [.editorconfig](.editorconfig) - Define code style rules using [EditorConfig](https://editorconfig.org).
- [opencode.json](opencode.json) - Project specific config for [OpenCode](https://opencode.ai/).

## Tech Stack

- [Deno Deploy](https://deno.com/deploy) - Infrastructure and deployment.
- [Deno KV](https://docs.deno.com/deploy/kv/) - Database storage and hosting.
- [Deno](https://deno.com/) - Development tooling and package management.
- [Nuxt](https://nuxt.com/) - A [Vue](https://vuejs.org/) framework that adds modern web server features.
- [Vue](https://vuejs.org/) - Frontend JavaScript framework.

## Initial Setup

First install the `latest stable` version of [Deno](https://deno.com/). One option is to use my [Deno setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/deno.sh).

Then you can run:

```bash
deno install
cp .sample.env .env
```

Now edit the Git Ignored file named `.env` and set appropriate values for all variables.

## Commands

- `deno task dev` - Start the local dev server
- `deno task build` - Make a new production-ready build

## Deployment

First setup a new [Deno Deploy](https://deno.com/deploy) project by following the steps in [docs/INFRA.md](docs/INFRA.md).

Following this, new releases will be automatically triggered from [Deno Deploy](https://deno.com/deploy) when new commits are pushed to the `main` branch.

