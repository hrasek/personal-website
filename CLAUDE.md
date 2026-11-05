# CLAUDE.md

Personal website of Martin Hošek (software engineer, PhD in physics).
It is one scrolling static page used for self-presentation.

## Sources of truth

- `docs/SPEC.md`: content, design, technology, quality targets.
  Read the relevant section before changing content, design or technology.
- `docs/DECISIONS.md`: decisions already made. Don't reopen them unless I
  ask. If a request conflicts with the spec or a decision, say so and
  propose an update to the doc instead of silently diverging.

## Stack (decided)

- SvelteKit with `@sveltejs/adapter-static`, TypeScript.
- Plain CSS with CSS variables for theme tokens. No CSS framework, no UI
  library. Light and dark mode, defaulting to the system setting.
- Content (projects, chess fallback values) in local JSON or Markdown under
  `src/lib/data/`. Components don't hard-code content.
- Self-hosted fonts (Inter, JetBrains Mono). No third-party requests at load.
- Hosting: Cloudflare Pages. GitHub Actions run checks only; Cloudflare
  deploys.

## Commands

- `npm run dev`: dev server
- `npm run check`: type check (svelte-check)
- `npm run lint`: Prettier check + ESLint
- `npm run format`: format with Prettier
- `npm test`: Vitest, single run (Node environment only)
- `npm run build`: static build into `build/`

Before proposing a commit, run `check`, `lint`, `test` and `build`.

## Project notes

- SvelteKit 3: configuration lives in `vite.config.ts`. There is no
  `svelte.config.js`.
- All pages are prerendered (`src/routes/+layout.ts`).
- Tests run in Node only, without browser mode or Playwright.

## Scope at launch

- One page with these sections: Hero, About, Projects, Experience,
  Publication, Skills, Beyond code (chess), Contact, Footer.
- Not at launch: blog, football section, contact form.

## Chess ratings (`functions/api/chess.ts`)

- One Cloudflare Pages Function at `/api/chess` returns Chess.com ratings
  (cached 1 hour) and the FIDE classical rating (cached 24 hours, ChessTools
  API).
- Send Chess.com requests one at a time, with an identifying User-Agent.
  Don't put an email address in it.
- The page ships stored fallback values (`chess.json`) and keeps them if an
  API fails. Treat any non-200 response as "no fresh value".
- Hide Chess.com formats with no game in the last 12 months.
- The response contract is in `docs/SPEC.md`, section 5.

## Content rules

- Site copy is in English.
- Never invent facts, project descriptions, numbers, dates or contact
  details. Use clearly marked placeholders: `TODO(content): ...`.

## Quality targets

- Lighthouse 95+ in all four categories. First-load weight under 500 KB
  without images. The chess board script loads lazily.
- Accessibility: contrast at least 4.5:1, visible focus states, semantic
  HTML, keyboard-navigable menu, alt text on images.
- Mobile first. Breakpoints are 640 px and 960 px.

## Security

- Never put secrets, tokens or personal email addresses into code, docs,
  commits or requests. Neither chess API needs a key. If one ever does, it
  goes into the Cloudflare function's secrets, never into the repository.

## Git workflow (project-specific)

- `main` is protected: only pull requests, no force pushes.
- Branches are `<type>/<short-description>` and commits follow Conventional
  Commits. My personal Claude Code rules contain the full convention.
- PRs are merged with a merge commit. Don't squash or rebase.

## How to work

- Work in small steps. For anything non-trivial, give a short plan first
  and wait for my OK.
- Say plainly when you are unsure. Verify API behaviour, limits and package
  versions from official sources instead of relying on memory.
