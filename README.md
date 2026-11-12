# personal-website

Source code of Martin Hošek's personal website: a single-page portfolio
for a software engineer with a PhD in physics.

> **Status:** work in progress. Nothing is deployed yet.

<!-- TODO: add the live URL once the domain is chosen (see docs/SPEC.md, section 6). -->

## Tech stack

- [SvelteKit](https://svelte.dev/docs/kit) with the static adapter, TypeScript
- Plain CSS with CSS variables (light and dark mode)
- One managed Azure Function, `/api/chess`, for live chess ratings
- Hosting on Azure Static Web Apps (Free plan), deployed by Azure Pipelines
- GitHub Actions run the checks on every pull request

## Getting started

Requirements: Node.js 24 or newer (pinned in `.nvmrc`).

```bash
npm install          # install dependencies
npm run dev          # start the dev server
npm run check        # type check (svelte-check)
npm run lint         # Prettier check + ESLint
npm run format       # format all files with Prettier
npm test             # unit tests (Vitest, single run)
npm run build        # production build into build/
npm run preview      # serve the production build locally
npm run build:api    # install and build the Azure Functions API in api/
npm run chess:check  # call the real Chess.com and FIDE APIs and print the result
```

## Project structure

The planned layout is described in [docs/SPEC.md](docs/SPEC.md), section 7.

## Deployment

Two systems, each with one job:

- **GitHub Actions** (`.github/workflows/ci.yml`) run the checks on every pull
  request and push to `main`: lint, type check, tests, build.
- **Azure Pipelines** (`azure-pipelines.yml`, in a private Azure DevOps
  project) builds the site after every merge to `main` and deploys it to
  Azure Static Web Apps.

## Contributing workflow

- `main` is protected: all changes go through a pull request.
- Branch names: `<type>/<short-description>`, for example `feat/hero-section`.
- Commit messages and PR titles follow
  [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).
- Pull requests are merged with a merge commit (no squash, no rebase), so the
  history shows every commit as it was pushed.

## Documentation

- [docs/SPEC.md](docs/SPEC.md): design and technical specification
- [docs/DECISIONS.md](docs/DECISIONS.md): decisions made and why
- [CLAUDE.md](CLAUDE.md): instructions for Claude Code

## License

<!-- TODO: choose a licence (for example MIT for the code). -->

To be decided. Until then, all rights are reserved. Personal content (texts,
CV, photos) is not licensed for reuse.
