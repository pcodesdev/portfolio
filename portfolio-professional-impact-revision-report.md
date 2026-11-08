# Professional Impact Revision Report

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Scope: local code/content changes and development-browser validation only.  
Authorization: **No commit, push, or deployment.**

## 1. Baseline Findings

- The existing worktree contained substantial uncommitted changes. They were preserved; no reset, commit, push, or deployment was performed.
- The professional identity and EdTech planning initiative were already in place from the prior phase, but quantified FCA, Realfield, and KPLC impact supplied in the current directive was not represented in the Experience records.
- Experience cards supported a single prose description. They did not provide a separate achievement list for readable, attributed metrics.
- The structured history had two FCA roles, a Full-Stack Developer role, and a 2017 KPLC support record; it did not include the supplied Realfield Data Specialist or 2021 KPLC ICT Technical Associate records.
- The About page had selected programme impact content, and Expertise had capabilities and impact evidence fields, but the new metrics and two distinct FCA placement rates were not fully represented.

## 2. Updated About and Expertise Content

About now includes selected impact summaries attributed to each organization/role:

- FCA Kenya Project Officer – Digital Skills: 500+ refugee and host-community youth supported, approximately 70% women and girls, 1,800+ secondary learners reached annually through bootcamps, and 12+ trainers/facilitators/consultants coordinated.
- FCA Kenya employment pathways: a reported 50% placement success rate for the Project Officer role; the earlier Project Assistant role’s reported 60% is explicitly separate.
- FCA Kenya Project Assistant / Digital Skills Trainer: 600+ learners trained.
- Realfield Limited Data Specialist: 500,000+ records at 99.7% accuracy and an 80% reduction in manual verification time.
- Kenya Power ICT Technical Associate: 50+ non-technical staff trained and 30% digital-tool adoption improvement.

Expertise now includes role-grounded impact evidence for Digital Skills & Workforce Development, Data Systems & Technology Solutions, and Digital Transformation & Technology Training. EdTech implementation includes LMS and blended-learning support, resources, assessments, learner support, and trainer/partner engagement. The remote-area EdTech concept remains separately labeled planning-stage; Full-Stack evidence remains Pemanju Farm Manager, and cloud sync remains planned.

## 3. Quantified Professional Experience

### Project Officer – Digital Skills

**Finn Church Aid Kenya | December 2024–Present | Kakuma & Dadaab, Kenya**

Kept the existing title and dates. The role description covers onboarding, schedules, attendance, mentorship, learner progress/follow-up, resources and assessments, use of programme data, LMS/blended/AI-assisted learning support, reporting, and coordination with the partner groups named in the directive.

Achievement bullets now show:

- 500+ refugee and host-community youth supported in training; approximately 70% are women and girls.
- 1,800+ junior and senior secondary school learners reached annually through STEM and digital-skills bootcamps.
- 12+ trainers, facilitators, and consultants coordinated and supervised.
- A **reported 50%** placement-success rate for this role, with the contribution wording retained (“Contributed to graduate employment pathways”).

### Project Assistant / Digital Skills Trainer

**Finn Church Aid Kenya | January 2022–November 2024 | Nairobi & Kakuma, Kenya**

The title now reflects the supplied Digital Skills Trainer responsibility. The description includes hands-on training, blended learning, LMS support, assignments, onboarding, mentorship, career readiness, portfolios, post-training follow-up, and ICT troubleshooting.

Achievement bullets show 600+ learners trained and a **reported 60%** placement-success rate for this role. The card explicitly says this 60% is separate from the Project Officer’s 50%; neither figure is presented as an organization-wide outcome.

### Data Specialist

**Realfield Limited | March 2021–December 2021 | Nakuru, Kenya (Remote)**

Added the supplied role with data collection, cleaning, validation, analysis, anomaly detection, governance, and audit-readiness responsibilities. Achievements show 500,000+ records processed with 99.7% accuracy and automated validation pipelines reducing manual verification time by 80%.

### ICT Technical Associate

**Kenya Power and Lighting Company | January 2021–March 2021 | Nakuru, Kenya**

Added the supplied role, technical documentation and user guidance responsibilities, 50+ non-technical staff trained, and 30% improvement in digital-tool adoption.

The existing IT Technical Support Specialist role dated November–December 2017 remains as a separate record. It was not overwritten or conflated with the supplied 2021 ICT Technical Associate role.

## 4. Attribution and Credibility Controls

- The Project Officer’s 50% and Project Assistant’s 60% placement rates remain attached to their respective roles and explicitly separate.
- “Supported,” “facilitated,” “coordinated,” and “contributed” are retained where the supplied wording assigns shared responsibility; the copy does not convert contributions into sole ownership.
- The remote-area EdTech initiative remains planning/concept-stage. No product name, features, architecture, partners, schedule, learner usage, adoption, or outcomes were added.
- Pemanju implemented offline-first/local records and spreadsheet workflows remain distinct from planned cloud synchronization and expanded deployment.
- The numbers in this revision were supplied in Peter’s directive. They were not independently audited against donor reports, HR records, datasets, or employer documentation in this local work session. Peter should verify the source, period, denominator, and attribution of each metric before public release. In particular, placement-rate definitions and cohort periods should be confirmed.
- No additional participant, budget, satisfaction, award, or placement metrics were invented. All figures supplied for the requested roles were represented in the relevant About/Expertise/Experience sections.

## 5. Presentation and Responsive Behavior

Experience cards retain the existing visual system and now render achievement bullets in a compact list below each role summary. About uses a restrained two-column selected-impact list that stacks at mobile widths. Expertise uses compact evidence lists rather than large animated number counters.

Expanded Experience browser checks at 1440, 1024, 768, 390, and 360 CSS pixels found:

- Six work-history cards, including the two FCA roles, Realfield, 2021 KPLC, the existing Full-Stack role, and the existing 2017 IT support role.
- Four achievement lists for the four roles with quantified achievements.
- Every required metric visible at every checked width.
- No document horizontal overflow.
- Longest mobile cards are vertically dense (approximately 993px for the first FCA card at 360px) but remain within the viewport width; this is a content-density tradeoff, not clipped content.
- About and Expertise were also checked at all five widths: five impact rows and seven capability areas rendered without horizontal overflow.

The current browser screenshot integration has previously reset viewport dimensions after capture. Responsive findings above use live DOM checks rather than claiming authoritative pixel-perfect screenshots.

## 6. Tests and Build

`CI=true npm test -- --watch=false --maxWorkers=2`:

```text
Test Suites: 11 passed, 11 total
Tests:       33 passed, 33 total
```

New regression coverage verifies role-to-metric attribution, separate placement rates, Experience achievement-list rendering, and About’s selected impact values.

`CI=true npm run build`:

```text
Creating an optimized production build...
Compiled successfully.
The project was built assuming it is hosted at https://pcodesdev.github.io.
The build folder is ready to be deployed.
```

The existing Node `fs.F_OK` deprecation warning remains. No lint script exists in `package.json`.

## 7. Files Changed in This Revision

- `src/portfolio.js` — FCA role summaries and achievement data; added Realfield and 2021 KPLC roles while preserving the existing 2017 KPLC record.
- `src/profileData.js` — About selected impact and Expertise impact evidence.
- `src/pages/about/AboutComponent.js` — renders selected impact.
- `src/pages/expertise/ExpertiseComponent.js` — renders compact impact evidence.
- `src/pages/profilePages.css` — responsive impact list styling.
- `src/components/experienceCard/ExperienceCard.js` and `.css` — role-specific achievement list rendering and styling.
- `src/profileData.test.js` — About metric/unique-label assertions.
- `src/experienceImpact.test.js` — role/date/company/metric attribution tests.
- `src/components/experienceCard/ExperienceCard.test.js` — achievement list rendering test.

Other existing worktree changes were not reverted or altered by this revision.

## 8. Remaining Issues and Recommendations

1. Peter should confirm the supplied metrics against source reports, including the populations/periods behind each placement percentage and the approximate share of women and girls.
2. The previously documented private-key exposure remains in Git history. Revoke/replace the key and complete coordinated history cleanup before any push.
3. FormSubmit activation and actual inbox delivery remain unverified.
4. `package.json` still builds with homepage `https://pcodesdev.github.io`, while the repository `CNAME` specifies `ashutoshhathidara.com`. Reconcile asset-base configuration before a future authorized deployment.
5. The local React Reveal deprecated lifecycle warning and locally aborted Analytics requests remain; neither caused the checked layout/test failures.
6. No commit, push, or deployment was performed.
