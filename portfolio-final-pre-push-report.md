# Portfolio Final Pre-Push Report

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Repository: `pcodesdev/pcodesdev.github.io`  
Deployment: **Not performed. No push or deployment was authorized.**

## 1. Baseline Findings

- The worktree was already substantially modified before this phase. Existing changes were preserved; no reset, commit, push, or deployment was run.
- The current project JSON had six entries, but EduMetrics, Movie Watch List, and Task List used `image: null`. `GithubRepoCard` omitted the image element when the field was empty, leaving the cards with no media area or visual fallback.
- The shared social component rendered `fa-x-twitter` from a local Font Awesome 5.11.2 bundle. That release has no X brand glyph, so the pseudo-element rendered `content: none`; the empty icon slot also inherited old inline/relative positioning that caused misalignment.
- Projects and Medium cards already consumed checked-in JSON. A Medium-only fetch script refreshed a raw snapshot but did not score/cap/pin articles; there was no scheduled repository-curation workflow.
- Contact used FormSubmit AJAX for `njugunapm23@gmail.com`. First-use provider activation and real inbox delivery were still unverified.
- The repository contains a tracked private key at the `githubkey` path in its initial Git commit. The file was moved out of the working tree during this phase, but the key remains in Git history. Treat it as compromised until it is revoked and replaced.

## 2. Project Image Root Cause

The three named repositories had no usable image URL in their curated records, and the card component used a conditional that returned no image element for a null image. There was no fixed-size media wrapper, `onError` fallback, or placeholder. A failed remote screenshot could similarly leave a broken image.

## 3. Illustrations Created

Original vector artwork was created for the projects lacking appropriate checked-in screenshots:

- `public/images/projects/edumetrics.svg` — educational assessment dashboard, subject comparison, and learning insights.
- `public/images/projects/movie-watchlist.svg` — movie discovery/search and an organized saved collection.
- `public/images/projects/task-list.svg` — task entry, checklist states, sorting, and progress.
- `public/images/projects/project-generic.svg` — neutral reusable visual fallback for other featured projects.

The artwork is original, locally hosted, under 4 KB per file, uses a consistent 960×540 (16:9) viewBox, and does not rely on third-party copyrighted artwork.

## 4. Project Image Fallback Implementation

`GithubRepoCard` now always renders a stable 16:9 media slot. Image resolution proceeds through the repository image, its configured `fallbackImage`, the generic local illustration, and an accessible non-broken placeholder if all image requests fail. Card dimensions do not collapse during fallback. Images use `object-fit: cover`, lazy loading, and meaningful `alt` text.

The three target projects point to their specific custom illustration as the fallback. Other projects have the generic local fallback. In the live Projects page, all six current card images loaded successfully and displayed in 323×182 media areas. Automated tests exercised absent images, broken remote images, custom-to-generic fallback, and the terminal placeholder.

## 5. GitHub Curation Architecture

`scripts/curate-featured-content.mjs` discovers public repositories through GitHub REST API pagination, up to 100 repositories per page and ten pages. For a shortlist it gathers README content and language metadata, repository description/topics/update date/stars/forks/fork/archive/size data, README image references, and a bounded homepage availability check. Requests are limited to five shortlist repositories concurrently. The workflow supplies `GITHUB_TOKEN`; the script does not print it or write it into generated files.

README image URLs and repository homepage URLs receive bounded HEAD/GET availability checks before discovered references are promoted. Existing reviewed image references are retained with the UI fallback chain as protection.

The score is transparent and deterministic:

- Digital transformation and practical domain relevance: +3.
- Technical depth: +3.
- Full-stack relevance: +2.
- Cloud relevance: +2.
- Practical problem solving: +2.
- Substantive README, structured documentation, language/topic diversity, and repository size: small independent evidence points.
- Stars are capped at one point and cannot dominate the ranking.
- Tutorial/template content receives a strong penalty; forks, archived repositories, empty repositories, and boilerplate-only repositories without project metadata are excluded.
- Candidates below the minimum score are not selected. Fewer than six qualifying repositories are allowed.

The selected output includes ranking scores/reasons and verified GitHub metadata. Existing approved titles, descriptions, use cases, engineering focus, stack, and image references are retained through override/existing-data precedence. Pemanju Farm Manager remains the prominent static flagship case study above the generated repository grid; no unverifiable source repository was invented.

## 6. Current Featured Projects

The checked-in static dataset currently has six entries:

1. **EduMetrics** — assessment-data analytics, reporting, and a full-stack education workflow.
2. **React Movie App** — movie discovery and API/search-analytics sample.
3. **Weather Forecast and History** — server-side API-key handling and current, forecast, and historical weather sample.
4. **Movie Watch List** — OMDb search and browser-persisted watchlist learning project.
5. **Cart-Menu** — restaurant cart and simulated checkout demonstration.
6. **Task List** — interactive React task management and sorting project.

Project and publication rendering both use a shared six-item display limiter. The data validator rejects more than six records.

## 7. Medium Curation Architecture

The same curation runner reads Medium's public RSS feed, extracts title, canonical URL, date, excerpt, thumbnail, and full article text for ranking. Truncated feed titles are recovered from the matching content heading when available. The full article body is used for scoring but is not copied into the generated portfolio JSON.

Scoring rewards software engineering, digital transformation/skills, cloud and implementation, technology adoption/digital ecosystems, and technical/product analysis. Article relevance is not based only on recency. A minimum score is enforced, and the same six-item cap, pin, exclusion, metadata, and canonical-URL validation applies. The last valid checked-in dataset is not rewritten if either upstream fetch fails or generated metadata fails validation.

## 8. Current Featured Medium Articles

The current checked-in six are:

1. **Kenya Is #1 in AI Usage. That’s Not the Same as Winning.**
2. **You Haven’t Made a Real Decision in Three Weeks. Neither Have I.**
3. **Google Stitch Just Killed Figma**
4. **We Asked 81,000 People What They Really Want from AI. The Answers Will Surprise You.**
5. **The Silicon Savannah Mirage: Why Kenya’s Tech Darlings Keep Crashing and What It Tells Us About Africa’s Unique Ecosystem**
6. **Python Lists, Loops, and Sequences: A Complete Guide with Real-World Examples**

All six URLs are canonical `medium.com/@pcodesdev/...` links. The checked-in data remains unchanged by the latest blocked dry run; the new ranking should be reviewed in its generated PR before replacing this manually curated set.

## 9. Scheduling Configuration

`.github/workflows/featured-content-curation.yml` runs weekly on Monday at 08:17 UTC and supports `workflow_dispatch`. It has only `contents: write` and `pull-requests: write` permissions. It runs the secret-signature scan, curation generator, data validator, regression tests, and production build before opening/updating a review pull request.

The workflow does **not** deploy to GitHub Pages or push curated content directly to the production site. A person must review and merge the pull request.

## 10. Workflow Behavior and Run Results

The curation runner validates both upstream sources and all candidate data before writing. Each generated file is written through a temporary file and atomic rename, and unchanged item data is not rewritten. If a GitHub or Medium fetch fails, the commit callback is never invoked; regression tests cover this failure path.

A live dry run initially succeeded before the final ranking refinements. The later final-rule live run was blocked by the unauthenticated GitHub API rate limit (HTTP 403 on a repository languages endpoint). It made no data changes. The workflow uses its scoped `GITHUB_TOKEN`, but a successful scheduled/manual GitHub Actions run has not yet been observed. Therefore, the latest live project/article ranking is **not verified**; the checked-in six/six records remain in place.

## 11. Manual Override Configuration

`scripts/curation-overrides.json` supports:

- `pinnedProjects` and `pinnedPublications`, which appear first and are limited to six.
- `excludedProjects` and `excludedPublications`.
- Per-project custom `title`, approved `description`, `projectType`, `useCase`, `engineeringFocus`, `stack`, `image`, `imageAlt`, and `fallbackImage`.
- Per-publication fields under the publication-ID map, including approved title/description/image overrides.

Pin/exclude conflicts, missing pinned candidates, invalid output, and more than six pinned entries cause validation failure. EduMetrics is explicitly pinned. Pemanju Farm Manager remains in its separate flagship case-study section because no verified public GitHub repository was established.

## 12. Twitter/X Root Cause and Fix

The configured `fa-x-twitter` class did not exist in the bundled Font Awesome 5.11.2 brand font; browser inspection showed `::before { content: none }`. The shared social component now renders an explicit X-brand SVG for that link, retains the accessible `X-Twitter` link label and profile URL, and uses a fixed 42×42 flex-centered icon/hit area for all shared social links.

Home and Contact passed at 1440, 1024, 768, 390, and 360px (10 combinations). The SVG remained visible and contained in its link box, with the expected `https://twitter.com/pcodesdev` destination and no viewport overflow.

## 13. Contact Delivery Verification

The form remains configured to submit through FormSubmit to `njugunapm23@gmail.com`, with required Name, Email, Subject, and Message fields, email-format validation, a honeypot outside keyboard order, loading/disabled state, duplicate-submit guard, success/error status, and direct email fallback.

Automated tests cover invalid email, required controls, provider-accepted response, loading, duplicate prevention, provider failure, and fallback instructions. **No real message was sent and delivery is not verified.** Peter must approve FormSubmit's one-time activation email, then send a real test message and confirm it reaches the intended inbox. The success text reports provider acceptance, not confirmed email delivery.

## 14. Automated Regression Tests

Seven suites now cover:

- Curated project/article six-item limits and malformed metadata/URLs.
- Ranking relevance, tutorial/boilerplate penalties, pin/exclude behavior, and validate-before-commit failure behavior.
- Missing, invalid, and failed project images through custom/generic/placeholder fallback.
- Project and publication titles, summaries, links, canonical article data, and image alt text.
- Shared X icon markup, accessible name, profile URL, and external-link attributes.
- Contact required fields, email type/validity, loading, success, failure, and duplicate submission prevention.

## 15. Whole-Site Audit Findings

- Eight routes were checked at 1440, 1024, 768, 390, and 360 CSS pixels: 40/40 layout checks passed.
- No horizontal document overflow was found. All eight header links were present; desktop navigation remained on one row, and tablet/mobile navigation was collapsed by default.
- Six projects and six publications rendered. All six current project images loaded, including the three custom local illustrations.
- The X icon passed at the five required viewport sizes on both Home and Contact.
- A fresh browser route sweep observed no application-level runtime exceptions or console errors. The pre-existing `react-reveal` `componentWillReceiveProps` warning remains; local Google Analytics requests may be aborted by the browser/environment.
- Shared typography/color checks from `portfolio-pre-push-quality-audit.md` remain applicable. The profile continues to present Digital Transformation & Technology Solutions with Full-Stack Development and Cloud Solutions tracks. No unsupported career metrics were added.
- The integrated screenshot exporter has previously reset viewport dimensions after capture, so the responsive conclusion is from live DOM measurements rather than authoritative screenshot artifacts. A normal-browser visual review is still recommended.

## 16. Files Modified or Added

- `.gitignore` — ignore repository-local `githubkey`.
- `.github/workflows/featured-content-curation.yml` — scheduled/manual review-only curation workflow.
- `package.json` — curation and secret-scan commands.
- `scripts/check-no-secrets.mjs` — heuristic credential-signature scan.
- `scripts/curate-featured-content.mjs` — GitHub/Medium discovery, ranking, validation, and safe generation.
- `scripts/curation-overrides.json` — pins, exclusions, and approved content/media overrides.
- `src/shared/curationCore.cjs` and `src/shared/curationCore.test.js` — ranking, limits, validation, and safe-update core/tests.
- `src/shared/featuredItems.js` and `src/shared/featuredItems.test.js` — shared six-item display cap/tests.
- `src/shared/opensource/projects.json` — local custom illustration fallbacks and alt text.
- `src/shared/medium/publications.json` — current six checked-in articles.
- `src/portfolio.js` and `src/pages/projects/Projects.js` — shared publication/project caps and X icon config.
- `src/components/githubRepoCard/GithubRepoCard.js`, `.css`, and `.test.js` — fixed media, fallback chain, and tests.
- `src/components/publicationsCard/PublicationCard.test.js` — publication rendering test.
- `src/components/socialMedia/SocialMedia.js`, `.css`, and `.test.js` — explicit X SVG and fixed shared icon slots/tests.
- `src/pages/contact/ContactComponent.test.js` — form behavior tests.
- `public/images/projects/edumetrics.svg`, `movie-watchlist.svg`, `task-list.svg`, and `project-generic.svg` — original vector illustrations.
- `githubkey` — removed from the working tree and moved outside the repository; the tracked-file deletion is not committed.

## 17. Test Results

`CI=true npm test -- --watch=false --maxWorkers=2`:

```text
Test Suites: 7 passed, 7 total
Tests:       19 passed, 19 total
```

The existing Node `fs.F_OK` deprecation warning remains.

## 18. Build Results

`CI=true npm run build` completed successfully:

```text
Creating an optimized production build...
Compiled successfully.
The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
```

`npm run curate:validate` passed with six projects and six publications. The security-signature scan passed for current repository text and generated build output. The curation runner passed `node --check`, and the GitHub Actions workflow parsed successfully with the expected job and permissions. `package.json` has no separate lint script.

The security scanner is heuristic; it cannot detect every credential format or remove credentials from Git history.

## 19. Outstanding Issues and Required Approvals

1. **Private key exposure in Git history (P0 release blocker):** the tracked private key was present in the initial commit. Its working-tree copy is now outside the repository and the old path is ignored, but prior commits still contain the key. Revoke/rotate it immediately. Purge it from Git history using an owner-approved coordinated history rewrite; no push is safe before that security remediation.
2. **Real contact delivery unverified:** Peter must confirm FormSubmit activation and verify a real message arrives before treating delivery as operational.
3. **Final live curation run not verified:** the final dry run hit GitHub's unauthenticated API rate limit. Review a successful workflow-generated PR before accepting automated selections.
4. **Screenshot limitation:** perform or accept a normal-browser visual review before release.
5. **Remaining dependency warning:** React Reveal emits a deprecated lifecycle warning; it is not an application runtime error but should be replaced/upgraded ahead of a React major-version migration.
6. **No production analytics/ad verification:** local analytics/ad endpoint aborts do not establish production delivery.

No push or Pages deployment was performed. The generated workflow only proposes a pull request and cannot deploy the site.

## 20. Final Verdict

**FAIL — DO NOT PUSH.** The private key remains in Git history and must be revoked/replaced and removed through a coordinated history cleanup first. FormSubmit delivery and the final authenticated live-curation run also remain unverified. The passing tests/build do not override these release blockers.
