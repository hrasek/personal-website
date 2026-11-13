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

> Hosting part superseded by D13 (6 November 2026). Repository and the
> GitHub Actions checks are unchanged.

- **Decision:** Cloudflare Pages hosts the site and deploys every push to
  `main`. The repository `personal-website` on GitHub is public; it will be
  renamed to match the domain later. GitHub Actions run checks only.
- **Why:** Cloudflare Pages is free, includes HTTPS and also runs the chess
  function. Actions are free for standard runners in public repositories.

## D3: Scope at launch

- **Decision:** no blog, no football section and no contact form at launch.
- **Why:** less to build and maintain. A plain email link avoids spam.

## D4: Chess ratings

> Where the function runs is superseded by D13: a managed Azure Function
> instead of a Cloudflare Pages Function. The behaviour below is unchanged.

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

> The Cloudflare details are obsolete since D13. The pin itself stays:
> GitHub Actions and the Azure pipeline both use `.nvmrc`.

- **Decision:** `.nvmrc` pins Node.js 24, which Cloudflare Pages and
  `actions/setup-node` both read. `package.json` has
  `"engines": { "node": ">=24" }`, and `.npmrc` has `engine-strict=true`,
  so `npm install` refuses an older Node locally.
- **Why:** 24 is an LTS line and is what I have installed (24.14.1).
  Without a pin, Cloudflare would build with its default (22.16.0, per its
  build image docs on 5 November 2026). The Cloudflare v3 build image does
  not read `engines`, so the `.nvmrc` file is what counts there.
- **Later:** move to Node 26 (Active LTS) in its own PR.

## D13: Azure Static Web Apps and Azure Pipelines (6 November 2026)

- **Decision:**
  - Hosting moves from Cloudflare Pages to **Azure Static Web Apps, Free
    plan**.
  - **Azure Pipelines** builds the site and deploys it after every merge to
    `main`. The pipeline lives in `azure-pipelines.yml` and runs in a
    **private** Azure DevOps project.
  - **GitHub Actions keeps the checks** on every pull request (no change).
  - The chess API becomes a **managed Azure Function** in the Static Web App
    (`api/` folder). It runs on Node.js 22; the site still builds on Node 24.
- **Why:** the site's own deployment shows the Azure DevOps skill from my CV
  in practice. The cost stays at zero; only the domain costs money.
- **Facts checked on 6 November 2026** (Microsoft docs):
  - Static Web Apps Free: 100 GB bandwidth per month per subscription, no
    paid overage, 250 MB per environment, 3 preview environments, 2 custom
    domains, free SSL, no SLA (intended for personal projects).
  - Deployment from Azure Pipelines uses the `AzureStaticWebApp@0` task
    (Linux agents only). We build ourselves and deploy with
    `skip_app_build: true`. The deployment token is a secret pipeline
    variable, never in the repository.
  - Managed functions support Node.js up to 22 (`node:22`).
  - Azure Pipelines, private project: 1 Microsoft-hosted parallel job,
    1,800 minutes per month, 60 minutes per run. Confirmed active in my
    organization; no grant request needed.
  - New Azure DevOps organizations can no longer create public projects, so
    the project is private. The pipeline runs aren't public; the YAML in
    the public GitHub repository is what shows the work.
- **Open, to verify in later PRs:**
  - whether managed functions add any cost on the Free plan (the caching
    question is settled in D14)
  - whether deploy results can be shown on GitHub (commit status or README
    badge) for a private Azure DevOps project
  - email forwarding for the domain, which was planned with Cloudflare
    Email Routing and now depends on the registrar
- **Rejected:** Kubernetes with Argo CD. A cluster costs money every month
  and needs maintenance, which is too much for a static page. Better shown
  in a separate project that needs it, featured on the site.
- **Supersedes:** D2 (hosting part), D4 (where the function runs) and the
  Cloudflare details of D12.

## D14: Chess API implementation (12 November 2026)

- **Decision:**
  - `api/` is a separate npm package: TypeScript, Azure Functions Node.js
    programming model v4, compiled with `tsc`. It runs on Node.js 22 in
    Static Web Apps (`apiRuntime` is `node:22` in
    `static/staticwebapp.config.json`); the site and CI stay on Node 24.
  - Chess.com username `hrasek` and FIDE ID `345652` are in
    `api/src/lib/config.ts`; application settings `CHESSCOM_USERNAME` and
    `FIDE_ID` override them. They are public data, not secrets.
  - Requests are serial (Chess.com first, then FIDE), with a 5-second
    timeout and the User-Agent
    `personal-website/1.0 (username: hrasek; +https://github.com/hrasek/personal-website)`.
  - Cache in memory: Chess.com 1 hour, FIDE 24 hours. A failed refresh
    keeps the last good value; a source that never succeeded is `null`.
    The response has `Cache-Control: public, max-age=300`.
  - The page validates the answer strictly and replaces each source
    separately; on any error it keeps the stored values from `chess.json`.
- **Why:** simplest setup that meets the spec without paid services.
  Serial access to the Chess.com API is unlimited, so extra fetches after
  a function restart are harmless.
- **Not chosen:** Azure Table Storage as a shared cache (extra resource and
  setup for little benefit); Node 24 for the API, which needs a linked
  Functions app and the paid Standard plan; fetching the ratings at build
  time with a daily scheduled pipeline (simpler, but ratings up to a day
  old).
- **Facts checked on 12 November 2026:** Static Web Apps lists `node:22`
  as the managed functions runtime; Azure Functions v4 supports Node 22 and
  24 in standalone Function Apps; Chess.com documents unlimited serial
  access and asks clients for an identifying User-Agent.
- **To verify after the first deploy:** that `/api/chess` answers on the
  live site and that the function logs show no errors.

## D15: SEO, icons and social preview (12 November 2026)

- **Decision:**
  - Title, description and the social preview settings live in
    `src/lib/data/site.json`, rendered by `SeoHead.svelte`.
  - `site.json` has `"url": null` until the domain is decided. While it is
    `null`, the build leaves out everything that needs an absolute URL: the
    canonical link, `og:url`, `og:image`, the sitemap entries and the
    `Sitemap:` line in `robots.txt`. `sitemap.xml` and `robots.txt` are
    prerendered routes, so setting the URL once updates all of them.
  - Icons: a bold `MH` monogram, white on the text colour (#14161A), drawn
    on a 16x16 pixel grid so it stays sharp at small sizes (`favicon.svg`,
    `favicon.ico`, `apple-touch-icon.png`). Social preview: a text-only
    1200x630 `og-image.png` (no photo; that decision is still open).
  - Small CSS files are inlined into the HTML (`inlineStyleThreshold`), so
    they don't block the first paint.
- **Why:** a placeholder domain in the canonical link or sitemap would be
  indexed and is worse than no tag at all.
- **Measured on 12 November 2026** (local production build, Lighthouse 12,
  mobile): Performance 95 to 98, Accessibility 100, Best Practices 96, SEO
  100; desktop Performance 100. Page weight 251 KiB. axe-core found no
  violations in light or dark mode at 375 and 1280 px. Best Practices loses
  points only because `/api/chess` doesn't exist in `vite preview`.
- **To do when the domain is known:** set `url` in `site.json`, then check
  the preview with a social card validator.

## Open

See [SPEC.md](SPEC.md), section 12: domain, licence, photo, blog, which
projects to show, interactive board, email forwarding.
Also the open points listed in D13.
