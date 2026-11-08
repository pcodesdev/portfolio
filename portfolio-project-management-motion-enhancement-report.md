# Portfolio Project Management & Motion Enhancement Report

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Scope: local implementation, design refinement, and browser validation only.  
Authorization: **No commit, push, or deployment.**

## 1. Project Management Positioning

- **Home:** Added Project Management to the first professional highlight and revised the hero statement to connect project management with technical implementation, digital transformation, EdTech, workforce development, and software solutions.
- **About:** Expanded the first-person biography and programme narrative with practical scheduling, trainer/partner coordination, learning-resource organization, implementation, attendance/progress monitoring, follow-up, programme records, and reporting. The page remains narrative-led and does not claim a formal PM qualification.
- **Expertise:** Added a Project Management category covering planning and implementation, workplans and scheduling, stakeholder/partner/team/trainer coordination, monitoring/evaluation/reporting, risk identification/mitigation, resource coordination, and deliverable/milestone tracking. Evidence is grounded in the existing FCA roles and documented 12+ trainers and 1,800+ annual secondary learner reach.
- **Professional Experience:** Strengthened only the Project Officer and Project Assistant descriptions with workplan/session planning, scheduling, assignment/progress tracking, partner coordination, monitoring, and reporting language. Existing role titles, dates, achievement bullets, and figures were retained unchanged.

## 2. Motion Enhancements

The existing local motion adapter now uses one-shot `IntersectionObserver` reveals instead of animating immediately on render. It supports a 460ms duration cap and 240ms stagger cap, with up to 12px directional entry, no extra wrapper, and stable element dimensions. Unsupported observers and reduced-motion preferences reveal content immediately.

- **Home hero:** Heading, professional tagline, supporting copy, social links, and CTA/highlight group enter in a short stagger. The Project Management highlight is visible with the established skill tags.
- **About:** Heading and major biography, journey, programme, impact, planning, and value sections reveal on scroll as groups rather than animating every paragraph.
- **Expertise:** All eight category cards reveal on scroll with a two-step stagger. Cards have restrained lift/border emphasis on hover and focus.
- **Experience:** Existing heading and experience-card reveals now trigger on scroll; accordion interaction and role text remain intact.
- **Projects/publications/education:** Existing local Fade wrappers now reveal on scroll. Project/publication entries use a capped three-step stagger; project cards gain small hover lift and visible focus feedback.
- **Navigation and controls:** Header links, CTA buttons, cards, and menu control have short transitions and visible keyboard focus indicators. No new animation dependency was added.

## 3. Motion and Accessibility

- Respects `prefers-reduced-motion: reduce`: observer is bypassed, reveal content remains visible, and global CSS suppresses animation, transitions, and smooth scrolling.
- Native DOM roots alone receive refs and animation props; metadata/function-component siblings are left untouched to avoid React warnings.
- Observer disconnects during cleanup; intersected items are unobserved after their first reveal.
- No opacity/transform layout shift was measured: element heights were unchanged before and after reveal.
- Existing keyboard focus remains visible and receives restrained border/outline feedback. Reveals do not gate content behind interaction or animation completion.
- Uses `IntersectionObserver` and CSS transforms rather than a library or continuous background animation, keeping ongoing work low on mobile and lower-powered devices.

## 4. Browser Validation

Validated the local app at **1440, 1024, 768, 390, and 360 CSS pixels** across Home, About, Expertise, Projects, Experience, and Education: **30 route/viewport combinations**.

- No horizontal overflow in any checked combination.
- One canonical and one description metadata entry per route; expected titles were present.
- Home displayed Project Management with the existing core highlights.
- Expertise rendered eight cards; the final card revealed after scrolling at mobile and desktop widths without changing its measured height.
- Experience retained the 2021 ICT Technical Associate role and did not show the removed 2017 KPLC support record.
- No application page exceptions or React ref warnings were observed after the adapter fix.
- With reduced motion enabled, computed reveal opacity was 1, transform was none, and animation was none.
- Home and Expertise were visually reviewed at desktop size; the home highlight group and new Project Management card fit the existing layout. Existing Minimal, Blue, and Dark theme structures were preserved; no theme color definitions were changed.

## 5. Tests and Build

Focused tests passed for profile data, About/Expertise rendering, FCA experience claims, project/publication cards, and the motion adapter.

`CI=true npm test -- --watch=false --maxWorkers=2`:

```text
Test Suites: 14 passed, 14 total
Tests:       39 passed, 39 total
```

`CI=true npm run build`:

```text
Creating an optimized production build...
Compiled successfully.
The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
```

The existing Node `DEP0176: fs.F_OK is deprecated` warning remains from the legacy CRA/Jest toolchain; it did not fail tests or build.

## 6. Files Changed

- `src/profileData.js` — Home identity/highlights, About narrative, programme narrative, Project Management expertise and supporting evidence.
- `src/profileData.test.js` — positioning, capability, and evidence assertions.
- `src/portfolio.js` — workplan, monitoring, and reporting detail in the two FCA role descriptions.
- `src/experienceImpact.test.js` — regression assertions for strengthened role descriptions, preserving prior metric/date checks.
- `src/components/motion/Reveal.js` and `reveal.css` — scroll-triggered reveal behavior, duration/delay caps, and fallbacks.
- `src/components/motion/Reveal.test.js` — observer, reduced-motion setup, cleanup, root preservation, and custom-child regression coverage.
- `src/containers/greeting/Greeting.js` and `Greeting.css` — staged homepage hero and CTA interaction states.
- `src/pages/about/AboutComponent.js` — grouped section reveals and project-coordination intro.
- `src/pages/expertise/ExpertiseComponent.js` and `ExpertiseComponent.test.js` — staggered category reveals and rendered Project Management coverage.
- `src/pages/profilePages.css` — card hover/focus response and transitions.
- `src/components/header/Header.css` — navigation hover/active/focus transitions.
- `src/components/githubRepoCard/GithubRepoCard.js` and `.css` — card stagger prop, duration, hover and focus states.
- `src/components/publicationsCard/PublicationCard.js` — card stagger prop and duration.
- `src/pages/projects/Projects.js` — stagger values for project and publication lists.

Existing PN branding, favicon, theme definitions, role titles/dates, impact figures, and prior local work were preserved.

## 7. Outstanding Issues and Recommendations

1. The codebase still uses React 16 / CRA 3.2 and has the previously reported npm audit findings; schedule a separately tested CRA 5 migration rather than applying a forced bulk upgrade.
2. The production build still targets `https://pcodesdev.github.io`, while the repository CNAME specifies `ashutoshhathidara.com`; reconcile before any future authorized deployment.
3. The previously documented private-key exposure in Git history remains a release blocker; revoke/rotate the key and coordinate an approved history rewrite before any push.
4. Metrics remain user-supplied and should be confirmed against source records and denominators before public release.
5. No commit, push, deployment, or publication was performed.
