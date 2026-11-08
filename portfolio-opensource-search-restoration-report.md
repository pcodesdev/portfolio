# Open Source Restoration & Ask My Portfolio Report

Date: 2026-11-05  
Project: Peter Njuguna Portfolio  
Scope: local implementation, attribution review, and validation only.  
Authorization: **No commit, push, deployment, or publication.**

## Open Source Page Restoration

Restored the requested hierarchy: centered **Open Source Contributions** introduction, four summary cards, two distribution panels, and PR/issue record panels. The summary labels remain Total Contributions, Pull Requests, Issues Resolved, and Stars Earned. The CSS-rendered doughnut rings use author-filtered GitHub totals and expose status values through accessible labels and legends. Returned PR and issue records link directly to GitHub and display their author, repository, state, date, and available PR change details.

The bundled REST snapshot was retrieved on 2026-11-05 for verified profile `pcodesdev` (account ID 44283776): 307 public repositories; 30 stars and 6 forks summed across owned repositories; 6 author-matched PRs (3 merged, 3 open); and 14 issue-search matches (10 closed, 4 open), of which 12 rows were returned. The UI distinguishes matches from returned rows and labels the snapshot as cached/stale using its retrieval timestamp. It does not claim that closed issues were personally resolved. The 731 commit-author search matches are not a contribution-calendar total; the calendar remains unavailable without authenticated GraphQL access.

## Contribution Attribution

PR and issue records are normalized and filtered by exact GitHub author login `pcodesdev`; merger, assignee, repository ownership, or membership alone is not treated as authorship. PR/issue totals are separately sourced from author-filtered REST search. Stars and forks are summed only over repositories whose owner login matches `pcodesdev`, and are described as owned-repository totals rather than stars earned on unrelated projects. GitHub commit author search is explicitly distinguished from the contribution calendar. Issue totals retain the API's 14-match versus 12-returned-row completeness caveat.

## Ask My Portfolio Implementation Status

The portfolio-wide search entry point is mounted at the app shell and available from all routes. The optional dialog includes the requested subtitle, question input, example questions, loading/status/error handling, page links, and a conventional local fallback. It closes with Escape/backdrop and returns focus to the opener. It has no separate route and does not obstruct the normal portfolio.

`src/search/knowledge-base.json` is the approved-content allowlist spanning Home/profile, About, Expertise, AI/PM competencies, roles, project case studies/cards, education, Open Source, and public Contact details. It excludes private repositories/files, internal FCA or partner records, participant data, and the Farm Manager database. A normalized GitHub snapshot is combined with this allowlist in local and server retrieval; exact author filtering and stable links are applied before those records enter search. Duplicate snapshot rows in the static corpus were removed.

`src/search/retrieval.js` provides bounded keyword retrieval with a small synonym map, title weighting, domain diversity, and no-match result. Aggregate GitHub questions retain the profile summary, repository questions prefer linked PR evidence, and duplicate source URLs are collapsed. The app presents concise matching excerpts and source links without a model call when no endpoint is configured. Rotating suggestions are generated across nine content domains, including Open Source.

`api/ask.js` provides a server-side retrieval/generation contract. It requires `OPENAI_API_KEY`, `OPENAI_MODEL`, `PORTFOLIO_SEARCH_ALLOWED_ORIGIN`, and Upstash Redis REST credentials for shared per-IP rate limiting; it restricts methods/origin/question size, fails closed if rate limiting is not configured, retrieves only from the public corpus, passes excerpts as untrusted data, filters model citations to retrieved source IDs, caps output, and abstains when no relevant source is found. Credentials are not in browser code or checked-in environment files.

**Important status:** the static React app has no configured serverless runtime, provider credentials, allowed production origin, or Redis service. No endpoint has been deployed and no live provider response has been verified. Therefore the operational experience is local keyword search with citations and an explicit message that AI answers are not connected in this build. The AI backend remains inactive until externally configured and end-to-end tested.

## Tests and Validation

Added tests cover:

- Open Source summary/chart/record counts, accessible distribution labels, theme surfaces, retrieval freshness, and author-filtered GitHub records.
- Retrieval across Project Management expertise plus FCA experience, AI skills, Pemanju case study, language/cloud/EdTech skills, public contact, and unsupported questions.
- Search entry/dialog labels, local fallback, source links, no-match handling, AI loading/success/error fallback, and Escape focus restoration.
- Server endpoint source allowlisting, server-only credentials, origin/method validation, missing questions, no-match abstention, prompt-injection boundaries, rate limiting, and fail-closed configuration.

Final full validation passed: **24 test suites / 84 tests**. `npm run build` compiled successfully, `npm run curate:validate` validated 6 featured projects and 6 publications, and `npm run security:scan` found no common private-key/access-token signatures in current repository/build text. The security scan does not inspect Git history. The build remains local and assumes `https://pcodesdev.github.io`.

`npm run security:scan` found no common key/token signatures in current repository/build text; it does not scan Git history. `npm run curate:validate` passed for 6 featured projects and 6 publications. `npm audit` remains at 184 advisories (9 low, 127 moderate, 43 high, 5 critical).

Responsive checks should cover the same requested hierarchy after the final live-data and search-source updates. The Open Source route now renders 18 returned PR/issue records rather than empty placeholders; visual browser validation is pending in this pass.

## Outstanding Issues and Risks

1. Authenticated GraphQL access is still required for the true contribution-calendar total and activity timeline. Public REST commit-search matches must not be presented as that total.
2. The AI endpoint is code only. It needs a compatible serverless deployment, server-side secrets, configured CORS origin, Upstash rate-limit storage, budget/usage caps, privacy notice, and end-to-end provider validation. Do not describe AI answers as operational until this is done.
3. Current npm audit findings remain 184 (9 low, 127 moderate, 43 high, 5 critical); plan a tested CRA/toolchain migration.
4. The previously exposed private key remains in Git history. Rotate/revoke it and perform coordinated history cleanup before any push.
5. The build homepage remains `pcodesdev.github.io`, while `CNAME` specifies `ashutoshhathidara.com`.
6. Existing impact metrics and wider technology inventory still require owner/source review. Contact form delivery remains unverified.

**Final status:** Open Source restoration, author-verified REST snapshot integration, portfolio-wide local search, and the server-side endpoint contract are implemented locally. Automated tests/build/content validation passed. Hosted AI provider verification remains pending; local search is available and explicitly identifies itself as the fallback. No commit, push, deployment, or publication was performed.
