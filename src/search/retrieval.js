const STOP_WORDS = new Set([
  "a",
  "about",
  "and",
  "are",
  "can",
  "does",
  "for",
  "from",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "my",
  "of",
  "on",
  "peter",
  "the",
  "tell",
  "what",
  "which",
  "who",
  "with",
  "you",
]);

const SYNONYMS = {
  ai: ["artificial", "intelligence", "engineering", "implementation"],
  artificial: ["ai", "intelligence"],
  implementation: ["integration", "delivery"],
  project: ["programme", "workplan", "coordination"],
  management: ["planning", "schedule", "coordination"],
  experience: ["role", "responsibilities", "career"],
  skills: ["expertise", "capabilities", "technologies"],
  frameworks: ["react", "nextjs", "django", "tailwind"],
  languages: ["javascript", "typescript", "python", "java", "php"],
  cloud: ["aws", "google", "deployment", "infrastructure"],
  farm: ["pemanju", "livestock", "offline", "records"],
  learning: ["edtech", "education", "training", "lms"],
  coordinated: ["coordination", "schedules", "trainers", "partners"],
  programmes: ["programme", "training", "fca"],
  program: ["programme", "training", "fca"],
  graduate: ["education", "degree", "university"],
  achievements: ["impact", "outcomes", "learners", "records", "accuracy"],
  support: ["troubleshooting", "ict", "technical support", "operations"],
  mentor: ["mentorship", "trainer", "learner", "coaching"],
  repository: ["github", "repo", "open-source", "contributions"],
  commit: ["github", "author-search", "contribution"],
  pull: ["pull-request", "pull-requests", "pr", "merged", "opened"],
  requests: ["pull-request", "pull-requests", "pr"],
  opened: ["open", "created", "authored"],
  merged: ["merged", "closed", "pull-request"],
  github: [
    "repository",
    "repositories",
    "pull-request",
    "issues",
    "commits",
    "stars",
  ],
  repositories: ["repository", "github", "open-source", "contributions"],
  contributed: ["contribution", "pull-request", "issue", "repository"],
  contribution: ["contributions", "commit", "pull-request", "issue"],
  contributions: ["contribution", "commits", "pull-requests", "issues"],
};

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function expandTokens(tokens) {
  const expanded = new Set(tokens);
  tokens.forEach((token) =>
    (SYNONYMS[token] || []).forEach((value) => expanded.add(value))
  );
  return expanded;
}

function scoreDocument(queryTokens, document) {
  const expandedQuery = expandTokens(queryTokens);
  const titleTokens = new Set(tokenize(document.title));
  const contentTokens = new Set(
    tokenize(`${document.content} ${document.keywords || ""}`)
  );
  let score = 0;
  expandedQuery.forEach((token) => {
    if (titleTokens.has(token)) score += 4;
    if (contentTokens.has(token)) score += 2;
  });
  if (
    document.domain === "open-source" &&
    [...expandedQuery].some((token) =>
      [
        "github",
        "repository",
        "repositories",
        "contribution",
        "contributions",
        "commit",
        "commits",
        "pull-request",
        "pull-requests",
        "pr",
        "issue",
        "issues",
      ].includes(token)
    )
  )
    score += 5;
  if (
    document.id === "github-profile-statistics" &&
    [...expandedQuery].some((token) =>
      [
        "pull",
        "requests",
        "pr",
        "commits",
        "issues",
        "stars",
        "repositories",
      ].includes(token)
    )
  )
    score += 5;
  const normalizedTitle = String(document.title || "").toLowerCase();
  const normalizedQuery = String(queryTokens.join(" ")).toLowerCase();
  if (normalizedQuery.length > 4 && normalizedTitle.includes(normalizedQuery))
    score += 5;
  return score;
}

function documentDomain(document) {
  if (document.domain) return document.domain;
  const id = String(document.id || "");
  if (id.startsWith("github-") || id === "opensource-profile")
    return "open-source";
  if (id.startsWith("project-") || id.startsWith("projects-"))
    return "projects";
  if (id.startsWith("experience-")) return "experience";
  if (id.startsWith("education-") || id.startsWith("credential-"))
    return "education";
  if (id.startsWith("technology-") || id.startsWith("ai-engineering"))
    return "technology";
  if (id.includes("project-management")) return "project-management";
  if (id.startsWith("contact")) return "contact";
  if (id.startsWith("about-impact-")) return "impact";
  if (id.startsWith("about")) return "about";
  return "profile";
}

function uniqueDocuments(documents) {
  const seen = new Set();
  return documents.filter((document) => {
    const key =
      document.externalUrl ||
      document.id ||
      `${document.title}:${document.url}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function retrieve(query, documents, limit = 4) {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];
  const unique = uniqueDocuments(documents);
  const ranked = unique
    .map((document) => ({
      document,
      score: scoreDocument(queryTokens, document),
    }))
    .filter((result) => result.score >= 2)
    .sort((left, right) => right.score - left.score);
  const bestGitHubRecord = unique
    .filter(
      (document) =>
        document.id.startsWith("github-pr-") ||
        document.id.startsWith("github-issue-")
    )
    .map((document) => ({
      document,
      score: scoreDocument(queryTokens, document),
    }))
    .sort((left, right) => right.score - left.score)[0];
  const queryText = queryTokens.join(" ");
  const asksForGitHubTotals =
    /how many|total|count|statistics|number/.test(queryText) ||
    [...expandTokens(queryTokens)].some((token) =>
      ["pull-request", "pull-requests", "commits", "issues", "stars"].includes(
        token
      )
    );
  const asksForRepositories = [...expandTokens(queryTokens)].some((token) =>
    ["repository", "repositories", "contributed", "contribution"].includes(
      token
    )
  );
  const profileSummary = unique.find(
    (document) =>
      document.id.startsWith("github-profile-") &&
      document.id !== "github-profile"
  );
  const preferredGitHubRecord = asksForRepositories
    ? unique.find(
        (document) =>
          document.id.startsWith("github-pr-") || document.id.startsWith("pr-")
      ) || bestGitHubRecord?.document
    : bestGitHubRecord?.document;
  const selected = [];
  const domainCounts = new Map();
  while (ranked.length && selected.length < limit) {
    let bestIndex = 0;
    let bestScore = -Infinity;
    ranked.forEach((result, index) => {
      const domain = documentDomain(result.document);
      const adjustedScore =
        result.score - (domainCounts.get(domain) || 0) * 1.5;
      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestIndex = index;
      }
    });
    const [{ document, score }] = ranked.splice(bestIndex, 1);
    const domain = documentDomain(document);
    domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
    selected.push({ ...document, score });
  }
  if (
    asksForGitHubTotals &&
    profileSummary &&
    !selected.some((document) => document.id === profileSummary.id)
  ) {
    if (selected.length >= limit) selected.pop();
    selected.unshift({
      ...profileSummary,
      score: scoreDocument(queryTokens, profileSummary),
    });
  }
  const openSourceQuery = [...expandTokens(queryTokens)].some((token) =>
    [
      "github",
      "repository",
      "repositories",
      "contribution",
      "contributions",
      "commit",
      "commits",
      "pull-request",
      "pull-requests",
      "pr",
      "issue",
      "issues",
    ].includes(token)
  );
  if (
    openSourceQuery &&
    preferredGitHubRecord &&
    !selected.some((document) => document.id === preferredGitHubRecord.id)
  ) {
    if (selected.length >= limit) selected.pop();
    selected.push({
      ...preferredGitHubRecord,
      score: scoreDocument(queryTokens, preferredGitHubRecord),
    });
  }
  return selected;
}

function makeLocalAnswer(results) {
  if (!results.length) return null;
  return results
    .slice(0, 3)
    .map(
      (result) =>
        `${result.title}: ${String(result.content).slice(0, 260).trim()}`
    )
    .join("\n\n");
}

module.exports = {
  tokenize,
  retrieve,
  makeLocalAnswer,
  documentDomain,
  uniqueDocuments,
};
