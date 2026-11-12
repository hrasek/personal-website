# Personal Website – Design & Technical Specification

Martin Hošek · Version 0.3 · November 2026

> This file is the repository copy of the specification. Keep it in sync with
> the project copy on claude.ai. Decisions and their reasons are logged in
> [DECISIONS.md](DECISIONS.md).

## 1. Purpose and goals

The website is the extended version of my one-page CV. The CV stays short; the website shows the detail: projects, the publication, and how I think and work.

**Goals**

- Present me as a software engineer with a strong analytical (physics PhD) background.
- Show real work: 3 to 5 projects with stack, problem and outcome.
- Make it easy for a recruiter to contact me or download the CV within 10 seconds.
- Demonstrate my own skills through the site itself: clean code, fast loading, good accessibility.

**Non-goals (for version 1)**

- No server of my own, no user accounts, no database (one small serverless function serves the chess ratings).
- No blog at launch (can be added later).
- No contact form; a plain email link avoids spam and maintenance.

## 2. Target audience

- Recruiters and hiring managers scanning quickly, often on a phone.
- Technical interviewers who want to see code and projects.
- Potential clients or collaborators in the scraping, chatbot and data-analysis area.

## 3. Site structure and content

The site is a single scrolling page with anchor navigation. Sections in order:

1. **Hero**: name, one-line identity, buttons (GitHub, LinkedIn, Email, Download CV).
   - Draft line: _Software engineer with a PhD in physics. I build scrapers, RAG chatbots and backend systems in Python._
2. **About**: 2 to 3 short paragraphs on the path from spectroscopy to software and what I am looking for.
3. **Projects**: 3 to 5 cards. Each card has a title, 2-sentence description, tech tags, and a GitHub or demo link.
   - Client work can only be shown if permitted. Otherwise build small public versions (for example a RAG chatbot over public documents, a scraper with a clean data output).
4. **Experience**: compact timeline: Software engineer at WANTED.solutions (since May 2024), research at the Institute of Scientific Instruments (2018 to 2023), research internship in Turin (2019).
5. **Publications** (below the Experience timeline): a count line, the Optics Letters article as a featured card, and the conference papers as a list (newest first, "First author" tag where true). Each item shows title, venue, year and a DOI link; no summaries (decided 11 November 2026). Data in `experience.json`.
6. **Skills**: grouped lists, no percentage bars.
   - Languages: Python, SQL, JavaScript, Matlab
   - Web and backend: Laravel, Svelte, Selenium
   - Data: numpy, pandas, matplotlib
   - Tools: Docker, Git, Azure DevOps, LaTeX, LabVIEW
7. **Beyond code**: chess is the main hobby, with floorball and football mentioned in one line.
   - Chess: 2 to 3 sentences on why I play and what it trains (logical and strategic thinking), a link to my Lichess or Chess.com profile with current rating, and an interactive board replaying one favourite game.
   - Other interests: one short line, no separate cards.
8. **Contact**: email, LinkedIn, GitHub; languages spoken (Czech native, English B2). No location (decided 10 November 2026).
9. **Footer**: copyright, link back to top.

## 4. Design

**Style:** minimal, calm, a lot of white space. One accent colour, two fonts, no decorative clutter. A subtle chess-inspired detail (a faint board pattern behind the hero, or a small knight icon as the logo mark).

**Colour palette**

| Role                 | Light mode | Dark mode |
| -------------------- | ---------- | --------- |
| Background           | #FAFAF7    | #101214   |
| Surface (cards)      | #FFFFFF    | #181B1F   |
| Text                 | #14161A    | #ECEDEE   |
| Muted text           | #5B616B    | #9AA1AB   |
| Accent (chess green) | #2F6F55    | #5FB894   |
| Border               | #E4E4DE    | #2A2E34   |

**Typography**

- Headings and body: Inter (fallback: system-ui, sans-serif).
- Code and tags: JetBrains Mono (fallback: monospace).
- Base size 17 px, line height 1.6, content width max 720 px for text.

**Layout and components**

- Sticky top bar with name and anchor links; collapses into a simple menu on mobile.
- Hero with large name, one-line identity, and a row of buttons.
- Project cards in a 2-column grid on desktop, 1 column on mobile.
- Timeline as a vertical list with dates on the left.
- Chess block: text and profile link on the left, board on the right (stacked on mobile), with Previous and Next move buttons under the board.
- Light/dark toggle in the top bar, defaulting to the system setting.

**Responsive breakpoints:** 640 px (mobile to tablet), 960 px (tablet to desktop). Mobile first.

**Accessibility:** contrast ratio at least 4.5:1, visible focus states, semantic HTML (header, main, section, footer), alt text on images, keyboard-navigable menu.

## 5. Technology

| Area      | Choice                                           | Reason                                             |
| --------- | ------------------------------------------------ | -------------------------------------------------- |
| Framework | SvelteKit 3 with the static adapter              | I already know Svelte; produces a fast static site |
| Language  | TypeScript (JavaScript acceptable)               | Safer, shows modern practice                       |
| Styling   | Plain CSS with CSS variables (theme tokens)      | Simple, no dependencies, easy dark mode            |
| Content   | Project data in a local JSON or Markdown file    | Easy to edit without touching components           |
| Fonts     | Self-hosted Inter and JetBrains Mono             | Faster, no third-party requests                    |
| Icons     | Inline SVG; brand logos from Font Awesome Free   | No icon font needed; CC BY 4.0, credited in code   |
| Analytics | Plausible or Cloudflare Web Analytics (optional) | Privacy-friendly, no cookie banner                 |

**Alternative considered:** Astro, if a Markdown blog becomes important. Python backends (Flask, Django) and Laravel were rejected because a portfolio does not need a server.

**Chess ratings:** the page stays static, and one small serverless function (`/api/chess`, a managed Azure Function in the Static Web App) supplies two live values. The Chess.com Published-Data API gives the online rating (no key; requests are sent one at a time, with an identifying User-Agent). The ChessTools ratings API gives the official FIDE rating for my FIDE ID. The function caches Chess.com for 1 hour and FIDE for 24 hours, because FIDE publishes rating lists monthly, and returns both values as one JSON response. The cache lives in the function's memory, so it is best effort: a restarted or extra function instance fetches again, which Chess.com allows for serial requests. The response also carries `Cache-Control: public, max-age=300`, so a visitor's browser reuses it for 5 minutes (see D14). Managed functions support Node.js up to 22, so the function runs on Node 22 while the site builds on Node 24.

**Fallback:** the page ships with the last known ratings and their date in `chess.json`, shows them immediately, and replaces them when the live response arrives. If either API fails, the old value stays visible.

**FIDE response (tested):** `GET https://api.chesstools.org/fide/{fide_id}` returns flat JSON and worked without an API key or authentication header. The fields used are `rating` (a number), `name`, `title` and `country`. The response has no rating-list date, so the function adds its own fetch timestamp. `k_factor` arrives as a string, so it is ignored.

**Error handling and licence:** an unknown FIDE ID returns HTTP 404 with `{"detail": "Player not found"}`. The function treats any non-200 answer, 404 included, as "no fresh value" and keeps the stored fallback. The ChessTools code is published under the MIT licence, which allows free use. The licence says nothing about the hosted API's availability or limits, so the function keeps traffic minimal (one request per day, cached for 24 hours). `rating` is the FIDE classical rating, so the page labels it "FIDE classical". If a key is ever required, it lives in the function's secrets, never in the page.

**Function output (draft contract):**

```json
{
	"chesscom": {
		"blitz": { "rating": 2254, "lastGame": "2026-07-31" },
		"bullet": { "rating": 2089, "lastGame": "2026-11-04" },
		"rapid": { "rating": 2206, "lastGame": "2023-03-01" },
		"daily": { "rating": 2077, "lastGame": "2026-03-29" }
	},
	"fide": { "classical": 2131 },
	"fetchedAt": "2026-11-04T14:32:31Z"
}
```

The values above come from the real responses for my accounts. The function reads `chess_blitz`, `chess_bullet`, `chess_rapid` and `chess_daily` from the Chess.com stats response, takes `last.rating` and converts `last.date` (a Unix timestamp in seconds) to a date. **Display rule:** the page shows only formats with a game in the 12 months before `fetchedAt` (not before "now", so the prerendered page and the browser agree). Today that means blitz, bullet and daily; rapid is hidden because the last rapid game was in March 2023. Chess960, tactics and puzzle rush are ignored.

## 6. URL, domain and hosting

- **Preferred domain:** martinhosek.cz (to be checked for availability). Alternatives: martinhosek.dev, hosek.dev.
- **Hosting:** Azure Static Web Apps, Free plan (free SSL, up to 2 custom domains). It also runs the chess function as a managed Azure Function.
- **Deployment:** a merge to `main` triggers the Azure pipeline, which builds the site and deploys it.
- **Email:** a simple address on the domain (for example martin@martinhosek.cz) forwarded to my main mailbox. How to forward it depends on the registrar (open decision).
- **Estimated cost:** domain about 10 to 20 EUR per year; hosting free.

## 7. Repository structure

```
personal-website/
├─ src/
│  ├─ routes/+page.svelte        # the single page
│  ├─ lib/components/            # Hero, ProjectCard, Timeline, Skills, ChessBoard, ...
│  ├─ lib/data/projects.json     # project content, chess.json
│  └─ app.css                    # theme variables, base styles
├─ static/                       # CV.pdf, favicon, social preview image, staticwebapp.config.json (API runtime)
├─ api/                          # managed Azure Functions (Node 22, own package.json): /api/chess
├─ scripts/chess-check.mjs       # calls the real chess APIs: npm run chess:check
├─ docs/
│  ├─ SPEC.md                    # this specification
│  └─ DECISIONS.md               # decision log
├─ .github/workflows/ci.yml      # CI checks on pull requests (GitHub Actions)
├─ azure-pipelines.yml           # build and deploy to Azure Static Web Apps
├─ vite.config.ts                # SvelteKit 3 config, static adapter, Vitest
├─ CLAUDE.md                     # instructions for Claude Code
└─ README.md
```

## 8. Quality requirements

- **Performance:** Lighthouse score 95+ in all four categories; page weight under 500 KB without images (the chess board script loads lazily and is excluded from first load).
- **SEO:** title, meta description, Open Graph image, sitemap, `lang` attribute.
- **Privacy:** no cookies, no tracking beyond privacy-friendly analytics.
- **Browser support:** current versions of Chrome, Firefox, Safari, Edge.

## 9. Deployment and costs

GitHub Actions check every pull request. After a merge to `main`, Azure Pipelines builds the site and deploys it to Azure Static Web Apps. The only running cost is the domain name.

| Part                                    | Cost                        | Note                                                                                                                                   |
| --------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Hosting (Azure Static Web Apps, Free)   | Free                        | 100 GB bandwidth per month per subscription, no paid overage; 250 MB per environment; 3 preview environments; 2 custom domains; no SLA |
| Chess function (managed Azure Function) | Free (to verify)            | Runs inside the Static Web App on Node.js 22; whether it adds any cost on the Free plan is still to be verified                        |
| Azure Pipelines (private project)       | Free                        | 1 Microsoft-hosted parallel job, 1,800 minutes per month, 60 minutes per run; confirmed active in my organization                      |
| GitHub Actions                          | Free                        | Free for standard runners in public repositories, so the repository stays public                                                       |
| Domain                                  | about 10 to 25 EUR per year | My estimate; check the price at the registrar before buying                                                                            |

Figures come from the official Microsoft pages [Static Web Apps quotas](https://learn.microsoft.com/azure/static-web-apps/quotas), [Static Web Apps plans](https://learn.microsoft.com/azure/static-web-apps/plans), [Static Web Apps languages and runtimes](https://learn.microsoft.com/azure/static-web-apps/languages-runtimes) and [Azure Pipelines parallel jobs](https://learn.microsoft.com/azure/devops/pipelines/licensing/concurrent-jobs), read on 6 November 2026, and from the [GitHub Actions billing](https://docs.github.com/en/actions/reference/usage-limits-billing-and-administration) page, read on 4 November 2026. Check them again before launch.

**Deployment steps**

1. Public GitHub repository (done). It holds no secrets.
2. Azure DevOps organization with a private project (done). New organizations can no longer create public projects.
3. In the Azure portal, create a Static Web App on the Free plan. Choose a deployment source other than GitHub, so Azure doesn't add its own GitHub Actions workflow (to be confirmed when we create it).
4. Copy the Static Web App's deployment token and store it as a secret variable in the Azure pipeline, never in the repository.
5. Add `azure-pipelines.yml`: on a push to `main`, install Node from `.nvmrc`, run `npm ci` and `npm run build`, then deploy `build/` and `api/` with the `AzureStaticWebApp@0` task (`skip_app_build: true`).
6. Create the pipeline in Azure DevOps from the GitHub repository and run the first deploy. The site appears at its `*.azurestaticapps.net` address with HTTPS; test it there, including `/api/chess`.
7. Buy the domain and add it as a custom domain in the Static Web App. HTTPS certificates are free.
8. Optional later: preview deployments for pull requests (the Free plan allows 3 preview environments).

**Branch protection (active since 5 November 2026)**

A GitHub ruleset on `main` requires a pull request for every change (0 required approvals, because I work alone), and blocks force pushes and branch deletion. Pull requests are merged with a merge commit, so linear history is not required. Once the CI workflow has run at least once, its check is added to the ruleset as a required status check, so a pull request cannot be merged while the checks fail. Details are in [DECISIONS.md](DECISIONS.md).

**GitHub Actions (checks only)**

Azure Pipelines builds and deploys the site, so Actions only run quality checks on every pull request and every push to `main`. A failed check shows as a red mark before anything is merged. There are no scheduled jobs, because the ratings come from the chess function.

The workflow is `.github/workflows/ci.yml`. It uses `actions/checkout@v6` and `actions/setup-node@v6`, reads the Node version from `.nvmrc`, caches npm, and runs one job, `checks`. That job name is the required status check in the ruleset.

The steps are: install dependencies (`npm ci`), lint, type check, run the unit tests (including the parsing of the Chess.com and FIDE responses in `api/`), test the production build, and build the API package. Action versions were checked on 5 November 2026.

**Optional later:** a Lighthouse CI step to enforce the score target from section 8.

## 10. Content to prepare before building

- [ ] Hero line and About text (English)
- [ ] 3 to 5 projects with description, stack, link, outcome
- [ ] Current CV as PDF (one page)
- [ ] Professional photo (optional) and social preview image
- [ ] Final email address and LinkedIn URL
- [ ] Permission check for any client work shown
- [ ] Chess: Chess.com username, FIDE ID, a 2 to 3 sentence personal text, and one favourite game as PGN

## 11. Milestones

1. **Week 1:** finalise content and approve the design mockup.
2. **Week 2:** build the page in SvelteKit, responsive and with dark mode, including the chess section.
3. **Week 3:** polish (accessibility, performance, SEO), connect domain, deploy.
4. **Launch:** add the URL to the CV, GitHub profile and LinkedIn.

## 12. Open decisions

- Final domain name
- Licence for the code (for example MIT; personal content not licensed for reuse)
- Whether to include a photo
- Whether to add a blog after launch
- Which projects to show publicly
- Which Chess.com username and FIDE ID to show
- Whether to show an interactive board with a favourite game, or only profile link and rating
- How to forward email for the domain (depends on the registrar)
