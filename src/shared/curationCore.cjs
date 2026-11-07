// Self-contained on purpose: tests load this file in a bare vm context (no require).
// Rubric documentation: docs/content-curation.md. Bump RUBRIC_VERSION on any weight or threshold change.
const RUBRIC_VERSION = 2;
const MAX_FEATURED_ITEMS = 6;
const MIN_PROJECT_SCORE = 50;
const MIN_PUBLICATION_SCORE = 50;

const PROJECT_RUBRIC = [
  { key: "technicalComplexity", label: "technical complexity", max: 25 },
  { key: "originality", label: "originality", max: 10 },
  { key: "practicalUsefulness", label: "practical usefulness", max: 15 },
  { key: "profileRelevance", label: "profile relevance", max: 20 },
  { key: "completenessActivity", label: "completeness and activity", max: 10 },
  { key: "documentation", label: "documentation", max: 10 },
  { key: "skillsDemonstrated", label: "skills demonstrated", max: 10 },
];

const PUBLICATION_RUBRIC = [
  { key: "technicalDepth", label: "technical depth", max: 25 },
  { key: "originality", label: "originality", max: 15 },
  { key: "practicalValue", label: "practical value", max: 15 },
  { key: "relevance", label: "professional relevance", max: 20 },
  { key: "structure", label: "explanation and structure", max: 15 },
  { key: "analysis", label: "meaningful analysis", max: 10 },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function textOf(value) {
  return String(value || "").toLowerCase();
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function distinctMatches(patterns, text) {
  return patterns.filter((pattern) => pattern.test(text)).length;
}

function clampTo(value, max) {
  return Math.min(value, max);
}

function toBreakdown(rubric, points) {
  const breakdown = {};
  rubric.forEach(({ key, max }) => {
    breakdown[key] = round2(clampTo(Math.max(points[key] || 0, 0), max));
  });
  return breakdown;
}

function describeBreakdown(rubric, breakdown) {
  return rubric.map(({ key, label, max }) => `${label} ${breakdown[key]}/${max}`);
}

const TECHNICAL_FAMILIES = [
  /\b(api|rest|graphql|endpoints?|fastapi|express|flask|django)\b/,
  /\b(backend|back-end|server|node\.?js|microservices?)\b/,
  /\b(database|sql|postgres(?:ql)?|mongodb|sqlite|supabase|firebase|orm|pandas)\b/,
  /\b(auth|authentication|authorization|jwt|oauth|security|encryption)\b/,
  /\b(tests?|testing|pytest|jest|unit tests?)\b/,
  /\b(docker|containers?|kubernetes|compose)\b/,
  /\b(ci\/cd|github actions|pipelines?|deployment|deploy)\b/,
  /\b(typescript|react|vue|angular|next\.?js|vite|tailwind)\b/,
  /\b(validation|schema|state management|architecture|design patterns?)\b/,
  /\b(responsive|accessibility|performance|caching)\b/,
];

const INNOVATION_SIGNALS =
  /\b(ai|llm|machine learning|rag|automation|analytics|dashboard|prediction|predictive|recommend\w*|integration|real-?time)\b/;

const PRACTICAL_SIGNALS = [
  /analytics/,
  /report(?:ing|s)?\b/,
  /track(?:ing|er)\b/,
  /management|manager/,
  /\b(?:import|export)\b/,
  /automat/,
  /search/,
  /\brecords?\b/,
  /assess/,
  /dashboard/,
  /schedul|planner|calendar|to-?do|task/,
  /calculator|converter|forecast|weather|inventory|checkout|watch-?list/,
];

const PROJECT_RELEVANCE = [
  [
    "education and digital skills",
    6,
    /\b(education|educational|edtech|learning|learners?|schools?|students?|teachers?|curriculum|lms|training|digital skills|workforce|upskilling|assessments?|classroom)\b/,
  ],
  [
    "AI engineering",
    5,
    /\b(ai|llm|machine learning|openai|gpt|rag|embeddings?|nlp|neural|prediction|predictive|chatbot|generative|prompt)\b/,
  ],
  [
    "project management and transformation",
    4,
    /\b(project management|digital transformation|workflow|operations|reporting|tracking|monitoring|kpi|dashboard|analytics|management system|stakeholders?|automation)\b/,
  ],
  [
    "cloud solutions",
    3,
    /\b(cloud|aws|azure|gcp|serverless|kubernetes|supabase|vercel|docker|ci\/cd|infrastructure|deployment)\b/,
  ],
  [
    "community impact",
    2,
    /\b(community|health|agricultur\w*|farm\w*|ngo|humanitarian|nonprofit|impact|inclusion|africa|kenya)\b/,
  ],
];

const SKILL_FAMILIES = [
  /\b(api|backend|frontend|full.?stack|database|algorithms?|testing|architecture)\b/,
  /\b(ai|llm|machine learning|openai|nlp|prediction|chatbot)\b/,
  /\b(digital transformation|education|edtech|workforce|digital skills|learning)\b/,
  /\b(cloud|aws|azure|serverless|docker|ci\/cd|kubernetes|deployment)\b/,
  /\b(data|analytics|pandas|visuali[sz]ation|etl|reporting)\b/,
  /\b(automation|workflow|integration|import|export|search)\b/,
];

const TUTORIAL_PATTERN =
  /tutorial|coursework|boilerplate|starter.?template|fork of|getting started with create react app|react hooks are functions/;

function stripCreateReactAppBoilerplate(readme) {
  return readme.replace(
    /getting started with create react app[\s\S]*?(?=^#{1,2}\s+(?:react hooks|usestate|useeffect|usecontext|usereducer|conclusion)\b|$)/im,
    " "
  );
}

function developmentSpanDays(project) {
  const start = Date.parse(project.createdAt || project.created_at || "");
  const end = Date.parse(
    project.pushedAt || project.pushed_at || project.updatedAt || project.updated_at || ""
  );
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;
  return (end - start) / DAY_MS;
}

function projectExclusion(project, rawReadme) {
  const name = textOf(project.name);
  if (project.fork || project.archived || Number(project.size) === 0) {
    return "forked, archived, or empty repository excluded";
  }
  if (
    /\.github\.io$/.test(name) ||
    (project.owner && name === textOf(project.owner))
  ) {
    return "site or profile repository excluded";
  }
  if (
    /getting started with create react app/.test(rawReadme) &&
    !textOf(project.description).trim() &&
    !(project.topics || []).length
  ) {
    return "boilerplate-only README with no project metadata excluded";
  }
  return "";
}

function scoreProject(project) {
  const rawReadme = textOf(project.readme);
  const exclusion = projectExclusion(project, rawReadme);
  if (exclusion) {
    return {
      score: -Infinity,
      reasons: [exclusion],
      breakdown: {},
      eligible: false,
      exclusion,
    };
  }

  const readme = stripCreateReactAppBoilerplate(rawReadme);
  const languages = (project.languages && project.languages.length
    ? project.languages
    : project.language
      ? [project.language]
      : []
  ).map(textOf);
  const description = textOf(project.description).trim();
  const text = [
    project.name,
    project.description,
    (project.topics || []).join(" "),
    languages.join(" "),
    readme,
  ]
    .map(textOf)
    .join(" ");
  const tutorialOrTemplate = TUTORIAL_PATTERN.test(
    `${textOf(project.name)} ${description} ${rawReadme}`
  );
  const points = {};

  const techFamilies = distinctMatches(TECHNICAL_FAMILIES, text);
  const size = Number(project.size) || 0;
  points.technicalComplexity =
    clampTo(techFamilies * 1.5, 15) +
    (languages.length >= 3 ? 5 : languages.length === 2 ? 3 : 0) +
    (size >= 1000 ? 5 : size >= 200 ? 3 : size >= 50 ? 2 : 0);

  points.originality =
    (description.length >= 30 ? 3 : 0) +
    (tutorialOrTemplate ? 0 : 4) +
    (INNOVATION_SIGNALS.test(text) ? 3 : 0);

  points.practicalUsefulness =
    clampTo(distinctMatches(PRACTICAL_SIGNALS, text) * 3, 9) +
    (project.homepageAvailable ? 4 : 0) +
    (/\b(usage|getting started|installation|how to run|npm (start|run|install)|pip install|docker (run|compose))\b/.test(
      readme
    )
      ? 2
      : 0);

  points.profileRelevance = PROJECT_RELEVANCE.reduce(
    (total, [, weight, pattern]) => total + (pattern.test(text) ? weight : 0),
    0
  );

  const spanDays = developmentSpanDays(project);
  points.completenessActivity =
    (readme.trim().length >= 300 ? 3 : 0) +
    (spanDays >= 30 ? 4 : spanDays >= 7 ? 2 : 0) +
    ((project.topics || []).length >= 2 ? 2 : 0) +
    clampTo(Number(project.stars || 0), 5) / 5;

  const headings = (readme.match(/^#{1,3}\s/gm) || []).length;
  points.documentation =
    (readme.length >= 1500 ? 5 : readme.length >= 500 ? 3 : 0) +
    (headings >= 6 ? 3 : headings >= 3 ? 2 : 0) +
    (/```|!\[[^\]]*\]\(/.test(readme) ? 2 : 0);

  points.skillsDemonstrated = clampTo(distinctMatches(SKILL_FAMILIES, text) * 2, 10);

  const breakdown = toBreakdown(PROJECT_RUBRIC, points);
  let score = PROJECT_RUBRIC.reduce((total, { key }) => total + breakdown[key], 0);
  const reasons = describeBreakdown(PROJECT_RUBRIC, breakdown);
  if (tutorialOrTemplate) {
    score -= 25;
    reasons.push("tutorial/template penalty -25");
  }

  return {
    score: round2(score),
    reasons,
    breakdown,
    eligible: true,
    exclusion: "",
  };
}

const PUBLICATION_TECH_TERMS = [
  /\b(api|apis|endpoint)\b/,
  /\b(architecture|system design|microservices?)\b/,
  /\b(database|sql|data pipeline|data model|etl)\b/,
  /\b(deploy(?:ment|ing)?|ci\/cd|infrastructure|cloud)\b/,
  /\b(implement(?:ation|ed|ing)?|integrat(?:ion|ed|ing))\b/,
  /\b(algorithm|framework|library|sdk|stack)\b/,
  /\b(security|privacy|authentication|governance)\b/,
  /\b(test(?:ing|s)?|monitoring|evaluation|benchmark)\b/,
  /\b(prompt|model|llm|machine learning|neural)\b/,
];

const PUBLICATION_RELEVANCE = [
  [
    "software engineering",
    5,
    /software|programming|developer|python|javascript|typescript|coding|\bapi\b/,
  ],
  [
    "digital transformation and skills",
    5,
    /digital transformation|digital skills|technology adoption|education technology|edtech|workforce|skills development|learning/,
  ],
  [
    "technology adoption and digital ecosystems",
    4,
    /ai adoption|ai usage|digital adoption|tech ecosystem|technology ecosystem|digital economy|technology in africa|kenya.{0,30}technology|digital public/,
  ],
  [
    "cloud and implementation",
    4,
    /cloud|deployment|infrastructure|implementation|engineering|architecture|data workflow/,
  ],
  [
    "AI and technical products",
    2,
    /artificial intelligence|\bai\b|machine learning|product design|figma|\blms\b|prototype|automation/,
  ],
];

const EXPERIENCE_MARKERS =
  /\b(i built|i learned|i found|i used|i designed|i led|i implemented|in my experience|my approach|we implemented|we built|case study|lessons learned|my own|from my work)\b/;
const TRADEOFF_MARKERS =
  /\b(however|unlike|rather than|instead of|trade-?offs?|on the other hand|whereas|limitation)\b/;
const EXAMPLE_MARKERS = /\b(for example|for instance|e\.g\.|such as|consider)\b/;
const PRACTICAL_MARKERS = [
  /\bsteps?\b/,
  /\bhow to\b/,
  /\bguide\b/,
  /\bchecklist\b/,
  /\bframework\b/,
  /\btemplate\b/,
  /\blessons?\b/,
  /\brecommend\w*/,
  /\bbest practices?\b/,
  /\bplaybook\b/,
];
const ANALYSIS_MARKERS = [
  /\bbecause\b/,
  /\btherefore\b/,
  /\bas a result\b/,
  /\bhowever\b/,
  /\bevidence\b/,
  /\bdata (shows|suggests|indicates)\b/,
  /\banaly[sz]\w*/,
  /\bimpact\b/,
  /\boutcomes?\b/,
  /\bimplications?\b/,
  /\brisks?\b/,
  /\bchallenges?\b/,
];
const CLICKBAIT_PATTERN =
  /nft|market crash|celebrity|viral|you won'?t believe|breaking:|\btop \d+\b|\b\d+ (ways|reasons|tips|things|secrets)\b/i;

function publicationMetrics(publication) {
  const content = String(publication.contentText || "");
  const words = content.split(/\s+/).filter(Boolean).length;
  const metrics = publication.metrics || {};
  return {
    wordCount: metrics.wordCount !== undefined ? metrics.wordCount : words,
    headingCount: metrics.headingCount || 0,
    paragraphCount: metrics.paragraphCount || 0,
    listItemCount: metrics.listItemCount || 0,
    codeBlockCount: metrics.codeBlockCount || 0,
    imageCount: metrics.imageCount || 0,
  };
}

function scorePublication(publication) {
  const title = String(publication.name || "");
  const description = String(publication.description || "");
  const text = `${textOf(title)} ${textOf(description)} ${textOf(publication.contentText)}`;
  const metrics = publicationMetrics(publication);
  const clickbait = CLICKBAIT_PATTERN.test(title);
  const points = {};

  points.technicalDepth =
    (metrics.wordCount >= 1500 ? 12 : metrics.wordCount >= 900 ? 10 : metrics.wordCount >= 400 ? 5 : 0) +
    clampTo(distinctMatches(PUBLICATION_TECH_TERMS, text) * 2, 9) +
    (metrics.codeBlockCount >= 1 ? 4 : 0);

  points.originality =
    (EXPERIENCE_MARKERS.test(text) ? 6 : 0) +
    (clickbait ? 0 : 3) +
    (TRADEOFF_MARKERS.test(text) ? 3 : 0) +
    (EXAMPLE_MARKERS.test(text) ? 3 : 0);

  points.practicalValue =
    clampTo(distinctMatches(PRACTICAL_MARKERS, text) * 2, 8) +
    (metrics.listItemCount >= 3 ? 3 : 0) +
    (metrics.codeBlockCount >= 1 || EXAMPLE_MARKERS.test(text) ? 4 : 0);

  points.relevance = PUBLICATION_RELEVANCE.reduce(
    (total, [, weight, pattern]) => total + (pattern.test(text) ? weight : 0),
    0
  );

  points.structure =
    (metrics.headingCount >= 3 ? 5 : metrics.headingCount >= 1 ? 2 : 0) +
    (metrics.paragraphCount >= 8 ? 4 : metrics.paragraphCount >= 4 ? 2 : 0) +
    (description.length >= 100 ? 3 : 0) +
    (metrics.imageCount >= 1 ? 3 : 0);

  points.analysis =
    clampTo(distinctMatches(ANALYSIS_MARKERS, text) * 1.5, 7) +
    (metrics.wordCount >= 800 ? 3 : 0);

  const breakdown = toBreakdown(PUBLICATION_RUBRIC, points);
  let score = PUBLICATION_RUBRIC.reduce((total, { key }) => total + breakdown[key], 0);
  const reasons = describeBreakdown(PUBLICATION_RUBRIC, breakdown);
  if (clickbait) {
    score -= 10;
    reasons.push("sensational-topic penalty -10");
  }
  if (metrics.wordCount < 300) {
    score -= 15;
    reasons.push("superficial length penalty -15");
  }

  return {
    score: round2(score),
    reasons,
    breakdown,
    eligible: true,
    exclusion: "",
  };
}

function limitFeaturedItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, MAX_FEATURED_ITEMS);
}

function normalizeId(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeTitle(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function canonicalUrl(value) {
  try {
    const url = new URL(value);
    return `${url.hostname.toLowerCase()}${url.pathname.replace(/\/+$/, "").toLowerCase()}`;
  } catch (error) {
    return "";
  }
}

function defaultDedupeKeys(candidate) {
  const keys = [`id:${normalizeId(candidate.id)}`];
  const url = canonicalUrl(candidate.url);
  if (url) keys.push(`url:${url}`);
  return keys;
}

function publicationDedupeKeys(candidate) {
  const keys = defaultDedupeKeys(candidate);
  const title = normalizeTitle(candidate.name);
  if (title) keys.push(`title:${title}`);
  return keys;
}

function applyFields(source, existing, manual, fields) {
  const result = { ...source };
  fields.forEach((field) => {
    if (manual && manual[field] !== undefined) result[field] = manual[field];
    else if (existing && existing[field] !== undefined) result[field] = existing[field];
  });
  return result;
}

// Deterministic: score descending, then normalized id ascending. Recency never breaks ties.
function compareRanked(left, right) {
  if (right.ranking.score !== left.ranking.score) {
    return right.ranking.score - left.ranking.score;
  }
  return normalizeId(left.candidate.id).localeCompare(normalizeId(right.candidate.id));
}

function rankCandidates({
  candidates,
  pinnedIds = [],
  excludedIds = [],
  scoreFunction,
  minimumScore,
  kind,
  dedupeKeys = defaultDedupeKeys,
}) {
  if (pinnedIds.length > MAX_FEATURED_ITEMS) {
    throw new Error(`At most ${MAX_FEATURED_ITEMS} ${kind} may be pinned`);
  }
  const pinnedSet = new Set(pinnedIds.map(normalizeId));
  const excludedSet = new Set(excludedIds.map(normalizeId));
  if (pinnedIds.some((id) => excludedSet.has(normalizeId(id)))) {
    throw new Error(`A ${kind} cannot be both pinned and excluded`);
  }

  const scored = candidates.map((candidate) => ({
    candidate,
    ranking: scoreFunction(candidate),
  }));
  const byId = new Map(
    scored.map((entry) => [normalizeId(entry.candidate.id), entry])
  );
  pinnedIds.forEach((id) => {
    const entry = byId.get(normalizeId(id));
    if (!entry) throw new Error(`Pinned ${kind} was not found upstream: ${id}`);
    if (!Number.isFinite(entry.ranking.score)) {
      throw new Error(
        `Pinned ${kind} is not eligible (${entry.ranking.exclusion || "excluded"}): ${id}`
      );
    }
  });

  const decisions = [];
  const record = (entry, status, reason) =>
    decisions.push({
      id: entry.candidate.id,
      name: entry.candidate.name,
      score: Number.isFinite(entry.ranking.score) ? entry.ranking.score : null,
      status,
      reason,
    });

  const seenKeys = new Map();
  const claim = (entry) => {
    const keys = dedupeKeys(entry.candidate);
    const clash = keys.find((key) => seenKeys.has(key));
    if (clash) return seenKeys.get(clash);
    keys.forEach((key) => seenKeys.set(key, entry.candidate.id));
    return null;
  };

  const selected = [];
  pinnedIds.forEach((id) => {
    const entry = byId.get(normalizeId(id));
    const duplicateOf = claim(entry);
    if (duplicateOf) {
      record(entry, "duplicate", `duplicate of ${duplicateOf}`);
      return;
    }
    selected.push(entry.candidate);
    record(entry, "selected-pinned", "pinned by owner");
  });

  scored
    .filter(({ candidate }) => !pinnedSet.has(normalizeId(candidate.id)))
    .sort(compareRanked)
    .forEach((entry) => {
      if (excludedSet.has(normalizeId(entry.candidate.id))) {
        record(entry, "excluded-by-owner", "listed in excluded overrides");
        return;
      }
      if (!Number.isFinite(entry.ranking.score)) {
        record(entry, "ineligible", entry.ranking.exclusion || "excluded");
        return;
      }
      if (entry.ranking.score < minimumScore) {
        record(entry, "below-threshold", `score below ${minimumScore}`);
        return;
      }
      const duplicateOf = claim(entry);
      if (duplicateOf) {
        record(entry, "duplicate", `duplicate of ${duplicateOf}`);
        return;
      }
      if (selected.length >= MAX_FEATURED_ITEMS) {
        record(entry, "outranked", `qualified but outside the top ${MAX_FEATURED_ITEMS}`);
        return;
      }
      selected.push(entry.candidate);
      record(entry, "selected", "highest-scoring qualified item");
    });

  return { selected, decisions };
}

function orderCandidates(candidates, pinnedIds, excludedIds, scoreFunction, minimumScore, kind) {
  return rankCandidates({
    candidates,
    pinnedIds,
    excludedIds,
    scoreFunction,
    minimumScore,
    kind,
  }).selected;
}

function validHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch (error) {
    return false;
  }
}

function validDate(value) {
  return Boolean(value) && Number.isFinite(Date.parse(value));
}

function validImageReference(value) {
  return typeof value === "string" &&
    (value.startsWith("/") || validHttpUrl(value));
}

async function collectValidatedData(fetchProjects, fetchPublications, commit) {
  const [projects, publications] = await Promise.all([
    fetchProjects(),
    fetchPublications(),
  ]);
  validateProjects(projects);
  validatePublications(publications);
  if (commit) await commit({ projects, publications });
  return { projects, publications };
}

function assertUnique(items, keysOf, message) {
  const seen = new Set();
  items.forEach((item) => {
    keysOf(item).forEach((key) => {
      if (seen.has(key)) throw new Error(`${message}: ${item.id}`);
    });
    keysOf(item).forEach((key) => seen.add(key));
  });
}

function validateProjects(projects) {
  if (!Array.isArray(projects) || projects.length > MAX_FEATURED_ITEMS) {
    throw new Error(`Featured projects must be an array of at most ${MAX_FEATURED_ITEMS}`);
  }
  const ids = new Set();
  projects.forEach((project) => {
    if (!project.id || ids.has(normalizeId(project.id))) {
      throw new Error("Featured projects need unique, non-empty ids");
    }
    ids.add(normalizeId(project.id));
    if (!project.name || !project.description || !validDate(project.createdAt)) {
      throw new Error(`Project metadata is incomplete: ${project.id}`);
    }
    if (
      !validHttpUrl(project.url) ||
      new URL(project.url).hostname !== "github.com" ||
      !new URL(project.url).pathname.startsWith("/pcodesdev/")
    ) {
      throw new Error(`Project URL must be a valid GitHub URL: ${project.id}`);
    }
    if (project.homepage && !validHttpUrl(project.homepage)) {
      throw new Error(`Project homepage is invalid: ${project.id}`);
    }
    if (!Array.isArray(project.languages)) {
      throw new Error(`Project languages must be an array: ${project.id}`);
    }
    if (!project.fallbackImage || !validImageReference(project.fallbackImage)) {
      throw new Error(`Project fallback image is invalid: ${project.id}`);
    }
    if (project.image && !validImageReference(project.image)) {
      throw new Error(`Project image is invalid: ${project.id}`);
    }
  });
  assertUnique(
    projects,
    (project) => [`url:${canonicalUrl(project.url)}`],
    "Featured projects must not repeat a repository"
  );
  return projects;
}

function validatePublications(publications) {
  if (!Array.isArray(publications) || publications.length > MAX_FEATURED_ITEMS) {
    throw new Error(`Featured publications must be an array of at most ${MAX_FEATURED_ITEMS}`);
  }
  const ids = new Set();
  publications.forEach((publication) => {
    if (!publication.id || ids.has(normalizeId(publication.id))) {
      throw new Error("Featured publications need unique, non-empty ids");
    }
    ids.add(normalizeId(publication.id));
    if (!publication.name || !publication.description || !validDate(publication.createdAt)) {
      throw new Error(`Publication metadata is incomplete: ${publication.id}`);
    }
    if (!validHttpUrl(publication.url)) {
      throw new Error(`Publication URL is invalid: ${publication.id}`);
    }
    const url = new URL(publication.url);
    if (url.hostname !== "medium.com" || !url.pathname.startsWith("/@pcodesdev/")) {
      throw new Error(`Publication URL must be canonical to Peter's Medium profile: ${publication.id}`);
    }
  });
  assertUnique(
    publications,
    (publication) => [
      `url:${canonicalUrl(publication.url)}`,
      `title:${normalizeTitle(publication.name)}`,
    ],
    "Featured publications must not repeat an article"
  );
  return publications;
}

const IMAGE_SOURCES = [
  "manual",
  "repo-file",
  "github-social-preview",
  "readme",
  "curated-illustration",
  "medium-rss",
  "article-og",
  "article-content",
  "unsplash",
  "pexels",
  "generated",
];
const STOCK_IMAGE_SOURCES = ["unsplash", "pexels"];

function validateImages(items, { kind }) {
  const usedSources = new Map();
  items.forEach((item) => {
    const label = `Featured ${kind} image for ${item.id}`;
    const meta = item.imageMeta;
    if (!meta || typeof meta !== "object") throw new Error(`${label} has no image metadata`);
    if (!validImageReference(meta.src)) throw new Error(`${label} has an invalid source`);
    if (item.image !== meta.src) throw new Error(`${label} does not match its metadata`);
    if (!String(meta.alt || "").trim()) throw new Error(`${label} has no alt text`);
    if (!IMAGE_SOURCES.includes(meta.source)) throw new Error(`${label} has an unknown source: ${meta.source}`);
    if (!["ok", "fallback"].includes(meta.status)) throw new Error(`${label} has an invalid status`);
    if ((meta.source === "generated") !== (meta.status === "fallback")) {
      throw new Error(`${label} has an inconsistent status`);
    }
    if (!validDate(meta.retrievedAt)) throw new Error(`${label} has no retrieval timestamp`);
    if (!Number.isFinite(meta.width) || !Number.isFinite(meta.height)) {
      throw new Error(`${label} has no dimensions`);
    }
    if (STOCK_IMAGE_SOURCES.includes(meta.source)) {
      if (!meta.attribution || !meta.license || !validHttpUrl(meta.sourceUrl)) {
        throw new Error(`${label} is missing attribution or license details`);
      }
    }
    if (!item.fallbackImage || !validImageReference(item.fallbackImage)) {
      throw new Error(`${label} has no valid fallback image`);
    }
    if (meta.source !== "generated") {
      if (usedSources.has(meta.src)) {
        throw new Error(`${label} is reused by ${usedSources.get(meta.src)}`);
      }
      usedSources.set(meta.src, item.id);
    }
  });
  return items;
}

function validateQuality(items, { minimumScore, pinnedIds = [], kind }) {
  const pinned = new Set(pinnedIds.map(normalizeId));
  items.forEach((item) => {
    if (pinned.has(normalizeId(item.id))) return;
    if (!Number.isFinite(item.curationScore) || item.curationScore < minimumScore) {
      throw new Error(
        `Featured ${kind} is below the quality threshold of ${minimumScore}: ${item.id} (${item.curationScore})`
      );
    }
  });
  return items;
}

module.exports = {
  RUBRIC_VERSION,
  MAX_FEATURED_ITEMS,
  MIN_PROJECT_SCORE,
  MIN_PUBLICATION_SCORE,
  PROJECT_RUBRIC,
  PUBLICATION_RUBRIC,
  limitFeaturedItems,
  normalizeId,
  normalizeTitle,
  canonicalUrl,
  scoreProject,
  scorePublication,
  rankCandidates,
  orderCandidates,
  publicationDedupeKeys,
  defaultDedupeKeys,
  applyFields,
  validateProjects,
  validatePublications,
  validateQuality,
  validateImages,
  IMAGE_SOURCES,
  validHttpUrl,
  validImageReference,
  collectValidatedData,
};
