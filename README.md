# Front End Technical Test

Technical test submission for Miroma Project Factory by [Brendan Murty](https://bcm.works).

## Structure

- [.claude](.claude/) - Project specific config for [Claude Code](https://claude.com/product/claude-code).
- [.github](.github/) - GitHub config.
- [.prototypes](.prototypes/) - Ideas and half-built prototypes.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [.vscode](.vscode/) - Customised [VS Code](https://code.visualstudio.com/) project configuration.
- [app](app/) - Application source code.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in Markdown files.
- [docs/ADR.md](docs/ADR.md) - Architecture decision record guide.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [docs/INFRA.md](docs/INFRA.md) - Infrastructure setup documentation.
- [.editorconfig](.editorconfig) - Define code style rules using [EditorConfig](https://editorconfig.org).
- [opencode.json](opencode.json) - Project specific config for [OpenCode](https://opencode.ai/).

## Tech Stack

- [Deno Deploy](https://deno.com/deploy) - Infrastructure and deployment.
- [Deno](https://deno.com/) - Development tooling and package management.
- [Nuxt](https://nuxt.com/) - A [Vue](https://vuejs.org/) framework that provides UI and server features.

## Required Tools

- [Deno](https://deno.com/) (`latest stable`) - Consider installing via my [Deno setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/deno.sh).
- 

## Initial Setup

```bash
deno install
cp .sample.env .env
```

## Commands

- `deno task dev` - Start a local dev server
- 

## Deployment

First setup a new [Deno Deploy](https://deno.com/deploy) project by following the steps in [docs/INFRA.md](docs/INFRA.md).

Following this, new releases will be automatically triggered from [Deno Deploy](https://deno.com/deploy) when new commits are pushed to the `main` branch.
