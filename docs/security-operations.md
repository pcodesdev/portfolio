# Security Operations

## Server endpoints

The optional API handlers are intended for a serverless deployment, not static GitHub Pages:

| Endpoint        | Methods           | Shared limit                                   | Storage failure behavior                              |
| --------------- | ----------------- | ---------------------------------------------- | ----------------------------------------------------- |
| `api/ask.js`    | `POST`, `OPTIONS` | 8 requests per client IP per 60 seconds        | Returns `503`; no AI request is sent without Redis    |
| `api/github.js` | `GET`, `OPTIONS`  | 12 live refreshes per client IP per 60 seconds | Serves the bundled/cached snapshot and marks it stale |

Both endpoints require an exact `Origin` match against `PORTFOLIO_SEARCH_ALLOWED_ORIGIN`. Counters and cache use Upstash REST storage so limits are shared across serverless instances. The GitHub endpoint checks a fresh cache before consuming a refresh allowance. The AI endpoint limits question input to 600 characters and only returns source IDs from retrieved allowlisted documents.

Configure these values only in the serverless platform's encrypted environment settings:

- `PORTFOLIO_SEARCH_ALLOWED_ORIGIN`: exact public portfolio origin.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`: durable shared cache and rate-limit storage.
- `OPENAI_API_KEY` and `OPENAI_MODEL`: optional, server-side only, for generated answers.
- `GITHUB_TOKEN`: optional read-only token for authenticated public profile/contribution queries.

The static portfolio works without these API deployments; no secrets are embedded in the frontend bundle.

## Dependency audit status

`react-scripts` is retained at 5.0.1 as a development dependency. The production-only audit is clean. The full audit still reports two high advisories in CRA 5's `webpack-dev-server` 4 / `webpack-dev-middleware` 5 stack. Forcing the patched WDS 5 / middleware 7 pair was tested and breaks CRA 5 because `react-dev-utils` passes middleware options removed by WDS 5; that override was reverted. The development server is bound to `127.0.0.1` by the `start` script and is not included in the deployed static site. Revisit these findings as part of migrating off CRA rather than overriding incompatible APIs.

## Image enrichment

The CI curation job downloads candidate owner-controlled images only over HTTPS. It resolves every hostname, rejects non-public IP ranges, pins the HTTPS connection to the validated IP while preserving hostname certificate validation, revalidates each redirect, and limits redirects to five. Image bodies are streamed with a 10 MB limit and an image MIME check before Sharp validates and re-encodes supported formats. Article Open Graph lookups use HTTPS, public-address validation, no redirects, an HTML MIME check, and a 2 MB body limit. Unsplash and Pexels credentials, when configured, are used only by the curation workflow and are never written to generated metadata.

## Deployment credentials

The Pages deployment uses `PAGES_DEPLOY_TOKEN` only in the deploy step. Before enabling publication, verify in repository settings that the token is fine-grained and limited to `pcodesdev/pcodesdev.github.io` with Contents write access only. The workflow source cannot independently verify a secret's configured scope. Deployment uses a normal push, verifies the served bundle, and rolls back its own deployment commit if verification times out; it does not force-push.

The portfolio source history contains a previously committed SSH private key. Treat it as compromised: revoke/rotate the corresponding credential, identify its owner from the public-key fingerprint in GitHub settings, and then coordinate history cleanup for all affected clones and refs. Do not rely on deleting the current file alone.
