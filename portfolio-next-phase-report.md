# Portfolio Next Phase Report

Date: 2026-11-04  
Project: Peter Njuguna Portfolio  
Deployment: Not performed

## 1. Audit findings reviewed

Reviewed the current `portfolio-page-audit.md`, prior implementation report, current source, and rendered production build. Confirmed the following findings still existed before edits:

- Static HTML metadata contained unsupported “5+ years,” “2000+ participants,” and “Cloud Architect” claims.
- The Open Source route rendered hardcoded aggregate totals alongside stale mixed-author contribution snapshots.
- The Contact “See My Resume” button linked to the generic GitHub profile.
- The mobile menu was a hidden checkbox/label; repo cards and back-to-top were clickable non-semantic elements; social links and footer emoji lacked accessible names.
- The About biography image was the Pexels digital-learning photo.
- Person JSON-LD contained street/postal address data.
- Several pages contained peer sections marked as H1.
- Education labeled a Scrimba course under “Degrees Received,” included unverified course counts/attribution, and had incorrect Google Cloud alt text.

The existing worktree had substantial uncommitted changes and prior screenshots/reports. Those files were preserved. Edits in this phase were limited to the authorized About illustration and audit-supported improvements.

## 2. Illustration source and license

- Illustration: **Push to Production** from unDraw.
- Catalog: https://undraw.co/illustrations
- Source SVG retrieved from the catalog-observed CDN URL: https://cdn.undraw.co/illustration/push-to-production_6yhb.svg?type=svg (HTTP 200, `image/svg+xml`).
- Official license: https://undraw.co/license
- License terms checked on 2026-11-04: unDraw grants free personal and commercial use, including modification and distribution within a project, without required attribution. The license excludes redistribution as an asset pack or competing illustration service and prohibits AI/ML training use. This usage is a portfolio illustration, not a standalone asset product or AI training use.
- The SVG was saved locally and its four violet accent fills were recolored to the site blue. The asset remains vector and is approximately 8.8 KB.
- The page includes an optional source link and descriptive alt text. The artwork is explicitly described as an illustration, not a portrait of Peter.

## 3. About page changes

- Replaced the local Pexels photograph with `src/assests/images/push-to-production.svg`.
- Preserved the existing two-column biography layout on desktop and tablet.
- Kept the illustration’s near-square composition on desktop/tablet; it is contained within a landscape frame on mobile and stacks before biography text.
- Added image intrinsic width/height, lazy loading, asynchronous decoding, and meaningful alt text to prevent layout shift and support assistive technology.
- Removed the old unused Pexels photo asset.

## 4. Other audit recommendations implemented

### P0 credibility findings

- Updated `public/index.html` title, description, keywords, and Open Graph description to align with the approved portfolio positioning. Removed unsupported numeric experience/participant claims and the “Cloud Architect” title.
- Added matching Open Graph description and canonical URL output in `SeoHeader.js`.
- Removed the rendered Open Source aggregate cards/charts/detail snapshots from the route. Replaced the page with neutral copy and a direct GitHub profile link. Deleted the dead hardcoded stats component and stylesheet; stale bundled JSON remains unused and is not rendered.
- Replaced the Contact “See My Resume” button with an “Email Peter” mailto action. No CV is presented because an approved CV file/link was not supplied.

### Approved P1/P2 items

- Removed street and postal fields from public Person JSON-LD and from contact-page data.
- Converted mobile navigation to a native button with keyboard activation, `aria-expanded`, and `aria-controls`; it closes on navigation.
- Changed repository cards to native external anchors with safe target/rel attributes.
- Added accessible names to social links, footer heart, and back-to-top button; back-to-top is now a semantic button.
- Changed peer section headings to subordinate levels so each audited route has one H1.
- Made phone number an actionable `tel:` link.
- Reclassified the Education listing as “Academic & Professional Learning,” removed unverified Scrimba curation/mastery/count claims, and corrected Cloud Digital Leader alternative text.
- Added a Home “Meet Peter” link to About.

No Pemanju deployment/adoption/user/revenue/cloud-sync claims or career metrics were added. No role dates or unsupported responsibilities were edited. Pemanju remains prominent, but a public source/demo is not available in this repository; that gap is left for Peter to resolve.

## 5. Files modified

- `public/index.html`
- `src/portfolio.js`
- `src/components/seoHeader/SeoHeader.js`
- `src/pages/about/AboutComponent.js`
- `src/pages/profilePages.css`
- `src/assests/images/push-to-production.svg`
- `src/pages/contact/ContactComponent.js`
- `src/pages/opensource/Opensource.js`
- `src/containers/organizations/Organizations.js`
- `src/components/header/Header.js`
- `src/components/header/Header.css`
- `src/components/githubRepoCard/GithubRepoCard.js`
- `src/components/githubRepoCard/GithubRepoCard.css`
- `src/components/socialMedia/SocialMedia.js`
- `src/components/topButton/TopButton.js`
- `src/components/topButton/TopButton.css`
- `src/components/footer/Footer.js`
- `src/pages/projects/Projects.js`
- `src/containers/education/Educations.js`
- `src/containers/certifications/Certifications.js`
- `src/pages/education/EducationComponent.js`
- `src/containers/opensourceStats/OpensourceStats.js` (removed)
- `src/containers/opensourceStats/OpensourceStats.css` (removed)
- `portfolio-page-audit.md`
- `portfolio-next-phase-report.md`
- Refreshed desktop/tablet/mobile screenshots for all eight routes

## 6. Responsive QA results

Tested the About image at 1440px, 768px, and 390px:

| Viewport | Rendered image | Layout | Result |
|---|---:|---|---|
| 1440px desktop | 440×436px | Beside biography | Pass |
| 768px tablet | 280×277px | Beside biography | Pass |
| 390px mobile | 338×260px frame | Above biography | Pass |

The local SVG loaded successfully at every width, natural dimensions are 888×880, alt text is present, and no horizontal overflow was detected.

All eight routes (Home, About, Expertise, Featured Projects, Professional Experience, Education & Certifications, Open Source, Contact) passed direct route navigation and reload checks at 1440px and 390px. Each rendered a single H1, had no broken local images, and had no horizontal overflow. Tablet screenshots and About checks were captured at 768px.

The mobile menu opened using keyboard Space, exposed `aria-expanded="true"`, allowed About navigation, and closed after selection. Contact email and phone hrefs were verified as `mailto:njugunapm23@gmail.com` and `tel:+254702913043`. Five project repository cards rendered as anchors. Removed Open Source aggregate numbers were absent from the rendered route.

Screenshots are saved in the project root using `{page}-{desktop|tablet|mobile}.png`, for example `about-desktop.png`, `about-tablet.png`, and `about-mobile.png`.

Browser QA reported no app-level errors. Third-party AdSense may still emit a duplicate page-level-ads error, and browser analytics requests may be blocked; neither prevented application rendering.

## 7. Build and test results

- `CI=true npm run build`: passed; optimized production build compiled successfully.
- `npm test -- --watch=false`: passed, 1 test suite and 1 test. This is the existing mount/unmount smoke test only, not comprehensive regression coverage.
- Static production preview: all eight routes rendered under GitHub Pages-compatible hash routing; no deployment performed.
- CRA/Node emitted the existing `fs.F_OK` deprecation warning; build output otherwise succeeded.

## 8. Remaining P0/P1 issues

- No P0 implementation blockers identified from the reviewed audit after the approved fixes.
- P1 evidence/approval items remain: confirm career chronology, titles, and role attribution; verify degree/course/certification records; provide an approved Pemanju source/demo or confirm private/development status; decide which older repositories should remain featured.
- The live GitHub/LinkedIn/Hashnode profile ownership and all external credential links were not independently verified in this implementation pass.
- Broader accessibility work remains: contrast test actual theme/card combinations, review reduced-motion behavior, and test with screen readers. Current checks cover key keyboard routes and names, not a full WCAG audit.

## 9. Metrics requiring Peter’s approval

No numerical career, training, placement, satisfaction, budget, or project-adoption metrics were added. The following claims remain unpublished or flagged pending evidence:

| Claim | Evidence needed | Non-numerical alternative currently used |
|---|---|---|
| Participant/training totals | Dated source records, scope/period, unique-person definition, and individual/team attribution | “Supports digital-skills initiatives across Nairobi, Kakuma, and Dadaab.” |
| Years of experience/training | Verified date range and definition of what the duration measures | “Experience spans digital programme delivery, technical learning, and software development.” |
| GitHub contribution totals | Current attributable data source, author/scope rules, and retrieval date | “Browse Peter’s public repositories and current contribution activity directly on GitHub.” |
| Scrimba project/exercise counts | Course dashboard/transcript or provider record | “Practiced responsive layouts, component-based interfaces, and frontend workflows through course exercises.” |
| Programme outcomes or employment rates | Source document, measurement period, team/individual attribution, and Peter’s approval | Describe verified responsibilities without an outcome number. |

The removed values have not been copied into this report as approved metrics. A historical GitHub-profile observation is retained only in the audit as a dated, external note and must not be reused as a published portfolio claim without approval.

## 10. Recommendations for the next phase

1. Peter verifies role chronology/titles, degree/course dates, credential URLs, and the responsibility wording in About/Experience.
2. Peter provides or approves a public Pemanju repository/demo/artifact and confirms each implemented-versus-planned statement. Do not claim production deployment, commercial adoption, users, revenue, or cloud sync without evidence.
3. Peter decides which older projects best represent current work and confirms ownership of social profile destinations.
4. Conduct a broader contrast, reduced-motion, screen-reader, and external-link QA pass; add route/content/accessibility regression tests beyond the current smoke test.
5. Revisit static route-level search previews only if individual hash routes need distinct social cards.

No deployment was performed. No further work from the next phase should begin without approval where factual confirmation is required.
