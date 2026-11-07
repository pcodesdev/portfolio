import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import curationCore from "../src/shared/curationCore.cjs";
import { assertImagesExist, enrichImages } from "./image-enrichment.mjs";

const SCRIPT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// CURATION_ROOT lets tests run the real CLI against a scratch copy of the data files.
const ROOT = process.env.CURATION_ROOT
  ? path.resolve(process.env.CURATION_ROOT)
  : SCRIPT_ROOT;
const OWNER = "pcodesdev";
const PUBLIC_ROOT = path.join(ROOT, "public");
const PROJECTS_PATH = path.join(ROOT, "src/shared/opensource/projects.json");
const PUBLICATIONS_PATH = path.join(ROOT, "src/shared/medium/publications.json");
const OVERRIDES_PATH = path.join(ROOT, "scripts/curation-overrides.json");
const MEDIUM_FEED_URL = "https://medium.com/feed/@pcodesdev";
const GENERIC_IMAGE = "/images/projects/project-generic.svg";
const USER_AGENT = "pcodesdev-portfolio-curation/2.0";
// Fields that change on every upstream event and must not trigger a redeploy on their own.
const VOLATILE_FIELDS = ["updatedAt", "lastUpdated", "stars", "forks"];
// Stage-1 scores omit the language list and homepage check (worth at most 9 points).
const SHORTLIST_MARGIN = 10;
const SHORTLIST_LIMIT = 25;
const IMAGE_ICONS = {
  Python: "logos-python",
  JavaScript: "logos-javascript",
  TypeScript: "logos-typescript-icon",
  CSS: "logos-css-3",
  HTML: "logos-html-5",
  Java: "logos-java",
  Go: "logos-go",
  Ruby: "logos-ruby",
  PHP: "logos-php",
  Dart: "logos-dart",
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripHtml(value) {
  return decodeEntities(
    String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function readRawXmlTag(xml, tagName) {
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(
    `<${escapedTag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${escapedTag}>`,
    "i"
  );
  const match = xml.match(expression);
  return decodeEntities(match ? match[1] || match[2] || "" : "");
}

function readXmlTag(xml, tagName) {
  return stripHtml(readRawXmlTag(xml, tagName));
}

function firstParagraph(html) {
  const match = String(html || "").match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  return match ? stripHtml(match[1]) : "";
}

async function mapLimit(values, limit, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index], index);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, values.length) }, () => worker())
  );
  return results;
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Retries network errors and 5xx only; rate limits and 4xx fail closed immediately.
async function fetchWithRetry(url, options, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.status < 500 || attempt === attempts) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === attempts) throw error;
    }
    await delay(500 * attempt * attempt);
  }
  throw lastError;
}

async function githubRequest(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetchWithRetry(url, { headers });
  if (!response.ok) {
    const rateLimited =
      response.status === 429 ||
      (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0");
    throw new Error(
      `GitHub request failed (${response.status}${rateLimited ? ", rate limited" : ""}): ${url}`
    );
  }
  return response.json();
}

async function rawReadme(repository) {
  const branch = encodeURIComponent(repository.default_branch || "main").replace(
    /%2F/gi,
    "/"
  );
  const url = `https://raw.githubusercontent.com/${OWNER}/${encodeURIComponent(
    repository.name
  )}/${branch}/README.md`;
  const response = await fetchWithRetry(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (response.status === 404) return "";
  if (!response.ok) throw new Error(`README request failed (${response.status}): ${url}`);
  return response.text();
}

async function urlIsReachable(url) {
  if (!url || !curationCore.validHttpUrl(url)) return false;
  const check = async (method) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
        headers: method === "GET" ? { Range: "bytes=0-0" } : undefined,
        signal: controller.signal,
      });
      if (response.body) await response.body.cancel();
      return response.ok;
    } finally {
      clearTimeout(timeout);
    }
  };
  try {
    if (await check("HEAD")) return true;
    return await check("GET");
  } catch (error) {
    return false;
  }
}

async function fetchAllRepositories() {
  const repositories = [];
  for (let page = 1; page <= 10; page += 1) {
    const result = await githubRequest(
      `https://api.github.com/users/${OWNER}/repos?per_page=100&page=${page}&sort=full_name&direction=asc`
    );
    if (!Array.isArray(result)) throw new Error("GitHub repository response was not a list");
    repositories.push(...result);
    if (result.length < 100) return repositories;
  }
  throw new Error("Repository discovery exceeded the supported pagination limit");
}

async function fetchLanguages(repository) {
  const languages = await githubRequest(repository.languages_url);
  if (!languages || typeof languages !== "object" || Array.isArray(languages)) {
    throw new Error(`Invalid language metadata for ${repository.full_name}`);
  }
  return Object.keys(languages).sort((left, right) => languages[right] - languages[left]);
}

function scoringInput(repository, extra) {
  return {
    id: curationCore.normalizeId(repository.name),
    name: repository.name,
    owner: OWNER,
    description: repository.description,
    language: repository.language,
    topics: repository.topics || [],
    size: repository.size,
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    createdAt: repository.created_at,
    pushedAt: repository.pushed_at,
    updatedAt: repository.updated_at,
    fork: repository.fork,
    archived: repository.archived,
    ...extra,
  };
}

function countByReason(repositories) {
  const counts = { forks: 0, archived: 0, empty: 0, siteRepositories: 0 };
  repositories.forEach((repository) => {
    if (repository.fork) counts.forks += 1;
    else if (repository.archived) counts.archived += 1;
    else if (Number(repository.size) === 0) counts.empty += 1;
    else if (curationCore.scoreProject(scoringInput(repository, {})).exclusion === "site or profile repository excluded") {
      counts.siteRepositories += 1;
    }
  });
  return counts;
}

async function discoverProjectCandidates(overrides, report) {
  const repositories = await fetchAllRepositories();
  const byId = new Map(
    repositories.map((repository) => [
      curationCore.normalizeId(repository.name),
      repository,
    ])
  );
  report.projects.discovered = repositories.length;
  Object.assign(report.projects, countByReason(repositories));

  const eligible = repositories.filter(
    (repository) =>
      !repository.fork &&
      !repository.archived &&
      Number(repository.size) > 0 &&
      curationCore.scoreProject(scoringInput(repository, {})).eligible
  );
  report.projects.eligible = eligible.length;

  // Stage 1: README-based score for every eligible repository (raw content, no API quota).
  const stageOne = await mapLimit(eligible, 8, async (repository) => {
    const readme = await rawReadme(repository);
    const ranking = curationCore.scoreProject(scoringInput(repository, { readme }));
    return { repository, readme, ranking };
  });

  const pinnedIds = (overrides.pinnedProjects || []).map(curationCore.normalizeId);
  const cutoff = curationCore.MIN_PROJECT_SCORE - SHORTLIST_MARGIN;
  const stageOneById = new Map(
    stageOne.map((entry) => [curationCore.normalizeId(entry.repository.name), entry])
  );
  const shortlistedIds = new Set(
    stageOne
      .filter((entry) => entry.ranking.score >= cutoff)
      .sort((left, right) =>
        right.ranking.score !== left.ranking.score
          ? right.ranking.score - left.ranking.score
          : curationCore.normalizeId(left.repository.name).localeCompare(
              curationCore.normalizeId(right.repository.name)
            )
      )
      .slice(0, SHORTLIST_LIMIT)
      .map((entry) => curationCore.normalizeId(entry.repository.name))
  );
  pinnedIds.forEach((id) => {
    if (!byId.has(id)) throw new Error(`Pinned projects was not found upstream: ${id}`);
    shortlistedIds.add(id);
  });
  report.projects.shortlisted = shortlistedIds.size;

  stageOne
    .filter((entry) => !shortlistedIds.has(curationCore.normalizeId(entry.repository.name)))
    .forEach((entry) =>
      report.projects.decisions.push({
        id: curationCore.normalizeId(entry.repository.name),
        name: entry.repository.name,
        score: entry.ranking.score,
        status: "not-shortlisted",
        reason: `preliminary score below ${cutoff}`,
      })
    );

  // Stage 2: full evaluation of the shortlist.
  return mapLimit([...shortlistedIds].sort(), 5, async (id) => {
    const repository = byId.get(id);
    const preliminary =
      stageOneById.get(id) || {
        readme: await rawReadme(repository),
      };
    const [languages, homepageAvailable] = await Promise.all([
      fetchLanguages(repository),
      repository.homepage ? urlIsReachable(repository.homepage) : false,
    ]);
    const readme = preliminary.readme;
    const scoreInput = scoringInput(repository, {
      readme,
      languages,
      homepageAvailable,
    });
    const ranking = curationCore.scoreProject(scoreInput);
    return {
      ...repository,
      id,
      languages,
      readme,
      homepageAvailable,
      ranking,
    };
  });
}

function languageItems(names) {
  return names.slice(0, 5).map((name) => ({
    name,
    iconifyClass: IMAGE_ICONS[name] || `logos:${name.toLowerCase()}`,
  }));
}

function plainMarkdown(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__|`|^>\s*)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWord(value, maxLength) {
  if (value.length <= maxLength) return value;
  const cutoff = value.lastIndexOf(" ", maxLength);
  return `${value.slice(0, cutoff > 0 ? cutoff : maxLength).trim()}...`;
}

function firstReadmeParagraph(readme) {
  const headingsRemoved = String(readme || "").replace(/^#{1,6}\s.*$/gm, " ");
  const paragraph = headingsRemoved
    .split(/\r?\n\s*\r?\n/)
    .map((entry) => plainMarkdown(stripHtml(entry)))
    .find((entry) => entry.length > 35 && !entry.startsWith("[!["));
  return truncateAtWord(paragraph || "", 240);
}

function projectData(candidate, existing, manual) {
  const useManual = (key, fallback) =>
    Object.prototype.hasOwnProperty.call(manual, key)
      ? manual[key]
      : existing && Object.prototype.hasOwnProperty.call(existing, key)
        ? existing[key]
        : fallback;
  const name = useManual("title", existing && existing.name ? existing.name : candidate.name);
  const description = useManual(
    "description",
    existing && existing.description
      ? existing.description
      : candidate.description || firstReadmeParagraph(candidate.readme)
  );
  const languageNames = candidate.languages || [];
  const primaryLanguage = candidate.language;
  const stack = languageNames.length
    ? languageNames.join(", ")
    : primaryLanguage || "See repository README";
  const fallbackImage = useManual(
    "fallbackImage",
    existing && existing.fallbackImage ? existing.fallbackImage : GENERIC_IMAGE
  );
  const image = Object.prototype.hasOwnProperty.call(manual, "image")
    ? manual.image
    : null;
  const homepage =
    candidate.homepage &&
    candidate.homepageAvailable &&
    curationCore.validHttpUrl(candidate.homepage)
      ? candidate.homepage
      : candidate.homepage
        ? undefined
        : existing && existing.homepage && curationCore.validHttpUrl(existing.homepage)
        ? existing.homepage
        : undefined;
  const result = {
    id: candidate.id,
    name,
    createdAt: candidate.created_at,
    updatedAt: candidate.updated_at,
    url: `https://github.com/${OWNER}/${candidate.name}`,
    projectType: useManual(
      "projectType",
      candidate.fork ? "Forked repository" : "Original repository"
    ),
    description,
    useCase: useManual("useCase", description),
    engineeringFocus: useManual(
      "engineeringFocus",
      candidate.readme
        ? "See the repository README for verified implementation details."
        : "See the repository description and source for project details."
    ),
    stack: useManual("stack", stack),
    image,
    imageAlt: useManual(
      "imageAlt",
      image ? `${name} project screenshot` : `${name} project illustration`
    ),
    fallbackImage,
    languages: languageItems(languageNames),
    topics: candidate.topics || [],
    stars: candidate.stargazers_count,
    forks: candidate.forks_count,
    homepageAvailable: Boolean(homepage),
    isFork: candidate.fork,
    lastUpdated: candidate.updated_at,
    curationScore: Number.isFinite(candidate.ranking.score)
      ? candidate.ranking.score
      : 0,
    rankingReasons: candidate.ranking.reasons,
  };
  if (homepage) result.homepage = homepage;
  return result;
}

function contentMetrics(rawContent) {
  const count = (pattern) => (rawContent.match(pattern) || []).length;
  return {
    wordCount: stripHtml(rawContent).split(/\s+/).filter(Boolean).length,
    headingCount: count(/<h[1-6]\b/gi),
    paragraphCount: count(/<p\b/gi),
    listItemCount: count(/<li\b/gi),
    codeBlockCount: count(/<pre\b/gi),
    // Medium appends a 1x1 tracking pixel served from /_/stat.
    imageCount: count(/<img\b(?![^>]*\/_\/stat)/gi),
  };
}

function parseMediumFeed(xml) {
  const items = [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
    (match) => match[1]
  );
  return items.map((item) => {
    const content = readRawXmlTag(item, "content:encoded");
    const url = readXmlTag(item, "link").replace(/\?source=.*$/i, "");
    const guid = readXmlTag(item, "guid");
    const slugId = url.split("-").pop();
    const id = guid.match(/\/p\/([a-z0-9]+)/i)?.[1] || slugId;
    const description =
      firstParagraph(content) ||
      stripHtml(readXmlTag(item, "description"));
    const pubDate = readXmlTag(item, "pubDate");
    const feedTitle = readXmlTag(item, "title");
    const fullHeading = stripHtml(
      content.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1] || ""
    );
    const titlePrefix = feedTitle.replace(/\s*…$/, "").trim();
    const name =
      feedTitle.endsWith("…") && fullHeading.startsWith(titlePrefix)
        ? fullHeading
        : feedTitle;
    const contentImages = [...content.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)]
      .map((match) => match[1])
      .filter((src) => !/\/_\/stat/.test(src));
    const image =
      contentImages[0] ||
      item.match(/<media:thumbnail\b[^>]*\burl=["']([^"']+)["']/i)?.[1] ||
      null;
    return {
      id,
      name,
      createdAt: pubDate ? new Date(pubDate).toISOString() : "",
      description: description.slice(0, 280),
      contentText: stripHtml(content),
      metrics: contentMetrics(content),
      contentImages: contentImages.slice(1),
      image,
      url,
    };
  });
}

async function fetchPublications(report) {
  const response = await fetchWithRetry(MEDIUM_FEED_URL, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": `${USER_AGENT} (+https://pcodesdev.github.io/)`,
    },
  });
  if (!response.ok) {
    throw new Error(`Medium RSS request failed (${response.status})`);
  }
  const parsed = parseMediumFeed(await response.text());
  const usable = parsed.filter(
    (publication) => publication.name && publication.id && publication.description
  );
  report.publications.discovered = parsed.length;
  report.publications.usable = usable.length;
  if (usable.length === 0) throw new Error("Medium RSS returned no usable articles");
  return usable;
}

function curateProjects(candidates, previousData, overrides, report, hints) {
  const previousById = new Map(
    previousData.map((item) => [curationCore.normalizeId(item.id), item])
  );
  const manualProjects = overrides.projects || {};
  const { selected, decisions } = curationCore.rankCandidates({
    candidates,
    pinnedIds: overrides.pinnedProjects || [],
    excludedIds: overrides.excludedProjects || [],
    scoreFunction: (candidate) => candidate.ranking,
    minimumScore: curationCore.MIN_PROJECT_SCORE,
    kind: "projects",
  });
  report.projects.decisions.push(...decisions);
  selected.forEach((candidate) => {
    hints[candidate.id] = {
      repository: candidate,
      readme: candidate.readme,
      manualImage: (manualProjects[candidate.id] || {}).image,
      primaryLanguage: candidate.language,
      topics: candidate.topics || [],
    };
  });
  return curationCore.validateProjects(
    selected.map((candidate) =>
      projectData(
        candidate,
        previousById.get(candidate.id),
        manualProjects[candidate.id] || {}
      )
    )
  );
}

// The Medium feed only exposes the 10 newest posts, so featured older posts are carried forward from stored data.
function withCarriedForward(feedItems, previousPublications, previousRubricVersion) {
  const feedIds = new Set(feedItems.map((item) => curationCore.normalizeId(item.id)));
  const carried = previousPublications
    .filter((item) => !feedIds.has(curationCore.normalizeId(item.id)))
    .filter(
      (item) =>
        previousRubricVersion === curationCore.RUBRIC_VERSION &&
        Number.isFinite(item.curationScore)
    )
    .map((item) => ({ ...item, carriedForward: true }));
  return [...feedItems, ...carried];
}

function curatePublications(candidates, overrides, report, hints) {
  const manualPublications = overrides.publications || {};
  const scoreFunction = (candidate) =>
    candidate.carriedForward
      ? {
          score: candidate.curationScore,
          reasons: candidate.rankingReasons || [],
          eligible: true,
          exclusion: "",
        }
      : curationCore.scorePublication(candidate);
  const { selected, decisions } = curationCore.rankCandidates({
    candidates,
    pinnedIds: overrides.pinnedPublications || [],
    excludedIds: overrides.excludedPublications || [],
    scoreFunction,
    minimumScore: curationCore.MIN_PUBLICATION_SCORE,
    kind: "publications",
    dedupeKeys: curationCore.publicationDedupeKeys,
  });
  report.publications.carriedForward = candidates.filter((item) => item.carriedForward).length;
  report.publications.decisions.push(...decisions);
  return curationCore.validatePublications(
    selected.map((publication) => {
      const ranking = scoreFunction(publication);
      const { contentText, metrics, carriedForward, contentImages, ...metadata } = publication;
      hints[publication.id] = { rssImage: publication.image, contentImages: contentImages || [] };
      return {
        ...metadata,
        ...(manualPublications[publication.id] || {}),
        curationScore: ranking.score,
        rankingReasons: ranking.reasons,
      };
    })
  );
}

function validateOverrides(overrides) {
  ["pinnedProjects", "excludedProjects", "pinnedPublications", "excludedPublications"].forEach(
    (key) => {
      if (!Array.isArray(overrides[key] || [])) {
        throw new Error(`Override field ${key} must be an array`);
      }
      if ((overrides[key] || []).length > curationCore.MAX_FEATURED_ITEMS && key.startsWith("pinned")) {
        throw new Error(`At most ${curationCore.MAX_FEATURED_ITEMS} items may be pinned in ${key}`);
      }
    }
  );
}

function validateStoredData(overrides) {
  validateOverrides(overrides);
  const projectPayload = readJson(PROJECTS_PATH);
  const publicationPayload = readJson(PUBLICATIONS_PATH);
  const projects = projectPayload.data;
  const publications = publicationPayload.data;
  curationCore.validateProjects(projects);
  curationCore.validatePublications(publications);
  if (projects.length < 1 || publications.length < 1) {
    throw new Error("Featured content must contain at least one project and one publication");
  }
  [projectPayload, publicationPayload].forEach((payload) => {
    if (payload.rubricVersion !== curationCore.RUBRIC_VERSION) {
      throw new Error(
        `Generated data was produced by rubric version ${payload.rubricVersion}; expected ${curationCore.RUBRIC_VERSION}. Run npm run curate:featured.`
      );
    }
  });
  curationCore.validateQuality(projects, {
    minimumScore: curationCore.MIN_PROJECT_SCORE,
    pinnedIds: overrides.pinnedProjects || [],
    kind: "projects",
  });
  curationCore.validateImages(projects, { kind: "projects" });
  curationCore.validateImages(publications, { kind: "publications" });
  assertImagesExist(projects, PUBLIC_ROOT);
  assertImagesExist(publications, PUBLIC_ROOT);
  curationCore.validateQuality(publications, {
    minimumScore: curationCore.MIN_PUBLICATION_SCORE,
    pinnedIds: overrides.pinnedPublications || [],
    kind: "publications",
  });
  for (const project of projects) {
    const fallback = project.fallbackImage || GENERIC_IMAGE;
    if (fallback.startsWith("/")) {
      const assetPath = path.join(ROOT, "public", fallback.slice(1));
      if (!fs.existsSync(assetPath)) throw new Error(`Missing project image fallback: ${fallback}`);
    } else if (!curationCore.validHttpUrl(fallback)) {
      throw new Error(`Invalid project image fallback: ${fallback}`);
    }
  }
  return { projects: projects.length, publications: publications.length };
}

function dataPayload(source, data) {
  return {
    source,
    rubricVersion: curationCore.RUBRIC_VERSION,
    generatedAt: new Date().toISOString(),
    data,
  };
}

function withoutVolatileFields(items) {
  return (items || []).map((item) => {
    const copy = { ...item };
    VOLATILE_FIELDS.forEach((field) => delete copy[field]);
    return copy;
  });
}

function readStoredPayload(filePath) {
  try {
    return readJson(filePath);
  } catch (error) {
    return { data: undefined };
  }
}

async function writeIfMeaningfullyChanged(filePath, payload) {
  const current = readStoredPayload(filePath);
  if (
    current.rubricVersion === payload.rubricVersion &&
    JSON.stringify(withoutVolatileFields(current.data)) ===
      JSON.stringify(withoutVolatileFields(payload.data))
  ) {
    return false;
  }

  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await fs.promises.writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.promises.rename(temporaryPath, filePath);
  return true;
}

function describeChanges(previous, next) {
  const before = new Set(previous.map((item) => curationCore.normalizeId(item.id)));
  const after = new Set(next.map((item) => curationCore.normalizeId(item.id)));
  return {
    added: next.filter((item) => !before.has(curationCore.normalizeId(item.id))).map((item) => item.id),
    removed: previous.filter((item) => !after.has(curationCore.normalizeId(item.id))).map((item) => item.id),
  };
}

const STATUS_ORDER = [
  "selected-pinned",
  "selected",
  "outranked",
  "below-threshold",
  "duplicate",
  "excluded-by-owner",
  "ineligible",
  "not-shortlisted",
];

function sortedDecisions(decisions) {
  return [...decisions].sort((left, right) => {
    const statusDelta = STATUS_ORDER.indexOf(left.status) - STATUS_ORDER.indexOf(right.status);
    if (statusDelta) return statusDelta;
    return (right.score ?? -1) - (left.score ?? -1) || String(left.id).localeCompare(String(right.id));
  });
}

function decisionTable(decisions) {
  const sorted = sortedDecisions(decisions);
  const shown = sorted.filter((decision) => decision.status !== "not-shortlisted");
  const rows = shown.map(
    (decision, index) =>
      `| ${index + 1} | ${String(decision.name || decision.id).replace(/\|/g, "\\|")} | ${
        decision.score === null || decision.score === undefined ? "n/a" : decision.score
      } | ${decision.status} | ${String(decision.reason).replace(/\|/g, "\\|")} |`
  );
  const hidden = sorted.length - shown.length;
  if (hidden) {
    rows.push(`| | ${hidden} further repositories | | not-shortlisted | preliminary score below the cut-off (see curation-report.json) |`);
  }
  return ["| # | Item | Score | Decision | Reason |", "| --- | --- | --- | --- | --- |", ...rows].join("\n");
}

function imageTable(images) {
  const rows = [...images.projects.map((entry) => ({ kind: "project", ...entry })), ...images.publications.map((entry) => ({ kind: "article", ...entry }))].map(
    (entry) =>
      `| ${entry.kind} | ${entry.id} | ${entry.source} | ${entry.status} | ${entry.notes.join("; ").replace(/\|/g, "\\|") || "-"} |`
  );
  return ["| Type | Item | Image source | Status | Notes |", "| --- | --- | --- | --- | --- |", ...rows].join("\n");
}

function renderReport(report) {
  const { projects, publications } = report;
  const lines = [
    "## Portfolio content curation",
    `- Rubric version: ${report.rubricVersion} (project/article threshold ${curationCore.MIN_PROJECT_SCORE}/${curationCore.MIN_PUBLICATION_SCORE} of 100; display limit ${curationCore.MAX_FEATURED_ITEMS} each)`,
    `- Mode: ${report.dryRun ? "dry run (nothing written)" : "write"}`,
    `- GitHub repositories discovered: ${projects.discovered} (forks ${projects.forks}, archived ${projects.archived}, empty ${projects.empty}, site/profile ${projects.siteRepositories}); eligible ${projects.eligible}; fully evaluated ${projects.shortlisted}`,
    `- Medium articles discovered: ${publications.discovered} (usable ${publications.usable}, carried forward from stored data ${publications.carriedForward})`,
    `- Items evaluated: ${projects.eligible + publications.usable + publications.carriedForward}`,
    `- Projects added: ${report.changes.projects.added.join(", ") || "none"}; removed: ${report.changes.projects.removed.join(", ") || "none"}`,
    `- Articles added: ${report.changes.publications.added.join(", ") || "none"}; removed: ${report.changes.publications.removed.join(", ") || "none"}`,
    `- Validation: ${report.validation}`,
    `- Generated data changed: ${report.changed ? "yes" : "no"}`,
    `- Last content update: ${report.lastContentUpdate || "unknown"}`,
    "",
    "### Projects",
    decisionTable(projects.decisions),
    "",
    "### Articles",
    decisionTable(publications.decisions),
    "",
    "### Featured images",
    imageTable(report.images),
  ];
  return `${lines.join("\n")}\n`;
}

function emitReport(report) {
  const markdown = renderReport(report);
  console.log(markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }
  if (process.env.CURATION_REPORT_PATH) {
    fs.writeFileSync(process.env.CURATION_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  }
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      [
        `changed=${report.changed}`,
        `projects_discovered=${report.projects.discovered}`,
        `publications_discovered=${report.publications.discovered}`,
        `projects_selected=${report.projects.decisions.filter((entry) => entry.status.startsWith("selected")).length}`,
        `publications_selected=${report.publications.decisions.filter((entry) => entry.status.startsWith("selected")).length}`,
      ].join("\n") + "\n"
    );
  }
}

async function run() {
  const overrides = readJson(OVERRIDES_PATH);
  validateOverrides(overrides);
  if (process.argv.includes("--validate")) {
    const counts = validateStoredData(overrides);
    console.log(
      `Validated ${counts.projects} featured projects and ${counts.publications} featured publications.`
    );
    return;
  }

  const dryRun = process.argv.includes("--dry-run");
  const previousProjectPayload = readStoredPayload(PROJECTS_PATH);
  const previousPublicationPayload = readStoredPayload(PUBLICATIONS_PATH);
  const previousProjects = previousProjectPayload.data || [];
  const previousPublications = previousPublicationPayload.data || [];
  const report = {
    startedAt: new Date().toISOString(),
    dryRun,
    rubricVersion: curationCore.RUBRIC_VERSION,
    projects: {
      discovered: 0,
      forks: 0,
      archived: 0,
      empty: 0,
      siteRepositories: 0,
      eligible: 0,
      shortlisted: 0,
      decisions: [],
    },
    publications: { discovered: 0, usable: 0, carriedForward: 0, decisions: [] },
    changes: {
      projects: { added: [], removed: [] },
      publications: { added: [], removed: [] },
    },
    validation: "not run",
    changed: false,
    images: { projects: [], publications: [] },
    lastContentUpdate: previousProjectPayload.generatedAt || null,
  };
  const hints = { projects: {}, publications: {} };
  const enrichmentContext = { publicRoot: PUBLIC_ROOT, owner: OWNER, dryRun, log: console.warn };

  await curationCore.collectValidatedData(
      async () => {
        const candidates = await discoverProjectCandidates(overrides, report);
        return curateProjects(candidates, previousProjects, overrides, report, hints.projects);
      },
      async () => {
        const feedItems = await fetchPublications(report);
        return curatePublications(
          withCarriedForward(
            feedItems,
            previousPublications,
            previousPublicationPayload.rubricVersion
          ),
          overrides,
          report,
          hints.publications
        );
      },
      async (selection) => {
        if (selection.projects.length < 1 || selection.publications.length < 1) {
          throw new Error("Refusing to publish: no project or article met the quality threshold");
        }
        const enrichedProjects = await enrichImages({
          kind: "projects",
          items: selection.projects,
          previousItems: previousProjects,
          hintsById: hints.projects,
          context: enrichmentContext,
        });
        const enrichedPublications = await enrichImages({
          kind: "articles",
          items: selection.publications,
          previousItems: previousPublications,
          hintsById: hints.publications,
          context: enrichmentContext,
        });
        const projects = enrichedProjects.items;
        const publications = enrichedPublications.items;
        report.images = { projects: enrichedProjects.outcomes, publications: enrichedPublications.outcomes };
        curationCore.validateImages(projects, { kind: "projects" });
        curationCore.validateImages(publications, { kind: "publications" });
        if (!dryRun) {
          assertImagesExist(projects, PUBLIC_ROOT);
          assertImagesExist(publications, PUBLIC_ROOT);
        }
        report.validation = "passed";
        report.changes.projects = describeChanges(previousProjects, projects);
        report.changes.publications = describeChanges(previousPublications, publications);
        if (dryRun) return;
        const changedProjects = await writeIfMeaningfullyChanged(
          PROJECTS_PATH,
          dataPayload("GitHub public repository metadata", projects)
        );
        const changedPublications = await writeIfMeaningfullyChanged(
          PUBLICATIONS_PATH,
          dataPayload("Medium RSS", publications)
        );
        report.changed = changedProjects || changedPublications;
        report.lastContentUpdate = readStoredPayload(PROJECTS_PATH).generatedAt || null;
      }
    );

  emitReport(report);
}

run().catch((error) => {
  console.error(`Portfolio curation failed: ${error.message}`);
  process.exitCode = 1;
});
