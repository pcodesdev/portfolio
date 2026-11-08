# Pre-Push Whole-Site Quality Audit

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Scope: local source, running development site, shared UI, eight routes, responsive behavior, accessibility checks, console/runtime checks, and build/test validation.  
Deployment: **Not performed. No push or deploy is authorized by this audit.**

## Executive Summary

The Contact page's Send Message button was present but visually washed out against the pale surface because it used a translucent color. It now uses the active theme's solid dark color with white text, has visible hover/focus/disabled states, follows the Message field, and remains inside the form at narrow widths.

Typography and semantic status colors now use shared tokens. Navigation, route metadata, theme-switcher keyboard behavior, chart summaries, project/publication surfaces, and several React/DOM warnings were addressed. Eight routes passed 40 in-page layout checks across 1440, 1024, 768, 390, and 360 CSS pixels. A fresh route sweep produced no application exceptions or console errors.

The site is not unconditionally push-ready: FormSubmit requires Peter's one-time activation and a real delivery check. The existing automated suite is only a single mount/unmount smoke test. The browser's analytics/ad requests can be aborted in this local environment, and the embedded screenshot tool does not preserve requested capture dimensions.

## Baseline Findings

- The worktree was already substantially modified before this audit. Those user changes were preserved; no reset, cleanup, push, or deployment was performed.
- Contact's submit button was rendered after Message but its translucent fill provided poor separation from the light page surface. The label appeared nearly invisible.
- Component styles used multiple legacy Google Sans family names that did not match the registered font-face family; the global body style also selected a system font.
- HashRouter keeps the browser pathname at `/`; route metadata based on pathname therefore could not distinguish portfolio routes.
- The header's list of links lacked a primary navigation landmark. Theme-menu state and keyboard dismissal/focus behavior were incomplete.
- Several user-facing surfaces used theme accents as card fills, weakening text contrast. Open Source status colors were inconsistent between cards and charts.
- Source/browser checks identified app-owned SVG attribute warnings, a BaseUI border warning, and missing Education list keys. These were corrected.
- The prior Projects/Experience/Contact phase report documents the curated content and its verification limits, including unavailable project demos and unconfirmed experience details.

## Changes Completed

### Contact and Form

- Replaced the translucent submit fill with the active theme's solid dark color and white text. Added hover, keyboard focus-visible, disabled, and loading presentation. The button has a 44px minimum height and fills the form width at mobile widths.
- Kept the form in native HTML form flow with required Name, Email, Subject, and Message fields, email type validation, a clipped non-required honeypot outside keyboard order, and an in-flight duplicate-submit guard.
- Added status/alert feedback and a direct email fallback for provider failure. The success message accurately says the provider accepted the request and notes that first-time activation is required.
- Tested that the Send Message control follows Message, can receive keyboard focus, is visible and within the form at 390px, and that an empty submit is stopped by native validation.
- Mocked provider acceptance/failure and duplicate-submit behavior in the previous implementation phase. **No real message was sent; FormSubmit delivery remains unverified pending Peter's confirmation email.**

### Shared Visual System

- Added shared body, heading, and display font variables and aligned component typography with the locally bundled Google Sans faces. Browser checks showed Google Sans computed for body/headings and the 400/500/700 files loaded.
- Added theme-derived text, background, border, primary, and focus colors plus shared semantic status colors. Kept status hues distinct from the pale-blue/navy identity.
- Updated project/publication card surfaces and Open Source status-card/chart styling to use readable theme surfaces and shared semantic colors.
- Measured representative foreground/background combinations in Blue, Minimal, and Dark themes; all sampled text combinations met WCAG AA contrast, with the lowest sampled ratio approximately 5.84:1.

### Shared Behavior and Accessibility

- Added a labeled primary navigation landmark and visible hover/focus contrast behavior. Existing responsive navigation remains collapsed by default below its breakpoint.
- Added theme-switcher expanded/controls/pressed state, Escape dismissal, and focus return to its trigger.
- Updated SEO title/description from the current hash route; the root canonical URL remains shared intentionally for this single-page application.
- Added accessible text descriptions to the Open Source chart regions.
- Fixed React SVG property casing, the BaseUI border shorthand/longhand warning, and Education list keys.
- Removed the explicit duplicate page-level AdSense initialization and unused external Font Awesome, Anime.js, and CanvasJS includes. Analytics, AdSense, and Iconify integrations still present in the page were not disabled to hide network messages.

## Route and Responsive QA

Routes checked: Home, About, Expertise, Projects, Experience, Education, Open Source, Contact.

Widths checked in the live DOM: 1440, 1024, 768, 390, and 360 CSS pixels (40 route/width combinations).

- Result: 40/40 checks passed. No document horizontal overflow or visible elements extending beyond the viewport were found.
- Desktop navigation stayed on one row; the primary navigation landmark was present on all routes.
- At 1024px and below, the mobile/tablet menu was collapsed by default and its toggle was available; all tested routes remained within the viewport.
- Contact's submit button remained visible and inside its form at 390px; the form switches to a single column on narrow screens.
- Route-specific title/description behavior, project/publication counts, and key links were checked in earlier implementation QA. See `portfolio-projects-experience-contact-report.md` for detailed content and demo-link findings.
- Keyboard checks covered navigation/theme controls and Contact form focus/validation. Automated screen-reader testing and a full WCAG audit were not performed.

### Screenshot Limitation

The integrated browser's screenshot action resets the live CSS viewport to approximately 404x252 after capture even when a wider viewport was requested. This makes its exported screenshots unreliable for pixel-accurate sign-off. Responsive conclusions above are based on live DOM geometry, not those screenshots. A normal-browser visual review is still recommended before release.

## Runtime and Console Audit

A fresh browser session visited all eight routes with listeners attached before navigation:

- Uncaught application exceptions: **none observed**.
- Browser console errors: **none observed**.
- Remaining React warning: `react-reveal` reports the deprecated `componentWillReceiveProps` lifecycle on `RevealBase`. This is dependency-originated and was not suppressed.
- Browser request failures observed in local testing: Google Analytics collection POST and Google's AdSense `pagead/ping` POST were aborted (`net::ERR_ABORTED`). They did not produce page exceptions. This local environment cannot establish production analytics/ad delivery.
- A `process is not defined` exception appeared during an earlier development hot update but did not reproduce during the clean route sweep. No evidence of a current reproducible route failure was found.
- No repeat of the duplicate AdSense initialization, invalid SVG attribute, BaseUI border, or Education key warnings was observed in the fresh route sweep.

## Validation

`CI=true npm test -- --watch=false`:

```text
PASS src/App.test.js
  √ renders without crashing

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

This is one mount/unmount smoke test, not broad behavior coverage. Contact interaction coverage described above was performed with browser validation and mocked provider responses in the prior implementation phase; no automated regression tests were added in this audit.

`npm run build`:

```text
Creating an optimized production build...
Compiled successfully.
The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
```

Both commands emitted Node's existing `fs.F_OK` deprecation warning. `package.json` has no lint script, so a separate lint command was unavailable. The optimized build and browser route checks passed; Lighthouse/Core Web Vitals and production network performance were not measured.

## Issue Register

### P0

- **Contact Send Message appeared invisible:** fixed. Root cause was a translucent fill with inadequate visual separation on the pale surface. The solid theme-dark fill, white label, and focus/hover/disabled styles are now in place. No unresolved P0 defect was observed in this audit.

### P1

- **Real Contact delivery is unverified:** FormSubmit requires Peter to approve its one-time activation email. After activation, send and confirm a real test message before representing the form as operational or approving a push that relies on it.
- **Automated regression coverage is thin:** the repository has only one smoke test. User-facing form states and keyboard interactions should be promoted into automated tests when the project test setup is next expanded.

### P2

- **`react-reveal` lifecycle deprecation:** dependency warning remains. It is not a current runtime failure, but the animation dependency should be upgraded or replaced before a future React upgrade.
- **Analytics/AdSense network behavior:** local requests were aborted by the browser/environment. Confirm deployed analytics and advertising integrations in an environment where those endpoints are reachable; do not treat local aborts as proof of production failure or success.
- **Visual screenshot sign-off:** integrated screenshot capture dimensions are unreliable. Perform a normal-browser visual review before release if pixel-level confirmation is required.
- **Experience facts need owner confirmation:** the previous report lists roles/dates and quantitative outcomes not supported by the structured source data. Keep those claims omitted until Peter confirms exact titles, organizations, dates, and metric definitions.

### P3

- **Portfolio source/demo scope:** some repository demos were unavailable and intentionally omitted; the Pemanju Farm Manager source repository was not publicly verified. The existing report records the specific checks. This audit did not exhaustively inspect every repository on the GitHub account.

## Required Approvals Before Push

- Peter confirms the FormSubmit activation email, then verifies one real delivery to the intended inbox.
- Peter reviews the documented experience/content limitations and approves any factual additions before they are published.
- Peter accepts that the current Jest suite is a smoke test and that local analytics/ad endpoint aborts were not production-verified.
- Peter performs or accepts the remaining normal-browser visual review limitation.
- Push and deployment still require a separate explicit authorization; this audit grants neither.

## Readiness Verdict

**PASS WITH LIMITATIONS — NOT APPROVED TO PUSH UNTIL PETER COMPLETES THE FORM ACTIVATION/DELIVERY CHECK AND APPROVES THE DOCUMENTED LIMITATIONS.**
