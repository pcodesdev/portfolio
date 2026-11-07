# Peter Njuguna Portfolio

This repository contains Peter Njuguna's professional portfolio, built around the positioning **Digital Transformation & Technology Solutions Professional**. The portfolio brings together project and programme delivery, digital learning, software development, cloud solutions, and AI Engineering & Implementation.

## Core Areas

- Project Management
- Digital Transformation
- EdTech & Digital Learning
- Digital Skills & Workforce Development
- Full-Stack Development
- Cloud Solutions
- AI Engineering & Implementation

## Current Features

- Responsive Home, About, Expertise, Professional Experience, Projects, Education, Open Source, and Contact routes.
- A categorized technology and professional-skills icon section with visible labels and keyboard-accessible tooltips.
- Project Management and AI Engineering & Implementation positioning across the profile and Expertise content.
- Minimal, Blue, and Dark theme choices, with other theme palettes retained in the theme system.
- A shared CSS motion system for staggered and scroll-triggered reveals, hover/focus feedback, and reduced-motion support.
- A Pemanju Farm Manager case-study presentation that separates implemented capabilities from planned work. The case study currently lacks an independently verified public source/demo or project-specific evidence link.
- Curated project/article data, responsive image metadata and local fallbacks, route-aware metadata, and an automated discover-score-publish workflow that verifies built and live image assets (see [Content curation and publication](docs/content-curation.md)).
- Optional serverless GitHub/AI endpoints use shared Upstash rate limits; image-fetch and deployment credential requirements are documented in [Security operations](docs/security-operations.md).
- An Open Source Contributions page with GitHub contribution summary, pull request and issue distributions, author-filtered records, followed by six curated Medium publications. The independent Featured Projects route retains its case study and project cards. GitHub snapshot values are author-filtered and include freshness metadata.
- A portfolio-wide **Ask My Portfolio** entry point on every route. Local keyword retrieval combines the curated public-content allowlist in `src/search/knowledge-base.json` with normalized GitHub snapshot records, returning source links and a no-match state. Aggregate GitHub questions prioritize verified profile totals; repository questions include author-filtered PR evidence. AI generation is not operational until the optional server endpoint is deployed/configured and end-to-end verified; deployments may set the non-secret `window.PORTFOLIO_SEARCH_ENDPOINT` before the app bundle loads.
- A FormSubmit contact form with validation and provider-status messaging. First-use activation and real inbox delivery have not been verified.

## Technology Stack

- React 16 and JavaScript, bootstrapped with Create React App (`react-scripts` 5.0.1).
- React Router DOM 5 with `HashRouter` for client-side routes.
- CSS, CSS variables, and component styles using `styled-components` 5; Base Web and Styletron are also used.
- React Helmet for route-aware metadata.
- Iconify's browser runtime with Simple Icons, Logos, and Material Design Icons; Font Awesome assets are bundled locally for existing social and interface icons.
- React Bootstrap components, including overlay/tooltip support in existing skill UI.
- Chart.js 2 and `react-chartjs-2` remain available for existing chart components; the Open Source distribution rings are CSS-rendered.
- Node.js scripts use built-in `fetch`, `node:test`, and `git` for content curation and deployment; `gh-pages` remains installed but is no longer used by `npm run deploy`.

## Project Status

### Implemented and Locally Validated

- The eight portfolio routes, responsive layouts, themes, categorized expertise icons, AI Engineering & Implementation positioning, Project Management content, and motion/reduced-motion behavior.
- The Open Source route shows GitHub contributions, PR/issue distributions and records, then six Medium articles. Featured GitHub project cards are intentionally absent there; the independent Featured Projects route retains its case study and project cards. PR/issue records are filtered by author login `pcodesdev`; issue search reports 14 matches but returns 12 records. The contribution calendar remains unavailable without authenticated GraphQL access.
- Ask My Portfolio local retrieval and the server-side AI endpoint contract are implemented; hosted provider responses remain unconfigured and unverified.
- Latest local validation: 27 Jest suites / 96 tests and 47 curation, deployment, and image tests passed. Curation and build checks validated six projects, six publications, and all referenced local image assets.
- Production dependency audit: zero known vulnerabilities. Full development-tree audit: 18 findings (13 low, 3 moderate, 2 high; no criticals); the two highs are in CRA's local development server. Its patched successor is not compatible with CRA 5's middleware configuration, so `npm start` is bound to `127.0.0.1` and the server is never deployed.
- Latest local production Lighthouse: mobile performance 87 (accessibility 98, best practices 100, SEO 100; FCP 0.9s, LCP 3.8s, TBT 160ms, CLS 0); desktop performance 99 (accessibility 98, best practices 100, SEO 100; FCP 0.5s, LCP 0.9s, TBT 0ms, CLS 0). The mobile target of 90 is not yet met; live PageSpeed Insights remains pending deployment.
- Production builds explicitly use `PUBLIC_URL=https://pcodesdev.github.io` and are checked for emitted canonical metadata, footer branding, curated data, and local image assets.

### Implemented but Requiring External Verification

- FormSubmit activation and successful delivery to the intended inbox.
- Public impact metrics, which require source, period, denominator, and attribution confirmation.
- Pemanju Farm Manager implementation claims and outcome evidence; a public repository/demo or approved project artifact has not been verified in this workspace.
- Every item in the wider technology/tool inventory should be reviewed for the intended level of familiarity before publication.
- Automated curation and live publication still require a successful GitHub Actions run. The `PAGES_DEPLOY_TOKEN` secret is configured as a fine-grained token limited to `pcodesdev/pcodesdev.github.io`, Contents read/write only, expiring 2027-11-07. Run a manual `workflow_dispatch` after the source history rewrite is pushed; see [Content curation and publication](docs/content-curation.md).

### Planned or Recommended

- An end-to-end AI search deployment is still pending. The React feature uses local keyword retrieval by default and can call an optional URL configured through `window.PORTFOLIO_SEARCH_ENDPOINT`; `api/ask.js` requires server-side provider credentials, an allowed origin, and durable rate-limit storage. No provider response has been verified. See [AI search implementation and feasibility](portfolio-ai-search-feasibility.md).
- Consider separating courses from academic degrees and adding approved, verifiable case-study artifacts.
- Plan a separately tested migration from CRA to a maintained build stack to remove remaining development-server advisories.

### Security and Publication Blockers

- A private key was present in Git history. The key is absent from GitHub account SSH keys and both repository deploy-key lists. Source `main` has been rewritten locally to remove the key and has a verified DPAPI-encrypted pre-rewrite backup; the rewrite must be pushed with an explicit lease and verified remotely.
- The deployment token's limited repository scope and one-year expiry were verified in GitHub settings. The previous one-time token generated during setup was revoked before the current secret was created.
- A legacy root-level `CNAME` references `ashutoshhathidara.com`; it is not copied into the live Pages repository by the deployment script. Confirm custom-domain intent before configuring a CNAME on the live site.
- FormSubmit delivery and public metric source verification remain outstanding.
- This repository has not been deployed or published as part of this work.

## Setup and Development

Use Node.js 20, matching the current content-curation workflow. From the repository root:

```bash
npm ci
npm start
```

The Create React App development server uses port 3000 by default and selects another available port if 3000 is occupied.

Run the test suite:

```bash
CI=true npm test -- --watch=false --maxWorkers=2
```

In Windows PowerShell, set the environment variable before running the test command:

```powershell
$env:CI = "true"
npm test -- --watch=false --maxWorkers=2
```

Create an optimized local build:

```bash
npm run build
```

Other repository checks:

```bash
npm run security:scan
npm run curate:validate
npm run test:curation
```

`npm run curate:featured` fetches public GitHub/Medium data, scores it, and rewrites the two generated data files; GitHub API access can be rate-limited without `GITHUB_TOKEN`. Add `--dry-run` to see the ranking report without writing files. Do not put credentials in frontend files or commit them.

## Source and Deployment Repositories

The configured Git remote is the source repository `pcodesdev/portfolio`. The live site `https://pcodesdev.github.io` is served by GitHub Pages from the **`main` branch of the separate repository `pcodesdev/pcodesdev.github.io`**, which holds the committed contents of `build/`. The generated `build/` directory is ignored by Git and is not part of a source push.

The [Curate and Publish Portfolio Content](.github/workflows/featured-content-curation.yml) workflow is the single automated deployment path: it curates content, runs every test and security gate, builds, and then publishes `build/` to that Pages repository with `scripts/deploy-live-site.mjs` (a plain, non-force push that is rolled back if the live site does not serve the new bundle). `npm run deploy` runs the same script for a manual deployment using your own Git credentials. See [Content curation and publication](docs/content-curation.md) for the required secret and operations.

`CNAME` in this repository specifies `ashutoshhathidara.com`, a template leftover that is not part of the build and is never deployed by the script; resolve it before relying on a custom domain.

The existing Node CI workflow is configured for `master` and `releases/*`, while the inspected working branch is `main`; confirm the intended CI branch triggers before relying on that workflow for a release.

## Content and Theme Configuration

- Profile, experience, project case-study, and skills content: `src/portfolio.js` and `src/profileData.js`.
- Categorized technology/tool icons: `src/technologySkills.js`.
- Curated repository/publication data: `src/shared/`.
- Theme palettes: `src/theme.js`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
