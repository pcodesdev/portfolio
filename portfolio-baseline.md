# Portfolio Baseline Report

## 1. Current architecture and technology stack

- Framework: React 16 with Create React App via `react-scripts` 3.2.0
- Routing: `react-router-dom` v5
- Styling: Styled Components + CSS modules/stylesheets
- SEO: `react-helmet`
- UI utilities: `react-reveal`, `react-bootstrap`, `baseui`, `styletron`
- Data and content: static configuration in `src/portfolio.js` plus JSON under `src/shared`
- Build tooling: npm scripts in `package.json` with `react-scripts --openssl-legacy-provider build` and `start`
- Deployment target: GitHub Pages (`homepage` set to `https://pcodesdev.github.io`)

## 2. Existing website sections and content structure

The current portfolio is organized around a template-style landing page and standard portfolio sections:

- Home / greeting section
- Skills / expertise
- Experience page
- Education page
- Projects page
- Open source page
- Contact page
- Footer and top button

The content is largely centralized in `src/portfolio.js`, which defines:

- SEO metadata
- greeting text
- social media links
- skills and expertise copy
- experience entries
- education / certifications
- project publication data
- contact page data

## 3. Current career positioning and messaging

The site currently presents a generic developer profile with heavy emphasis on:

- Full Stack Developer
- Cloud Architect
- AWS / Azure / AI related positioning
- Training and digital skills claims
- Broad, template-style claims with high-level metrics

At baseline, the headline and summary are not aligned with the brief’s required scope of Digital Transformation & Technology Solutions, and several claims are unverified or overwrite the intended positioning.

## 4. Existing professional experience claims and metrics

The experience data in `src/portfolio.js` contains several numerical and outcome statements, including:

- 5+ years experience
- 2000+ participants trained
- 98% satisfaction
- 62% job placement
- 40% improvement claim
- broad cloud architecture claims

These claims require validation before public publication. The brief explicitly requires all metrics to be evidence-backed and approved before being published.

## 5. Existing projects and technical evidence

The codebase does not yet feature a dedicated flagship project detail for Pemanju Farm Manager. The project is referenced in the experience section but not presented as a formal engineering case study or architecture narrative.

The current project/card structure is primarily repository-based and generic, not a recruiter-friendly technical project narrative.

## 6. UI / UX issues and accessibility concerns

Observed baseline issues include:

- Generic portfolio template branding rather than targeted professional positioning
- Large volumes of marketing-heavy, non-evidence-based copy
- Over-claiming in the home page and experience sections
- Visual hierarchy is functional but does not emphasize a flagship case study or a clear professional identity
- Some accessibility warnings are already present in the codebase (emoji accessibility and unused imports)

## 7. Build, test and lint status

Validation performed before changes:

- `npm install` succeeded
- `npm run build` succeeded with warnings
- `npm test -- --watch=false` succeeded with 1/1 test passing

Key warnings observed during the baseline build:

- `jsx-a11y/accessible-emoji` in `src/components/themeSwitcher/SimpleThemeSwitcher.js`
- `no-unused-vars` in `src/components/header/Header.js`
- `no-unused-vars` in `src/containers/skills/DataScienceImg.js`

## 8. Dependency risks and technical debt

- React 16 / old CRA stack
- Old `react-scripts` version and build warnings
- Some content and claims are template-derived and over-optimized for marketing language rather than evidence
- Several URLs and public-facing statements appear more promotional than verifiable
- The portfolio data is centralized in one file, which makes evidence-based rewriting manageable but also makes inaccurate claims easy to propagate across the site

## 9. Baseline screenshots

- Desktop: [baseline-desktop.png](baseline-desktop.png)
- Mobile: [baseline-mobile.png](baseline-mobile.png)

## 10. Proposed files and components to modify

Primary files anticipated for the main rewrite:

- `src/portfolio.js`
- `src/containers/greeting/Greeting.js`
- `src/containers/skills/Skills.js`
- `src/components/header/Header.js`
- `src/pages/projects/Projects.js`
- `src/pages/experience/Experience.js`
- `src/pages/home/HomeComponent.js`
- `src/pages/contact/ContactComponent.js`
- `src/components/seoHeader/SeoHeader.js`

Additional supporting work:

- `src/App.css` and related component CSS for hierarchy and readability
- Any data files under `src/shared` if content needs to be reorganized
- New documentation files for the rework and final validation report

## 11. Baseline summary

The codebase is a functioning React portfolio template that is easy to extend, but the existing content is not yet aligned to the requested professional identity or evidence-based case-study framing. The project is suitable for a targeted rewrite without major structural changes, with the most important work concentrated in the central portfolio data and the main project/experience sections.
