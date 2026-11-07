import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createRequire } from "node:module";
import sharp from "sharp";
import { buildSearchQuery, enrichImages, generateFallbackSvg } from "../image-enrichment.mjs";
import { createFakeFetch } from "./fake-fetch.mjs";

const require = createRequire(import.meta.url);
const core = require("../../src/shared/curationCore.cjs");

const NOW = new Date("2026-11-07T00:00:00Z");
const DAY = 24 * 60 * 60 * 1000;
const GENERIC = "/images/projects/project-generic.svg";

function setup({ fixture = {}, env = {}, now = NOW, publicRoot } = {}) {
  const root = publicRoot || fs.mkdtempSync(path.join(os.tmpdir(), "image-test-"));
  fs.mkdirSync(path.join(root, "images/projects"), { recursive: true });
  const requests = [];
  const state = { fixture };
  const context = {
    publicRoot: root,
    fetchImpl: createFakeFetch(() => state.fixture, (entry) => requests.push(entry)),
    lookupHost: async () => [{ address: "93.184.216.34", family: 4 }],
    env,
    now,
    log: () => {},
  };
  return { root, requests, state, context };
}

const project = (id, extra = {}) => ({
  id,
  name: extra.name || id,
  url: `https://github.com/pcodesdev/${id}`,
  description: "A description that is long enough to matter",
  topics: [],
  fallbackImage: GENERIC,
  imageAlt: `${id} project illustration`,
  ...extra,
});

const article = (id, name = `Article ${id}`) => ({
  id,
  name,
  url: `https://medium.com/@pcodesdev/${id}-${id}`,
  description: "An article description that is long enough",
});

const repoHints = (name, readme = "", extra = {}) => ({
  repository: { name, default_branch: "main" },
  readme,
  ...extra,
});

const photo = (id, text, extra = {}) => ({
  id,
  alt_description: text,
  description: null,
  tags: [],
  width: 4000,
  height: 3000,
  urls: { raw: `https://images.unsplash.com/photo-${id}` },
  links: { html: `https://unsplash.com/photos/${id}`, download_location: `https://api.unsplash.com/photos/${id}/download` },
  user: { name: "Ada Photographer" },
  ...extra,
});

async function enrichProject(env, item, hints, previous = [], extra = {}) {
  const result = await enrichImages({
    kind: "projects",
    items: [item],
    previousItems: previous,
    hintsById: { [item.id]: hints },
    context: env.context,
    ...extra,
  });
  return { item: result.items[0], outcome: result.outcomes[0] };
}

test("a README image is downloaded, validated, and re-encoded to responsive WebP", async () => {
  const env = setup({
    fixture: { images: { "https://img.test/shot.png": { width: 1600, height: 900, format: "png" } } },
  });
  const { item } = await enrichProject(env, project("alpha"), repoHints("alpha", "# Alpha\n\n![app](https://img.test/shot.png)"));

  assert.equal(item.imageMeta.source, "readme");
  assert.equal(item.imageMeta.status, "ok");
  assert.equal(item.imageMeta.license, "owner");
  assert.equal(item.imageMeta.width, 960);
  assert.equal(item.imageMeta.height, 540);
  assert.match(item.imageMeta.srcSet, /-480\.webp 480w, .*-960\.webp 960w/);
  assert.equal(item.image, item.imageMeta.src);
  assert.match(item.imageMeta.alt, /alpha/);
  const file = path.join(env.root, item.image.replace(/^\//, ""));
  const metadata = await sharp(file).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 960);
  core.validateImages([item], { kind: "projects" });
});

test("projects resolve in priority order: repo file, custom social preview, README image", async () => {
  const images = {
    "https://raw.githubusercontent.com/pcodesdev/beta/main/docs/screenshot.png": { width: 1400, height: 800 },
    "https://opengraph.githubassets.com/custom": { width: 1200, height: 630 },
    "https://img.test/readme.png": { width: 1200, height: 700 },
  };
  const hints = repoHints("beta", "![x](https://img.test/readme.png)");
  const withEverything = setup({ fixture: { images, repos: [{ name: "beta", treeFiles: ["docs/screenshot.png"], socialPreview: "https://opengraph.githubassets.com/custom" }] }, env: { GITHUB_TOKEN: "token" } });
  assert.equal((await enrichProject(withEverything, project("beta"), hints)).item.imageMeta.source, "repo-file");

  const noTree = setup({ fixture: { images, repos: [{ name: "beta", socialPreview: "https://opengraph.githubassets.com/custom" }] }, env: { GITHUB_TOKEN: "token" } });
  assert.equal((await enrichProject(noTree, project("beta"), hints)).item.imageMeta.source, "github-social-preview");

  const noToken = setup({ fixture: { images, repos: [{ name: "beta", socialPreview: "https://opengraph.githubassets.com/custom" }] } });
  assert.equal((await enrichProject(noToken, project("beta"), hints)).item.imageMeta.source, "readme");
});

test("badges, SVGs, and logo-like files are never treated as project images", async () => {
  const env = setup({
    fixture: { repos: [{ name: "gamma", treeFiles: ["assets/logo.png", "src/icon.png", "docs/diagram.svg"] }] },
  });
  const readme = "![build](https://img.shields.io/badge/build-passing-green.svg) ![logo](./logo.svg)";
  const { item, outcome } = await enrichProject(env, project("gamma"), repoHints("gamma", readme));
  assert.equal(item.imageMeta.source, "generated");
  assert.equal(outcome.status, "fallback");
  assert.ok(!env.requests.some((entry) => entry.url.includes("shields.io")));
});

test("broken, empty, non-image, corrupt, and tiny images are rejected in favour of a fallback", async () => {
  const images = {
    "https://img.test/missing.png": { status: 404 },
    "https://img.test/empty.png": { kind: "empty" },
    "https://img.test/page.png": { kind: "html" },
    "https://img.test/corrupt.png": { kind: "corrupt" },
    "https://img.test/tiny.png": { width: 120, height: 60 },
  };
  const readme = Object.keys(images).map((url) => `![x](${url})`).join("\n");
  const env = setup({ fixture: { images } });
  const { item, outcome } = await enrichProject(env, project("delta"), repoHints("delta", readme));

  assert.equal(item.imageMeta.source, "generated");
  assert.equal(item.imageMeta.status, "fallback");
  assert.ok(outcome.notes.filter((note) => /rejected/.test(note)).length >= 2);
  assert.ok(fs.existsSync(path.join(env.root, item.image.replace(/^\//, ""))));
  core.validateImages([item], { kind: "projects" });
});

test("private DNS answers and redirects to internal hosts are rejected before fetching them", async () => {
  const privateDns = setup({
    fixture: { images: { "https://img.test/private.png": { width: 1200, height: 700 } } },
  });
  privateDns.context.lookupHost = async () => [
    { address: "10.0.0.8", family: 4 },
  ];
  const blockedHost = await enrichProject(
    privateDns,
    project("private-dns"),
    repoHints("private-dns", "![x](https://img.test/private.png)")
  );
  assert.equal(blockedHost.item.imageMeta.source, "generated");
  assert.ok(!privateDns.requests.some((entry) => entry.url.includes("private.png")));

  const redirected = setup();
  const regularFetch = redirected.context.fetchImpl;
  redirected.context.fetchImpl = async (url, options) => {
    if (url === "https://img.test/redirect.png") {
      redirected.requests.push({ url, method: options.method || "GET" });
      return new Response(null, {
        status: 302,
        headers: { location: "http://127.0.0.1/internal.png" },
      });
    }
    return regularFetch(url, options);
  };
  const blockedRedirect = await enrichProject(
    redirected,
    project("private-redirect"),
    repoHints("private-redirect", "![x](https://img.test/redirect.png)")
  );
  assert.equal(blockedRedirect.item.imageMeta.source, "generated");
  assert.ok(!redirected.requests.some((entry) => entry.url.includes("127.0.0.1")));
});

test("oversized image responses are rejected from headers before reading their bodies", async () => {
  const env = setup();
  const regularFetch = env.context.fetchImpl;
  env.context.fetchImpl = async (url, options) => {
    if (url === "https://img.test/large.png") {
      env.requests.push({ url, method: options.method || "GET" });
      return new Response("too small to be the declared response", {
        status: 200,
        headers: {
          "content-type": "image/png",
          "content-length": String(10 * 1024 * 1024 + 1),
        },
      });
    }
    return regularFetch(url, options);
  };
  const result = await enrichProject(
    env,
    project("large-image"),
    repoHints("large-image", "![x](https://img.test/large.png)")
  );

  assert.equal(result.item.imageMeta.source, "generated");
  assert.ok(result.outcome.notes.some((note) => /size limit/.test(note)));
});

test("streamed images without a content length are stopped at the byte limit", async () => {
  const env = setup();
  const regularFetch = env.context.fetchImpl;
  env.context.fetchImpl = async (url, options) => {
    if (url === "https://img.test/chunked.png") {
      env.requests.push({ url, method: options.method || "GET" });
      return new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array(10 * 1024 * 1024));
            controller.enqueue(new Uint8Array(1));
            controller.close();
          },
        }),
        { status: 200, headers: { "content-type": "image/png" } }
      );
    }
    return regularFetch(url, options);
  };
  const result = await enrichProject(
    env,
    project("chunked-image"),
    repoHints("chunked-image", "![x](https://img.test/chunked.png)")
  );

  assert.equal(result.item.imageMeta.source, "generated");
  assert.ok(result.outcome.notes.some((note) => /size limit/.test(note)));
});

test("a manual override image wins, and a missing local override falls through the chain", async () => {
  const env = setup({ fixture: { images: { "https://img.test/r.png": { width: 1000, height: 600 } } } });
  fs.writeFileSync(path.join(env.root, "images/projects/custom.svg"), "<svg/>");
  const manual = await enrichProject(env, project("epsilon"), repoHints("epsilon", "![r](https://img.test/r.png)", { manualImage: "/images/projects/custom.svg" }));
  assert.equal(manual.item.imageMeta.source, "manual");
  assert.equal(manual.item.image, "/images/projects/custom.svg");

  const missing = await enrichProject(env, project("epsilon"), repoHints("epsilon", "![r](https://img.test/r.png)", { manualImage: "/images/projects/nope.svg" }));
  assert.equal(missing.item.imageMeta.source, "readme");
});

test("a manual override replaces a previously validated image", async () => {
  const env = setup();
  fs.writeFileSync(path.join(env.root, "images/projects/brand.svg"), "<svg/>");
  const previous = {
    ...project("epsilon"),
    image: "https://example.test/old.png",
    imageMeta: {
      src: "https://example.test/old.png",
      width: 960,
      height: 540,
      alt: "Old project image",
      source: "readme",
      sourceUrl: "https://github.com/pcodesdev/epsilon",
      license: "owner",
      retrievedAt: NOW.toISOString(),
      status: "ok",
    },
  };
  const result = await enrichProject(
    env,
    project("epsilon"),
    repoHints("epsilon", "", { manualImage: "/images/projects/brand.svg" }),
    [previous]
  );

  assert.equal(result.item.image, "/images/projects/brand.svg");
  assert.equal(result.item.imageMeta.source, "manual");
});

test("an existing curated illustration beats stock search and keeps a branded runtime fallback", async () => {
  const env = setup({
    env: { UNSPLASH_ACCESS_KEY: "key" },
    fixture: { unsplash: { results: [photo("1", "students in a classroom")] } },
  });
  fs.writeFileSync(path.join(env.root, "images/projects/zeta.svg"), "<svg/>");
  const { item } = await enrichProject(
    env,
    project("zeta", { name: "School analytics", fallbackImage: "/images/projects/zeta.svg" }),
    repoHints("zeta")
  );
  assert.equal(item.imageMeta.source, "curated-illustration");
  assert.ok(!env.requests.some((entry) => entry.url.includes("api.unsplash.com")));
  assert.match(item.fallbackImage, /\/images\/featured\/projects\/zeta-fallback\.svg$/);
});

test("articles use the RSS image, then the Open Graph image, then embedded content images", async () => {
  const images = {
    "https://cdn.test/rss.png": { width: 1200, height: 700 },
    "https://cdn.test/og.png": { width: 1200, height: 630 },
    "https://cdn.test/inline.png": { width: 1000, height: 600 },
    "https://cdn.test/broken.png": { status: 500 },
  };
  const run = async (id, rssImage, og, contentImages = []) => {
    const env = setup({ fixture: { images, medium: { items: [{ id, og }] } } });
    const result = await enrichImages({
      kind: "articles",
      items: [article(id)],
      hintsById: { [id]: { rssImage, contentImages } },
      context: env.context,
    });
    return { item: result.items[0], env };
  };

  const rss = await run("a1", "https://cdn.test/rss.png", "https://cdn.test/og.png");
  assert.equal(rss.item.imageMeta.source, "medium-rss");
  assert.ok(!rss.env.requests.some((entry) => entry.url.startsWith("https://medium.com/@pcodesdev/")), "no page fetch is needed");

  const og = await run("a2", "https://cdn.test/broken.png", "https://cdn.test/og.png");
  assert.equal(og.item.imageMeta.source, "article-og");

  const inline = await run("a3", "https://cdn.test/broken.png", undefined, ["https://cdn.test/inline.png"]);
  assert.equal(inline.item.imageMeta.source, "article-content");
  assert.match(inline.item.imageMeta.alt, /Article a3/);
});

test("stock search picks a relevant, attributed, WebP-delivered photo and rejects irrelevant results", async () => {
  const env = setup({
    env: { UNSPLASH_ACCESS_KEY: "key" },
    fixture: {
      unsplash: { results: [photo("111", "snowy mountain landscape at dawn"), photo("222", "students learning in a classroom")] },
    },
  });
  const { item } = await enrichProject(env, project("eta", { name: "School analytics", description: "Education analytics for schools" }), repoHints("eta"));

  assert.equal(item.imageMeta.source, "unsplash");
  assert.equal(item.imageMeta.providerKey, "unsplash:222");
  assert.equal(item.imageMeta.license, "Unsplash License");
  assert.match(item.imageMeta.attribution, /Ada Photographer on Unsplash/);
  assert.match(item.imageMeta.sourceUrl, /utm_source=pcodesdev_portfolio/);
  assert.match(item.image, /fm=webp/);
  assert.match(item.imageMeta.srcSet, /w=480.* 480w, .*w=960.* 960w/);
  assert.match(item.imageMeta.alt, /Illustrative photo for School analytics/);
  assert.ok(env.requests.some((entry) => entry.url.includes("/photos/222/download")), "download is reported to Unsplash");
  assert.ok(env.requests.every((entry) => !entry.url.includes("pexels")));
  core.validateImages([item], { kind: "projects" });
});

test("stock search never reuses one photo for two different items", async () => {
  const env = setup({
    env: { UNSPLASH_ACCESS_KEY: "key" },
    fixture: { unsplash: { results: [photo("333", "students in a school classroom")] } },
  });
  const result = await enrichImages({
    kind: "projects",
    items: [
      project("one", { name: "School tracker", description: "Student school tracking" }),
      project("two", { name: "School planner", description: "Student school planning" }),
    ],
    hintsById: { one: repoHints("one"), two: repoHints("two") },
    context: env.context,
  });
  assert.equal(result.items[0].imageMeta.source, "unsplash");
  assert.equal(result.items[1].imageMeta.source, "generated");
});

test("search failures, missing keys, unrelated topics, and dead photo URLs fall back without throwing", async () => {
  const failing = setup({ env: { UNSPLASH_ACCESS_KEY: "key" }, fixture: { unsplash: { status: 500 } } });
  const failed = await enrichProject(failing, project("theta", { name: "School analytics" }), repoHints("theta"));
  assert.equal(failed.item.imageMeta.source, "generated");
  assert.ok(failed.outcome.notes.some((note) => /image search failed/.test(note)));

  const keyless = setup();
  const noProvider = await enrichProject(keyless, project("iota", { name: "School analytics" }), repoHints("iota"));
  assert.ok(noProvider.outcome.notes.some((note) => /no image search provider configured/.test(note)));
  assert.equal(noProvider.item.imageMeta.source, "generated");

  const unrelated = setup({ env: { UNSPLASH_ACCESS_KEY: "key" }, fixture: { unsplash: { results: [photo("9", "mountain")] } } });
  const nothingRelevant = await enrichProject(unrelated, project("kappa", { name: "School analytics" }), repoHints("kappa"));
  assert.equal(nothingRelevant.item.imageMeta.source, "generated");

  const dead = setup({ env: { UNSPLASH_ACCESS_KEY: "key" }, fixture: { stockImagesBroken: true, unsplash: { results: [photo("5", "students classroom")] } } });
  const deadResult = await enrichProject(dead, project("lambda", { name: "School analytics" }), repoHints("lambda"));
  assert.equal(deadResult.item.imageMeta.source, "generated");
  assert.ok(deadResult.outcome.notes.some((note) => /not retrievable/.test(note)));

  const generic = setup({ env: { UNSPLASH_ACCESS_KEY: "key" } });
  const noTopic = await enrichProject(generic, project("mu", { name: "Zzzq", description: "Qqq" }), repoHints("mu"));
  assert.ok(noTopic.outcome.notes.some((note) => /no relevant search topic/.test(note)));
});

test("Pexels is selected by configuration and its attribution is recorded", async () => {
  const env = setup({
    env: { PEXELS_API_KEY: "key", IMAGE_SEARCH_PROVIDER: "pexels", UNSPLASH_ACCESS_KEY: "other" },
    fixture: {
      pexels: { photos: [{ id: 77, alt: "doctor in a hospital ward", photographer: "Grace", url: "https://www.pexels.com/photo/77/", width: 3000, height: 2000, src: { original: "https://images.pexels.com/photos/77/original.jpeg" } }] },
    },
  });
  const { item } = await enrichProject(env, project("nu", { name: "Hospital records", description: "Hospital patient records" }), repoHints("nu"));
  assert.equal(item.imageMeta.source, "pexels");
  assert.equal(item.imageMeta.license, "Pexels License");
  assert.match(item.imageMeta.attribution, /Grace on Pexels/);
  assert.ok(env.requests.every((entry) => !entry.url.includes("unsplash")));
});

test("a previously validated image is reused without searching, until its cache entry expires", async () => {
  const env = setup({
    env: { UNSPLASH_ACCESS_KEY: "key" },
    fixture: { unsplash: { results: [photo("444", "hospital ward")] } },
  });
  const item = project("xi", { name: "Hospital records", description: "Hospital patient records" });
  const first = await enrichProject(env, item, repoHints("xi"));
  assert.equal(first.item.imageMeta.source, "unsplash");

  env.requests.length = 0;
  const second = await enrichProject(env, item, repoHints("xi"), [first.item]);
  assert.deepEqual(second.item.imageMeta, first.item.imageMeta);
  assert.ok(!env.requests.some((entry) => entry.url.includes("api.unsplash.com")), "no new search");
  assert.deepEqual(second.outcome.notes, ["reused previously validated image"]);

  env.context.now = new Date(NOW.getTime() + 15 * DAY);
  const expired = await enrichProject(env, item, repoHints("xi"), [first.item]);
  assert.ok(env.requests.some((entry) => entry.url.includes("api.unsplash.com")), "stale entry is refreshed");
  assert.equal(expired.item.imageMeta.providerKey, "unsplash:444");
  assert.equal(expired.item.imageMeta.retrievedAt, env.context.now.toISOString());
});

test("local files that disappeared are re-fetched instead of reused", async () => {
  const env = setup({ fixture: { images: { "https://img.test/a.png": { width: 1200, height: 700 } } } });
  const hints = repoHints("omicron", "![a](https://img.test/a.png)");
  const first = await enrichProject(env, project("omicron"), hints);
  fs.rmSync(path.join(env.root, first.item.image.replace(/^\//, "")));
  const second = await enrichProject(env, project("omicron"), hints, [first.item]);
  assert.ok(fs.existsSync(path.join(env.root, second.item.image.replace(/^\//, ""))));
  assert.notDeepEqual(second.outcome.notes, ["reused previously validated image"]);
});

test("a generated thumbnail is kept for a week before image search is retried", async () => {
  const env = setup({ env: { UNSPLASH_ACCESS_KEY: "key" }, fixture: { unsplash: { status: 500 } } });
  const item = project("pi", { name: "School analytics" });
  const first = await enrichProject(env, item, repoHints("pi"));
  assert.equal(first.item.imageMeta.source, "generated");

  env.state.fixture = { unsplash: { results: [photo("555", "school students")] } };
  env.requests.length = 0;
  const soon = await enrichProject(env, item, repoHints("pi"), [first.item]);
  assert.equal(soon.item.imageMeta.source, "generated");
  assert.equal(env.requests.filter((entry) => entry.url.includes("api.unsplash.com/search")).length, 0);

  env.context.now = new Date(NOW.getTime() + 8 * DAY);
  const later = await enrichProject(env, item, repoHints("pi"), [first.item]);
  assert.equal(later.item.imageMeta.source, "unsplash");
});

test("image selection is deterministic across independent runs", async () => {
  const fixture = {
    images: { "https://img.test/d.png": { width: 1500, height: 800, color: "#aa3366" } },
  };
  const hints = repoHints("rho", "![d](https://img.test/d.png)");
  const left = await enrichProject(setup({ fixture }), project("rho"), hints);
  const right = await enrichProject(setup({ fixture }), project("rho"), hints);
  assert.deepEqual(left.item.imageMeta, right.item.imageMeta);
});

test("branded fallback thumbnails escape titles and stay deterministic", () => {
  const svg = generateFallbackSvg({ id: "x", title: `Fish & <script>alert("x")</script> Chips`, label: "Commerce", kindLabel: "Project" });
  assert.ok(!svg.includes("<script"));
  assert.match(svg, /Fish &amp; &lt;script&gt;/);
  assert.equal(svg, generateFallbackSvg({ id: "x", title: `Fish & <script>alert("x")</script> Chips`, label: "Commerce", kindLabel: "Project" }));
  assert.match(svg, /Peter Njuguna/);
});

test("unreferenced enrichment assets are removed while referenced ones are kept", async () => {
  const env = setup({ fixture: { images: { "https://img.test/e.png": { width: 1200, height: 700 } } } });
  const directory = path.join(env.root, "images/featured/projects");
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "stale-12345678-960.webp"), "stale");
  const { item } = await enrichProject(env, project("sigma"), repoHints("sigma", "![e](https://img.test/e.png)"));
  assert.ok(!fs.existsSync(path.join(directory, "stale-12345678-960.webp")));
  assert.ok(fs.existsSync(path.join(env.root, item.image.replace(/^\//, ""))));
});

test("dry runs never write assets", async () => {
  const env = setup({ fixture: { images: { "https://img.test/f.png": { width: 1200, height: 700 } } } });
  env.context.dryRun = true;
  await enrichProject(env, project("tau"), repoHints("tau", "![f](https://img.test/f.png)"));
  assert.ok(!fs.existsSync(path.join(env.root, "images/featured")));
});

test("search queries come from the item's own title, description, and category", () => {
  assert.deepEqual(buildSearchQuery({ name: "React Movie App", description: "Movie discovery with TMDB", topics: [] }).category, "Movies");
  assert.match(buildSearchQuery({ name: "Weather Forecast and History", description: "WeatherAPI sample" }).query, /weather forecast/);
  assert.equal(buildSearchQuery({ name: "Zzzq", description: "Qqq" }), null);
});

test("core image validation rejects missing alt text, stock photos without attribution, and reused images", () => {
  const good = (id, src, overrides = {}) => ({
    id,
    image: src,
    fallbackImage: GENERIC,
    imageMeta: { src, width: 960, height: 540, alt: `Alt for ${id}`, source: "readme", sourceUrl: "https://github.com/pcodesdev/x", license: "owner", status: "ok", retrievedAt: NOW.toISOString(), ...overrides },
  });
  assert.doesNotThrow(() => core.validateImages([good("a", "/a.webp"), good("b", "/b.webp")], { kind: "projects" }));
  assert.throws(() => core.validateImages([good("a", "/a.webp", { alt: " " })], { kind: "projects" }), /no alt text/);
  assert.throws(() => core.validateImages([good("a", "/a.webp", { source: "unsplash" })], { kind: "projects" }), /attribution or license/);
  assert.throws(() => core.validateImages([good("a", "/same.webp"), good("b", "/same.webp")], { kind: "projects" }), /reused by a/);
  assert.throws(() => core.validateImages([{ id: "a", image: "/a.webp", fallbackImage: GENERIC }], { kind: "projects" }), /no image metadata/);
  assert.throws(() => core.validateImages([good("a", "/a.webp", { status: "fallback" })], { kind: "projects" }), /inconsistent status/);
  assert.throws(() => core.validateImages([good("a", "/a.webp", { retrievedAt: "nope" })], { kind: "projects" }), /retrieval timestamp/);
});
