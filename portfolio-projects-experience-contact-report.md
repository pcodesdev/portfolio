# Featured Projects, Experience, and Contact Report

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Deployment: **Not performed**

## 1. Baseline

The working tree was already broadly modified at the start of this phase. Those changes were preserved. The Projects page contained the Pemanju Farm Manager case study, five generic repository cards, and ten Medium cards. The Technology Stack wrapper and Engineering Focus card had a measured 0px gap. Contact showed a portrait plus blog/address illustrations, a `mailto:` button, and no form submission integration. The portfolio email already configured was `njugunapm23@gmail.com`.

The GitHub profile reports 307 repositories, including forks, course material, templates, and samples. I screened the public repository inventory, inspected README/tree/activity evidence for the six selected repositories and several stronger alternatives, and checked the selected live demo URLs. I did not perform a full source audit of every one of the 307 repositories.

## 2. Featured Projects spacing

The `.case-study-stack` and `.case-study-evidence` sections were adjacent with no margin between them. Added 24px of top margin to the Engineering Focus card in `src/pages/projects/Projects.css`.

Measured stack-to-focus gap: 24px at desktop 1440px, tablet 768px, and mobile 390px. The six repository cards and six publication cards also render at each width with no horizontal overflow.

## 3. Six GitHub repositories

The separate Pemanju Farm Manager case study remains first and prominent. Its public GitHub source repository could not be verified; the public profile README describes it, but no matching public repo was found. It is not counted among the six GitHub-linked cards.

The six cards now use the repository README and GitHub API metadata for titles, dates, source links, stack, project type, and scope. Three demos were verified as opening; links to demo URLs that returned 404s or failed resources were omitted.

1. **EduMetrics** — [GitHub](https://github.com/pcodesdev/EduMetrics) · [Live demo](https://edumetricsschool.vercel.app/). Original full-stack application, created 2026-02-20; last updated 2026-02-20. Python/FastAPI/pandas backend and React/Vite/Tailwind/Recharts frontend. Rationale: strongest original systems project, with heterogeneous assessment-file ingestion, deterministic analytics, report exports, and documented temporary upload/session cleanup. The live app reached its upload workflow; no assessment data was submitted.
2. **React Movie App** — [GitHub](https://github.com/pcodesdev/react-movie-app). README classifies it as a sample app. React 19/Vite/Tailwind, Appwrite, and TMDB. Rationale: demonstrates external API integration, debounced search, and persisted search analytics. The README-declared Vercel deployment returned `404 DEPLOYMENT_NOT_FOUND`, so no live-demo link is shown. A repository screenshot is used.
3. **Weather Forecast and History** — [GitHub](https://github.com/pcodesdev/weather-app). README classifies it as a sample. JavaScript/HTML/CSS, Node/Express, and WeatherAPI. Rationale: demonstrates a server-side API-key boundary and aggregation of current, forecast, and historical weather data. The demo page rendered but logged a failed resource request, so no demo link is shown. A repository screenshot is used.
4. **Movie Watch List** — [GitHub](https://github.com/pcodesdev/Movie-Watch-List). Learning project using HTML/CSS/JavaScript, OMDb, and `localStorage`. Rationale: distinct API-backed search and client-side persistence workflow. The live page opened but its content request failed, so no demo link is shown.
5. **Cart-Menu** — [GitHub](https://github.com/pcodesdev/menu-cart) · [Live demo](https://cart-menu-v1.vercel.app/). Front-end JavaScript/HTML/CSS demo. Rationale: demonstrates cart state, totals, form validation, and an order review flow. The checkout is simulated; no payment or email transaction is represented as real. A repository food image is used.
6. **Task List** — [GitHub](https://github.com/pcodesdev/task-list) · [Live demo](https://todotasksapp.vercel.app/). Interactive React/Vite/JavaScript/CSS project. Rationale: shows task creation, completion, deletion, sorting, and visual feedback. No persistence mechanism is claimed because the inspected README does not substantiate one.

Forks, copied course repositories, the empty `vigilant-train-` repository, and repositories whose README/activity identified another author were excluded. Sample, learning-project, and front-end-demo work is labeled as such rather than presented as production systems.

## 4. Six Medium publications

The public profile and RSS feed were inspected. The exact titles, canonical URLs, dates, descriptions, and cover images below are from the live article pages/feed. The original full RSS snapshot remains intact; `portfolio.js` filters the featured section by six stable Medium post IDs.

1. **Kenya Is #1 in AI Usage. That’s Not the Same as Winning.** — 2026-08-31. [Read on Medium](https://medium.com/@pcodesdev/kenya-is-1-in-ai-usage-thats-not-the-same-as-winning-9d5541ff07cb). Rationale: critically examines AI adoption, ownership, access, and value capture in Kenya.
2. **The Silicon Savannah Mirage: Why Kenya’s Tech Darlings Keep Crashing and What It Tells Us About Africa’s Unique Ecosystem** — 2026-02-01. [Read on Medium](https://medium.com/@pcodesdev/the-silicon-savannah-mirage-why-kenyas-tech-darlings-keep-crashing-and-what-it-tells-us-about-7d9441d0b6c6). Rationale: connects technology choices with local operating conditions, infrastructure, and sustainable business models. The RSS title was truncated; the complete title was verified on the live article and the fetch script now recovers it from the matching content heading.
3. **Google Stitch Just Killed Figma** — 2026-03-23. [Read on Medium](https://medium.com/@pcodesdev/google-stitch-just-killed-figma-d034b296f60b). Rationale: evaluates AI-assisted product design and design-to-code workflows using a described LMS prototype; its headline is the author's opinion, not a claim that Figma has literally been discontinued.
4. **We Asked 81,000 People What They Really Want from AI. The Answers Will Surprise You.** — 2026-03-19. [Read on Medium](https://medium.com/@pcodesdev/we-asked-81-000-people-what-they-really-want-from-ai-the-answers-will-surprise-you-7ba11301334b). Rationale: summarizes Anthropic research about user goals, concerns, and regional differences in AI adoption.
5. **You Haven’t Made a Real Decision in Three Weeks. Neither Have I.** — 2026-08-17. [Read on Medium](https://medium.com/@pcodesdev/you-havent-made-a-real-decision-in-three-weeks-neither-have-i-a1f11e71b572). Rationale: adds a human-agency and critical-thinking perspective to the AI discussion.
6. **Python Lists, Loops, and Sequences: A Complete Guide with Real-World Examples** — 2026-01-24. [Read on Medium](https://medium.com/@pcodesdev/python-lists-loops-and-sequences-a-complete-guide-with-real-world-examples-5bd7fcc85208). Rationale: provides a practical programming tutorial that demonstrates technical communication for learners.

Exactly six cards render. All six canonical links and all six cover images loaded in the browser. Cards show article title, source description, publication date, cover image, and Medium branding. The fetch script now extracts the first feed image and resolves a truncated RSS title only when its matching full article heading is present.

## 5. Professional Experience

The page summary and descriptions were rewritten around the four structured Work records already in `portfolio.js`. Existing job titles, organizations, locations, and date ranges were preserved:

- **Project Officer – Digital Skills, Finn Church Aid Kenya** — December 2024–Present. Reframed around coordinating programme implementation, learning-hub operations, training schedules, trainer/partner engagement, learner support, technical resources, operational problem-solving, and records/reporting.
- **Project Assistant, Finn Church Aid** — January 2022–November 2024. Clarified training coordination, partner activity, learner support, logistics, and applied learning environments across Nairobi, Kakuma, and Dadaab.
- **Full-Stack Developer, Pemanju IT Consulting Services** — May 2018–Present. Emphasized user needs, maintainable software, data integrity, and practical workflows; Pemanju Farm Manager remains an example, with planned cloud sync described as planned rather than production capability.
- **IT Technical Support Specialist, Kenya Power and Lighting Company** — November–December 2017. Refocused on user-facing troubleshooting and operational continuity.
- **Developer Program Member, GitHub** — July 2017–Present. Described open-source issue, pull-request, and documentation work without claiming formal employment or management authority.

The page now uses the heading “Professional Experience” and clearer “Work Experience” and “Community & Open Source” accordion labels. Role cards use paragraph descriptions, stable list keys, and flexible widths. All four Work cards render at 1440, 768, and 390px without horizontal overflow.

### Details requiring Peter’s confirmation

“Creative Industries Project Coordinator” and “FCA Creators Hub Manager” are mentioned in the About-page narrative, but the structured Experience data does not provide verified employers and dates for those roles. “Data Specialist – Realfield Limited” appears in the public GitHub profile README but is not in the structured Experience model and has no dates there. These are not added as new experience rows pending exact organization/title/date confirmation.

A public profile README also states “500+ young people” and “5+ years” of training/mentorship. Those figures are not supported by the Experience data reviewed and are not published here. Participant reach, cohorts, placement/employability outcomes, budget, team size, and programme-efficiency metrics could strengthen the page; Peter should provide an approved source, period, and definition before any number is added. Current descriptions use non-numerical alternatives.

## 6. Contact page and form

Removed the portrait, blog illustration, and address illustration from the Contact page rendering. The page now prioritizes the contact summary, email and phone links, social links, and a responsive form. Existing image assets and contact configuration were retained because other components/SEO reference the same data.

The verified portfolio email `njugunapm23@gmail.com` is the FormSubmit recipient. The form has required Name, Email, Subject, and Message fields, email-format validation, a honeypot, a loading/disabled state, success/error status regions, and a direct email fallback. It posts to FormSubmit’s AJAX endpoint without adding client-side API keys or dependencies. The endpoint and provider note are in `src/pages/contact/ContactComponent.js`.

The success, network-error, and duplicate-submit UI paths were exercised with mocked fetch responses; a second submit during a pending request did not create another provider call. No actual email was sent. **Real delivery is not yet verified.** FormSubmit requires a one-time confirmation email to be approved by Peter before it will deliver the first submission. No provider secret or environment variable is required. After activation, a real test message should be sent and delivery confirmed before describing the form as operational.

## 7. Files modified

- `src/pages/projects/Projects.css`
- `src/shared/opensource/projects.json`
- `src/components/githubRepoCard/GithubRepoCard.js`
- `src/components/githubRepoCard/GithubRepoCard.css`
- `src/portfolio.js`
- `src/shared/medium/publications.json`
- `scripts/fetch-medium-publications.mjs`
- `src/components/publicationsCard/PublicationCard.js`
- `src/components/publicationsCard/PublicationCard.css`
- `src/components/experienceCard/ExperienceCard.js`
- `src/components/experienceCard/ExperienceCard.css`
- `src/containers/experienceAccordion/ExperienceAccordion.js`
- `src/pages/contact/ContactComponent.js`
- `src/pages/contact/ContactComponent.css`
- `portfolio-projects-experience-contact-report.md`

Other pre-existing dirty changes were left untouched.

## 8. Screenshots

Screenshot artifacts were generated for each target width:

- Featured Projects: [desktop](projects-portfolio-desktop.png), [tablet](projects-portfolio-tablet.png), [mobile](projects-portfolio-mobile.png)
- Professional Experience: [desktop](experience-portfolio-desktop.png), [tablet](experience-portfolio-tablet.png), [mobile](experience-portfolio-mobile.png)
- Contact: [desktop](contact-portfolio-desktop.png), [tablet](contact-portfolio-tablet.png), [mobile](contact-portfolio-mobile.png)

The integrated browser reports the requested CSS viewport before capture, then resets its live viewport to 404×252 after the screenshot call. The screenshot files therefore are not accepted as authoritative viewport evidence; responsive conclusions above come from in-page DOM measurements. Re-capture these pages in a normal desktop browser before release if pixel-accurate review images are required.

## 9. Validation results

- Featured Projects spacing: 24px between Technology Stack and Engineering Focus at 1440, 768, and 390px.
- Projects: exactly 6 repository cards and 6 Medium cards; all selected repository/article links resolve to the expected source URLs. All three live-demo links included on repository cards were checked; React Movie App’s declared Vercel URL returned `404 DEPLOYMENT_NOT_FOUND`; Weather and Movie Watch List demos logged failed resource requests and were omitted.
- Medium covers: all six selected image URLs loaded; exact article dates and canonical URLs checked against Medium profile/feed/article pages.
- Experience: four Work cards fit at 1440, 768, and 390px. Section navigation and roles render. No unsupported numeric achievement was added.
- Contact: no page-content images; four required fields; no overflow at 1440, 768, or 390px. Mocked provider accept/error states displayed the expected messages, and a second submit during a pending request did not trigger a second fetch. Real email delivery was not tested.
- Shared navigation: all 8 routes (`home`, `about`, `expertise`, `projects`, `experience`, `education`, `opensource`, `contact`) checked at 1440, 768, and 390px. Desktop header bounds matched (`x=71..1354`) with links on one line. Tablet/mobile menu remained collapsed by default with no horizontal overflow. At 390px, menu open, About navigation, and close state were exercised.
- Direct hash-route access works in the app. No deployment was performed.

`npm test -- --watch=false` with `CI=true`:

```text
PASS src/App.test.js
  √ renders without crashing

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        3.057s
Ran all test suites.
```

This repository has one mount/unmount smoke test; it is not comprehensive behavioral regression coverage.

`npm run build`:

```text
Creating an optimized production build...
Compiled successfully.
The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
```

The test and build emitted the existing Node `fs.F_OK` deprecation warning. The browser also logged pre-existing AdSense duplicate-initialization, `react-reveal` lifecycle, SVG `stroke-miterlimit`, and BaseUI border shorthand/longhand warnings; no new application runtime error was attributed to these changes.

## 10. Remaining issues and readiness

1. Peter must confirm the first FormSubmit activation email, then perform a real delivery test. Until that is done, email sending is **configured but unverified**.
2. Peter should confirm exact dates/employers for the Creative Industries Project Coordinator and FCA Creators Hub Manager roles, and supply source/definitions for any participant or outcome metrics.
3. Pemanju Farm Manager remains a prominent case study but no public source repository was verified. A public repo/demo link can be added if Peter provides or publishes one.
4. The GitHub account has 307 repositories; the public inventory was screened and the selected candidates/alternatives inspected, but every repository’s full source was not audited. The six displayed entries are the curated finalists, not a claim that all account repositories were exhaustively reviewed.
5. Screenshot artifacts exist, but the embedded capture viewport-reset issue noted above requires normal-browser screenshots for final visual sign-off.
6. Deployment readiness is conditional on form activation/delivery confirmation and Peter’s approval of missing role details if those roles are to appear. **No production deployment was made.**
