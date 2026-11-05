# Decisions

A log of decisions about the personal website. Each entry says what was
decided and why. Don't reopen a decision unless there is a new reason. To
change one, add a new entry that supersedes it and mark the old one as
superseded.

Entries D1 to D5 were made before this log existed and are recorded here on
5 November 2026. The full details are in [SPEC.md](SPEC.md).

## D1: One static page with SvelteKit

- **Decision:** one scrolling static page built with SvelteKit and
  `adapter-static`, TypeScript, and plain CSS with CSS variables. Light and
  dark mode, defaulting to the system setting.
- **Why:** I already know Svelte, a static page is fast and cheap to host,
  and plain CSS keeps dependencies at zero.
- **Rejected:** Astro (only worth it for a Markdown blog); Flask, Django and
  Laravel (a portfolio doesn't need a server).

## D2: Hosting and repository

- **Decision:** Cloudflare Pages hosts the site and deploys every push to
  `main`. The repository `personal-website` on GitHub is public; it will be
  renamed to match the domain later. GitHub Actions run checks only.
- **Why:** Cloudflare Pages is free, includes HTTPS and also runs the chess
  function. Actions are free for standard runners in public repositories.

## D3: Scope at launch

- **Decision:** no blog, no football section and no contact form at launch.
- **Why:** less to build and maintain. A plain email link avoids spam.

## D4: Chess ratings

- **Decision:** one Cloudflare Pages Function, `/api/chess`, returns
  Chess.com ratings (cached 1 hour) and the FIDE classical rating (cached
  24 hours, ChessTools API). The page ships stored fallback values and keeps
  them if an API fails. Chess.com formats with no game in the last 12 months
  are hidden. Chess.com requests are sent one at a time with an identifying
  User-Agent.
- **Why:** the page stays static, ratings stay current, and traffic to both
  APIs stays minimal.

## D5: No secrets or personal email in the repository

- **Decision:** never put secrets, tokens or my email address into code,
  docs, commits or requests.
- **Why:** the repository is public.

## D6: Ruleset on `main` (5 November 2026)

- **Decision:** a GitHub ruleset on the default branch, enforcement Active:
  - pull request required before merging, 0 required approvals
  - force pushes blocked, deletion restricted
  - "Require linear history" off (it would block merge commits, see D7)
  - empty bypass list, so the rules apply to me too
  - required status check: added once the CI workflow has run at least once
- **Why:** every change is reviewed in a PR and checked by CI before it
  reaches production. 0 approvals because GitHub doesn't let me approve my
  own PR.

## D7: Merge commits only (5 November 2026)

- **Decision:** PRs are merged with a merge commit. Squash and rebase
  merging are disabled in the repository settings. Pushed commits are never
  rewritten (no force push, no amend, no rebase); mistakes are fixed with a
  new commit.
- **Why:** an honest history that shows every commit as it was pushed, with
  the same hashes. Rebase merging would keep the commits but give them new
  hashes.

## D8: Branch names and commit messages (5 November 2026)

- **Decision:** branches are `<type>/<short-description>` (lowercase,
  hyphens, for example `feat/hero-section`). Commit messages and PR titles
  follow Conventional Commits 1.0.0. The types are `feat`, `fix`, `docs`,
  `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore` and `revert`.
- **Why:** branch names and commit messages use the same vocabulary, and
  the convention is widely known.
- **Where:** the full convention is in my personal Claude Code rules
  (`~/.claude/rules/git-conventions.md`). The summary is in `README.md` and
  `CLAUDE.md`.

## D9: Documentation lives in the repository (5 November 2026)

- **Decision:** `CLAUDE.md`, `docs/SPEC.md` and `docs/DECISIONS.md` are the
  repository copies of the project docs. After an important decision,
  update both the repository and the claude.ai project.
- **Why:** Claude Code works locally and can only see the repository.

## D10: SvelteKit 3, configured in `vite.config.ts` (5 November 2026)

- **Decision:** the project was created with `sv create` (sv 1.3.0) and uses
  SvelteKit 3. The adapter (`adapter-static`) and the Vitest setup live in
  `vite.config.ts`. All pages are prerendered via `src/routes/+layout.ts`.
- **Why:** SvelteKit 3 no longer supports `svelte.config.js`, so the spec's
  repository structure was updated.

## D11: Unit tests in Node only (5 November 2026)

- **Decision:** Vitest runs in the Node environment. The browser mode the
  scaffold added (Playwright with Chromium) was removed. `npm test` runs
  `vitest run --passWithNoTests`, so CI passes before the first test exists.
- **Why:** the planned tests (parsing the chess API responses) don't need a
  browser, and CI stays fast without downloading Chromium.
- **Later:** component tests in a browser can be added in their own PR.

## D12: Node.js 24 (5 November 2026)

- **Decision:** `.nvmrc` pins Node.js 24, which Cloudflare Pages and
  `actions/setup-node` both read. `package.json` has
  `"engines": { "node": ">=24" }`, and `.npmrc` has `engine-strict=true`,
  so `npm install` refuses an older Node locally.
- **Why:** 24 is an LTS line and is what I have installed (24.14.1).
  Without a pin, Cloudflare would build with its default (22.16.0, per its
  build image docs on 5 November 2026). The Cloudflare v3 build image does
  not read `engines`, so the `.nvmrc` file is what counts there.
- **Later:** move to Node 26 (Active LTS) in its own PR.

## Open

See [SPEC.md](SPEC.md), section 12: domain, licence, photo, blog, which
projects to show, chess accounts, interactive board.
