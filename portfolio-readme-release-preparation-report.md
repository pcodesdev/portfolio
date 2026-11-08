# README and GitHub Release Preparation Report

Date: 2026-11-05  
Repository: `pcodesdev/portfolio`  
Authorization: README/feasibility edits and GitHub push were authorized subject to the security gate. No deployment of `build/` was authorized.

## README Changes

Replaced the inherited template README with current project documentation covering:

- Peter Njuguna and the Digital Transformation & Technology Solutions Professional positioning, including the seven core areas.
- Current routes/features, categorized skills and tool icons, Project Management/AI positioning, themes/motion/accessibility, case-study status, Open Source presentation, and contact-delivery status.
- Actual dependencies: React 16, CRA/react-scripts 3.2, JavaScript/CSS, React Router 5 HashRouter, styled-components, Base Web/Styletron, Helmet, Iconify, Font Awesome, React Bootstrap, Chart.js, Node content scripts, and gh-pages.
- `npm ci`, `npm start`, tests, build, security scan, and curated-data validation commands.
- Implemented/local validation, externally unverified items, planned work, and unresolved blockers.
- The distinction between source and build output, the lack of a separate deployment remote, and the behavior of the existing `npm run deploy` script.

The README explicitly says no production deployment or publication is claimed. It links to the AI search feasibility document and documents the CNAME/homepage mismatch, contact verification status, historical-key blocker, and dependency audit.

## Build Folder Exclusion

- `.gitignore` contains `/build` and `git check-ignore -v build build/index.html` confirms the rule applies.
- `git ls-files build` returned no tracked build paths.
- `git diff --cached --name-only` returned no staged paths. Consequently, no build artifact is staged.
- `npm run build` recreates local `build/`; the output remains ignored and available for a separately approved deployment workflow.
- There is no separate deployment remote configured in this checkout. `npm run deploy` would publish `build/` to a `gh-pages` branch on `origin`, which is `https://github.com/pcodesdev/portfolio.git`. It was not run.
- The featured-content curation workflow runs tests/build and opens a review PR; its text explicitly says it does not deploy. The existing Node CI workflow targets `master` and `releases/*`, whereas the current branch is `main`; confirm intended CI triggers.

## AI Search Feasibility

The assessment is documented in [portfolio-ai-search-feasibility.md](portfolio-ai-search-feasibility.md). Recommendation: feasible at moderate complexity, but not implemented. Proposed design uses an allowlisted, approved public-content index; server-side query embeddings/model calls; retrieved source passages and page links; abstention on unsupported questions; a keyword fallback; rate/length/token limits; privacy controls; and API keys held only in server-side secrets. A serverless API is not currently present in this static portfolio.

A small prototype is estimated at 3–5 engineering days after content/hosting/provider approval; production hardening may add 1–2 weeks. Costs depend on traffic/provider/model and are estimated with a token-based formula and pilot traffic scenario, rather than an unsupported fixed dollar amount. Private repositories, personal files, FCA/partner/participant records, and the Farm Manager database are explicitly excluded. The feature remains a proposal pending separate approval.

## Git Diff and Worktree Summary

- Active branch: `main`, tracking `origin/main`; remote URL is `https://github.com/pcodesdev/portfolio.git`.
- No commit, push, or deployment was performed. No files are staged.
- `git diff --stat` reports **89 tracked changed/deleted files, 8,620 insertions, and 3,891 deletions**. This includes extensive prior local portfolio work, the `githubkey` working-tree deletion, package/lockfile work, route/theme/content changes, and this README update. It is not a summary of only this directive.
- New untracked files also exist from earlier work and this phase, including reports, assets, tests, scripts, and `portfolio-ai-search-feasibility.md`. They were preserved and not staged.
- `git diff --check` completed without whitespace errors; Git emitted only existing LF-to-CRLF working-copy notices. Prettier check passed for `README.md` and `portfolio-ai-search-feasibility.md`.
- A line-by-line review of the entire inherited, multi-phase worktree diff was not completed. It remains required before a future release; the push is already blocked by the security gate below.

## Validation Results

- `CI=true npm test -- --watch=false --maxWorkers=2`: **17 suites passed, 44 tests passed**.
- `CI=true npm run build`: compiled successfully. The generated build assumes `https://pcodesdev.github.io`.
- `npm run security:scan`: no common private-key/access-token signatures found in current repository text or generated build files. The heuristic excludes `.git` and does not establish historical safety.
- `npm audit`: **184 advisories: 9 low, 127 moderate, 43 high, 5 critical**. `react-scripts@3.2.0` is the directly reported high-severity dependency; npm's remediation path is the major CRA 5 migration.
- `npm run curate:validate`: passed with 6 featured projects and 6 featured publications.
- `git diff --check`: passed; `/build` is ignored and not tracked or staged.
- No deployment was performed.

The test/build output retains the existing Node `DEP0176: fs.F_OK is deprecated` warning.

## Security Remediation and Push Status

**Push blocked; no commit SHA exists.** Git history inspection confirms `githubkey` is present in the initial commit `4d9940db0ef189b364d4d4bbec03d716be7353f3`. The working-tree file is deleted and `/build` is excluded, but a current-worktree secret scan cannot revoke a key or remove it from history.

The key has **not** been rotated/revoked or purged from Git history in this session. Those actions require owner-controlled GitHub/key-provider access and a coordinated, explicitly approved history rewrite; the exposed private key was not read or printed. Do not push this branch until revocation/rotation and history cleanup are verified. No GitHub push was attempted.

## Remaining Release Blockers

1. Revoke/rotate the exposed private key and complete coordinated history cleanup; then rescan history before pushing.
2. Review the complete inherited worktree diff and select/approve intended files; there are extensive pre-existing changes and untracked artifacts, none staged here.
3. Plan remediation for 184 dependency advisories, including a tested CRA/toolchain upgrade.
4. Reconcile `CNAME` (`ashutoshhathidara.com`) with `package.json` homepage/build base (`pcodesdev.github.io`) and identify the intended separate deployment repository/remote.
5. Verify public impact metrics against primary sources and confirm FormSubmit activation/inbox delivery.
6. Confirm the AI search proposal and operating budget/hosting separately before implementation.

**Final status: README and feasibility documents updated; tests/build/security scan/data validation passed; build artifacts excluded; push not performed because the historical private-key security gate remains unresolved.**
