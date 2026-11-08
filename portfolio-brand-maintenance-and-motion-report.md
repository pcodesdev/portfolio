# Portfolio Brand Maintenance and Motion Report

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Scope: local code, package, and browser validation only.  
Authorization: **No commit, push, or deployment.**

## 1. Experience Cleanup

Removed the November–December 2017 Kenya Power IT Technical Support Specialist entry from the live experience data in `src/portfolio.js`, including its description. The January–March 2021 ICT Technical Associate role remains separate, with its role-specific 50+ staff training and reported 30% digital-tool adoption improvements intact.

A regression test now checks that the 2017 KPLC title is absent while asserting the 2021 KPLC company, dates, and achievements. The live Experience route was checked with its work accordion expanded: the 2021 role is present and the removed role is not.

The repository also contains an unreferenced legacy `src/shared/experience_data.json` template and a commented example in the Experience page with an unrelated Android Developer record dated 2017. Neither is used by the live route; these were left untouched rather than modifying unrelated historical content.

## 2. Dependency Maintenance

| Package | Installed/current state | Finding and action |
| --- | --- | --- |
| `react-reveal` | Removed | Replaced the 30 live source/test references with the local CSS motion adapter. Its `RevealBase` emitted React's deprecated `componentWillReceiveProps` warning. The package was not marked deprecated by npm; replacement addresses the observed lifecycle warning without adding another animation dependency. |
| `apollo-boost` | Removed | The only import was in an unreferenced legacy project container. The routed Projects page does not import it. Removed the direct dependency and lockfile entries; left that legacy source file untouched. |
| `gh-pages` | 6.3.0 (was 2.2.0) | Updated the deployment helper as a scoped maintenance change. npm reports the new version supports Node >=10. Its previous direct critical advisory is no longer present. The deploy command was not run. |
| `react-is` | 16.13.1 | Pinned to the available React-16-compatible version; `16.14.0` was not published in the registry. |
| `react`, `react-dom` | 16.14.0 | Kept aligned at the final React 16 patch. React 19 is a major migration and was not attempted with CRA 3.2. |
| `react-scripts` | 3.2.0 | Direct high-severity audit finding. npm's proposed fix is `react-scripts@5.0.1`, a semver-major CRA migration. Deferred so its webpack, Jest, Node, and build changes can be handled and tested as a separate migration. |
| `react-router-dom` | 5.3.4 | Kept on v5 to match the current `HashRouter` application; v7 is a major API migration. |
| `baseui` | 9.116.3 | Kept stable; current latest reported by `npm outdated` is 18.2.0, a major jump. |
| `chart.js` / `react-chartjs-2` | 2.9.4 / 2.11.2 | Kept as a compatible pair used by the open-source charts. Current latest major lines are Chart.js 4 and react-chartjs-2 5; upgrade together with chart regression coverage. |
| `styled-components` | 5.3.11 | Kept on v5; v6 is a major upgrade and was not mixed into this focused maintenance pass. |
| `node-fetch` | 2.7.0 | Kept on v2 for the current Node scripts; v3 is ESM-only and would require script-level changes. |

`npm outdated` lists additional direct packages with newer major releases, including `react-bootstrap`, `dotenv`, `husky`, `lint-staged`, and `prettier`. No blanket update was applied. The project has no lint script.

### Security Audit

After the scoped dependency changes, `npm audit` reports **184 vulnerabilities: 9 low, 127 moderate, 43 high, and 5 critical**. `react-scripts@3.2.0` is the direct package reported at high severity; the critical and most other findings are in the legacy transitive build-tool tree. Removing `apollo-boost` did not change the aggregate audit counts. The audit remains a release concern; this report does not characterize the transitive findings as harmless or fixed. Avoid `npm audit fix --force` because its proposed changes cross major-version boundaries.

## 3. Motion System

Replaced React Reveal with `src/components/motion/Reveal.js` and `reveal.css`, the module used by the application. An extra duplicate adapter was found during validation and removed so the tests exercise the actual live import path.

The adapter preserves the child root element and its existing class/style, adds no layout wrapper, supports the current Fade/Flip direction props, and caps requested duration at 380ms. Motion is intentionally restrained: up to 5px directional movement or a 0.99 scale, with a short ease-out. The `prefers-reduced-motion: reduce` rule removes animation and restores opacity/transform.

`src/components/motion/Reveal.test.js` checks child/layout preservation, style merging, direction classes, and the duration cap. Browser emulation confirmed computed `animation-name: none` and `animation-duration: 0s` with reduced motion enabled. No `react-reveal` imports or package references remain in source/package manifests.

## 4. Brand and Favicon

The header uses the PN monogram SVG. `public/index.html` and `public/manifest.json` use the matching `public/icons/pn-monogram.svg`; manifest and browser theme colors are `#0B2B55`. Legacy portrait/icon image files remain in the repository but are not referenced by the active favicon/manifest entries. They were not destructively overwritten. The scalable SVG is the active favicon and PWA icon; older clients that ignore SVG manifest icons may need raster variants in a later asset-generation pass.

`src/brandAssets.test.js` checks that header and public marks both carry the PN identity and that browser/manifest metadata point to the same icon and theme color. The live header image loaded in browser checks at desktop and mobile widths.

## 5. Responsive, Route, and Theme Checks

The browser checked the nine HashRouter destinations (home, home alias, About, Expertise, Projects, Experience, Education, Open Source, Contact) at 1440px and 360px: **18 route/viewport combinations**. All had the expected route title, one canonical link, one description, a loaded header logo, and no document horizontal overflow. Five viewport widths (1440, 1024, 768, 390, 360) were also checked on Experience, About, and Expertise; no horizontal overflow was found.

The three theme choices (Minimal, Blue, Dark) produced distinct background colors and no horizontal overflow at mobile width. The expanded live Experience list retained the 2021 KPLC role and omitted the 2017 KPLC support record. No application page exceptions were captured. Some Google Analytics requests were aborted during rapid local navigation; these are external telemetry requests, not app exceptions.

## 6. Verification

`CI=true npm test -- --watch=false --maxWorkers=2`:

```text
Test Suites: 13 passed, 13 total
Tests:       36 passed, 36 total
```

`CI=true npm run build` completed successfully:

```text
Creating an optimized production build...
Compiled successfully.
The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
```

The Node runtime still emits `DEP0176: fs.F_OK is deprecated` from the legacy toolchain. This did not fail tests or build. No deployment command was run.

## 7. Files Changed in This Phase

- `src/portfolio.js` — removed the 2017 KPLC IT support record; retained 2021 ICT Associate.
- `src/experienceImpact.test.js` — regression assertion for removal and 2021 role retention.
- `src/components/motion/Reveal.js`, `reveal.css`, and `Reveal.test.js` — live React 16-compatible CSS motion adapter, reduced-motion support, and focused coverage.
- `src/motion/Reveal.js`, `reveal.css`, and `Reveal.test.js` — removed redundant unused copy.
- `src/brandAssets.test.js` — favicon/manifest/header identity checks.
- `package.json` and `package-lock.json` — removed `react-reveal` and unused `apollo-boost`; upgraded `gh-pages`; pinned React-compatible `react-is`.
- `public/index.html` and `public/manifest.json` — aligned active browser/PWA icon and theme-color metadata.

The worktree already contained extensive changes from earlier phases. They were preserved. No commit, push, or deployment was performed.

## 8. Outstanding Risks Before Release

1. **Private key in Git history:** the private key was moved outside the worktree and its path ignored, but an earlier commit still contains it. Revoke/rotate it and coordinate an approved history rewrite before any push.
2. **Dependency security:** the 184 npm audit findings remain. Plan a dedicated CRA 3 to CRA 5 migration and evaluate its transitive dependency fixes with tests; do not treat the current build success as a security clearance.
3. **Hosting mismatch:** repository `CNAME` specifies `ashutoshhathidara.com`, while `package.json` homepage and the generated build target `https://pcodesdev.github.io`. Reconcile before a future authorized deployment.
4. **Contact delivery:** FormSubmit activation and real inbox delivery remain unverified.
5. **Curated content:** the prior live GitHub curation attempt was blocked by the unauthenticated API rate limit; review a successful workflow-generated pull request before accepting generated selections.
6. **User-supplied metrics:** confirm source, period, denominator, and attribution of impact figures before public release, as recorded in the professional impact report.
