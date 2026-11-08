# Portfolio Expertise Expansion & Pre-Publication Audit

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Scope: local implementation, accessibility, and pre-publication audit only.  
Authorization: **No commit, push, deployment, or publication.**

## 1. Expertise Icons Implemented

Added **Technologies, Tools & Professional Skills** to Expertise with eight responsive, visibly separated categories:

- AI Engineering & Implementation: AI engineering, implementation/integration, AI-assisted software development, AI-powered workflow automation, AI solutions development, and AI applications in EdTech/digital learning; ChatGPT/OpenAI, Gemini, Claude, Microsoft Copilot, GitHub Copilot, and Perplexity are listed separately as tools.
- Programming Languages & Web Technologies: Java, JavaScript, HTML5, CSS3, Python, PHP, SQL, TypeScript, React, Next.js, Node.js, Django, and Tailwind CSS. Languages and frameworks are separate subsections.
- Databases & Data Technologies: MySQL, MongoDB, PostgreSQL, and Firebase.
- Cloud Computing & Infrastructure: Google Cloud, AWS, Vercel, and GitHub Actions.
- Operating Systems: Windows, Linux, Ubuntu, and macOS under desktop/server; Android and iOS under mobile.
- Project Management & Delivery: competency marks for planning, workplans/scheduling, task/milestone tracking, team/stakeholder coordination, and monitoring/evaluation/reporting; a separate software-tools group for Trello, Jira, Asana, Notion, Microsoft Teams, and Slack.
- Digital Skills Training & EdTech: training, facilitation, LMS, e-learning, blended learning, content-development, and STEM/digital-skills competencies; Moodle and Google Classroom as tools.
- Design, Collaboration & Productivity: Figma, Adobe XD, Adobe Creative Cloud, Canva, Google Workspace, Microsoft 365, Zoom, Replit, and GitHub.

Each named item appears once. Brand assets use the existing Iconify runtime and Simple Icons/Logos sets where available. Abstract competencies use neutral Material Design icons. Microsoft Copilot uses a neutral assistant icon because the installed Iconify set had no Microsoft Copilot brand glyph; Microsoft 365 uses the available Microsoft mark. Neither is presented as an exact product logo.

The named AI engineering and implementation competencies reflect the proficiency Peter explicitly confirmed in this directive. The section does not claim a particular deployed AI product, certification, or project outcome. Other listed technologies and software tools reflect the requested and existing portfolio inventory; their presence does not imply equal proficiency. Owner review of the broader technology list is still recommended before publication.

## 2. AI Positioning and Interaction

AI Engineering & Implementation is now a core Expertise category and a Home highlight, alongside Project Management, EdTech & Digital Learning, Digital Skills & Workforce Development, Full-Stack Development, and Cloud Solutions. The About narrative includes AI engineering and implementation as part of technical delivery. The primary identity remains **Digital Transformation & Technology Solutions Professional**. The competency copy covers the six requested areas without naming a deployed product, certification, or outcome that was not established.

The grid has consistent 30px icons, fixed minimum tile sizing, visible names for touch users, and an accessible name, `title`, and associated tooltip for each keyboard-focusable tile. Tooltips use a restrained fade/upward motion; hover and `:focus-within` reveal the label. Backgrounds use the active theme's dark color and white text. No category tabs were added because the eight categories are already separate, scannable sections.

Browser checks confirmed **70/70 Iconify SVGs rendered**, all 70 names remained visible, keyboard focus revealed the tooltip in Minimal, Blue, and Dark themes, and reduced-motion reduces tooltip transition duration. The section uses the existing Iconify 1.x CDN/runtime; if that external script is unavailable, the text labels remain, but the brand marks may not render.

## 3. Portfolio Audit Findings

### Content and Professional Positioning

- Home, About, Expertise, and Experience maintain the Digital Transformation & Technology Solutions identity. About remains narrative-led; Expertise lists capabilities and evidence; Experience carries employer, role, dates, and role-specific metrics.
- Project Management appears on Home and Expertise, and FCA duties are described through documented coordination, scheduling, follow-up, monitoring, and reporting responsibilities. The PM skills list does not claim a certification, budget ownership, or newly invented outcome.
- AI engineering, implementation, integration, workflow automation, software development, solutions development, and EdTech applications are presented as professional competencies at the owner's stated proficiency. No specific product deployment, certification, or measured AI outcome is claimed.
- Quantified FCA, Realfield, and KPLC impact figures are still user-supplied and have not been independently checked against reports, HR records, datasets, or employer documents. Verify sources, periods, denominators, and individual/team attribution before publication.
- The broader technology inventory includes items supplied in the directive, including languages, databases, cloud products, operating systems, and AI tools. The visible note avoids implying equal proficiency across every technology; Peter should review this broader list. AI engineering proficiency itself is owner-confirmed.
- Education is labeled “Academic & Professional Learning,” but Scrimba is still stored in the `degrees` data collection. Consider structurally separating the course from academic degrees and confirm degree/certification dates and credential links.

### Project Case Studies

The Pemanju Farm Manager case study already covers context, problem, objectives, role, solution, architecture, technologies, engineering challenges, implementation status, and implemented versus planned stack. It does not show independently verifiable outcome metrics, a public source/demo link, or a Pemanju-specific screenshot in the inspected workspace. Descriptive “evidence” paragraphs are not an independent artifact. The case study is structurally useful but not yet sufficient as verifiable proof.

Before publication, validate the implementation claims against the actual code and add approved screenshots or diagrams and a public repository/demo if available. If private, say so and provide a safe artifact that does not expose farm/customer data. A digital-skills/EdTech programme case study could demonstrate project delivery, but requires approval and de-identification; do not disclose FCA/partner/participant data. A Realfield case study similarly needs permission and anonymized evidence.

### Audit-Driven Correction

The live Open Source route previously rendered aggregate stats/charts and PR/issue cards from snapshots that include third-party repository records and mixed author identities. The displayed totals therefore could be read as Peter-only contributions when that attribution was not established. The route now shows a neutral profile introduction and live GitHub-profile link instead. Snapshot/component files remain preserved but are not rendered. A regression test protects the single-H1 route and absence of those unverified panels.

## 4. Audit Severity Register

### Critical

- **Private key exposure in Git history:** earlier reports document `githubkey` in the initial commit. The repository-local copy was moved/deleted and the path ignored, but current `npm run security:scan` only checks present text/build output and does not rewrite history. Revoke/rotate the key and coordinate owner-approved history cleanup before any push.

### High

- **Dependency vulnerabilities:** current `npm audit` reports **184 advisories: 9 low, 127 moderate, 43 high, and 5 critical**. `react-scripts@3.2.0` is the directly reported high-severity dependency; its proposed `react-scripts@5.0.1` remediation is a major CRA migration. The audit remains unresolved; do not treat a successful build or current secret scan as security clearance.
- **Custom domain/build mismatch:** `CNAME` specifies `ashutoshhathidara.com`, while `package.json` homepage/build targets `https://pcodesdev.github.io`. Reconcile asset base, canonical host, and Pages configuration before deployment.
- **Public impact claims need source validation:** user-provided participant, placement, data-volume/accuracy, and adoption figures remain visible. Confirm records, measurement window, denominator, and attribution before publication.

### Medium

- **Case-study evidence gap:** Pemanju has good narrative structure but no linked code/demo or project-specific screenshot, and no independently checked outcome. Add verified evidence or explicitly label the work private/in development; validate all implementation claims.
- **Technology familiarity not independently evidenced:** the new icons follow the directive and existing skill list, but do not prove hands-on depth. Keep the familiarity caveat and review every tool/OS/technology with the portfolio owner.
- **Contact delivery unverified:** FormSubmit activation and inbox delivery have not been tested with a real message. Automated tests mock provider success/error; they prove UI behavior, not delivery.
- **External sample demos:** the browser pages supplied with this session showed the React Movie App deployment returning `404 DEPLOYMENT_NOT_FOUND` and a Weather sample attempting `http://localhost:3000/apikey` from the deployed site, producing CORS/fetch errors. These sample URLs are not currently present as live-demo fields in the curated `projects.json`; do not publish them as working demos unless repaired and rechecked.
- **Education structure/verification:** Scrimba is a course but remains in the `degrees` collection; confirm credential names, issuers, dates, and links.
- **HashRouter SEO constraint:** route-specific Helmet metadata is client rendered and every route shares the root canonical. Sitemap lists only the homepage. Crawlers that do not execute JavaScript may not see route-specific metadata.

### Low

- **Remote Iconify dependency:** labels and accessible names remain without the CDN, but brand logos depend on the existing external Iconify script. Consider locally bundling/caching icons if offline or third-party availability is a requirement.
- **Toolchain warning:** tests/build still emit Node `DEP0176: fs.F_OK is deprecated` from the legacy CRA/Jest stack. Local Google Analytics requests were aborted during navigation; no app `pageerror` was recorded.

## 5. Technical and Browser Validation

- Local browser matrix: all eight routes at **1440px and 390px**, 16 checks. Expected titles rendered; one canonical and description per route; no horizontal overflow; no broken local images; no app page exceptions.
- Expertise: nine capability cards and eight icon categories; 70 SVG icons rendered at desktop and mobile; Open Source now renders one H1 and no snapshot contribution panels.
- Tooltip interaction: hover and keyboard-focus behavior verified; theme surfaces checked in Minimal, Blue, and Dark with white text. Visible icon names provide a touch-safe fallback. Reduced-motion suppresses/reduces non-essential animation.
- Local secret scan: `npm run security:scan` passed with no common private-key/access-token signatures found in current repository text or generated build. This does not address Git history or guarantee all secret formats are detected.
- `CI=true npm test -- --watch=false --maxWorkers=2`:

```text
Test Suites: 17 passed, 17 total
Tests:       44 passed, 44 total
```

- `CI=true npm run build` compiled successfully. The generated build still assumes `https://pcodesdev.github.io`.
- `npm audit --omit=dev` returned the same **184** counts because the legacy vulnerable build dependency tree is reachable from declared production dependencies in this manifest.
- Contact form UI has required labels/validation and mocked-provider tests, but no real provider/inbox test was done.

## 6. Files Changed in This Phase

- `src/technologySkills.js` — 8 categorized skill/tool datasets with group distinctions and no duplicate names.
- `src/components/technologySkills/TechnologySkills.js` and `.css` — responsive Iconify grid, captions, tooltips, focus/hover behavior, theme styles, and reduced-motion handling.
- `src/components/technologySkills/TechnologySkills.test.js` and `src/technologySkills.test.js` — component semantics, Iconify scan hook, category coverage, AI wording, and PM/tool separation.
- `src/pages/expertise/ExpertiseComponent.js` and `.test.js` — integrate the section and test capability presentation.
- `src/pages/opensource/Opensource.js`, `src/containers/organizations/Organizations.js`, and `src/pages/opensource/Opensource.test.js` — remove unverified snapshot panels from the visible route, update neutral source wording, and protect heading/data behavior. Underlying snapshots/components remain in the workspace.

## 7. Recommended Corrections Before Publication

1. Revoke/rotate the historical private key and perform coordinated history cleanup; current scanner success is insufficient.
2. Address the 184 audit findings through a tested CRA/toolchain migration and dependency review; avoid forced major-version audit fixes.
3. Reconcile `CNAME`, `homepage`, build asset URLs, and canonical host.
4. Verify public outcome metrics against source records and have Peter review the broader technology/tool list; retain AI Engineering & Implementation as an owner-confirmed competency.
5. Add substantiated Pemanju evidence (approved screenshots/diagram, repo/demo, or private-project artifact) and validate current implementation/status claims.
6. Confirm FormSubmit activation and real inbox delivery.
7. Repair/revalidate any demo intended for publication; the supplied React Movie and Weather sample URLs currently fail as described, though they are not configured live-demo fields in the current project data.
8. Separate courses from degrees and verify education/certification metadata.
9. Keep contribution snapshots off the public route until every record and aggregate can be attributed to Peter and given an as-of date.

## Final Readiness Verdict

**NOT READY for publication.** The requested icon section is implemented and the local test/build/browser checks pass, but the historical private-key exposure, severe dependency audit, host mismatch, and unverified public metrics remain unresolved. Contact delivery and case-study evidence also need confirmation. No commit, push, deployment, or publication was performed.
