# Portfolio Quality Audit — EdTech Planning, SEO & Accessibility

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Scope: local source and development site only.  
Authorization: Local changes and tests only. **No commit, push, or deployment was performed.**

## 1. Baseline Findings

- The worktree was already substantially modified before this phase; all unrelated and previous-phase changes were preserved.
- The profile had the intended Digital Transformation & Technology Solutions identity and an EdTech/digital-learning delivery capability, but it did not disclose the proposed remote-area EdTech concept or its planning-only stage.
- The About narrative used third person for Peter, despite being a first-person portfolio. Some SEO fields appropriately use his name for identity/search.
- Expertise had four areas after the prior phase but did not distinguish EdTech implementation from conceptual product planning.
- Route-aware Helmet metadata existed, but its meta/canonical output was duplicated alongside the static HTML tags. Static canonical and Open Graph URLs used `pcodesdev.github.io`, while the repository's `CNAME` specifies `ashutoshhathidara.com`.
- `HashRouter` routes use URL fragments and are not independently crawlable server documents; unique route metadata is client-rendered only.
- Shared social icons were geometrically centered but did not explicitly suppress text decoration for every anchor state.
- The featured Pemanju case study described problem, solution, architecture, and planned features; it needed a clearer “My role” and current-status statement.

## 2. EdTech Planning Initiative

The About page now has a distinct **EdTech solution in planning** section. Its wording is first person and states that I am exploring accessible, resource-conscious digital learning approaches for remote and underserved learners affected by limited connectivity and limited access to learning hardware.

The status explicitly says it is planning/conceptual only, is not implemented or deployed, is not being used by learners, and has no claimed outcomes, adoption, architecture, partners, or timeline. This initiative is separate from FCA digital-skills programme implementation and from Pemanju Farm Manager.

## 3. About Page Changes

- Updated the biography to first person while retaining ICT education, FCA Kenya career progression, technical support/software work, and programme-delivery context.
- Kept the existing local unDraw illustration and its source attribution beside the biography.
- Added the planning initiative as a separate forward-looking section after the current programme-delivery description.
- Preserved the career journey and learner pathway without adding unsupported dates, numbers, outcomes, or platform features.

## 4. Expertise Page Changes

The page now differentiates five areas:

1. EdTech & digital learning implementation.
2. EdTech solution planning for underserved learners, with planning-stage status.
3. Digital skills & workforce development.
4. Full-stack development, grounded in Pemanju Farm Manager.
5. Cloud solutions, explicitly foundational, with cloud sync still planned.

The planning card does not present a completed technical design or platform. The implementation area describes supported learning/programme work and expressly avoids claiming a built EdTech platform.

## 5. Personal Identity and Pronouns

- About biography, programme description, value statement, Contact summary, and new case-study role text use first-person narration.
- Home retains the professional identity headline and `Peter Njuguna` as the page H1.
- Name references remain in SEO titles/descriptions, structured data, proper nouns, image alt text, attribution, and the footer where they serve identity or context.
- A source scan found the remaining “Peter Njuguna is…” in the SEO description intentionally; third-person biography narration was removed.

## 6. SEO Improvements Implemented

- Home/static title now reads **Peter Njuguna | Digital Transformation, Digital Skills & EdTech Kenya**.
- Home description describes the Kenya-based professional identity and specializations without outcome claims.
- Added a restrained keyword list based on the requested search phrases; no hidden text or keyword stuffing was added.
- Added unique title, description, keyword, Open Graph title/description, and Twitter title/description metadata for all eight existing routes.
- Helmet now reconciles with matching static tags; browser validation found one description, keyword set, canonical, Open Graph title/description, and Twitter title per rendered route.
- Aligned static canonical and social URL to the configured custom domain `https://ashutoshhathidara.com/`.
- Added Schema.org JSON-LD `WebSite`, `ProfilePage`, and `Person` graph nodes. The Person node uses existing name, current verified structured work entry, existing public contact, and credential data; it does not add awards, metrics, or unverified technical achievements.
- Added a route-scoped `CreativeWork` node for the Pemanju case study only. No `SoftwareApplication` claims or deployment status were invented.
- Updated `robots.txt` with an allow rule and sitemap directive; added `public/sitemap.xml` with only the homepage URL because hash fragments are not separate crawlable documents.
- Browser audit confirmed eight unique route titles, one description/keywords/canonical/Open Graph/Twitter tag set per route, one root canonical, valid JSON-LD graphs, and the `CreativeWork` node only on Projects.

### Technical SEO Limitations

The website was not deployed during this phase. Search engine access, indexing, ranking, Google Search Console verification, rich-result eligibility, and live social unfurl behavior are therefore **not confirmed**.

The app uses React `HashRouter`, so the route-specific Helmet tags are client-rendered after JavaScript loads. A crawler that does not render JavaScript may see only static homepage metadata. Hash fragments are not suitable as independent canonical URLs, so all route canonicals point to the root. A future SEO-focused change could add GitHub Pages-compatible prerendered route documents or static route-specific metadata without breaking hash routing; this was not introduced here.

## 7. Social Icon Underline and Alignment Fix

Social anchors now set `text-decoration: none` inline, and the stylesheet explicitly covers `:link`, `:visited`, `:hover`, `:focus`, `:focus-visible`, and `:active`. Nested icon and SVG elements also suppress decoration. The keyboard focus outline remains present and unchanged.

The previously corrected 42×42 flex-centered icon slots and custom X SVG remain in place. The X destination is `https://twitter.com/pcodesdev`, and its accessible label remains `X-Twitter`.

Browser checks at 1440, 1024, 768, 390, and 360px on both Home and Contact measured 10 X-icon combinations. All were centered, contained, underline-free, and free of viewport overflow. A fresh keyboard tab sequence reached X with `:focus-visible`, a solid 2.4px focus outline, no underline, and the correct profile URL. Hover was checked in the dark theme; the icon stays white on the dark brand surface. No screenshot was accepted as a substitute for these live DOM checks.

## 8. Accessibility and Quality Review

- Existing social links retain accessible names and secure external-link attributes.
- Shared icon links keep keyboard focus outlines while underlines are suppressed.
- `prefers-reduced-motion: reduce` now disables or substantially reduces global animations, transitions, and smooth scrolling.
- Contact has labeled required fields, email type validation, a provider loading state, and success/error feedback; actual delivery remains unverified.
- The About illustration retains meaningful alt text and visible attribution.
- The eight routes were checked at 1440, 1024, 768, 390, and 360 CSS pixels: 40/40 layout checks passed with no horizontal overflow. All eight header links were present; desktop navigation remained on one row and mobile navigation was collapsed by default.
- A fresh route sweep observed no application `pageerror` or console error. The existing React Reveal lifecycle deprecation warning remains. Google Analytics POST requests were aborted locally (`net::ERR_ABORTED`).

## 9. Project Case Study and Evidence Review

Pemanju Farm Manager remains the flagship case study. It now has explicit **My role** and **Current status** cards. My role is grounded in the existing Full-Stack Developer record at Pemanju IT Consulting Services. The status identifies offline-first local records and spreadsheet workflows as implemented, and Supabase/PostgreSQL synchronization and expanded deployment as planned, not deployed.

The separate EdTech concept is not represented as a product or completed project. Existing unavailable demo links, source repository limitations, and content approval requirements remain documented in `portfolio-final-pre-push-report.md`.

## 10. Contact Verification

The form remains configured for FormSubmit and `njugunapm23@gmail.com`. Automated tests cover validation, loading, duplicate prevention, provider acceptance/error, and email fallback behavior. **No real message was sent; provider activation and inbox delivery remain unverified.** Do not describe the form as delivery-verified until the provider activation and real inbox test are completed.

## 11. Test Results

`CI=true npm test -- --watch=false --maxWorkers=2`:

```text
Test Suites: 9 passed, 9 total
Tests:       27 passed, 27 total
```

The suite includes profile/claim tests, the About planning integration, the social link contract, contact states, project image fallback, publication rendering, curation validation, and the original App smoke test.

## 12. Build Results

`CI=true npm run build` completed successfully:

```text
Creating an optimized production build...
Compiled successfully.
The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
```

The existing Node `fs.F_OK` deprecation warning remains. No lint script exists in `package.json`. Sitemap/robots host consistency was checked locally. **The build homepage setting still targets `https://pcodesdev.github.io`, while `CNAME` specifies `ashutoshhathidara.com`; this should be reconciled before deployment** so asset URLs and canonical host agree. No public deployment, indexing, Lighthouse, Search Console, or Core Web Vitals measurement was performed.

## 13. Remaining Warnings, Blockers, and Limitations

- **Private-key history exposure remains a release blocker.** The private key was present in Git history. Its working copy was moved outside the repository and the filename is ignored, but history still contains it. Revoke/rotate it and coordinate history cleanup before any push.
- **Contact delivery remains unverified** pending FormSubmit activation and a real inbox test.
- **SEO remains deployment-dependent.** Unique client-rendered metadata is implemented, but actual indexing, rich results, and social previews cannot be verified locally. HashRouter pages share one root canonical by design.
- **React Reveal emits a deprecated lifecycle warning.** A future dependency replacement/upgrade is recommended; it was not broadened into this task.
- **Analytics requests abort in the local browser environment.** Production analytics behavior is unknown.
- The security scan is heuristic and cannot guarantee detection of all secrets or erase historical credentials.

## 14. Prioritized Remaining Improvements

1. Revoke/replace the historical private key and perform owner-approved Git history cleanup before any push.
2. Complete FormSubmit activation and verify a real message reaches the intended inbox.
3. After deployment authorization, configure/verify the custom domain, inspect live crawlable HTML, submit the sitemap in Search Console, and verify social previews.
4. Consider static prerendering for About, Expertise, Projects, Experience, Education, Open Source, and Contact if search visibility for individual sections is important.
5. Replace or upgrade React Reveal in a separately tested maintenance change.
6. Confirm any remaining role titles/dates/outcomes with Peter before adding factual career details.
7. Reconcile the CRA `homepage` field/build asset base with the CNAME custom domain before the next authorized deployment.

## 15. Final Quality Assessment

**Quality score: 8/10 for the local implementation; not a 10/10 release-ready portfolio yet.** The local code now presents a coherent first-person story, distinguishes EdTech delivery experience from a planning-stage remote-area concept, keeps technical/cloud claims evidence-based, has unique route metadata and structured data, and passes automated and browser layout checks. A higher score is not justified until the historical private key is revoked and removed through coordinated history cleanup, the CNAME/build-host mismatch is corrected, FormSubmit delivery is verified, and deployed SEO/indexing and performance behavior are tested on the public domain.

## Final Verdict

**PASS WITH LIMITATIONS.** The requested local enhancements and validation pass. This does **not** authorize a commit, push, or deployment. The documented private-key history exposure, CNAME/build-host mismatch, and unverified contact delivery remain blockers before release.
