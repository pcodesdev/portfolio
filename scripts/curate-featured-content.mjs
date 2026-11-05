import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import curationCore from "../src/shared/curationCore.cjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OWNER = "pcodesdev";
const PROJECTS_PATH = path.join(ROOT, "src/shared/opensource/projects.json");
const PUBLICATIONS_PATH = path.join(ROOT, "src/shared/medium/publications.json");
const OVERRIDES_PATH = path.join(ROOT, "scripts/curation-overrides.json");
const MEDIUM_FEED_URL = "https://medium.com/feed/@pcodesdev";
const GENERIC_IMAGE = "/images/projects/project-generic.svg";
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

function imageFromReadme(readme, repository) {
  const imageMatch = String(readme || "").match(
    /!\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+['"][^)]*['"])?\)/i
  );
  if (!imageMatch) return null;
  const imagePath = imageMatch[1].replace(/&amp;/g, "&");
  if (/^https:\/\//i.test(imagePath)) return imagePath;
  if (/^data:/i.test(imagePath) || imagePath.startsWith("#")) return null;
  const branch = encodeURIComponent(repository.default_branch || "main").replace(
    /%2F/gi,
    "/"
  );
  const relativePath = imagePath.replace(/^\.\//, "");
  return `https://raw.githubusercontent.com/${OWNER}/${encodeURIComponent(
    repository.name
  )}/${branch}/${relativePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
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

async function githubRequest(url) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "pcodesdev-portfolio-curation/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status}): ${url}`);
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
  const response = await fetch(url, {
    headers: { "User-Agent": "pcodesdev-portfolio-curation/1.0" },
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
      `https://api.github.com/users/${OWNER}/repos?per_page=100&page=${page}&sort=updated`
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

async function discoverProjectCandidates(overrides) {
  const repositories = await fetchAllRepositories();
  const byId = new Map(
    repositories.map((repository) => [
      curationCore.normalizeId(repository.name),
      repository,
    ])
  );
  const pinned = (overrides.pinnedProjects || []).map((id) => {
    const repository = byId.get(curationCore.normalizeId(id));
    if (!repository) throw new Error(`Pinned project is unavailable from GitHub: ${id}`);
    return repository;
  });
  const pinnedIds = new Set(pinned.map((repository) => curationCore.normalizeId(repository.name)));
  const initialCandidates = repositories
    .filter((repository) => !repository.fork && !repository.archived && repository.size > 0)
    .map((repository) => ({
      id: curationCore.normalizeId(repository.name),
      name: repository.name,
      description: repository.description,
      language: repository.language,
      topics: repository.topics || [],
      size: repository.size,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      updatedAt: repository.updated_at,
      fork: repository.fork,
      archived: repository.archived,
    }))
    .map((candidate) => ({
      candidate,
      score: curationCore.scoreProject(candidate).score,
    }))
    .filter(({ candidate, score }) => pinnedIds.has(candidate.id) || score >= curationCore.MIN_PROJECT_SCORE)
    .sort((left, right) => right.score - left.score)
    .slice(0, 30)
    .map(({ candidate }) => byId.get(candidate.id));
  const shortlist = [...pinned, ...initialCandidates].filter(
    (repository, index, list) =>
      list.findIndex(
        (candidate) =>
          curationCore.normalizeId(candidate.name) ===
          curationCore.normalizeId(repository.name)
      ) === index
  );

  return mapLimit(shortlist, 5, async (repository) => {
    const [readme, languages, homepageAvailable] = await Promise.all([
      rawReadme(repository),
      fetchLanguages(repository),
      repository.homepage ? urlIsReachable(repository.homepage) : false,
    ]);
    const scoreInput = {
      id: curationCore.normalizeId(repository.name),
      name: repository.name,
      description: repository.description,
      language: repository.language,
      languages,
      topics: repository.topics || [],
      readme,
      size: repository.size,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      updatedAt: repository.updated_at,
      fork: repository.fork,
      archived: repository.archived,
    };
    const ranking = curationCore.scoreProject(scoreInput);
    const previewImage = imageFromReadme(readme, repository);
    const previewImageAvailable = previewImage
      ? await urlIsReachable(previewImage)
      : false;
    return {
      ...repository,
      id: scoreInput.id,
      languages,
      readme,
      readmeSummary: firstParagraph(readXmlTag(readme, "description") || readme),
      previewImage,
      previewImageAvailable,
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

function firstReadmeParagraph(readme) {
  const headingsRemoved = String(readme || "").replace(/^#{1,6}\s.*$/gm, " ");
  const paragraph = headingsRemoved
    .split(/\r?\n\s*\r?\n/)
    .map(stripHtml)
    .find((entry) => entry.length > 35 && !entry.startsWith("[!["));
  return paragraph || "";
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
    : existing && Object.prototype.hasOwnProperty.call(existing, "image")
      ? existing.image
      : candidate.previewImageAvailable
        ? candidate.previewImage
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
    readmeImageAvailable: Boolean(candidate.previewImageAvailable),
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

function parseMediumFeed(xml) {
  const items = [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
    (match) => match[1]
  );
  return items
    .map((item) => {
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
      const image =
        content.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] ||
        item.match(/<media:thumbnail\b[^>]*\burl=["']([^"']+)["']/i)?.[1] ||
        null;
      return {
        id,
        name,
        createdAt: pubDate ? new Date(pubDate).toISOString() : "",
        description: description.slice(0, 280),
        contentText: stripHtml(content),
        image,
        url,
      };
    })
    .filter((publication) => publication.name && publication.id && publication.description);
}

async function fetchPublications() {
  const response = await fetch(MEDIUM_FEED_URL, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
      "User-Agent": "pcodesdev-portfolio-curation/1.0 (+https://pcodesdev.github.io/)",
    },
  });
  if (!response.ok) {
    throw new Error(`Medium RSS request failed (${response.status})`);
  }
  const publications = parseMediumFeed(await response.text());
  if (publications.length === 0) throw new Error("Medium RSS returned no usable articles");
  return publications;
}

function curateProjects(candidates, previousData, overrides) {
  const previousById = new Map(
    previousData.map((item) => [curationCore.normalizeId(item.id), item])
  );
  const manualProjects = overrides.projects || {};
  const ordered = curationCore.orderCandidates(
    candidates.map((candidate) => ({ ...candidate, id: candidate.id })),
    overrides.pinnedProjects || [],
    overrides.excludedProjects || [],
    (candidate) => candidate.ranking,
    curationCore.MIN_PROJECT_SCORE,
    "projects"
  );
  return curationCore.validateProjects(
    ordered.map((candidate) =>
      projectData(
        candidate,
        previousById.get(candidate.id),
        manualProjects[candidate.id] || {}
      )
    )
  );
}

function curatePublications(candidates, overrides) {
  const manualPublications = overrides.publications || {};
  const ordered = curationCore.orderCandidates(
    candidates.map((candidate) => ({
      ...candidate,
      ranking: curationCore.scorePublication(candidate),
    })),
    overrides.pinnedPublications || [],
    overrides.excludedPublications || [],
    (candidate) => candidate.ranking,
    curationCore.MIN_PUBLICATION_SCORE,
    "publications"
  );
  return curationCore.validatePublications(
    ordered.map((publication) => {
      const { contentText, ranking, ...metadata } = publication;
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
  const projects = readJson(PROJECTS_PATH).data;
  const publications = readJson(PUBLICATIONS_PATH).data;
  curationCore.validateProjects(projects);
  curationCore.validatePublications(publications);
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
  return { source, generatedAt: new Date().toISOString(), data };
}

async function writeIfMeaningfullyChanged(filePath, payload) {
  let currentData;
  try {
    currentData = readJson(filePath).data;
  } catch (error) {
    currentData = undefined;
  }
  if (JSON.stringify(currentData) === JSON.stringify(payload.data)) return false;

  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await fs.promises.writeFile(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`);
  await fs.promises.rename(temporaryPath, filePath);
  return true;
}

function appendWorkflowSummary(projects, publications, changed) {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;
  const lines = [
    "## Portfolio curation",
    `- Featured repositories: ${projects.length} (maximum ${curationCore.MAX_FEATURED_ITEMS})`,
    `- Featured Medium articles: ${publications.length} (maximum ${curationCore.MAX_FEATURED_ITEMS})`,
    `- Generated data changed: ${changed ? "yes" : "no"}`,
    "- Deployment: not performed; data changes are proposed for review in a pull request.",
  ];
  fs.appendFileSync(summaryPath, `${lines.join("\n")}\n`);
}

async function run() {
  const overrides = readJson(OVERRIDES_PATH);
  validateOverrides(overrides);
  if (process.argv.includes("--validate")) {
    const counts = validateOverrides(overrides);
    console.log(
      `Validated ${counts.projects} featured projects and ${counts.publications} featured publications.`
    );
    return;
  }

  const previousProjects = readJson(PROJECTS_PATH).data;
  const dryRun = process.argv.includes("--dry-run");
  let changed = false;
  const { projects: curatedProjects, publications: curatedPublications } =
    await curationCore.collectValidatedData(
      async () => {
        const repositories = await discoverProjectCandidates(overrides);
        return curateProjects(repositories, previousProjects, overrides);
      },
      async () => curatePublications(await fetchPublications(), overrides),
      async ({ projects, publications }) => {
        if (dryRun) return;
        const projectPayload = dataPayload(
          "GitHub public repository metadata",
          projects
        );
        const publicationPayload = dataPayload("Medium RSS", publications);
        const changedProjects = await writeIfMeaningfullyChanged(
          PROJECTS_PATH,
          projectPayload
        );
        const changedPublications = await writeIfMeaningfullyChanged(
          PUBLICATIONS_PATH,
          publicationPayload
        );
        changed = changedProjects || changedPublications;
      }
    );
  appendWorkflowSummary(curatedProjects, curatedPublications, changed);
  console.log(
    `Selected ${curatedProjects.length} projects and ${curatedPublications.length} Medium articles${
      process.argv.includes("--dry-run") ? " (dry run)" : ""
    }.`
  );
  curatedProjects.forEach((project) =>
    console.log(`Project ${project.id}: ${project.curationScore} points (${project.rankingReasons.join(", ")})`)
  );
  curatedPublications.forEach((publication) =>
    console.log(
      `Article ${publication.id}: ${publication.curationScore} points (${publication.rankingReasons.join(", ")})`
    )
  );
}

run().catch((error) => {
  console.error(`Portfolio curation failed: ${error.message}`);
  process.exitCode = 1;
});
