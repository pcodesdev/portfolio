# Ask My Portfolio — Feasibility Assessment

Date: 2026-11-05  
Status: **Partially implemented locally; hosted AI integration is not operational or verified.**  
Scope: public portfolio content only.

## Recommendation

A small, source-grounded **Ask My Portfolio** feature is technically feasible, but it should be a separate approved implementation after the portfolio's security and publication blockers are resolved. It should complement, not replace, normal page navigation or keyword search.

The current local work adds a portfolio-wide dialog, source-linked keyword retrieval, and an optional server-side endpoint contract. This is not an end-to-end AI service: no provider credentials, allowed production origin, Redis rate-limit store, deployed endpoint, or successful provider response is configured or verified. Unless a deployment sets the non-secret `window.PORTFOLIO_SEARCH_ENDPOINT` before the app loads, visitors receive local matching excerpts and the UI explicitly says AI answers are not connected in this build.

The content set is small and mostly public, so a managed vector database is not required for an initial version. A server-side endpoint with a compact, versioned index of approved page excerpts is a reasonable starting point. Do not connect this feature to private repositories, personal files, FCA or partner records, participant information, or the Pemanju Farm Manager database.

## Proposed Architecture

1. **Approve and extract public content.** The local `src/search/knowledge-base.json` is a curated allowlist with stable IDs, page URLs, titles, and plain-text excerpts across Home, About, Expertise, Experience, Projects, Education, Open Source, and Contact. The app combines it with a normalized public GitHub snapshot whose PR/issue records are filtered by the verified author login `pcodesdev`; issues remain explicitly incomplete when GitHub search returns fewer rows than its total. It excludes private files, FCA/partner/participant records, and the Farm Manager database. Contact email is included because it is already intentionally public on the Contact page. Review metric and tool entries before indexing them in an external provider.
2. **Chunk and index.** Local keyword retrieval is implemented in `src/search/retrieval.js`, with title-weighted token matching and simple domain synonyms. No embeddings or vector database are currently used. If semantic search is approved later, split approved text by heading and generate embeddings in a controlled process; keep the JSON source as authority and treat vectors as derived artifacts.
3. **Serve retrieval behind an endpoint.** `api/ask.js` is a server-side endpoint contract. It accepts a bounded question, retrieves approved passages, calls a configured model with those passages, keeps the provider key in `OPENAI_API_KEY`, and expects an allowed origin plus Upstash Redis REST credentials for shared per-IP rate limiting. These environment values are not configured in the repository. The endpoint must be deployed to a compatible serverless host and end-to-end tested before enabling the frontend endpoint setting.
4. **Return grounded answers and sources.** Require concise answers supported by retrieved passages, with page/anchor links on each source. If retrieval confidence is low or sources do not answer the question, return a clear “not covered in the published portfolio” response and link to Contact.
5. **Keep a conventional fallback.** Provide a keyword search over the same approved JSON, or retain browser find/navigation if the optional assistant is unavailable. The portfolio pages remain complete and useful without AI.
6. **Limit and protect use.** Apply per-IP rate limits, per-question token/context limits, request timeouts, origin checks, abuse monitoring, and a modest monthly spending cap. Avoid storing visitor questions by default; if logging is needed, minimize or anonymize it and disclose retention.

The current application is a static React/HashRouter site and no server runtime is configured in this repository. Therefore the endpoint file is a local implementation contract, not a live API. It requires a separately hosted function/API, durable rate-limit storage, a deliberate CORS/hosting decision, and provider credentials set only in server-side secrets. The browser-visible endpoint URL is not secret; a provider key must not be added to `src/`, `public/`, or any browser-visible configuration. GitHub snapshot data is available to local retrieval and rotating topic suggestions, with the optional GitHub endpoint refreshing it independently of AI generation.

## Scope and Complexity Estimate

**Complexity: moderate.** A constrained prototype is approximately 3–5 engineering days after content approval and hosting/provider selection. That covers an approved-content exporter, chunking/index generation, a serverless endpoint, retrieval and citations, keyword fallback, accessible optional UI, rate limits, and automated tests. Production hardening, privacy review, abuse testing, monitoring, and deployment integration may add 1–2 weeks depending on the selected platform and release requirements. These are planning estimates, not a commitment.

A lower-complexity first step is conventional keyword search over the approved structured content. This can improve discovery without a model API, vector service, or generated answers and is a sensible baseline for comparison.

## Cost and Operations

No reliable dollar estimate can be made until a provider/model, hosting platform, and expected question volume are selected. Model and embedding prices change and differ significantly by tier. Use this monthly cost model when comparing providers:

```text
monthly model cost = requests * (
  average input tokens * input price per token
  + average output tokens * output price per token
) + query-embedding cost
```

Also account for serverless invocation, vector storage/query limits, logging/monitoring, and possible minimum paid plans. A planning load such as 100–300 questions/month with short retrieved context and capped answers is a sensible pilot; test actual token usage and latency before increasing limits. A low-cost model and small self-hosted/static index may fit free tiers at pilot traffic, but this must be confirmed against current provider terms and pricing. A managed vector database adds operational cost and is not justified until retrieval scale or administration needs require it.

Ongoing work includes refreshing the index when approved public content changes, monitoring rate limits/costs, checking source links, reviewing unsupported-answer cases, and responding to model/provider changes. Keep a kill switch so the endpoint can be disabled without breaking the portfolio.

## Key Risks and Controls

- **Hallucination or unsupported career claims:** answer only from retrieved approved passages, use a minimum relevance threshold, cite links, and abstain clearly.
- **Prompt injection in questions or stored text:** treat visitor input and retrieved text as untrusted data; do not allow instructions in content to change system policy or access other data.
- **Confidential data exposure:** index only the allowlisted public content export; never connect private files, FCA systems, participant data, or Pemanju's operational database.
- **Credential exposure:** make all model and embedding requests from the server endpoint; scan bundles and repository before release.
- **Abuse and cost spikes:** rate limit, cap question length/context/output, set budget alerts and a hard monthly quota, and keep keyword search available after throttling.
- **Privacy:** disclose that questions are sent to an AI provider, avoid collecting sensitive visitor data, and document provider retention/processing before launch.
- **Stale answers:** version the corpus, rebuild indexes from approved content, and link each source to its current page.
- **Accessibility and performance:** make the feature optional, keyboard accessible, labeled as AI-generated, responsive, and non-blocking; avoid loading large models into the browser.

## Decision Gate

Before enabling generated answers, Peter must approve the public content allowlist, hosting/API owner, model/provider, privacy notice, cost cap, and user-facing disclaimer/abstention behavior. First complete the existing private-key history remediation, dependency security plan, and custom-domain/build-host decision. Local keyword search and the endpoint contract have been added, but no API key or production endpoint is configured, and no end-to-end AI provider response has been verified.
