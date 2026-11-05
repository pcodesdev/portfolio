const MAX_FEATURED_ITEMS = 6;
const MIN_PROJECT_SCORE = 3;
const MIN_PUBLICATION_SCORE = 3;

function textOf(value) {
  return String(value || "").toLowerCase();
}

function matchesAny(text, pattern) {
  return pattern.test(text);
}

function scoreProject(project) {
  const rawReadme = textOf(project.readme);
  const tutorialOrTemplate = /tutorial|coursework|boilerplate|starter.?template|fork of|getting started with create react app|react hooks are functions/.test(
    `${textOf(project.name)} ${textOf(project.description)} ${rawReadme}`
  );
  const boilerplateOnly =
    /getting started with create react app/.test(rawReadme) &&
    !textOf(project.description).trim() &&
    !(project.topics || []).length;
  const readme = rawReadme.replace(
    /getting started with create react app[\s\S]*?(?=^#{1,2}\s+(?:react hooks|useState|useEffect|useContext|useReducer|conclusion)\b|$)/im,
    " "
  );
  const metadata = [
    project.name,
    project.description,
    project.topics && project.topics.join(" "),
    project.language,
    project.languages && project.languages.join(" "),
    project.readme,
  ]
    .map(textOf)
    .join(" ");
  const reasons = [];
  let score = 0;
  const weightedSignals = [
    ["digital transformation relevance", /education|learning|digital skills|community|health|agricultur|farm|school|programme|workflow|operations/, 3],
    ["technical depth", /api|backend|database|security|testing|architecture|docker|typescript|react|fastapi|validation|ci\/cd/, 3],
    ["full-stack relevance", /full.?stack|frontend|backend|rest api|database|client.?server/, 2],
    ["cloud relevance", /cloud|aws|azure|gcp|serverless|deployment|kubernetes|supabase|vercel/, 2],
    ["practical problem solving", /analytics|reporting|tracking|management|import|export|automation|search|records|assessment/, 2],
  ];

  weightedSignals.forEach(([label, pattern, points]) => {
    if (matchesAny(metadata, pattern)) {
      score += points;
      reasons.push(label);
    }
  });

  if (readme.length >= 1000) {
    score += 1;
    reasons.push("substantive README");
  }
  if ((readme.match(/^#{1,3}\s/gm) || []).length >= 4) {
    score += 1;
    reasons.push("structured documentation");
  }
  if ((project.languages || []).length >= 2) score += 1;
  if ((project.topics || []).length >= 2) score += 1;
  if (project.size > 100) score += 1;
  score += Math.min(Number(project.stars || 0), 5) / 5;

  if (tutorialOrTemplate) {
    score -= 15;
    reasons.push("tutorial/template penalty");
  }
  if (boilerplateOnly) {
    score = -Infinity;
    reasons.push("boilerplate-only README with no project metadata excluded");
  }
  if (project.fork || project.archived || Number(project.size) === 0) {
    score = -Infinity;
    reasons.push("forked, archived, or empty repository excluded");
  }

  return { score, reasons };
}

function scorePublication(publication) {
  const metadata = `${textOf(publication.name)} ${textOf(publication.description)} ${textOf(publication.contentText)}`;
  let score = 0;
  const reasons = [];
  const signals = [
    ["software engineering", /software|programming|developer|python|javascript|typescript|coding|api/, 4],
    ["digital transformation and skills", /digital transformation|digital skills|technology adoption|education technology|workforce|skills development/, 4],
    ["technology adoption and digital ecosystems", /ai adoption|ai usage|digital adoption|tech ecosystem|technology ecosystem|digital economy|technology in africa|kenya.{0,30}technology/, 3],
    ["cloud and implementation", /cloud|deployment|infrastructure|implementation|engineering|architecture|data workflow/, 4],
    ["technical analysis", /technical|analysis|systems|product design|application|automation|data|interface design|figma|lms|prototype/, 2],
    ["technology adoption", /technology|technology-enabled|artificial intelligence|\bai\b|\btech\b/, 1],
  ];

  signals.forEach(([label, pattern, points]) => {
    if (matchesAny(metadata, pattern)) {
      score += points;
      reasons.push(label);
    }
  });
  if (String(publication.description || "").length >= 100) score += 1;
  if (/nft|market crash|celebrity|viral/i.test(publication.name || "")) score -= 2;

  return { score, reasons };
}

function limitFeaturedItems(items) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, MAX_FEATURED_ITEMS);
}

function normalizeId(value) {
  return String(value || "").trim().toLowerCase();
}

function applyFields(source, existing, manual, fields) {
  const result = { ...source };
  fields.forEach((field) => {
    if (manual && manual[field] !== undefined) result[field] = manual[field];
    else if (existing && existing[field] !== undefined) result[field] = existing[field];
  });
  return result;
}

function orderCandidates(candidates, pinnedIds, excludedIds, scoreFunction, minimumScore, kind) {
  const candidateMap = new Map(
    candidates.map((candidate) => [normalizeId(candidate.id), candidate])
  );
  const pinned = pinnedIds.map((id) => {
    const candidate = candidateMap.get(normalizeId(id));
    if (!candidate) throw new Error(`Pinned ${kind} was not found upstream: ${id}`);
    return candidate;
  });
  const pinnedSet = new Set(pinnedIds.map(normalizeId));
  const excludedSet = new Set(excludedIds.map(normalizeId));
  if (pinnedIds.length > MAX_FEATURED_ITEMS) {
    throw new Error(`At most ${MAX_FEATURED_ITEMS} ${kind} may be pinned`);
  }
  if (pinnedIds.some((id) => excludedSet.has(normalizeId(id)))) {
    throw new Error(`A ${kind} cannot be both pinned and excluded`);
  }

  const ranked = candidates
    .filter((candidate) => !pinnedSet.has(normalizeId(candidate.id)))
    .filter((candidate) => !excludedSet.has(normalizeId(candidate.id)))
    .map((candidate) => ({ candidate, ranking: scoreFunction(candidate) }))
    .filter(({ ranking }) => ranking.score >= minimumScore)
    .sort((left, right) => {
      if (right.ranking.score !== left.ranking.score) {
        return right.ranking.score - left.ranking.score;
      }
      return String(right.candidate.updatedAt || right.candidate.createdAt || "").localeCompare(
        String(left.candidate.updatedAt || left.candidate.createdAt || "")
      );
    })
    .map(({ candidate }) => candidate);

  return [...pinned, ...ranked].slice(0, MAX_FEATURED_ITEMS);
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
  return publications;
}

module.exports = {
  MAX_FEATURED_ITEMS,
  MIN_PROJECT_SCORE,
  MIN_PUBLICATION_SCORE,
  limitFeaturedItems,
  normalizeId,
  scoreProject,
  scorePublication,
  orderCandidates,
  applyFields,
  validateProjects,
  validatePublications,
  validHttpUrl,
  validImageReference,
  collectValidatedData,
};
