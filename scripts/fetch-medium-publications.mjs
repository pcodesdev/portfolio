import fs from "node:fs";
import path from "node:path";

const FEED_URL = "https://medium.com/feed/@pcodesdev";
const OUTPUT_PATH = path.resolve("src/shared/medium/publications.json");

function decodeEntities(value) {
  return value
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
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function firstText(content) {
  const paragraph = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraph) return stripHtml(paragraph[1]);
  const caption = content.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  if (caption) return stripHtml(caption[1]);
  return "";
}

function truncate(value, maxLength = 220) {
  if (value.length <= maxLength) return value;
  const cutoff = value.lastIndexOf(" ", maxLength);
  return `${value.slice(0, cutoff > 0 ? cutoff : maxLength).trim()}...`;
}

const response = await fetch(FEED_URL, {
  headers: {
    "User-Agent": "pcodesdev-portfolio/1.0 (+https://pcodesdev.github.io/)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
});

if (!response.ok) {
  throw new Error(`Medium feed request failed: ${response.status}`);
}

const xml = await response.text();
const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
  (match) => match[1]
);

const publications = items
  .map((item) => {
    const feedTitle = stripHtml(
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1] ||
        item.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ||
        ""
    );
    const rawLink = stripHtml(
      item.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || ""
    );
    const guid = stripHtml(
      item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1] || ""
    );
    const pubDate = stripHtml(
      item.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || ""
    );
    const content = item.match(
      /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i
    )?.[1] || "";
    const firstHeading = stripHtml(
      content.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1] || ""
    );
    const titlePrefix = feedTitle.replace(/\s*…$/, "").trim();
    const title =
      feedTitle.endsWith("…") && firstHeading.startsWith(titlePrefix)
        ? firstHeading
        : feedTitle;
    const image = content.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] || null;

    const url = rawLink.replace(/\?source=.*$/i, "").trim();
    const id = guid.match(/\/p\/([a-z0-9]+)/i)?.[1] || url.split("-").pop();

    return {
      id,
      name: title,
      createdAt: pubDate ? new Date(pubDate).toISOString() : "",
      description: truncate(firstText(content)),
      image,
      url,
    };
  })
  .filter((publication) => publication.name && publication.url);

if (publications.length === 0) {
  throw new Error("Medium feed returned no publications");
}

const payload = {
  source: "Medium RSS",
  profileUrl: "https://medium.com/@pcodesdev",
  feedUrl: FEED_URL,
  fetchedAt: new Date().toISOString(),
  data: publications,
};

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);

console.log(
  `Wrote ${publications.length} Medium publications to ${path.relative(
    process.cwd(),
    OUTPUT_PATH
  )}`
);
