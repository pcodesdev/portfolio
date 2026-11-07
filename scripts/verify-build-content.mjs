import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import curationCore from "../src/shared/curationCore.cjs";
import { assertImagesExist } from "./image-enrichment.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildIndex = process.argv.indexOf("--build");
const BUILD = path.resolve(ROOT, buildIndex > -1 ? process.argv[buildIndex + 1] : "build");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), "utf8"));
}

const jsDirectory = path.join(BUILD, "static", "js");
if (!fs.existsSync(jsDirectory)) {
  throw new Error(`No compiled JavaScript found in ${jsDirectory}`);
}
const bundle = fs
  .readdirSync(jsDirectory)
  .filter((name) => name.endsWith(".js"))
  .map((name) => fs.readFileSync(path.join(jsDirectory, name), "utf8"))
  .join("\n");

const projects = readJson("src/shared/opensource/projects.json").data;
const publications = readJson("src/shared/medium/publications.json").data;
curationCore.validateImages(projects, { kind: "projects" });
curationCore.validateImages(publications, { kind: "publications" });
assertImagesExist(projects, BUILD);
assertImagesExist(publications, BUILD);
const missing = [
  ...projects.map((project) => project.url),
  ...publications.map((publication) => publication.url),
].filter((url) => !bundle.includes(url));

if (missing.length) {
  console.error(`The build does not contain these featured items:\n${missing.join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Build verified: all ${projects.length} featured projects, ${publications.length} featured articles, and their local image assets are present.`
  );
}
