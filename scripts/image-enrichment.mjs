import crypto from "node:crypto";
import { lookup } from "node:dns/promises";
import fs from "node:fs";
import https from "node:https";
import ipaddr from "ipaddr.js";
import { isIP } from "node:net";
import path from "node:path";
import nodeFetch from "node-fetch";
import sharp from "sharp";

// Image resolution for featured projects and articles. Owner-controlled images are downloaded and
// re-encoded to WebP; stock photos are hotlinked (Unsplash API terms) with attribution.
// Every item ends with a valid image: a generated, branded SVG is the last resort and never throws.

export const IMAGE_WIDTHS = [480, 960];
export const GENERIC_PROJECT_IMAGE = "/images/projects/project-generic.svg";
const MIN_WIDTH = 320;
const MIN_HEIGHT = 160;
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15000;
const MAX_REDIRECTS = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const OWNER_TTL_MS = 30 * DAY_MS;
const SEARCH_TTL_MS = 14 * DAY_MS;
const FALLBACK_TTL_MS = 7 * DAY_MS;
const USER_AGENT = "pcodesdev-portfolio-images/1.0";

export const CATEGORY_RULES = [
  ["Education technology", /\b(edu\w*|school|students?|learn\w*|teachers?|classroom|curriculum|lms|training|digital skills)\b/, "students learning classroom"],
  ["Artificial intelligence", /\b(ai|llm|machine learning|openai|gpt|chatbot|neural|prompt)\b/, "artificial intelligence technology"],
  ["Healthcare", /\b(hospital|health\w*|clinic|medical)\b/, "healthcare hospital"],
  ["Weather", /\b(weather|forecast|climate)\b/, "weather forecast sky"],
  ["Movies", /\b(movies?|films?|cinema|tmdb|omdb|watch-?list)\b/, "cinema movie film"],
  ["Travel", /\b(travel|journal|trips?|tourism|geolocation)\b/, "travel journey map"],
  ["Agriculture", /\b(farm\w*|agricultur\w*|crops?|veggies|livestock)\b/, "farm agriculture"],
  ["Food and hospitality", /\b(pizza|restaurant|recipes?|food|menu)\b/, "restaurant food menu"],
  ["Commerce", /\b(shop\w*|cart|checkout|e-?commerce|store|orders?)\b/, "online shopping store"],
  ["Finance", /\b(bank\w*|finance|payments?|budget|invoice)\b/, "finance banking"],
  ["Data and analytics", /\b(analytics|dashboards?|reports?|metrics?|statistics|charts?)\b/, "data analytics dashboard"],
  ["Digital transformation", /\b(digital transformation|technology adoption|workforce|digital economy|silicon savannah)\b/, "digital transformation technology"],
  ["Community", /\b(community|referral|nonprofit|ngo|network)\b/, "community people network"],
  ["Productivity", /\b(tasks?|to-?do|planner|calendar|productivity)\b/, "task planning productivity"],
  ["Design", /\b(figma|design|ux|ui)\b/, "interface design"],
  ["Software engineering", /\b(software|programming|developer|python|javascript|typescript|react|api|code|coding)\b/, "software development code"],
];

const STOPWORDS = new Set(
  "a an and app application the of to in for on with from by is are as at be this that it its your you we our how what why who when where into about over under using use used made make new best simple complete guide basics beginner beginners real world project projects repository repo github sample demo web site website page html css js javascript react vite node tool tools built build based first second three days history current".split(" ")
);
const GENERIC_RESULT_WORDS = new Set("technology development people code software".split(" "));

function words(text) {
  return String(text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

export function categoryFor(item) {
  const text = `${item.name || ""} ${item.description || ""} ${(item.topics || []).join(" ")}`.toLowerCase();
  const match = CATEGORY_RULES.find(([, pattern]) => pattern.test(text));
  return match ? { label: match[0], phrase: match[2] } : null;
}

export function buildSearchQuery(item) {
  const category = categoryFor(item);
  if (!category) return null;
  const titleWords = [...new Set(words(item.name))].slice(0, 2);
  const keywords = [...new Set([...words(category.phrase), ...titleWords])];
  return {
    category: category.label,
    query: [category.phrase, ...titleWords].join(" "),
    keywords,
  };
}

function parsePublicUrl(value) {
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !url.hostname ||
      url.hostname.toLowerCase() === "localhost" ||
      url.hostname.toLowerCase().endsWith(".localhost") ||
      url.hostname.toLowerCase().endsWith(".local")
    ) {
      throw new Error("URL is not a public https URL");
    }
    return url;
  } catch (error) {
    throw new Error("URL is not a public https URL");
  }
}

function isPublicAddress(address) {
  if (!isIP(address)) return false;
  const parsed = ipaddr.process(address);
  return parsed.range() === "unicast";
}

async function assertPublicHttpsUrl(value, ctx) {
  const url = parsePublicUrl(value);
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname)
    ? [{ address: hostname }]
    : await (ctx.lookupHost || lookup)(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new Error("URL host resolves to a non-public address");
  }
  return { url, addresses };
}

async function fetchSafeResponse(value, ctx, options = {}, redirectMode = "follow-safe") {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const agents = [];
  try {
    let target = await assertPublicHttpsUrl(value, ctx);
    for (let redirects = 0; ; redirects += 1) {
      const requestOptions = {
        ...options,
        headers: { "User-Agent": USER_AGENT, ...(options.headers || {}) },
        redirect: redirectMode === "follow-safe" ? "manual" : "error",
        signal: controller.signal,
      };
      let response;
      if (ctx.fetchImpl) {
        response = await ctx.fetchImpl(target.url.href, requestOptions);
      } else {
        const vettedAddresses = target.addresses.map(({ address }) => ({
          address,
          family: isIP(address),
        }));
        const hostname = target.url.hostname.replace(/^\[|\]$/g, "");
        const agent = new https.Agent({
          lookup(requestedHost, lookupOptions, callback) {
            if (requestedHost.replace(/^\[|\]$/g, "") !== hostname) {
              callback(new Error("Unexpected host in pinned image request"));
              return;
            }
            if (lookupOptions && lookupOptions.all) {
              callback(null, vettedAddresses);
              return;
            }
            callback(null, vettedAddresses[0].address, vettedAddresses[0].family);
          },
        });
        agents.push(agent);
        response = await nodeFetch(target.url.href, { ...requestOptions, agent });
      }
      if (![301, 302, 303, 307, 308].includes(response.status)) {
        return {
          response,
          cleanup: () => {
            clearTimeout(timer);
            agents.forEach((agent) => agent.destroy());
          },
        };
      }
      if (redirectMode !== "follow-safe") {
        throw new Error("Redirects are not allowed for this resource");
      }
      if (redirects >= MAX_REDIRECTS) throw new Error("Too many image redirects");
      const location = response.headers.get("location");
      if (!location) throw new Error("Redirect response has no location");
      if (response.body && typeof response.body.cancel === "function") {
        await response.body.cancel();
      } else if (response.body && typeof response.body.destroy === "function") {
        response.body.destroy();
      }
      agents.forEach((agent) => agent.destroy());
      agents.length = 0;
      target = await assertPublicHttpsUrl(new URL(location, target.url).href, ctx);
    }
  } catch (error) {
    clearTimeout(timer);
    agents.forEach((agent) => agent.destroy());
    throw error;
  }
}

async function readLimitedBody(response, limit) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > limit) {
    if (response.body) await response.body.cancel();
    throw new Error("response exceeds the size limit");
  }
  if (!response.body) throw new Error("empty response");
  const chunks = [];
  let total = 0;
  const append = async (value, cancel) => {
      total += value.byteLength;
      if (total > limit) {
        await cancel();
        throw new Error("response exceeds the size limit");
      }
      chunks.push(Buffer.from(value));
  };
  if (typeof response.body.getReader === "function") {
    const reader = response.body.getReader();
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        await append(value, () => reader.cancel());
      }
    } finally {
      reader.releaseLock();
    }
  } else {
    for await (const value of response.body) {
      await append(value, () => {
        response.body.destroy();
        return Promise.resolve();
      });
    }
  }
  if (!total) throw new Error("empty response");
  return Buffer.concat(chunks, total);
}

async function fetchBuffer(url, ctx, headers = {}) {
  const { response, cleanup } = await fetchSafeResponse(
    url,
    ctx,
    { headers },
    "follow-safe"
  );
  try {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") || "";
    if (!/^image\/[a-z0-9.+-]+(?:\s*;|$)/i.test(contentType)) {
      throw new Error(`unexpected content type ${contentType}`);
    }
    return await readLimitedBody(response, MAX_BYTES);
  } finally {
    cleanup();
  }
}

async function fetchJson(url, ctx, options = {}) {
  const response = await ctx.fetchImpl(url, {
    ...options,
    headers: { "User-Agent": USER_AGENT, Accept: "application/json", ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
  return response.json();
}

async function remoteImageIsUsable(url, ctx) {
  try {
    const buffer = await fetchBuffer(url, ctx);
    const meta = await sharp(buffer).metadata();
    return Boolean(meta.width && meta.height && meta.width >= MIN_WIDTH && meta.height >= MIN_HEIGHT);
  } catch (error) {
    return false;
  }
}

function contentHash(buffer) {
  return crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 8);
}

function writeIfChanged(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && Buffer.compare(fs.readFileSync(file), Buffer.from(content)) === 0) return;
  fs.writeFileSync(file, content);
}

function assetDirectory(ctx, kind) {
  return path.join(ctx.publicRoot, "images", "featured", kind);
}

function publicPath(kind, fileName) {
  return `/images/featured/${kind}/${fileName}`;
}

// Downloads, validates, and re-encodes an owner-controlled image into responsive WebP files.
async function acquireOwnedImage(candidate, item, kind, ctx) {
  const buffer = await fetchBuffer(candidate.url, ctx);
  const image = sharp(buffer, { failOn: "error" });
  const meta = await image.metadata();
  if (!["jpeg", "png", "webp", "gif", "avif"].includes(meta.format)) {
    throw new Error(`unsupported image format ${meta.format}`);
  }
  if (!meta.width || !meta.height || meta.width < MIN_WIDTH || meta.height < MIN_HEIGHT) {
    throw new Error(`image is too small (${meta.width}x${meta.height})`);
  }
  const ratio = meta.width / meta.height;
  if (ratio < 0.2 || ratio > 4) throw new Error("image aspect ratio is unsuitable for a card");

  const widths = IMAGE_WIDTHS.filter((width) => width <= meta.width);
  if (!widths.length) widths.push(Math.min(...IMAGE_WIDTHS, meta.width));
  const stem = `${item.id}-${contentHash(buffer)}`;
  const variants = [];
  for (const width of widths) {
    const height = Math.round((width * 9) / 16);
    const output = await sharp(buffer)
      .rotate()
      .resize({ width, height, fit: "cover", position: ratio < 1.2 ? "top" : sharp.strategy.attention })
      .webp({ quality: 78 })
      .toBuffer();
    variants.push({ width, height, fileName: `${stem}-${width}.webp`, output });
  }
  if (!ctx.dryRun) {
    variants.forEach(({ fileName, output }) => writeIfChanged(path.join(assetDirectory(ctx, kind), fileName), output));
  }
  const largest = variants[variants.length - 1];
  return {
    src: publicPath(kind, largest.fileName),
    srcSet: variants.map(({ fileName, width }) => `${publicPath(kind, fileName)} ${width}w`).join(", "),
    width: largest.width,
    height: largest.height,
  };
}

const BADGE_PATTERN = /shields\.io|badge|travis-ci|circleci|codecov|coveralls|\.svg(\?|$)|github\.com\/[^/]+\/[^/]+\/workflows|img\.shields|forthebadge|visitor-badge|komarev|capsule-render/i;

export function readmeImageUrls(readme, repository, owner) {
  const urls = [];
  const markdown = /!\[[^\]]*\]\(<?([^\s)>]+)>?(?:\s+['"][^)]*['"])?\)/g;
  const html = /<img\b[^>]*\bsrc=["']([^"']+)["']/gi;
  [markdown, html].forEach((pattern) => {
    let match;
    while ((match = pattern.exec(String(readme || "")))) urls.push(match[1].replace(/&amp;/g, "&"));
  });
  const branch = encodeURIComponent(repository.default_branch || "main");
  return urls
    .map((value) => {
      if (/^https:\/\//i.test(value)) return value;
      if (/^(data:|#|http:)/i.test(value)) return null;
      const relative = value.replace(/^\.?\//, "");
      return `https://raw.githubusercontent.com/${owner}/${encodeURIComponent(repository.name)}/${branch}/${relative
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")}`;
    })
    .filter((url) => url && !BADGE_PATTERN.test(url));
}

const SCREENSHOT_NAME = /(screenshot|screen-?shot|preview|banner|cover|hero|demo|thumbnail|social|mockup|showcase)/i;
const NOT_A_SCREENSHOT = /(icon|logo|favicon|sprite|avatar|badge|node_modules|vendor|\.min\.)/i;

export function screenshotCandidates(tree, repository, owner) {
  const branch = encodeURIComponent(repository.default_branch || "main");
  return (tree || [])
    .filter((entry) => entry.type === "blob" && /\.(png|jpe?g|webp)$/i.test(entry.path))
    .filter((entry) => !NOT_A_SCREENSHOT.test(entry.path) && entry.path.split("/").length <= 4)
    .filter((entry) => !entry.size || entry.size <= MAX_BYTES)
    .map((entry) => ({
      path: entry.path,
      score:
        (SCREENSHOT_NAME.test(entry.path) ? 10 : 0) +
        (/^(docs|screenshots?|images?|assets|\.github)\//i.test(entry.path) ? 2 : 0) -
        entry.path.split("/").length,
    }))
    .filter((entry) => entry.score >= 10)
    .sort((left, right) => right.score - left.score || left.path.localeCompare(right.path))
    .slice(0, 3)
    .map((entry) => ({
      source: "repo-file",
      url: `https://raw.githubusercontent.com/${owner}/${encodeURIComponent(repository.name)}/${branch}/${entry.path
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")}`,
      sourceUrl: `https://github.com/${owner}/${repository.name}/blob/${repository.default_branch || "main"}/${entry.path}`,
    }));
}

async function githubJson(url, ctx, body) {
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (ctx.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${ctx.env.GITHUB_TOKEN}`;
  return fetchJson(url, ctx, body ? { method: "POST", headers, body: JSON.stringify(body) } : { headers });
}

async function projectCandidates(item, hints, ctx) {
  const owner = ctx.owner;
  const repository = hints.repository;
  const steps = [];
  if (hints.manualImage) {
    steps.push(async () => [{ source: "manual", url: hints.manualImage, sourceUrl: item.url, local: hints.manualImage.startsWith("/") }]);
  }
  steps.push(async () => {
    if (!repository) return [];
    const tree = await githubJson(
      `https://api.github.com/repos/${owner}/${encodeURIComponent(repository.name)}/git/trees/${encodeURIComponent(repository.default_branch || "main")}?recursive=1`,
      ctx
    );
    return screenshotCandidates(tree.tree, repository, owner);
  });
  steps.push(async () => {
    if (!repository || !ctx.env.GITHUB_TOKEN) return [];
    const result = await githubJson("https://api.github.com/graphql", ctx, {
      query: "query($owner:String!,$name:String!){repository(owner:$owner,name:$name){openGraphImageUrl usesCustomOpenGraphImage}}",
      variables: { owner, name: repository.name },
    });
    const data = result.data && result.data.repository;
    return data && data.usesCustomOpenGraphImage
      ? [{ source: "github-social-preview", url: data.openGraphImageUrl, sourceUrl: item.url }]
      : [];
  });
  steps.push(async () =>
    repository
      ? readmeImageUrls(hints.readme, repository, owner)
          .slice(0, 4)
          .map((url) => ({ source: "readme", url, sourceUrl: item.url }))
      : []
  );
  return { steps };
}

async function articleCandidates(item, hints, ctx) {
  const steps = [];
  steps.push(async () => (hints.rssImage ? [{ source: "medium-rss", url: hints.rssImage, sourceUrl: item.url }] : []));
  steps.push(async () => {
    const { response, cleanup } = await fetchSafeResponse(
      item.url,
      ctx,
      { headers: { Accept: "text/html" } },
      "no-redirects"
    );
    let html;
    try {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get("content-type") || "";
      if (!/^text\/html(?:\s*;|$)/i.test(contentType)) {
        throw new Error(`unexpected content type ${contentType}`);
      }
      html = (await readLimitedBody(response, MAX_HTML_BYTES)).toString("utf8");
    } finally {
      cleanup();
    }
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match ? [{ source: "article-og", url: match[1].replace(/&amp;/g, "&"), sourceUrl: item.url }] : [];
  });
  steps.push(async () => (hints.contentImages || []).slice(0, 4).map((url) => ({ source: "article-content", url, sourceUrl: item.url })));
  return { steps };
}

function searchProvider(ctx) {
  const requested = (ctx.env.IMAGE_SEARCH_PROVIDER || "").toLowerCase();
  const available = [];
  if (ctx.env.UNSPLASH_ACCESS_KEY) available.push("unsplash");
  if (ctx.env.PEXELS_API_KEY) available.push("pexels");
  if (requested && available.includes(requested)) return requested;
  return available[0] || null;
}

function rankStockResults(results, keywords, usedKeys, ownerId) {
  const required = new Set(keywords);
  return results
    .map((result) => {
      const haystack = new Set(words(result.text));
      const overlap = [...required].filter((word) => haystack.has(word) && !GENERIC_RESULT_WORDS.has(word)).length;
      return { ...result, overlap };
    })
    .filter((result) => result.overlap >= 1 && (!usedKeys.has(result.key) || usedKeys.get(result.key) === ownerId))
    .sort((left, right) => right.overlap - left.overlap || String(left.key).localeCompare(String(right.key)));
}

async function stockCandidates(item, kind, ctx, usedKeys) {
  const provider = searchProvider(ctx);
  if (!provider) return { candidates: [], note: "no image search provider configured" };
  const plan = buildSearchQuery(item);
  if (!plan) return { candidates: [], note: "no relevant search topic could be derived" };

  if (provider === "unsplash") {
    const url = `https://api.unsplash.com/search/photos?${new URLSearchParams({ query: plan.query, orientation: "landscape", per_page: "20", content_filter: "high" })}`;
    const data = await fetchJson(url, ctx, { headers: { Authorization: `Client-ID ${ctx.env.UNSPLASH_ACCESS_KEY}`, "Accept-Version": "v1" } });
    const ranked = rankStockResults(
      (data.results || []).map((photo) => ({
        key: `unsplash:${photo.id}`,
        text: [photo.alt_description, photo.description, ...(photo.tags || []).map((tag) => tag.title)].filter(Boolean).join(" "),
        photo,
      })),
      plan.keywords,
      usedKeys,
      item.id
    );
    return {
      candidates: ranked.slice(0, 3).map(({ photo, key }) => ({
        source: "unsplash",
        key,
        remote: {
          base: photo.urls.raw,
          width: photo.width,
          height: photo.height,
          make: (width) => `${photo.urls.raw}${photo.urls.raw.includes("?") ? "&" : "?"}w=${width}&h=${Math.round((width * 9) / 16)}&fit=crop&crop=entropy&fm=webp&q=75`,
        },
        sourceUrl: `${photo.links.html}?utm_source=pcodesdev_portfolio&utm_medium=referral`,
        attribution: `Illustrative photo by ${photo.user.name} on Unsplash`,
        license: "Unsplash License",
        altDetail: photo.alt_description || photo.description || plan.category,
        downloadLocation: photo.links.download_location,
      })),
    };
  }

  const url = `https://api.pexels.com/v1/search?${new URLSearchParams({ query: plan.query, orientation: "landscape", per_page: "20" })}`;
  const data = await fetchJson(url, ctx, { headers: { Authorization: ctx.env.PEXELS_API_KEY } });
  const ranked = rankStockResults(
    (data.photos || []).map((photo) => ({ key: `pexels:${photo.id}`, text: photo.alt || "", photo })),
    plan.keywords,
    usedKeys,
    item.id
  );
  return {
    candidates: ranked.slice(0, 3).map(({ photo, key }) => ({
      source: "pexels",
      key,
      remote: {
        base: photo.src.original,
        width: photo.width,
        height: photo.height,
        make: (width) => `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${Math.round((width * 9) / 16)}`,
      },
      sourceUrl: photo.url,
      attribution: `Illustrative photo by ${photo.photographer} on Pexels`,
      license: "Pexels License",
      altDetail: photo.alt || plan.category,
    })),
  };
}

function wrapTitle(title, maxChars = 26, maxLines = 3) {
  const lines = [];
  let current = "";
  String(title).split(/\s+/).forEach((word) => {
    if ((current + " " + word).trim().length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  });
  if (current) lines.push(current);
  const clipped = lines.slice(0, maxLines);
  if (lines.length > maxLines) clipped[maxLines - 1] = `${clipped[maxLines - 1].replace(/[.,;:!?-]*$/, "")}…`;
  return clipped;
}

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[character]);
}

const PALETTES = [
  ["#0B2B55", "#1D5FA8", "#8CC1F0"],
  ["#12403C", "#1F7A70", "#9AD9CC"],
  ["#2B2D5B", "#5557B3", "#B7B9F5"],
  ["#3D2A18", "#9A6330", "#F0C58F"],
];

export function generateFallbackSvg({ id, title, label, kindLabel }) {
  const palette = PALETTES[parseInt(contentHash(Buffer.from(String(id))), 16) % PALETTES.length];
  const lines = wrapTitle(title);
  const text = lines
    .map((line, index) => `<text x="72" y="${250 + index * 62}" font-size="48" font-weight="700" fill="#FFFFFF">${escapeXml(line)}</text>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540" role="img" aria-label="${escapeXml(`${kindLabel}: ${title}`)}" font-family="Segoe UI, Arial, sans-serif">
<rect width="960" height="540" fill="${palette[0]}"/>
<circle cx="860" cy="60" r="220" fill="${palette[1]}" opacity=".55"/><circle cx="90" cy="520" r="170" fill="${palette[1]}" opacity=".35"/>
<rect x="72" y="86" width="${24 + escapeXml(`${kindLabel} · ${label}`).length * 12}" height="40" rx="20" fill="${palette[2]}"/>
<text x="92" y="113" font-size="22" font-weight="600" fill="${palette[0]}">${escapeXml(`${kindLabel} · ${label}`)}</text>
${text}
<rect x="72" y="${250 + lines.length * 62 - 22}" width="84" height="6" rx="3" fill="${palette[2]}"/>
<text x="72" y="486" font-size="24" fill="${palette[2]}">Peter Njuguna · Portfolio</text>
<rect x="852" y="438" width="48" height="48" rx="12" fill="#FFFFFF" opacity=".92"/><text x="876" y="472" font-size="22" font-weight="700" text-anchor="middle" fill="${palette[0]}">PN</text>
</svg>
`;
}

function writeFallback(item, kind, ctx) {
  const category = categoryFor(item);
  const label = category ? category.label : kind === "projects" ? item.primaryLanguage || "Software" : "Technology";
  const svg = generateFallbackSvg({
    id: item.id,
    title: item.name,
    label,
    kindLabel: kind === "projects" ? "Project" : "Article",
  });
  const fileName = `${item.id}-fallback.svg`;
  if (!ctx.dryRun) writeIfChanged(path.join(assetDirectory(ctx, kind), fileName), svg);
  return publicPath(kind, fileName);
}

function ttlFor(source) {
  if (source === "generated") return FALLBACK_TTL_MS;
  if (["unsplash", "pexels", "curated-illustration"].includes(source)) return SEARCH_TTL_MS;
  return OWNER_TTL_MS;
}

async function previousIsReusable(previous, ctx) {
  const meta = previous && previous.imageMeta;
  if (!meta || meta.status !== "ok" || !meta.src) return false;
  if (ctx.now - Date.parse(meta.retrievedAt) > ttlFor(meta.source)) return false;
  if (meta.src.startsWith("/")) {
    const files = [meta.src, ...String(meta.srcSet || "").split(",").map((entry) => entry.trim().split(" ")[0]).filter(Boolean)];
    return files.every((file) => fs.existsSync(path.join(ctx.publicRoot, file.replace(/^\//, ""))));
  }
  return remoteImageIsUsable(meta.src, ctx);
}

function altFor(source, item, candidate) {
  switch (source) {
    case "unsplash":
    case "pexels":
      return `Illustrative photo for ${item.name}: ${candidate.altDetail}`;
    case "medium-rss":
    case "article-og":
    case "article-content":
      return `Cover image for the article "${item.name}"`;
    case "curated-illustration":
      return item.imageAlt || `Illustration for ${item.name}`;
    default:
      return `${item.name} project preview image`;
  }
}

async function resolveOne(item, kind, hints, ctx, usedKeys, previous) {
  const notes = [];
  const retrievedAt = ctx.now.toISOString();
  const finish = (meta, extra = {}) => ({
    image: meta.src,
    imageAlt: meta.alt,
    imageMeta: { ...meta, retrievedAt, status: meta.source === "generated" ? "fallback" : "ok" },
    fallbackImage: extra.fallbackImage,
    notes,
  });

  const fallbackSrc = writeFallback({ ...item, primaryLanguage: hints.primaryLanguage }, kind, ctx);
  const curated =
    kind === "projects" &&
    item.fallbackImage &&
    item.fallbackImage !== GENERIC_PROJECT_IMAGE &&
    item.fallbackImage.startsWith("/") &&
    !item.fallbackImage.includes("/images/featured/") &&
    fs.existsSync(path.join(ctx.publicRoot, item.fallbackImage.replace(/^\//, "")))
      ? item.fallbackImage
      : null;
  const runtimeFallback = curated || fallbackSrc;

  if (!hints.manualImage && await previousIsReusable(previous, ctx).catch(() => false)) {
    notes.push("reused previously validated image");
    const meta = previous.imageMeta;
    return { image: meta.src, imageAlt: meta.alt, imageMeta: meta, fallbackImage: runtimeFallback, notes };
  }
  if (!hints.manualImage && previous && previous.imageMeta && previous.imageMeta.source === "generated" && ctx.now - Date.parse(previous.imageMeta.retrievedAt) < FALLBACK_TTL_MS && !ctx.forceRetry) {
    notes.push("reused generated thumbnail; image search is retried after 7 days");
    return { image: previous.imageMeta.src, imageAlt: previous.imageMeta.alt, imageMeta: previous.imageMeta, fallbackImage: runtimeFallback, notes };
  }

  const plan = kind === "projects" ? await projectCandidates(item, hints, ctx) : await articleCandidates(item, hints, ctx);
  for (const step of plan.steps) {
    let candidates = [];
    try {
      candidates = await step();
    } catch (error) {
      notes.push(`candidate lookup failed: ${error.message}`);
    }
    for (const candidate of candidates) {
      try {
        if (candidate.local) {
          if (!fs.existsSync(path.join(ctx.publicRoot, candidate.url.replace(/^\//, "")))) throw new Error("local file is missing");
          return finish(
            { src: candidate.url, width: 960, height: 540, alt: item.imageAlt || altFor("manual", item, candidate), source: candidate.source, sourceUrl: candidate.sourceUrl, license: "owner" },
            { fallbackImage: runtimeFallback }
          );
        }
        const owned = await acquireOwnedImage(candidate, item, kind, ctx);
        return finish(
          { ...owned, alt: altFor(candidate.source, item, candidate), source: candidate.source, sourceUrl: candidate.sourceUrl, license: "owner" },
          { fallbackImage: runtimeFallback }
        );
      } catch (error) {
        notes.push(`${candidate.source} image rejected (${error.message})`);
      }
    }
  }

  if (curated) {
    const alt = item.imageAlt || `Illustration for ${item.name}`;
    notes.push("used the existing curated illustration");
    return finish(
      { src: curated, width: 960, height: 540, alt, source: "curated-illustration", sourceUrl: item.url, license: "owner" },
      { fallbackImage: fallbackSrc }
    );
  }

  try {
    const { candidates, note } = await stockCandidates({ ...item, topics: hints.topics }, kind, ctx, usedKeys);
    if (note) notes.push(note);
    for (const candidate of candidates) {
      const widths = IMAGE_WIDTHS.map((width) => ({ width, url: candidate.remote.make(width) }));
      if (!(await remoteImageIsUsable(widths[widths.length - 1].url, ctx))) {
        notes.push(`${candidate.source} photo rejected (not retrievable)`);
        continue;
      }
      usedKeys.set(candidate.key, item.id);
      if (candidate.downloadLocation) {
        fetchJson(candidate.downloadLocation, ctx, { headers: { Authorization: `Client-ID ${ctx.env.UNSPLASH_ACCESS_KEY}` } }).catch(() => {});
      }
      const largest = widths[widths.length - 1];
      return finish(
        {
          src: largest.url,
          srcSet: widths.map(({ url, width }) => `${url} ${width}w`).join(", "),
          width: largest.width,
          height: Math.round((largest.width * 9) / 16),
          alt: altFor(candidate.source, item, candidate),
          source: candidate.source,
          sourceUrl: candidate.sourceUrl,
          attribution: candidate.attribution,
          license: candidate.license,
          providerKey: candidate.key,
        },
        { fallbackImage: runtimeFallback }
      );
    }
  } catch (error) {
    notes.push(`image search failed: ${error.message}`);
  }

  notes.push("using the generated branded thumbnail");
  return finish(
    { src: fallbackSrc, width: 960, height: 540, alt: `Branded thumbnail for "${item.name}" (${kind === "projects" ? "project" : "article"})`, source: "generated", sourceUrl: item.url, license: "owner" },
    { fallbackImage: fallbackSrc }
  );
}

export async function enrichImages({ kind, items, previousItems = [], hintsById = {}, context }) {
  const ctx = {
    fetchImpl: globalThis.fetch,
    env: process.env,
    owner: "pcodesdev",
    now: new Date(),
    dryRun: false,
    ...context,
  };
  const previousById = new Map(previousItems.map((item) => [String(item.id).toLowerCase(), item]));
  // Shared across kinds so one stock photo is never used for two different items.
  const usedKeys = ctx.usedKeys || (ctx.usedKeys = new Map());
  previousItems.forEach((item) => {
    const key = item.imageMeta && item.imageMeta.providerKey;
    if (key && !usedKeys.has(key)) usedKeys.set(key, item.id);
  });
  const outcomes = [];
  const enriched = [];
  for (const item of items) {
    let result;
    try {
      result = await resolveOne(item, kind, hintsById[item.id] || {}, ctx, usedKeys, previousById.get(String(item.id).toLowerCase()));
    } catch (error) {
      const fallbackSrc = writeFallback(item, kind, ctx);
      result = {
        image: fallbackSrc,
        imageAlt: `Branded thumbnail for "${item.name}"`,
        imageMeta: { src: fallbackSrc, width: 960, height: 540, alt: `Branded thumbnail for "${item.name}"`, source: "generated", sourceUrl: item.url, license: "owner", status: "fallback", retrievedAt: ctx.now.toISOString() },
        fallbackImage: fallbackSrc,
        notes: [`image enrichment failed unexpectedly: ${error.message}`],
      };
    }
    const { notes, ...fields } = result;
    enriched.push({ ...item, ...fields });
    outcomes.push({ id: item.id, source: fields.imageMeta.source, status: fields.imageMeta.status, notes });
    notes.filter((note) => /failed|rejected/.test(note)).forEach((note) => ctx.log && ctx.log(`Image enrichment (${kind}/${item.id}): ${note}`));
  }

  if (!ctx.dryRun) removeUnreferencedAssets(kind, enriched, ctx);
  return { items: enriched, outcomes };
}

function removeUnreferencedAssets(kind, items, ctx) {
  const directory = assetDirectory(ctx, kind);
  if (!fs.existsSync(directory)) return;
  const referenced = new Set();
  items.forEach((item) => {
    [item.image, item.fallbackImage, ...String((item.imageMeta && item.imageMeta.srcSet) || "").split(",").map((entry) => entry.trim().split(" ")[0])]
      .filter((value) => value && value.startsWith(`/images/featured/${kind}/`))
      .forEach((value) => referenced.add(path.basename(value)));
  });
  fs.readdirSync(directory)
    .filter((name) => !referenced.has(name))
    .forEach((name) => fs.rmSync(path.join(directory, name), { force: true }));
}

export function assertImagesExist(items, publicRoot) {
  items.forEach((item) => {
    const meta = item.imageMeta || {};
    const files = [meta.src, item.fallbackImage, ...String(meta.srcSet || "").split(",").map((entry) => entry.trim().split(" ")[0])].filter(
      (value) => value && value.startsWith("/")
    );
    files.forEach((file) => {
      const target = path.join(publicRoot, file.replace(/^\//, ""));
      if (!fs.existsSync(target) || fs.statSync(target).size === 0) {
        throw new Error(`Featured image file is missing or empty: ${file} (${item.id})`);
      }
    });
  });
}
