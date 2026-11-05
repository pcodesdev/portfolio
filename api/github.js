const fallbackSnapshot = require("../src/shared/opensource/github_stats_snapshot.json");
const {
  buildGitHubSnapshot,
  normalizeGitHubPages,
} = require("../src/search/github-data");

const CACHE_KEY = "portfolio:github-profile:pcodesdev:v1";
const CACHE_TTL_SECONDS = 86400;
const FRESH_TTL_MS = 60 * 60 * 1000;
const RATE_WINDOW_SECONDS = 60;
const RATE_LIMIT = 12;
let warmCache = null;

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function redisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
}

async function redisCommand(...command) {
  if (!redisUrl() || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Persistent cache is not configured.");
  }
  const response = await fetch(`${redisUrl()}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([command]),
  });
  if (!response.ok) throw new Error("GitHub cache request failed.");
  const result = await response.json();
  if (result[0]?.error) throw new Error("GitHub cache command failed.");
  return result[0]?.result;
}

async function readCache() {
  if (warmCache) return warmCache;
  try {
    const result = await redisCommand("GET", CACHE_KEY);
    if (typeof result === "string") {
      warmCache = JSON.parse(result);
      return warmCache;
    }
  } catch (error) {
    return null;
  }
  return null;
}

async function writeCache(snapshot) {
  warmCache = snapshot;
  await redisCommand(
    "SET",
    CACHE_KEY,
    JSON.stringify(snapshot),
    "EX",
    String(CACHE_TTL_SECONDS)
  );
}

function getClientKey(request) {
  const trustedIp = request.headers["x-vercel-forwarded-for"];
  const remoteAddress = request.socket?.remoteAddress;
  return String(trustedIp || remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

async function allowRequest(request) {
  const result = await redisCommand(
    "INCR",
    `portfolio:github-rate:${getClientKey(request)}`
  );
  if (Number(result) === 1) {
    await redisCommand(
      "EXPIRE",
      `portfolio:github-rate:${getClientKey(request)}`,
      String(RATE_WINDOW_SECONDS)
    );
  }
  return Number(result) <= RATE_LIMIT;
}

async function githubRequest(url, method = "GET", body) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "pcodesdev-portfolio-readonly",
  };
  if (process.env.GITHUB_TOKEN)
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const response = await fetch(url, {
    method,
    headers: body
      ? { ...headers, "Content-Type": "application/json" }
      : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const error = new Error(`GitHub API returned ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function fetchPages(urlFactory, expectedPages = 10) {
  const pages = [];
  for (let page = 1; page <= expectedPages; page += 1) {
    const result = await githubRequest(urlFactory(page));
    pages.push(result);
    if (!Array.isArray(result) || result.length < 100) break;
  }
  return normalizeGitHubPages(pages);
}

async function searchAll(query) {
  const pages = [];
  let total = 0;
  for (let page = 1; page <= 10; page += 1) {
    const result = await githubRequest(
      `https://api.github.com/search/issues?q=${encodeURIComponent(
        query
      )}&sort=created&order=desc&per_page=100&page=${page}`
    );
    total = result.total_count || 0;
    pages.push(result.items || []);
    const returnedCount = pages.flat().length;
    if (!(result.items || []).length || returnedCount >= total) break;
  }
  return { total, items: normalizeGitHubPages(pages) };
}

async function fetchPullRequestDetails(records) {
  return Promise.all(
    records.map(async (record) => {
      const pullUrl = record.pull_request?.url;
      if (!pullUrl) return record;
      try {
        const details = await githubRequest(pullUrl);
        return { ...record, ...details, pull_request: record.pull_request };
      } catch (error) {
        return record;
      }
    })
  );
}

async function fetchContributionCalendar(login) {
  if (!process.env.GITHUB_TOKEN) return null;
  const to = new Date();
  const from = new Date(to);
  from.setFullYear(from.getFullYear() - 1);
  const query = `query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){totalCommitContributions totalIssueContributions totalPullRequestContributions totalRepositoryContributions contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  try {
    const result = await githubRequest(
      "https://api.github.com/graphql",
      "POST",
      {
        query,
        variables: { login, from: from.toISOString(), to: to.toISOString() },
      }
    );
    const collection = result.data?.user?.contributionsCollection;
    if (!collection) return null;
    return {
      totalContributions: collection.contributionCalendar.totalContributions,
      totalCommitContributions: collection.totalCommitContributions,
      totalIssueContributions: collection.totalIssueContributions,
      totalPullRequestContributions: collection.totalPullRequestContributions,
      totalRepositoryContributions: collection.totalRepositoryContributions,
      weeks: collection.contributionCalendar.weeks,
      periodFrom: from.toISOString(),
      periodTo: to.toISOString(),
    };
  } catch (error) {
    return null;
  }
}

async function fetchLiveSnapshot() {
  const profile = await githubRequest("https://api.github.com/users/pcodesdev");
  if (!verifyProfileIdentity(profile)) {
    throw new Error(
      "GitHub profile identity did not match the configured portfolio account."
    );
  }

  const pageCount = Math.ceil(profile.public_repos / 100);
  const [
    repositories,
    prSearch,
    issueSearch,
    openIssueSearch,
    closedIssueSearch,
    commitSearch,
  ] = await Promise.all([
    fetchPages(
      (page) =>
        `https://api.github.com/users/${profile.login}/repos?type=owner&per_page=100&page=${page}`,
      pageCount
    ),
    searchAll(`author:${profile.login} type:pr`),
    searchAll(`author:${profile.login} type:issue`),
    searchAll(`author:${profile.login} type:issue is:open`),
    searchAll(`author:${profile.login} type:issue is:closed`),
    githubRequest(
      `https://api.github.com/search/commits?q=${encodeURIComponent(
        `author:${profile.login}`
      )}&per_page=1`
    ),
  ]);
  const detailedPullRequests = await fetchPullRequestDetails(prSearch.items);
  const contributionCalendar = await fetchContributionCalendar(profile.login);
  return buildGitHubSnapshot({
    profile,
    repositories,
    pullRequests: detailedPullRequests,
    issues: issueSearch.items,
    prTotal: prSearch.total,
    issueTotal: issueSearch.total,
    issueOpenTotal: openIssueSearch.total,
    issueClosedTotal: closedIssueSearch.total,
    commitSearchMatches: commitSearch.total_count ?? null,
    contributionCalendar,
    fetchedAt: new Date().toISOString(),
    freshness: "live",
  });
}

function verifyProfileIdentity(profile) {
  return profile?.login === "pcodesdev" && profile?.id === 44283776;
}

function snapshotWithFreshness(snapshot, now = Date.now()) {
  const fetchedAt = Date.parse(snapshot.retrievedAt || "");
  return {
    ...snapshot,
    freshness:
      Number.isFinite(fetchedAt) && now - fetchedAt <= FRESH_TTL_MS
        ? "cached"
        : "stale",
  };
}

async function getCachedSnapshot() {
  return snapshotWithFreshness((await readCache()) || fallbackSnapshot);
}

module.exports = async function githubProfile(request, response) {
  const allowedOrigin = process.env.PORTFOLIO_SEARCH_ALLOWED_ORIGIN;
  const origin = request.headers.origin;
  if (request.method === "OPTIONS") {
    if (!allowedOrigin || origin !== allowedOrigin) {
      return sendJson(response, 403, { message: "Origin is not allowed." });
    }
    response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.statusCode = 204;
    return response.end();
  }
  if (request.method !== "GET")
    return sendJson(response, 405, { message: "Method not allowed." });
  if (!allowedOrigin || origin !== allowedOrigin) {
    return sendJson(response, 403, { message: "Origin is not allowed." });
  }
  response.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  const cached = await readCache();
  if (cached && snapshotWithFreshness(cached).freshness === "cached") {
    return sendJson(response, 200, snapshotWithFreshness(cached));
  }

  if (!redisUrl() || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    const fallback = cached || fallbackSnapshot;
    return sendJson(response, 200, {
      ...snapshotWithFreshness(fallback),
      freshness: "stale",
      warning:
        "Persistent cache is not configured; serving the bundled verified snapshot.",
    });
  }

  try {
    if (!(await allowRequest(request))) {
      response.setHeader("Retry-After", String(RATE_WINDOW_SECONDS));
      const fallback = cached || fallbackSnapshot;
      return sendJson(response, 200, {
        ...snapshotWithFreshness(fallback),
        freshness: "stale",
        warning: "Refresh rate limit reached; serving cached GitHub data.",
      });
    }
  } catch (error) {
    const fallback = cached || fallbackSnapshot;
    return sendJson(response, 200, {
      ...snapshotWithFreshness(fallback),
      freshness: "stale",
      warning:
        "Rate-limit/cache service unavailable; serving cached GitHub data.",
    });
  }

  try {
    const snapshot = await fetchLiveSnapshot();
    await writeCache(snapshot);
    return sendJson(response, 200, snapshot);
  } catch (error) {
    const fallback = cached || fallbackSnapshot;
    return sendJson(response, 200, {
      ...snapshotWithFreshness(fallback),
      freshness: "stale",
      warning:
        "GitHub API refresh failed; serving the most recent cached snapshot.",
    });
  }
};

module.exports._test = {
  buildGitHubSnapshot,
  normalizeGitHubPages,
  snapshotWithFreshness,
  verifyProfileIdentity,
  fetchPages,
  searchAll,
  fetchLiveSnapshot,
  getCachedSnapshot,
  resetWarmCache() {
    warmCache = null;
  },
};
