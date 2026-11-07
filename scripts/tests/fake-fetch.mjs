// Fixture-driven GitHub, Medium, image-host, and stock-provider responses. Installs itself as the global
// fetch when loaded with `node --import` and FAKE_FIXTURE set; otherwise import createFakeFetch.
import fs from "node:fs";
import sharp from "sharp";

const OWNER = "pcodesdev";

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function apiRepository(repository) {
  return {
    name: repository.name,
    full_name: `${OWNER}/${repository.name}`,
    fork: Boolean(repository.fork),
    archived: Boolean(repository.archived),
    size: repository.size === undefined ? 500 : repository.size,
    description: repository.description || null,
    language: repository.language || null,
    topics: repository.topics || [],
    created_at: repository.created_at || "2025-01-01T00:00:00Z",
    pushed_at: repository.pushed_at || "2025-06-01T00:00:00Z",
    updated_at: repository.pushed_at || "2025-06-01T00:00:00Z",
    stargazers_count: repository.stars || 0,
    forks_count: 0,
    homepage: repository.homepage || null,
    default_branch: "main",
    languages_url: `https://api.github.com/repos/${OWNER}/${repository.name}/languages`,
  };
}

function feedXml(items) {
  const entries = items
    .map(
      (item) => `<item>
<title><![CDATA[${item.title}]]></title>
<link>${item.url || `https://medium.com/@pcodesdev/${item.slug || item.id}-${item.id}?source=rss-1`}</link>
<guid isPermaLink="false">https://medium.com/p/${item.id}</guid>
<pubDate>${item.pubDate || "Mon, 02 Feb 2026 08:00:00 GMT"}</pubDate>
<content:encoded><![CDATA[${item.html}]]></content:encoded>
</item>`
    )
    .join("\n");
  return `<?xml version="1.0"?><rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>${entries}</channel></rss>`;
}

async function imageResponse(spec) {
  if (spec.status && spec.status !== 200) return new Response("missing", { status: spec.status });
  if (spec.kind === "empty") return new Response(null, { status: 200, headers: { "content-type": "image/png" } });
  if (spec.kind === "html") return new Response("<html></html>", { status: 200, headers: { "content-type": "text/html" } });
  if (spec.kind === "corrupt") return new Response("not really an image", { status: 200, headers: { "content-type": "image/png" } });
  const format = spec.format || "png";
  const bytes = await sharp({
    create: { width: spec.width || 1280, height: spec.height || 720, channels: 3, background: spec.color || "#3366aa" },
  })
    [format]()
    .toBuffer();
  return new Response(bytes, { status: 200, headers: { "content-type": `image/${format}` } });
}

export function createFakeFetch(getFixture, log = () => {}) {
  return async function fakeFetch(input, options = {}) {
    const url = String(input);
    const method = (options.method || "GET").toUpperCase();
    const data = getFixture();
    log({ url, method });

    if (url.startsWith("https://api.github.com/users/")) {
      if (data.githubStatus && data.githubStatus !== 200) {
        return json({ message: "API rate limit exceeded" }, data.githubStatus, { "x-ratelimit-remaining": "0" });
      }
      const page = Number(new URL(url).searchParams.get("page") || 1);
      return json(page === 1 ? data.repos.map(apiRepository) : []);
    }

    const languages = url.match(/^https:\/\/api\.github\.com\/repos\/[^/]+\/([^/]+)\/languages$/);
    if (languages) {
      const repository = data.repos.find((entry) => entry.name === languages[1]);
      return json(repository && repository.languages ? repository.languages : { JavaScript: 100 });
    }

    const tree = url.match(/^https:\/\/api\.github\.com\/repos\/[^/]+\/([^/]+)\/git\/trees\//);
    if (tree) {
      const repository = data.repos.find((entry) => entry.name === tree[1]);
      return json({ tree: ((repository && repository.treeFiles) || []).map((path) => ({ path, type: "blob", size: 50000 })) });
    }

    if (url === "https://api.github.com/graphql") {
      const { variables } = JSON.parse(options.body);
      const repository = data.repos.find((entry) => entry.name === variables.name);
      const custom = repository && repository.socialPreview;
      return json({
        data: { repository: { usesCustomOpenGraphImage: Boolean(custom), openGraphImageUrl: custom || "https://opengraph.githubassets.com/generated" } },
      });
    }

    const readme = url.match(/^https:\/\/raw\.githubusercontent\.com\/[^/]+\/([^/]+)\/main\/README\.md$/);
    if (readme) {
      const repository = data.repos.find((entry) => entry.name === readme[1]);
      if (!repository || repository.readme === undefined) return new Response("", { status: 404 });
      return new Response(repository.readme, { status: 200 });
    }

    if (data.images && data.images[url]) return imageResponse(data.images[url]);

    if (url.startsWith("https://medium.com/feed/")) {
      const medium = data.medium || { status: 200, items: [] };
      if (medium.status && medium.status !== 200) return new Response("unavailable", { status: medium.status });
      return new Response(feedXml(medium.items), { status: 200, headers: { "content-type": "application/rss+xml" } });
    }

    if (url.startsWith("https://medium.com/@pcodesdev/")) {
      const item = ((data.medium && data.medium.items) || []).find((entry) => url.includes(entry.id));
      if (!item || !item.og) return new Response("<html><head></head></html>", { status: 200, headers: { "content-type": "text/html" } });
      return new Response(`<html><head><meta property="og:image" content="${item.og}"/></head></html>`, { status: 200, headers: { "content-type": "text/html" } });
    }

    if (url.startsWith("https://api.unsplash.com/search/photos")) {
      const unsplash = data.unsplash || {};
      if (unsplash.status && unsplash.status !== 200) return json({ errors: ["failure"] }, unsplash.status);
      return json({ results: unsplash.results || [] });
    }
    if (url.startsWith("https://api.unsplash.com/photos/")) return json({ url: "ok" });
    if (url.startsWith("https://api.pexels.com/v1/search")) {
      const pexels = data.pexels || {};
      if (pexels.status && pexels.status !== 200) return json({ error: "failure" }, pexels.status);
      return json({ photos: pexels.photos || [] });
    }
    if (url.startsWith("https://images.unsplash.com/") || url.startsWith("https://images.pexels.com/")) {
      if (data.stockImagesBroken) return new Response("gone", { status: 404 });
      return imageResponse({ width: 960, height: 540, format: "jpeg", color: "#118866" });
    }

    // Homepage and other reachability probes.
    return new Response(null, { status: 200 });
  };
}

if (process.env.FAKE_FIXTURE) {
  const logPath = process.env.FAKE_LOG;
  globalThis.fetch = createFakeFetch(
    () => JSON.parse(fs.readFileSync(process.env.FAKE_FIXTURE, "utf8")),
    logPath ? (entry) => fs.appendFileSync(logPath, `${JSON.stringify(entry)}\n`) : undefined
  );
}
