# Portfolio Medium, Open Source, and Navbar Report

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Deployment: **Not performed**

## 1. Summary

The working tree was already broadly modified when this task began. It already contained the Open Source copy and data changes, Medium social/publication integration, and shared desktop flex navigation rules. I verified those changes and made two additional code edits during this task:

1. Renamed the Open Source metric from "Issues Resolved" to "Issues Closed" because the snapshot verifies issue state, not resolution cause.
2. Moved the shared Header outside Home's `.container` margin wrapper so it aligns with the shared header on the other routes.

The contribution figures are derived from the checked-in GitHub snapshots. No contribution count was hand-written or invented. A full-size Open Source screenshot pair was already present in the worktree; the browser capture API could not produce replacements at the requested dimensions. Tests and the production build were run. Nothing was deployed.

## 2. Open Source page

### Copy

- The existing page introduction in `src/containers/organizations/Organizations.js` describes the contribution areas represented by the tracked data: web development, application functionality, accessibility, documentation, and troubleshooting.
- The Pull Requests explanation in `src/containers/pullRequests/PullRequests.js` describes responsive-layout, accessibility, documentation, and maintenance work.
- The Issues explanation in `src/containers/issues/Issues.js` describes bug reports, enhancement requests, deployment/authentication problems, and documentation improvements.
- Kept the existing "View current GitHub profile" link and centred it with the page content.

### Preserved design

`src/pages/opensource/Opensource.js` retains the existing page structure:

- Organizations / Open Source Profile header
- Summary statistics cards
- Contributions section with Pull Request Distribution and Issue Distribution doughnut charts
- Pull Requests card list
- Issues card list
- Footer and back-to-top button

The pale-blue page background, card borders, green/red/purple status colours, and responsive card layout are preserved.

### Statistics and data sources

The cards in `src/containers/opensourceStats/OpensourceStats.js` read from the JSON snapshots rather than hardcoded values:

| Card | Value | Derivation |
|---|---:|---|
| Total Contributions | 18 | 6 pull requests + 12 issues tracked in the snapshots |
| Pull Requests | 6 | `pull_requests.json` `totalCount`; description shows 3 merged and 3 open |
| Issues Closed | 9 | `issues.json` `closed`; description shows 9 of 12 tracked issues closed |
| Stars Earned | — | Not available from the tracked contribution data |

Snapshot refreshes on 2026-11-04 used the public GitHub REST search API filtered to author `pcodesdev`:

- `src/shared/opensource/pull_requests.json` — 6 authored pull requests: 3 open, 3 merged, 0 closed.
- `src/shared/opensource/issues.json` — 12 public authored issues: 3 open, 9 closed.

The issue search endpoint reported `total_count: 14` but returned 12 publicly visible items. The snapshot contains the 12 items the API returned; non-public items cannot be represented. This limitation is recorded rather than filled with inferred numbers.

### Stars Earned — approval required

The Stars Earned card is retained only to preserve the four-card layout. It shows `—` and the text "Not available from the tracked contribution data".

A reliable "stars earned" figure is not available from the tracked pull-request/issue snapshots. Peter must choose one of these options before the card can carry a number:

1. Supply an approved source or definition for stars earned, or
2. Approve removing the Stars Earned card and using a three-card layout.

No star count was estimated or invented.

## 3. Medium social link

`src/portfolio.js` now includes Medium in `socialMediaLinks`:

- Name: `Medium profile`
- URL: `https://medium.com/@pcodesdev`
- Icon: `fa-medium` in the same Font Awesome circle treatment as the other social icons
- Background: `#000000`
- Rendered as an external link with `target="_blank"` and `rel="noopener noreferrer"`
- Accessible name: `Medium profile`

Verified in the rendered homepage DOM: six social links render, the Medium link uses `fab fa-medium`, and its href/target/rel/`aria-label` are correct.

## 4. Medium publications replacing Hashnode

### Implementation

- Added `scripts/fetch-medium-publications.mjs`, a dependency-free Node script.
- It reads `https://medium.com/feed/@pcodesdev`, extracts each item's title, canonical URL, publication date, and first paragraph, strips HTML, and writes `src/shared/medium/publications.json`.
- Added `npm run fetch:medium` to `package.json`.
- `src/portfolio.js` imports the generated JSON as `publications`, and the publications heading now reads "Medium Publications".
- The Contact page blog section links to the Medium profile and describes Medium articles.
- `src/components/publicationsCard/PublicationCard.js` is now a semantic external anchor instead of a clickable `div`. It keeps the existing card styling and adds an explicit `aria-label`.
- `src/pages/projects/Projects.js` renders all ten publications with stable React keys.
- Hashnode data, icons, and publication references were removed from live code. The only remaining Hashnode mentions are inside historical audit/report Markdown files, which were left unchanged as records.

### Publications currently rendered

All ten items below come from the official Medium RSS feed. Titles, dates, and URLs were not rewritten by hand.

1. 2026-09-14 — [The Spectacular Collapse of NFTs and What It Reveals About Human Psychology, Tech, and Finance](https://medium.com/@pcodesdev/the-spectacular-collapse-of-nfts-and-what-it-reveals-about-human-psychology-tech-and-finance-941162923c7c)
2. 2026-08-31 — [Kenya Is #1 in AI Usage. That’s Not the Same as Winning.](https://medium.com/@pcodesdev/kenya-is-1-in-ai-usage-thats-not-the-same-as-winning-9d5541ff07cb)
3. 2026-08-17 — [You Haven’t Made a Real Decision in Three Weeks. Neither Have I.](https://medium.com/@pcodesdev/you-havent-made-a-real-decision-in-three-weeks-neither-have-i-a1f11e71b572)
4. 2026-03-23 — [Google Stitch Just Killed Figma](https://medium.com/@pcodesdev/google-stitch-just-killed-figma-d034b296f60b)
5. 2026-03-19 — [We Asked 81,000 People What They Really Want from AI. The Answers Will Surprise You.](https://medium.com/@pcodesdev/we-asked-81-000-people-what-they-really-want-from-ai-the-answers-will-surprise-you-7ba11301334b)
6. 2026-02-28 — [I Saw a Tweet That Stopped Me Cold, And Then I Couldn’t Sleep](https://medium.com/@pcodesdev/i-saw-a-tweet-that-stopped-me-cold-and-then-i-couldnt-sleep-6b64edef8323)
7. 2026-02-15 — [OpenClaw: The Lobster That’s Eating Silicon Valley’s Lunch (And Your To-Do List)](https://medium.com/@pcodesdev/openclaw-the-lobster-thats-eating-silicon-valley-s-lunch-and-your-to-do-list-803c4e69d641)
8. 2026-02-01 — [The Silicon Savannah Mirage: Why Kenya’s Tech Darlings Keep Crashing and What It Tells Us About…](https://medium.com/@pcodesdev/the-silicon-savannah-mirage-why-kenyas-tech-darlings-keep-crashing-and-what-it-tells-us-about-7d9441d0b6c6)
9. 2026-01-24 — [Python Lists, Loops, and Sequences: A Complete Guide with Real-World Examples](https://medium.com/@pcodesdev/python-lists-loops-and-sequences-a-complete-guide-with-real-world-examples-5bd7fcc85208)
10. 2026-01-16 — [Python Basics: The Complete Beginner’s Guide to Programming in 2026](https://medium.com/@pcodesdev/python-basics-the-complete-beginners-guide-to-programming-in-2026-a0fedf8fe6f7)

Validation results:

- 10 items, 10 unique URLs, no missing titles/descriptions/dates.
- Every URL starts with `https://medium.com/@pcodesdev/`.
- Every rendered card is an `A` element with `target="_blank"` and `rel="noopener noreferrer"`.
- Dates render as `Published on YYYY-MM-DD`.

The current feed was inspected and the ten checked-in article records matched its titles, publication dates, and canonical URLs. The static JSON snapshot means the site does not depend on a live third-party request at render time. Individual article pages were not opened during this test pass.

## 5. Navbar alignment fix

### Root cause

The Open Source route itself did not apply a special width or offset. The route-to-route horizontal shift came from Home: `HomeComponent` placed the shared Header inside `.container`, and `HomeComponent.css` gives that wrapper `margin: 0 1rem`. Other routes render the same Header without that parent margin. At 1440px, the live header's left edge measured about 86px on Home versus 71px on Open Source and the other routes.

The supplied older screenshot also showed a two-row desktop menu. At inspection time, the already-modified, uncommitted `Header.css` in the working tree used a desktop flex row and `white-space: nowrap`; the live app rendered its eight navigation links on one line. That shared CSS was retained rather than duplicated or overridden for Open Source.

### Fix

The Home layout now renders the shared Header as a sibling of the `.container` used for Greeting, Footer, and TopButton. This removes the Home-only horizontal margin from the header without changing the shared navigation design or mobile menu. Existing desktop flex rules and mobile hamburger behavior were left intact.

### Measured result

| Viewport | Routes checked | Result |
|---|---|---|
| 1440px | Home, About, Expertise, Featured Projects, Professional Experience, Education, Open Source, Contact | Header bounds match (`x=71..1354`); all 8 links share one top position; no horizontal overflow |
| 390px | Same 8 routes | Menu collapsed by default; document width does not exceed viewport; hamburger opens and selecting About changes route and closes it |

On direct access and refresh of `/#/opensource`, the Open Source page and shared header rendered. The mobile menu was explicitly opened on Open Source, then an About link was selected; `aria-expanded` returned to `false`.

## 6. Responsive and route QA

Tested with headless Edge over CDP at 1440×900 and 390×844 using the application's hash routes.

| Route | 1440px H1 | Content verified | 390px overflow | Header |
|---|---|---|---|---|
| `/#/home` | Peter Njuguna | 6 social links including Medium | None | Single-line desktop / hamburger mobile |
| `/about` | Technology grounded in people and practice | Page rendered | None | Pass |
| `/expertise` | Capabilities in practice | Page rendered | None | Pass |
| `/experience` | Experience | Page rendered | None | Pass |
| `/education` | Education | Page rendered | None | Pass |
| `/opensource` | Open Source Profile | 4 stat cards, 6 PR cards, 12 issue cards, 2 charts | None | Pass |
| `/projects` | Featured Projects | 10 Medium publication cards | None | Pass |
| `/contact` | Contact | Page rendered | None | Pass |

At 390px, the collapsed menu state and overflow were checked on every listed route. The menu was opened on Open Source and then an About link was selected; it closed and navigated successfully.

### Screenshots

Full-size reference captures available in the project root:

- [opensource-desktop.png](opensource-desktop.png)
- [opensource-mobile.png](opensource-mobile.png)

These show the preserved page layout, background, metric cards, charts, and mobile stacking. They predate the final "Issues Closed" wording change, so the third card in the screenshots reads "Issues Resolved". Fresh captures were attempted as `opensource-validation-desktop.png` and `opensource-validation-mobile.png`, but the browser tool resized its viewport after capture (1440px became 404px; 390px became 116px). Those validation images are not representative screenshots and should not be used as release evidence.

## 7. Console and accessibility notes

The browser showed no new errors attributable to the two edits. Existing runtime messages observed during route checks include:

- AdSense: `TagError: adsbygoogle.push() error: Only one 'enable_page_level_ads' allowed per page.` — third-party script, does not block rendering.
- `react-reveal`: React `componentWillReceiveProps` deprecation warning.
- Projects: invalid SVG DOM property warnings for `stroke-miterlimit` and `fill-rule` in existing illustration/card SVGs.
- Analytics requests to Google Analytics failed in the local browser session.

Accessibility improvements in the changed areas:

- Publication cards are native external anchors with meaningful accessible names.
- The Medium social link has an accessible name and safe external-link attributes.
- The mobile menu uses a native button with expanded state and closes after navigation.

## 8. Build and test results

`npm test -- --watch=false` with `CI=true`:

```text
PASS src/App.test.js
  √ renders without crashing

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.496s
Ran all test suites.
EXITCODE=0
```

This is the existing mount/unmount smoke test, not comprehensive regression coverage.

`npm run build`:

```text
Creating an optimized production build...
Compiled successfully.

The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
EXITCODE=0
```

The build emitted Node's `fs.F_OK` deprecation warning and compiled successfully.

## 9. Files changed and pre-existing worktree changes

Code files edited during this task:

- `src/containers/opensourceStats/OpensourceStats.js` — metric wording changed to "Issues Closed".
- `src/pages/home/HomeComponent.js` — shared Header moved outside the Home content-margin wrapper. The Skills removal in this file was already present and was preserved.
- `portfolio-medium-opensource-report.md` — this report updated to reflect verified work and results.

The following implementation surfaces already had uncommitted changes at task start and were preserved: `src/components/header/Header.css`, `src/components/header/Header.js`, `src/containers/organizations/Organizations.js`, `src/containers/pullRequests/PullRequests.js`, `src/containers/issues/Issues.js`, `src/portfolio.js`, `src/components/socialMedia/SocialMedia.js`, `src/pages/projects/Projects.js`, `src/components/publicationsCard/PublicationCard.js`, `src/shared/opensource/pull_requests.json`, and `src/shared/opensource/issues.json`. The Medium feed snapshot, fetch script, package changes, and screenshots also exist in the working tree; they were validated but not created by this task.

The worktree still contains earlier uncommitted changes from previous phases. None of them were reverted.

## 10. Remaining approvals and limitations

1. **Stars Earned card** — approve a source/definition or approve removing the card. It currently shows `—`.
2. **Medium link verification** — all ten links and metadata matched the public RSS feed and are canonical `@pcodesdev` URLs; browser checks confirmed the rendered hrefs and new-tab attributes. Individual article page navigation was not performed in this test pass.
3. **Issue count discrepancy** — GitHub search reported `total_count: 14` but returned 12 public items. The rendered count reflects only the 12 public items.
4. **Screenshots** — fresh viewport captures are limited by the browser tooling resize noted above; use updated screenshots from a normal browser capture before release.
5. **Deployment** — not performed, pending Peter's authorization.
