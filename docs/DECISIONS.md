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

> Contact-form part superseded by D16 (17 November 2026). No blog and no
> football section still apply.

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
  - required status check: the CI job `checks` (confirmed active on
    20 November 2026)
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
  - email forwarding for the domain: no longer needed, because the site
    shows no email address (D17)
- **API build, answered on 17 November 2026:** the `AzureStaticWebApp@0`
  task has separate `skip_app_build` and `skip_api_build` inputs. Microsoft's
  build configuration docs describe building the API yourself, setting
  `skip_api_build: true` and pointing `api_location` at the built API. The
  pipeline therefore builds both the site and the API and the task only
  uploads them (SPEC.md, section 9, step 5).
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
- **Verified after the first deploy (20 November 2026):** `/api/chess`
  answers on the live site with live ratings, and the built-in metrics show
  no function errors (D18).

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

## D16: Contact form with Pushbullet notifications (17 November 2026)

> The email-link fallback is superseded by D17 (17 November 2026): the site
> shows no email address, and a failed send points to LinkedIn. The
> pipeline question under "To verify" is answered in D13.

- **Decision:**
  - The Contact section gets a short form: name, email, message (1 to
    3,000 characters) and a hidden honeypot field `website`. The email
    link stays next to the form as a fallback.
  - The form posts JSON to `/api/contact`, a second managed Azure Function
    in the existing `api/` package. It validates the input, answers a
    filled honeypot with success without sending anything, and sends a
    Pushbullet "note" to my phone. It returns 200 (sent), 400 (invalid
    input) or 502 (Pushbullet failed). On any error the page shows the
    email link.
  - The Pushbullet access token is the application setting
    `PUSHBULLET_TOKEN` in the Static Web App. Locally it lives in
    `api/local.settings.json`, which is gitignored; the repository has only
    `api/local.settings.example.json` with a placeholder. The token never
    goes into code, docs, commits or chats (see D5).
  - The site stores nothing. A short note under the form says what is
    collected and that messages pass through Pushbullet.
  - No captcha and no third-party scripts at launch.
- **Why:** visitors without a mail client can write in a few seconds; I get
  an instant notification on my phone; the function is small backend work
  in the existing architecture and costs nothing.
- **Not chosen:**
  - a personal server (WEDOS VPS, Azure VM, App Service or Container Apps):
    extra cost and maintenance for one HTTP call, and linking your own
    backend to Static Web Apps needs the paid Standard plan
  - a third-party form service: messages go through another company, with
    monthly limits on free tiers
  - sending email (for example Azure Communication Services): needs DNS
    setup on a domain that isn't decided yet
  - Cloudflare Turnstile or another captcha: a third-party script that
    works against the performance and privacy targets
- **Facts checked on 12 and 17 November 2026:**
  - Pushbullet API docs: free accounts can send 500 pushes per month; more
    returns an error. Pushes are created with
    `POST https://api.pushbullet.com/v2/pushes` and an `Access-Token`
    header.
  - Microsoft docs: managed functions in Static Web Apps support HTTP
    triggers only; application settings reach the API as environment
    variables and are encrypted at rest.
  - Tested on 17 November 2026: a note sent with `curl` arrived on my
    Android phone.
- **To verify:**
  - that the pipeline builds `api/` correctly: done. The pipeline
    builds the API itself and deploys with `skip_api_build: true` (D13);
    both functions work on the live site since 20 November 2026 (D18).
  - the monthly push count after launch. If spam appears, add rate
    limiting or a captcha as a new decision.
- **Supersedes:** the contact-form part of D3.

## D17: Contact form without an email address (17 November 2026)

- **Decision:**
  - My email address appears nowhere on the site or in the repository. The
    Contact section has the form plus GitHub and LinkedIn links.
  - If sending fails, the form says so and points to LinkedIn. Without
    JavaScript, a short note points to LinkedIn instead of the form.
  - The Contact section is one column at every width: intro text, the
    GitHub and LinkedIn links, then the form (max 560 px wide).
  - Limits, the same in the browser (`src/lib/contact-form.ts`) and in the
    API (`api/src/lib/contact.ts`), kept equal by a unit test: name 1 to 100
    characters, email up to 254 characters and shaped like an address,
    message 1 to 3,000 characters. The API also rejects request bodies over
    16 KB before parsing them.
  - A 400 answer lists the invalid fields
    (`{ "error": "invalid_input", "fields": ["email"] }`) and the form marks
    them. A missing `PUSHBULLET_TOKEN` gives 502 and the log line
    "PUSHBULLET_TOKEN is not set". The function answers with
    `Cache-Control: no-store`, and its logs never contain the token or the
    visitor's message.
  - Form errors use a new colour token, `--color-danger`: #B42318 in light
    mode and #F97066 in dark mode, both above 6:1 contrast on the background
    and on surfaces.
  - The form copy in `src/lib/data/contact.json` is a draft
    (`TODO(content)`).
- **Why:** an address on a public page and in a public repository attracts
  spam (and D5 keeps it out of the repository anyway). Recruiters already
  use LinkedIn. Without an email address, no email forwarding is needed for
  the domain. One column looked calmer than form and text side by side.
- **Trade-off:** visitors who would rather copy an email address can't.
- **Checked on 17 November 2026:** lint, type check, 66 unit tests and both
  builds pass; axe-core found no violations in the Contact section in light
  and dark mode at 375 and 1280 px, with the error messages showing.
- **Supersedes:** the email-link fallback in D16; the email forwarding
  question in D13 and in SPEC.md, section 12.

## D18: First deploy and monitoring (20 November 2026)

- **Decision:**
  - The Static Web App `personal-website` runs in the resource group
    `rg-personal-website`, Free plan, region West Europe, with deployment
    source "Other". The Azure pipeline from `azure-pipelines.yml` deploys it
    after every merge to `main`; its first run worked on 20 November 2026.
  - The site is live at its generated `*.azurestaticapps.net` address until
    the custom domain is connected. The address is in the Azure portal; it
    is left out of this public repository on purpose, so search engines
    don't pick it up before the real domain exists.
  - `PUSHBULLET_TOKEN` is set as an application setting in the Production
    environment. Both functions work on the live site; a test message
    through the contact form arrived on my phone.
  - Monitoring uses the built-in Static Web Apps metrics (`FunctionHits`,
    `FunctionErrors`, `SiteHits`, `SiteErrors`) under Monitoring > Metrics,
    pinned to a private portal dashboard. **No Application Insights.**
- **Why no Application Insights:** it is priced separately from Static Web
  Apps. Azure Monitor's first 5 GB per month per billing account are free,
  so it would very likely cost nothing here, but the metrics already show
  whether the functions are called and whether they fail. Turn it on only
  when a real problem needs the log lines (`traces`).
- **Lighthouse on the live site (13.5, 20 November 2026, incognito):** 100
  in Performance, Accessibility, Best Practices and SEO on mobile and on
  desktop. Mobile: first and largest contentful paint 1.3 s, Total Blocking
  Time 0 ms, layout shift 0.001; page weight 245 KiB. A mobile run with
  browser extensions enabled scored 88 in Performance (extensions added
  blocking time), so always measure in an incognito window.
- **Checked:** the CI job `checks` was already a required status check on
  `main` (D6).
- **Still open:** whether the managed functions add any cost on the Free
  plan (D13), checked in the Azure cost view after a few days of traffic;
  the custom domain (SPEC.md, sections 6 and 9).

## Open

See [SPEC.md](SPEC.md), section 12: domain, licence, photo, blog, which
projects to show, interactive board, DNS for the bare domain.
Also the open points listed in D13 and D16.
