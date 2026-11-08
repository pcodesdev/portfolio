import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import curationCore from "../src/shared/curationCore.cjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = new URL(
  process.env.LIVE_SITE_URL || "https://pcodesdev.github.io"
);

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

const projects = readJson("src/shared/opensource/projects.json").data;
const publications = readJson("src/shared/medium/publications.json").data;
curationCore.validateImages(projects, { kind: "projects" });
curationCore.validateImages(publications, { kind: "publications" });

const localPaths = new Set();
[...projects, ...publications].forEach((item) => {
  const meta = item.imageMeta;
  [
    item.image,
    item.fallbackImage,
    meta.src,
    ...String(meta.srcSet || "")
      .split(",")
      .map((entry) => entry.trim().split(/\s+/)[0]),
  ]
    .filter((value) => value && value.startsWith("/"))
    .forEach((value) => localPaths.add(value));
});

const failures = [];
await Promise.all(
  [...localPaths].map(async (imagePath) => {
    const url = new URL(imagePath, baseUrl);
    try {
      const response = await fetch(url, {
        headers: { Range: "bytes=0-0" },
        signal: AbortSignal.timeout(15000),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.startsWith("image/")) {
        failures.push(
          `${imagePath} returned ${response.status} (${
            contentType || "no content type"
          })`
        );
      }
      if (response.body) await response.body.cancel();
    } catch (error) {
      failures.push(`${imagePath} failed: ${error.message}`);
    }
  })
);

if (failures.length) {
  throw new Error(
    `Live featured image verification failed:\n${failures.join("\n")}`
  );
}

console.log(
  `Verified ${localPaths.size} featured image URLs on ${baseUrl.origin}.`
);
