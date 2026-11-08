# Portfolio Page Audit

Audit date: 2026-11-04  
Scope: React source, local data, generated production build, and rendered routes at 1440px desktop and 390px mobile. External pages were checked only where noted. This is an audit and roadmap; recommendations outside the About image enhancement have not been implemented.

## 1. Executive Summary

The portfolio has a clear emerging identity around Digital Transformation & Technology Solutions. Home, About, and Expertise now have distinct purposes; the About biography is more visually balanced with a locally bundled unDraw “Push to Production” illustration; the Experience and Education pages use the same pale-blue and navy theme; and Pemanju Farm Manager is prominent as the featured engineering case study.

The site still needs a claims and evidence review before it is fully ready for recruiter review. This phase removed unsupported public SEO numbers and the “Cloud Architect” claim, removed hardcoded Open Source totals and stale mixed-author activity snapshots from the visible route, and replaced the misleading resume CTA with a direct email action. Semantic navigation and key controls were improved. Remaining items include unverified employment/education/project claims, direct Pemanju evidence, broader accessibility review, and limited automated test coverage.

No deployment was made. Resolved P0 items are marked in the register; unresolved content and technical recommendations require Peter's approval or evidence before implementation.

## 2. Page-by-Page Findings

### Home

**Strengths**
- The hero identifies Peter by name and gives the intended professional positioning.
- Four concise highlights and working internal links to work, experience, and contact provide a clear starting point.
- The illustration and photo render in the production build at desktop and mobile widths.

**Weaknesses and recommendations**
- There is no direct About or Expertise call to action in the hero; visitors must use the header to find Peter’s story or capabilities. Add one or both as secondary links.
- The GitHub social icon is visually identifiable, but icon-only social links do not expose accessible names to assistive technology.
- Public `index.html` metadata, discussed under SEO, conflicts with the Home identity and includes unverified claims.

**Evidence/files**: `src/pages/home/HomeComponent.js`, `src/containers/greeting/Greeting.js`, `src/portfolio.js`, `src/components/socialMedia/SocialMedia.js`, `public/index.html`.

### About

**Strengths**
- Biography, professional journey, FCA programme context, pathway, and value proposition are distinct from Home and Expertise.
- The unDraw illustration depicts a technology professional preparing a product for production, not Peter; it has meaningful alternative text and a source link.
- At 1440px and 768px the image sits alongside the text. At 390px it stacks before the biography, reducing time to first visual and preserving readable copy.

**Weaknesses and recommendations**
- Career chronology is described as stages without dates. Keep dates omitted until Peter verifies a dated employment record.
- Confirm the title “FCA Creators Hub Manager,” chronology, and the extent to which programme reporting, trainer coordination, and employability pathway responsibilities are attributable to Peter.
- Keep programme scale and outcome metrics out until Peter approves a source, scope, and attribution.

**Evidence/files**: `src/pages/about/AboutComponent.js`, `src/pages/profilePages.css`, `src/portfolio.js`, `src/assests/images/push-to-production.svg`.

### Expertise

**Strengths**
- Five capability areas are independently scannable and paired with practice evidence.
- Pemanju Farm Manager grounds the React/TypeScript, offline persistence, data integrity, and Excel workflow description.
- The Cloud section explicitly distinguishes foundational knowledge from advanced production delivery and identifies synchronization as planned.

**Weaknesses and recommendations**
- The capability list remains self-authored rather than independently verified. Confirm technical depth and whether testing, domain services, database design, cybersecurity, and IT infrastructure claims correspond to actual code or work artifacts.
- Add one or two links to code, a demo, or a technical write-up once suitable public evidence is available.

**Evidence/files**: `src/pages/expertise/ExpertiseComponent.js`, `src/pages/profilePages.css`, `src/portfolio.js` (`expertiseAreas`, `projectCaseStudy`).

### Featured Projects

**Strengths**
- Pemanju Farm Manager is the first major project section and is explicitly labeled as the flagship engineering case study.
- The case study describes a real operational problem, offline-first architecture, Excel workflows, and implemented versus planned technology.
- A separate “Technical Writing” section can support communication and developer-education positioning.

**Weaknesses and recommendations**
- The case study itself has no direct source repository, public demo, or evidence link. Add a verified public link or state that the project is private/in development and provide a suitable artifact.
- The five repository cards below the flagship are older generic template projects (2020–2024): GPT-3 landing page, task list, password generator, hotel UI, and dice game. They dilute the intended programme-delivery and full-stack positioning when given equal visual treatment. Review for current relevance; retain only verified work that adds distinct evidence.
- Resolved: repo cards are now native anchors with `target="_blank"` and `rel="noopener noreferrer"`.
- “More Projects” correctly opens the GitHub profile, but repo descriptions use promotional claims such as “secure” and “advanced” without evidence visible on the portfolio.
- The project page is very long: detailed case-study blocks, three stack lists, repository cards, and publications are all on one route. Consider an approved detail-page or progressive disclosure in a later phase.
- No live demo is presented for Pemanju or the listed projects.

**Evidence/files**: `src/pages/projects/Projects.js`, `src/pages/projects/Projects.css`, `src/shared/opensource/projects.json`, `src/components/githubRepoCard/GithubRepoCard.js`, `src/portfolio.js` (`projectCaseStudy`, `publications`).

### Professional Experience

**Strengths**
- FCA roles are prioritized and use the titles Project Officer – Digital Skills and Project Assistant.
- The descriptions cover digital skills implementation, hub operations, training coordination, learner support, and partner engagement.
- Pemanju and the short IT support role show a technical strand alongside programme delivery.

**Weaknesses and recommendations**
- The Experience page’s accordion is collapsed by default, hiding all work history until interaction; consider opening the current role by default or using a simpler chronology.
- The description at the top is broad and repeats the overall positioning rather than stating the most relevant scope.
- Dates and chronology need Peter’s confirmation, especially “Pemanju Full-Stack Developer, May 2018–Present” alongside full-time FCA roles, and the role scope/title across the sequence.
- No quantified outcomes are included, which avoids fabrication; add outcomes only when sourced and clearly attributed to Peter, the team, or the programme.
- Peter should confirm the current-role responsibilities in the portfolio and About biography are representative and not overstated.

**Evidence/files**: `src/pages/experience/Experience.js`, `src/containers/experienceAccordion/ExperienceAccordion.js`, `src/portfolio.js` (`experience`).

### Education & Certifications

**Strengths**
- The Laikipia University BSc is prominent, and certification records link to credential pages or documents.
- Cloud credentials provide relevant supporting context for the developing Cloud Solutions track.

**Weaknesses and recommendations**
- “Scrimba – The Frontend Developer Career Path” is displayed under “Degrees Received,” although it is a course/programme, not a degree. Separate academic qualifications from courses and certifications.
- Scrimba descriptions claim Mozilla MDN curation, “Mastered” technologies, “12+” projects, and hundreds of challenges. Confirm the attribution and numbers, or replace with verifiable completion details.
- The Cloud Digital Leader entry uses `alt_name: "Microsoft"` despite naming Google Cloud as the issuer.
- Laikipia is rendered as “Bsc” rather than “BSc”; confirm the exact award title and dates. Verify current status and exact public credential destination for each linked credential before retaining it.
- The page subtitle says “Basic Qualification and Certifcations,” which is both awkward and misspelled. Improve the label in a later approved content pass.
- Mobile layout displays credential logos with generous vertical spacing before the qualification list; review scan density and prioritize degree details.

**Evidence/files**: `src/pages/education/EducationComponent.js`, `src/containers/education/Educations.js`, `src/containers/certifications/Certifications.js`, `src/components/degreeCard/DegreeCard.js`, `src/components/certificationCard/CertificationCard.js`, `src/portfolio.js` (`degrees`, `certifications`).

### Open Source

**Strengths**
- The page has a clear route and includes profile contribution context, PR and issue cards, and charts.
- A live public GitHub profile was reachable during this audit; its page reported 173 contributions in the last year at audit time (2026-11-04). This is an external, time-sensitive observation, not a replacement approved portfolio metric.

**Weaknesses and recommendations**
- The previous implementation showed unsourced totals and stale mixed-author contribution records. These statistic/chart/card sections are no longer rendered; the dead component containing hardcoded totals was removed.
- The page is intentionally reduced to a neutral profile introduction and a link to GitHub. It no longer makes unsubstantiated contribution, language, or impact claims.
- If activity examples are reintroduced, verify ownership/attribution, update them from an attributable source, and include a retrieval date and scope.

**Evidence/files**: `src/pages/opensource/Opensource.js`, `src/containers/organizations/Organizations.js`, `src/containers/opensourceStats/OpensourceStats.js` (removed), `src/shared/opensource/pull_requests.json` and `issues.json` (not rendered).

### Contact

**Strengths**
- Email is a working `mailto:` social link; GitHub, LinkedIn, YouTube, X, Hashnode, and a Google Maps destination are presented.
- The page has a direct contact heading and professional availability statement.

**Weaknesses and recommendations**
- The misleading resume CTA is replaced by “Email Peter,” which opens the configured mail client. Add a CV only if Peter supplies or approves the actual document/link.
- The phone number is now an actionable `tel:` link. The main contact address remains the mailto icon; a visible text address could be added if desired.
- Street and postal data are no longer included in Person structured data; only city/region/country are emitted.
- Contact’s illustration and address/phone blocks create large visual sections; make the primary recruiter contact method more direct and reduce decorative weight in a later approved pass.
- Social icon anchors now have accessible names from the profile names.

**Evidence/files**: `src/pages/contact/ContactComponent.js`, `src/pages/contact/ContactComponent.css`, `src/components/socialMedia/SocialMedia.js`, `src/portfolio.js` (`contactPageData`, `greeting`). External checks: GitHub profile and repository and Hashnode profile loaded; LinkedIn extraction was inconclusive; email delivery and map destination were not independently tested.

### Header & Navigation

**Strengths**
- Navigation labels map to the eight routes, and `HashRouter` makes direct routes/refreshes compatible with GitHub Pages static hosting.
- The mobile trigger is now a semantic button with `aria-expanded` and `aria-controls`; keyboard activation and closing after route selection were verified.
- All route headings loaded after direct route access and refresh. Active route styling is visible on desktop.

**Weaknesses and recommendations**
- Desktop navigation compresses eight long labels into one row, and the 768px breakpoint still uses a small font. Confirm tablet readability and consider a responsive breakpoint that moves the menu to the mobile pattern earlier.

**Evidence/files**: `src/components/header/Header.js`, `src/components/header/Header.css`, `src/containers/Main.js`.

### Footer & Shared Components

**Strengths**
- Footer copyright year is dynamic and route footer rendering is consistent.
- Back-to-top has route-cleaned scroll handling and did not produce app errors in the route audit.
- Theme selection persists to local storage and offers several choices.

**Weaknesses and recommendations**
- “Back to top” is now a named native button; the footer heart emoji has an accessible name.
- Theme toggle is fixed at the top-right and may compete with the header/menu; its theme names are available, but contrast and keyboard focus should be tested across themes.
- The CSS theme contrast audit does not test text on actual card backgrounds. In the default blue theme, repo card text uses `#001C55` on `#0E6BA8`, which should be checked against WCAG contrast before claiming compliance.
- Several decorative SVGs/images and project cards lack useful alt text or native interaction semantics; distinguish decorative from informative assets in an accessibility pass.

**Evidence/files**: `src/components/footer/Footer.js`, `src/components/topButton/TopButton.js`, `src/components/themeSwitcher/SimpleThemeSwitcher.js`, `src/components/githubRepoCard/GithubRepoCard.js`, `src/theme.js`, `src/themeAccessibilityAudit.js`.

### SEO & Discoverability

**Strengths**
- React Helmet sets a descriptive title and description from the portfolio data, and a Person JSON-LD object is included.
- Canonical portfolio URL and Open Graph title/type/url are supplied in the React SEO data.
- `HashRouter` supports GitHub Pages without server rewrites.

**Weaknesses and recommendations**
- Static metadata now uses the approved positioning text without the unverified experience, participant, or Cloud Architect claims.
- Helmet now emits the same Open Graph description and canonical URL as the static metadata. Hash-routed subpages still share the same static HTML preview; route-specific prerendering remains optional.
- Person JSON-LD no longer includes street address or postal code. Job, telephone, and credential fields remain and should be checked for accuracy/consent.
- Audited routes now render one H1 each; subordinate sections were changed to H2s where identified.

**Evidence/files**: `public/index.html`, `src/components/seoHeader/SeoHeader.js`, `src/portfolio.js` (`seo`, `experience`, `contactPageData`, `certifications`).

### Overall UX & Responsive Design

**Strengths**
- All eight routes rendered at 1440px and 390px in the current production build without horizontal document overflow, failed local images, or app-level browser errors.
- The About page uses a local, lightweight SVG with a palette matching the pale-blue/navy site; the attribution/source link is present.
- Hash-based direct route entry and page refresh behavior were tested in local static hosting.

**Weaknesses and recommendations**
- The project page remains long and dense. The Open Source page is now short; its totals and stale snapshots were removed from the rendered route.
- Reveal animations are used broadly across pages and can delay content visibility or frustrate reduced-motion users. Respect `prefers-reduced-motion` and limit animation in a later UX pass.
- The theme switcher changes palette but does not state the selected theme with `aria-pressed` or equivalent.
- Current automated tests do not assert content, navigation, external link destinations, keyboard operation, image loading, or responsive behavior.

**Evidence/files**: all route page components; `src/App.test.js`; `src/components/header/Header.css`; `src/pages/projects/Projects.css`; `src/containers/skills/Skills.css`; shared Reveal usage.

## 3. Prioritized Improvement Register

| ID | Page/Component | Priority | Finding | Recommendation | Expected Benefit | Files | Scope | Approval Required |
|---|---|---|---|---|---|---|---|---|
| AUD-01 | SEO / public HTML | P0 | Resolved: static and React metadata now share the evidence-based Digital Transformation & Technology Solutions description; unsupported static claims were removed. | Keep public HTML and Helmet metadata synchronized; add only Peter-approved metrics. | Prevents misleading first impressions in search/social previews. | `public/index.html`, `src/portfolio.js`, `src/components/seoHeader/SeoHeader.js` | Small | Yes for future claims |
| AUD-02 | Open Source | P0 | Resolved: unsourced totals and stale mixed-author charts/cards were removed from the visible route; the dead component containing hardcoded totals was deleted. | Reintroduce metrics only from an attributable, dated source scoped to Peter. | Restores credibility and avoids overstating contribution. | `src/pages/opensource/Opensource.js`, `src/containers/organizations/Organizations.js`, removed `OpensourceStats.js`, bundled snapshots are no longer rendered | Medium | Yes for future metrics |
| AUD-03 | Contact | P0 | Resolved: “See My Resume” no longer points to GitHub; the CTA is now “Email Peter” and opens the configured mail client. | Add a CV link only after Peter supplies/approves the actual file or URL. | Avoids a misleading recruiter action and keeps contact direct. | `src/pages/contact/ContactComponent.js` | Small | Yes for CV |
| AUD-04 | Contact / structured data | P1 | Resolved: street address and postal code were removed from Person JSON-LD; city/region/country remain. | Review whether phone and credential data should remain public in structured data. | Reduces unnecessary personal information exposure. | `src/components/seoHeader/SeoHeader.js` | Small | Yes for remaining personal data |
| AUD-05 | Accessibility / shared controls | P1 | Partially resolved: mobile nav, back-to-top, and repository cards now use semantic button/anchor elements; social links and footer emoji have accessible names. | Continue keyboard/screen-reader review across themes and interactive pages. | Makes primary navigation and controls usable to more visitors. | `Header.js`, `GithubRepoCard.js`, `TopButton.js`, `SocialMedia.js`, `Footer.js` | Medium | No |
| AUD-06 | Education & Certifications | P1 | Partially resolved: section now says “Academic & Professional Learning,” Scrimba copy no longer claims Mozilla curation/mastery/counts, and Cloud Digital Leader alt text now names Google Cloud. Course completion date and credential records still need verification. | Peter to verify exact degree award/date, course completion date, and credential URLs/issuers before adding more detail. | Improves qualification accuracy and recruiter scanning. | `Educations.js`, `EducationComponent.js`, `portfolio.js` | Small | Yes |
| AUD-07 | Experience / About | P1 | Career dates and concurrent Pemanju/FCA role relationship are not explained; some detailed FCA responsibilities are not independently evidenced in repository data. | Have Peter confirm chronology, role titles, attribution, and whether Pemanju is concurrent before adding dates/outcomes. | Keeps the career narrative consistent and defensible. | `src/portfolio.js`, `src/pages/experience/Experience.js`, `src/pages/about/AboutComponent.js` | Small | Yes |
| AUD-08 | Pemanju case study | P1 | Flagship is prominent but has no direct public source, demo, or evidence link; implementation claims cannot be checked from this workspace. | Confirm implementation status and add an approved repo/demo or label it private/in development with a suitable artifact. | Makes the strongest technical proof independently verifiable. | `src/portfolio.js`, `src/pages/projects/Projects.js` | Small | Yes |
| AUD-09 | Projects selection | P1 | Five older generic projects below the flagship dilute the Digital Transformation/full-stack profile and use promotional descriptions. | Review each for relevance and current quality; retain a concise, evidence-backed subset and revise claims. | Keeps recruiter attention on strongest, most relevant proof. | `src/shared/opensource/projects.json`, `src/pages/projects/Projects.js` | Medium | Yes |
| AUD-10 | SEO metadata | P2 | Partially resolved: static title/description/Open Graph values align with the portfolio positioning; Helmet emits OG description and canonical URL. Route-specific static previews are not generated for hash routes. | Consider route-aware prerendering only if social previews/search indexing of individual pages becomes a requirement. | Improves accurate search and social sharing snippets. | `public/index.html`, `SeoHeader.js`, `portfolio.js` | Small | No |
| AUD-11 | Open Source content | P2 | Intro claims broad languages, cloud contributions, reviews, and worldwide impact not evidenced by visible data. | Replace broad claims with specific linked contribution examples after verifying authorship and scope. | Makes open-source profile concrete rather than generic. | `Organizations.js`, `PullRequests.js`, `Issues.js`, JSON snapshots | Medium | Yes |
| AUD-12 | Experience layout | P2 | All work details are hidden in a collapsed accordion; top description is broad. | Open current role by default or present a concise chronology; lead with confirmed responsibilities and outcomes. | Reduces effort for recruiters to find role history. | `Experience.js`, `ExperienceAccordion.js`, `portfolio.js` | Small | Yes |
| AUD-13 | Contact | P2 | Partially resolved: email CTA is now a labeled `mailto:` link and phone uses `tel:`; social destinations still need owner confirmation. | Confirm linked profiles; add a CV only when approved. | Makes recruiter contact direct and accessible. | `ContactComponent.js`, `portfolio.js`, `SocialMedia.js` | Small | Yes for CV/ownership |
| AUD-14 | Projects interactions | P2 | Resolved: repository cards are native external anchors with `target` and `rel`. | Keep descriptive labels and verify public project destinations in future portfolio reviews. | Improves reliable keyboard and touch navigation. | `GithubRepoCard.js`, `GithubRepoCard.css` | Small | No |
| AUD-15 | Visual/accessibility | P2 | Contrast evaluation does not test foreground against actual repo-card backgrounds; broad reveal animations do not account for reduced-motion preference. | Audit component color pairs and add `prefers-reduced-motion` handling. | Improves readability and comfort for users sensitive to motion. | `themeAccessibilityAudit.js`, `theme.js`, `GithubRepoCard.css`, shared Reveal components | Medium | No |
| AUD-16 | Home discovery | P2 | Home has no direct CTA for About/Expertise; users must use the header to reach story/capabilities. | Add a secondary About or Expertise action after reviewing visual balance. | Makes the intended recruiter journey easier. | `Greeting.js`, `Greeting.css`, `portfolio.js` | Small | No |
| AUD-17 | Page semantics | P2 | Partially resolved: page sections on Contact, Projects, and Education now use subordinate heading levels; one H1 was confirmed on all eight routes in browser QA. Some decorative imagery still needs alt review. | Audit SVG illustrations and remaining image alternatives page by page. | Improves heading navigation and non-visual comprehension. | `Projects.js`, `ContactComponent.js`, `EducationComponent.js`, SVG page components | Medium | No |
| AUD-18 | Mobile/navigation | P2 | Partially resolved: mobile menu is a keyboard-operable button with `aria-expanded`, and tablet route sweep passed; desktop nav density remains unchanged. | Reassess tablet breakpoint only if usability testing shows the desktop row is too compressed. | Improves navigation clarity at tablet and keyboard use. | `Header.js`, `Header.css` | Small | No |
| AUD-19 | Page UX | P3 | Long projects and open-source pages require substantial scrolling; animation is repeated across most sections. | Consider a dedicated project detail route and restrained, user-sensitive reveal motion in a future phase. | Reduces page fatigue without changing core content. | `Projects.js`, `Projects.css`, `Opensource.js`, shared Reveal usage | Large | No |
| AUD-20 | Automated QA | P2 | The only test asserts that App mounts and unmounts. | Add route assertions, CTA destination tests, accessible control checks, and browser layout/image smoke tests. | Prevents content/routing/interaction regressions. | `src/App.test.js`, test configuration | Medium | No |

## 4. Claims and Metrics Audit

### Metrics approval register

No unverified metrics below are currently published in the portfolio’s visible routes or static SEO metadata. They are recorded for approval and are not authorized for reintroduction.

| Historical/unapproved claim | Status | Evidence required before publication | Non-numerical alternative currently used |
|---|---|---|---|
| “2000+ participants trained” in old static metadata | Removed | Dated programme records with unique participant definition, location/period, deduplication method, and attribution to Peter versus FCA/team outcomes | “Supports digital-skills initiatives across Nairobi, Kakuma, and Dadaab.” |
| “5+ years” experience/training claims in external/profile copy | Removed from portfolio metadata; external profiles are not controlled here | Verified role/training date range and confirmation of what the duration measures | “Experience spans digital programme delivery, technical learning, and software development.” |
| Open Source totals: 1,247 contributions, 156 PRs, 89 issues, 2,340 stars | Removed from portfolio route | Current GitHub data export/API source, authorship/scope rules, and retrieval date; distinguish Peter’s PRs from third-party repo totals/stars | “Browse Peter’s public repositories and current contribution activity directly on GitHub.” |
| Scrimba “12+ projects” and “hundreds” of exercises | Removed | Course transcript/dashboard or course record with exact verified count | “Practiced responsive layouts, component-based interfaces, and frontend workflows through course exercises.” |
| Any future training, placement, satisfaction, budget, or employment outcome numbers | Not published | Source document, measurement period, definition, team/individual attribution, and Peter’s written approval | Describe the verified activity or responsibility without a number. |

Repository descriptions also contained qualitative claims such as “secure,” “advanced,” and “captivating” without validation in this site; these remain data-copy recommendations, not independently verified technical findings. A live GitHub profile showed 173 contributions during the prior year when checked on 2026-11-04; that external, time-sensitive value is not displayed or approved for reuse.

### Unverified technical skills or implementation status

- The degree description lists a broad stack including Cassandra, Hadoop, Spark, Tableau, D3.js, Wireshark, Nmap, NIST/ISO 27001, AWS EC2/S3/Lambda, Azure, Docker, Kubernetes, Jenkins, GitLab CI, Terraform, Ansible, TensorFlow, and GraphQL. These remain published as degree-description topics, not a verified professional proficiency list; Peter should confirm or approve removal/rewording.
- Other skill entries include Node.js, Python, SQL, cloud architecture, security, automation, and service-layer logic. Confirm the intended experience level and link evidence where possible.
- Pemanju case-study claims React, TypeScript, Vite, Tailwind, Dexie, IndexedDB, SheetJS, offline operation, Excel import/export, relational integrity, and planned Supabase/PostgreSQL. The project code is not in this portfolio workspace and the case study has no evidence URL. Confirm each implemented/planned label before publication.
- The rendered Open Source page no longer claims specific languages, cloud contributions, or contribution impact; it links visitors to GitHub for current activity.

### Ambiguous employment or achievement claims

- Confirm current and past FCA titles, exact dates, employer naming, Nairobi/Kakuma/Dadaab scope, and contribution/responsibility wording.
- Confirm whether the Pemanju role has been continuous since May 2018 and how it relates to concurrent FCA employment.
- Confirm Creative Industries Project Coordinator and FCA Creators Hub Manager titles and chronology currently represented in About narrative.
- No outcome metrics are present in the current active experience content, which is preferable to unsupported impact figures. Any future numbers require source, period, team/individual attribution, and Peter’s approval.

### Ambiguous education/credential details

- Confirm exact degree award title (“BSc in Information and Communication Technology”) and 2016–2020 dates.
- Confirm whether Scrimba course was completed in 2024 and the course provider/description; it is now grouped under academic and professional learning, not labeled a degree.
- Verify every certificate’s current public link and exact issuer/title. Cloud Digital Leader alt text now matches Google Cloud.
- Contact JSON-LD still includes telephone and credentials; confirm public visibility. Street address and postal code have been removed.

### External links checked or requiring verification

- GitHub profile and `pcodesdev/gpt-3` repository load and identify the intended GitHub account/repository.
- Hashnode profile loads, but its visible profile title is a legacy “Expert software Developer…” headline; consider updating that external profile for consistency.
- LinkedIn extraction was inconclusive, so destination validity/ownership is not independently confirmed in this audit.
- Email mailto target is present in code; actual email delivery was not tested.
- The map link was not independently checked. Street-level address data has been removed from the portfolio content and JSON-LD.
- Pemanju has no public demo or repository link in the case study.

## 5. Visual QA Evidence

All screenshots are current-production-build viewport captures and are stored in the `portfolio/` project root: desktop 1440×1000, tablet 768×1024, and mobile 390×844.

| Page | Desktop | Tablet | Mobile |
|---|---|---|---|
| Home | `home-desktop.png` | `home-tablet.png` | `home-mobile.png` |
| About | `about-desktop.png` | `about-tablet.png` | `about-mobile.png` |
| Expertise | `expertise-desktop.png` | `expertise-tablet.png` | `expertise-mobile.png` |
| Featured Projects | `projects-desktop.png` | `projects-tablet.png` | `projects-mobile.png` |
| Professional Experience | `experience-desktop.png` | `experience-tablet.png` | `experience-mobile.png` |
| Education & Certifications | `education-desktop.png` | `education-tablet.png` | `education-mobile.png` |
| Open Source | `opensource-desktop.png` | `opensource-tablet.png` | `opensource-mobile.png` |
| Contact | `contact-desktop.png` | `contact-tablet.png` | `contact-mobile.png` |

About image validation at 1440px, 768px, and 390px:

- Source: unDraw catalog illustration “Push to Production,” downloaded from `https://cdn.undraw.co/illustration/push-to-production_6yhb.svg?type=svg`; exact official license at `https://undraw.co/license` permits commercial/personal use and modification without attribution. A source link is retained in the page caption.
- Optimized, local SVG asset: 8,823 bytes; natural dimensions 888×880. The accent uses the site blue; neutral fills remain part of the unDraw source artwork.
- The illustration loaded at every tested width and has descriptive alt text and width/height attributes.
- Rendered image bounds: 440×436 at 1440px, 280×277 at 768px, and 338×260 contained within the mobile frame.
- It is side-by-side with biography text at desktop and tablet, and stacked before the text on mobile.
- No horizontal document overflow was detected at the three requested widths.

Route sweep at 1440px and 390px found no broken local images, horizontal overflow, duplicate H1s, or app-level page/console errors. Keyboard activation/expanded state of mobile navigation, email/telephone link destinations, repository anchors, and absence of the removed aggregate stats were checked. Third-party AdSense may emit a duplicate page-level-ads error, and browser analytics requests may be blocked; neither prevented application rendering.

## 6. Recommended Next Implementation Phase

Proposed next phase, in this order; content requiring Peter’s facts or choices must wait for his approval:

1. Claims sign-off: confirm employment chronology/titles, degree/course dates, certifications, broad degree skill topics, and responsibilities described in About/Experience.
2. Pemanju evidence: provide or approve a source/demo/artifact and verify implementation status; do not claim deployment, adoption, users, revenue, or cloud sync without evidence.
3. Portfolio selection: Peter chooses which generic repositories remain and confirms social profile ownership.
4. Remaining accessibility work: contrast test actual theme/card combinations, review reduced-motion behavior and all illustration alternatives, and run keyboard/screen-reader checks.
5. Add route/content/CTA/accessibility automated regression coverage beyond the mount-only test, then repeat browser QA.

## Validation Summary

- `npm test -- --watch=false`: 1 test passed; suite passed. This remains a smoke test, not comprehensive coverage.
- `CI=true npm run build`: compiled successfully after the approved changes.
- Direct route and reload sweep: all eight routes rendered at 1440px and 390px; no broken local images or horizontal overflow.
- About image responsive checks: passed at 1440px, 768px, and 390px.
- Keyboard nav, email CTA, tel link, repository anchors, stale-stat removal, and one-H1-per-route checks passed in browser QA.
- Production deployment: not performed.