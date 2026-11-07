# Content curation and publication

The portfolio features at most six GitHub projects and six Medium articles. Selection and publication are automated by
[`featured-content-curation.yml`](../.github/workflows/featured-content-curation.yml). Rubric version: **2**.

## Pipeline

1. **Discover** – all public `pcodesdev` repositories (paginated GitHub REST API) and the `@pcodesdev` Medium RSS feed.
2. **Exclude** – forks, archived and empty repositories, `*.github.io` and profile repositories, boilerplate-only repositories.
3. **Score** – every remaining item against the rubric below.
4. **Select** – highest scores above the threshold, duplicates removed, capped at six per type.
5. **Gate** – validation, scenario and image-enrichment tests, the full Jest suite, a production build, checks for featured URLs and local image assets, and two credential scans.
6. **Deploy** – publish `build/` to the Pages repository, verify the live bundle and featured image URLs, and roll back on bundle-verification failure.
7. **Commit** – only after successful deployment checks, the refreshed data files and generated image assets are committed to `main`.

Any failing gate stops the run before step 6, so the previous live version stays in place.

## Schedule and triggers

- Daily at 06:17 UTC (`cron: "17 6 * * *"`) and manually through **Run workflow**.
- Manual inputs: `dry_run` (evaluate, test and build only) and `force_deploy` (deploy even if the content is unchanged).
- A deploy happens only when the generated content changed (volatile fields such as stars and `updatedAt` do not count) or `force_deploy` is set.
- One run at a time (`concurrency: portfolio-content-publication`, no cancellation of in-flight deployments).
- Optional `UNSPLASH_ACCESS_KEY` and `PEXELS_API_KEY` Actions secrets enable attributed stock-image search; set the `IMAGE_SEARCH_PROVIDER` Actions variable to `unsplash` or `pexels`. Without these credentials, generated branded thumbnails are used.

## Project rubric (100 points)

| Criterion                                           | Points | Signals                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Technical complexity and implementation quality     | 25     | up to 10 technical families in the README/metadata (API, backend, database, auth/security, tests, containers, CI/CD, modern front-end, architecture/validation, performance) at 1.5 each (max 15); language breadth (2 languages 3, 3+ languages 5); repository size (50 KB 2, 200 KB 3, 1 MB 5) |
| Originality and innovation                          | 10     | meaningful description 3; not a tutorial/template 4; innovation signals (AI, automation, analytics, integration, real-time) 3                                                                                                                                                                    |
| Practical usefulness                                | 15     | problem-solving signals (reporting, tracking, import/export, automation, search, assessment and similar) 3 each (max 9); reachable live demo 4; usage/installation instructions 2                                                                                                                |
| Relevance to professional profile                   | 20     | education and digital skills 6; AI engineering 5; project management and transformation 4; cloud solutions 3; community impact 2                                                                                                                                                                 |
| Completeness and active development                 | 10     | README of at least 300 characters 3; development span between creation and last push (7 days 2, 30 days 4); two or more topics 2; stars (up to 1)                                                                                                                                                |
| Documentation quality                               | 10     | README length (500 characters 3, 1,500 characters 5); headings (3 → 2, 6 → 3); code blocks or screenshots 2                                                                                                                                                                                      |
| Demonstrated engineering and problem-solving skills | 10     | distinct skill families (software engineering, AI, digital transformation/education, cloud/DevOps, data, automation) at 2 each                                                                                                                                                                   |

Penalty: −25 for tutorial, coursework, boilerplate or template repositories.
**Minimum score to be featured: 50.**

## Article rubric (100 points)

| Criterion                            | Points | Signals                                                                                                                                                                       |
| ------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Technical depth and accuracy         | 25     | word count (400 → 5, 900 → 10, 1,500 → 12); technical terms (API, architecture, data, deployment, implementation, security, testing, models) at 2 each (max 9); code blocks 4 |
| Originality of insights              | 15     | first-hand experience markers 6; non-sensational title 3; trade-off or contrast language 3; concrete examples 3                                                               |
| Practical value                      | 15     | how-to, steps, checklist, framework, lessons, recommendations at 2 each (max 8); lists 3; code or examples 4                                                                  |
| Relevance to professional expertise  | 20     | software engineering 5; digital transformation and skills 5; technology adoption and digital ecosystems 4; cloud and implementation 4; AI and technical products 2            |
| Quality of explanation and structure | 15     | headings (1 → 2, 3 → 5); paragraphs (4 → 2, 8 → 4); descriptive excerpt 3; images 3                                                                                           |
| Meaningful analysis                  | 10     | analysis markers (because, therefore, evidence, impact, outcomes, risks, challenges) at 1.5 each (max 7); 800+ words 3                                                        |

Penalties: −10 for sensational or clickbait topics, −15 for fewer than 300 words.
**Minimum score to be featured: 50.**

## Ranking

- Score descending, then repository or article id ascending. Recency never breaks ties and the newest item is not assumed to be the best.
- Scores are pure functions of the fetched metadata (no clock input), so the same inputs always produce the same ranking.
- A newcomer replaces a featured item only if it scores higher; items that fall out of the top six are listed as `outranked`.
- Duplicates are detected by id, canonical URL and, for articles, normalized title. The highest-scoring copy wins.
- Owner overrides live in [`scripts/curation-overrides.json`](../scripts/curation-overrides.json): `pinned*` items are always featured (they bypass only the score threshold and must still be eligible), `excluded*` items are never featured, and `projects`/`publications` hold manual card text.
- The Medium feed exposes only the 10 newest posts, so featured older posts are carried forward from the stored data with their stored score.

## Safeguards

- Data is written only after both sources were fetched and validated; a GitHub rate limit, Medium outage or empty feed fails the run and leaves the files untouched.
- Rubric changes require bumping `RUBRIC_VERSION`; `npm run curate:validate` rejects data produced by another version or containing unpinned items below the threshold.
- Deployment is a plain push to `pcodesdev/pcodesdev.github.io` (`main`). It is never forced, so a concurrent change makes the push fail without overwriting it.
- After pushing, the deploy script polls `https://pcodesdev.github.io/asset-manifest.json` until it serves the new main bundle. On timeout it pushes a revert commit that restores the previous tree and fails the run.
- The workflow token has `contents: write` only in the publish job; repository checkout does not persist credentials. The cross-repository token is used only by the deploy step and is passed to git through environment variables, never in a URL or argument.

## Required one-time setup

1. Create a **fine-grained personal access token** limited to the repository `pcodesdev/pcodesdev.github.io` with **Contents: Read and write** (nothing else).
2. Add it to `pcodesdev/portfolio` as the Actions secret **`PAGES_DEPLOY_TOKEN`**.
3. Confirm GitHub Pages for `pcodesdev/pcodesdev.github.io` is set to deploy from branch `main`, folder `/ (root)`.
4. Confirm `main` in `pcodesdev/portfolio` allows pushes by `github-actions[bot]` (no pull-request-only protection).
5. Run the workflow once with **Run workflow** and `dry_run` enabled, then once more without it.

## Observability

Each run writes a report to the job summary and uploads `curation-report.json` as an artifact. It contains the repositories and
articles discovered, the number evaluated, every score with its decision (`selected`, `selected-pinned`, `outranked`,
`below-threshold`, `duplicate`, `ineligible`, `excluded-by-owner`, `not-shortlisted`), added and removed items, validation
results, the deployment outcome (`deployed`, `no-change`, `rolled-back`, `failed`) and the timestamp of the last content update
(`generatedAt` in the data files, which changes only when content changes).

## Local commands

```bash
npm run curate:featured -- --dry-run   # rank without writing
npm run curate:featured                # rewrite the two data files
npm run curate:validate                # structural, uniqueness and quality checks
npm run test:curation                  # pipeline and deployment scenario tests
npm run build && npm run verify:build  # confirm featured URLs are in the bundle
npm run verify:live                    # verify local featured image URLs on LIVE_SITE_URL
npm run deploy                         # manual deploy with your own Git credentials
```
