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
- Curated project/article data, local image fallbacks, route-aware metadata, and a review-only featured-content workflow.
- An Open Source Contributions overview with four summary cards, CSS doughnut distributions, status legends, and author-filtered PR/issue records. Its bundled GitHub REST snapshot reports 307 public repositories, 6 author-matched pull requests (3 merged, 3 open), and 14 issue-search matches (12 rows returned). Stars/forks are summed only across repositories owned by `pcodesdev`; commit-search matches are not presented as contribution-calendar totals. Values show retrieval freshness, and the optional server endpoint can refresh the snapshot.
- A portfolio-wide **Ask My Portfolio** entry point on every route. Local keyword retrieval combines the curated public-content allowlist in `src/search/knowledge-base.json` with normalized GitHub snapshot records, returning source links and a no-match state. Aggregate GitHub questions prioritize verified profile totals; repository questions include author-filtered PR evidence. AI generation is not operational until the optional server endpoint is deployed/configured and end-to-end verified; deployments may set the non-secret `window.PORTFOLIO_SEARCH_ENDPOINT` before the app bundle loads.
- A FormSubmit contact form with validation and provider-status messaging. First-use activation and real inbox delivery have not been verified.

## Technology Stack

- React 16 and JavaScript, bootstrapped with Create React App (`react-scripts` 3.2.0).
- React Router DOM 5 with `HashRouter` for client-side routes.
- CSS, CSS variables, and component styles using `styled-components` 5; Base Web and Styletron are also used.
- React Helmet for route-aware metadata.
- Iconify's browser runtime with Simple Icons, Logos, and Material Design Icons; Font Awesome assets are bundled locally for existing social and interface icons.
- React Bootstrap components, including overlay/tooltip support in existing skill UI.
- Chart.js 2 and `react-chartjs-2` remain available for existing chart components; the Open Source distribution rings are CSS-rendered.
- Node.js scripts use `node-fetch` and `dotenv` for content tooling. `gh-pages` is installed as a development dependency for the existing deploy script.

## Project Status

### Implemented and Locally Validated

- The eight portfolio routes, responsive layouts, themes, categorized expertise icons, AI Engineering & Implementation positioning, Project Management content, and motion/reduced-motion behavior.
- Open Source panels preserve the requested contribution-summary layout. PR/issue records are filtered by author login `pcodesdev`; issue search reports 14 matches but currently returns 12 records. The contribution calendar remains unavailable without authenticated GraphQL access. Snapshot retrieval time and cached/stale state are shown in the UI.
- Ask My Portfolio local retrieval and the server-side AI endpoint contract are implemented; hosted provider responses remain unconfigured and unverified.
- Latest verified automated validation: 24 test suites and 84 tests passed. `npm run curate:validate` validated 6 featured projects and 6 publications; `npm run security:scan` found no common key/token signatures in repository or built text (Git history is not scanned).
- Latest verified production build: `npm run build` compiled successfully. The build assumes `https://pcodesdev.github.io` as its public URL.

### Implemented but Requiring External Verification

- FormSubmit activation and successful delivery to the intended inbox.
- Public impact metrics, which require source, period, denominator, and attribution confirmation.
- Pemanju Farm Manager implementation claims and outcome evidence; a public repository/demo or approved project artifact has not been verified in this workspace.
- Every item in the wider technology/tool inventory should be reviewed for the intended level of familiarity before publication.
- Automated curation has not yet been verified through a successful authenticated workflow run.

### Planned or Recommended

- An end-to-end AI search deployment is still pending. The React feature uses local keyword retrieval by default and can call an optional URL configured through `window.PORTFOLIO_SEARCH_ENDPOINT`; `api/ask.js` requires server-side provider credentials, an allowed origin, and durable rate-limit storage. No provider response has been verified. See [AI search implementation and feasibility](portfolio-ai-search-feasibility.md).
- Consider separating courses from academic degrees and adding approved, verifiable case-study artifacts.
- Plan a separately tested migration from the legacy CRA 3 toolchain and resolve outstanding dependency advisories.

### Security and Publication Blockers

- A private key was present in Git history. Its repository-local copy was removed, but the historical commit must be addressed: rotate/revoke the key and coordinate an approved history cleanup before any push.
- `npm audit` reports 184 advisories (9 low, 127 moderate, 43 high, 5 critical). A successful build does not resolve these findings.
- `CNAME` specifies `ashutoshhathidara.com`, while the package `homepage` and build asset base target `pcodesdev.github.io`.
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
```

`npm run curate:featured` fetches public GitHub/Medium data to generate review candidates; GitHub API access can be rate-limited without `GITHUB_TOKEN`. Do not put credentials in frontend files or commit them.

## Source and Deployment Repositories

The configured Git remote is the source repository `pcodesdev/portfolio`. The generated `build/` directory is ignored by Git and is not part of a source push. The featured-content GitHub Actions workflow runs tests/build checks and opens a review pull request; it explicitly does not deploy the site.

The package also defines `npm run deploy`, which builds the site and publishes `build/` to a `gh-pages` branch on the configured remote. It is **not** a separate deployment-repository configuration, and no separate deployment remote is configured in this checkout. Do not run that script for a source-only release or until the deployment repository/target and the `CNAME`/`homepage` mismatch have been resolved and approved. No deployment is performed by the setup, test, or build commands above.

The existing Node CI workflow is configured for `master` and `releases/*`, while the inspected working branch is `main`; confirm the intended CI branch triggers before relying on that workflow for a release.

## Content and Theme Configuration

- Profile, experience, project case-study, and skills content: `src/portfolio.js` and `src/profileData.js`.
- Categorized technology/tool icons: `src/technologySkills.js`.
- Curated repository/publication data: `src/shared/`.
- Theme palettes: `src/theme.js`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
