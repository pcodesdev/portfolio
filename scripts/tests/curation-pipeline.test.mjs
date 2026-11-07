import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const curationCore = require("../../src/shared/curationCore.cjs");

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const script = path.join(repoRoot, "scripts/curate-featured-content.mjs");
const fakeFetch = pathToFileURL(path.join(repoRoot, "scripts/tests/fake-fetch.mjs")).href;

function strongReadme(name) {
  return `# ${name}

Education analytics platform for schools with assessment import, reporting dashboard and AI-assisted insights.

## Architecture
A REST API backend built with FastAPI and a React frontend, PostgreSQL database, JWT authentication, schema validation, Docker deployment and CI/CD with GitHub Actions on cloud infrastructure.

## Usage
Installation: pip install -r requirements.txt then docker compose up. How to run the frontend: npm start.

## Testing
pytest and jest unit tests cover the import workflow, reporting, search and automation features.

## Screenshots
![dashboard](https://example.com/${name}.png)

## Features
${"Teachers import student assessment records, track progress, export reports, and automate workflow tasks for schools and community programmes. ".repeat(8)}
`;
}

function standardReadme(name) {
  return `# ${name}

Project management workflow tracker with reporting dashboard and API backend.

## Usage
npm install and npm start.

## Architecture
React frontend with a Node.js backend REST API and database, tested with jest.

## Notes
${"Tracks tasks, records, and reports for operations teams. ".repeat(20)}
`;
}

const strongRepo = (name) => ({
  name,
  description: "Education analytics platform with reporting and AI insights",
  language: "Python",
  languages: { Python: 900, JavaScript: 500, TypeScript: 100 },
  size: 1500,
  topics: ["education", "analytics"],
  created_at: "2025-01-01T00:00:00Z",
  pushed_at: "2025-08-01T00:00:00Z",
  homepage: "https://example.com/app",
  readme: strongReadme(name),
});

const standardRepo = (name) => ({
  name,
  description: "Workflow tracker with reporting dashboard",
  language: "JavaScript",
  languages: { JavaScript: 900, CSS: 100 },
  size: 300,
  topics: ["workflow", "tracking"],
  created_at: "2025-01-01T00:00:00Z",
  pushed_at: "2025-03-01T00:00:00Z",
  readme: standardReadme(name),
});

const weakRepo = (name) => ({
  name,
  description: "",
  language: "HTML",
  size: 4,
  readme: "# demo\nhello",
});

function strongArticleHtml(topic) {
  const paragraph = `<p>In my experience, ${topic} implementation succeeds because the architecture, deployment, and data workflow are aligned. For example, I built an API integration on cloud infrastructure with testing; however, the trade-off is extra security governance. The analysis shows measurable impact and outcomes, and the risks and challenges are documented with evidence.</p>`;
  return (
    `<h3>${topic}</h3>${paragraph.repeat(20)}<h3>Steps</h3><ul><li>Step one</li><li>Step two</li><li>Step three</li></ul>` +
    `<pre>run()</pre><h3>Lessons</h3><p>A checklist and playbook of best practices for digital transformation, technology adoption, education and workforce skills in software and Python.</p>` +
    `<img src="https://example.com/${topic}.png"/>`
  );
}

const strongArticle = (id, title) => ({ id, title, html: strongArticleHtml(title) });

function standardArticleHtml() {
  const sentence =
    "Digital transformation and technology adoption in education need software skills. For example, I built an API integration on cloud infrastructure; the analysis shows impact for schools and workforce learning, however the challenges are real. ";
  return `<h3>One</h3>${`<p>${sentence.repeat(2)}</p>`.repeat(8)}<h3>Two</h3><h3>Three</h3><img src="https://example.com/std.png"/>`;
}

const standardArticle = (id, title) => ({ id, title, html: standardArticleHtml() });
const weakArticle = (id, title = "Top 10 NFT things to know") => ({
  id,
  title,
  html: "<p>A short note about my day, with no real analysis.</p>",
});

function createWorkspace(overrides = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "curation-test-"));
  ["scripts", "src/shared/opensource", "src/shared/medium", "public/images/projects"].forEach(
    (directory) => fs.mkdirSync(path.join(root, directory), { recursive: true })
  );
  fs.writeFileSync(path.join(root, "public/images/projects/project-generic.svg"), "<svg/>");
  fs.writeFileSync(
    path.join(root, "scripts/curation-overrides.json"),
    JSON.stringify({
      pinnedProjects: [],
      excludedProjects: [],
      pinnedPublications: [],
      excludedPublications: [],
      projects: {},
      publications: {},
      ...overrides,
    })
  );
  return {
    root,
    fixturePath: path.join(root, "fixture.json"),
    reportPath: path.join(root, "report.json"),
    outputPath: path.join(root, "github-output.txt"),
    projectsPath: path.join(root, "src/shared/opensource/projects.json"),
    publicationsPath: path.join(root, "src/shared/medium/publications.json"),
  };
}

function run(workspace, fixture, args = [], extraEnv = {}) {
  fs.writeFileSync(workspace.fixturePath, JSON.stringify(fixture));
  fs.rmSync(workspace.outputPath, { force: true });
  const result = spawnSync(process.execPath, ["--import", fakeFetch, script, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      CURATION_ROOT: workspace.root,
      FAKE_FIXTURE: workspace.fixturePath,
      CURATION_REPORT_PATH: workspace.reportPath,
      GITHUB_OUTPUT: workspace.outputPath,
      GITHUB_STEP_SUMMARY: path.join(workspace.root, "summary.md"),
      GITHUB_TOKEN: "",
      UNSPLASH_ACCESS_KEY: "",
      PEXELS_API_KEY: "",
      ...extraEnv,
    },
  });
  const readIfPresent = (file) =>
    fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    projects: readIfPresent(workspace.projectsPath),
    publications: readIfPresent(workspace.publicationsPath),
    report: readIfPresent(workspace.reportPath),
  };
}

const baseline = () => ({
  repos: ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"].map(standardRepo),
  medium: {
    status: 200,
    items: ["a1", "a2", "a3", "a4", "a5", "a6"].map((id) =>
      strongArticle(`${id}aaaaaaaaaa`.slice(0, 12), `Digital transformation lessons ${id}`)
    ),
  },
});

const ids = (payload) => payload.data.map((item) => item.id);
const decisionFor = (report, kind, id) =>
  report[kind].decisions.find((decision) => decision.id === id);

test("fixtures meet the documented quality bar", () => {
  const strong = curationCore.scoreProject({
    ...strongRepo("x"),
    languages: ["Python", "JavaScript", "TypeScript"],
    homepageAvailable: true,
  });
  const standard = curationCore.scoreProject({
    ...standardRepo("y"),
    languages: ["JavaScript", "CSS"],
  });
  assert.ok(standard.score >= curationCore.MIN_PROJECT_SCORE, `standard fixture scored ${standard.score}`);
  assert.ok(strong.score > standard.score);

  const article = (html, title) => {
    const text = html.replace(/<[^>]+>/g, " ");
    const count = (pattern) => (html.match(pattern) || []).length;
    return curationCore.scorePublication({
      name: title,
      description: text.trim().slice(0, 200),
      contentText: text,
      metrics: {
        wordCount: text.split(/\s+/).filter(Boolean).length,
        headingCount: count(/<h[1-6]/g),
        paragraphCount: count(/<p>/g),
        listItemCount: count(/<li>/g),
        codeBlockCount: count(/<pre>/g),
        imageCount: count(/<img/g),
      },
    });
  };
  const strongArticleScore = article(strongArticleHtml("Cloud"), "Cloud");
  const standardArticleScore = article(standardArticleHtml(), "Digital transformation lessons");
  assert.ok(
    standardArticleScore.score >= curationCore.MIN_PUBLICATION_SCORE,
    `standard article scored ${standardArticleScore.score}`
  );
  assert.ok(strongArticleScore.score > standardArticleScore.score);
});

test("first run discovers, scores, and writes projects and articles", () => {
  const workspace = createWorkspace();
  const result = run(workspace, baseline());
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.projects.data.length, 6);
  assert.equal(result.publications.data.length, 6);
  assert.equal(result.projects.rubricVersion, curationCore.RUBRIC_VERSION);
  assert.equal(result.report.projects.discovered, 6);
  assert.equal(result.report.publications.discovered, 6);
  assert.equal(result.report.changed, true);
  assert.match(fs.readFileSync(workspace.outputPath, "utf8"), /changed=true/);
});

test("a newly created high-quality GitHub project is discovered and featured", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  fixture.repos = fixture.repos.slice(0, 3);
  assert.equal(run(workspace, fixture).status, 0);

  fixture.repos.push(strongRepo("brand-new-platform"));
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(ids(result.projects).includes("brand-new-platform"));
  assert.deepEqual(result.report.changes.projects.added, ["brand-new-platform"]);
  assert.equal(result.report.changed, true);
});

test("a newly published high-quality Medium article is discovered and featured", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  fixture.medium.items = fixture.medium.items.slice(0, 3);
  assert.equal(run(workspace, fixture).status, 0);

  fixture.medium.items.push(strongArticle("ffffffffffff", "Cloud implementation playbook"));
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(ids(result.publications).includes("ffffffffffff"));
  assert.deepEqual(result.report.changes.publications.added, ["ffffffffffff"]);
});

test("a higher-scoring project replaces the lowest-ranked featured project", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  assert.equal(run(workspace, fixture).status, 0);

  fixture.repos.push(strongRepo("zz-better-than-all"));
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.projects.data.length, 6);
  assert.ok(ids(result.projects).includes("zz-better-than-all"));
  const [removed] = result.report.changes.projects.removed;
  assert.ok(removed, "one previously featured project must be displaced");
  assert.equal(decisionFor(result.report, "projects", removed).status, "outranked");
  assert.ok(
    decisionFor(result.report, "projects", "zz-better-than-all").score >
      decisionFor(result.report, "projects", removed).score
  );
});

test("a higher-scoring article replaces a lower-scoring featured article", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  fixture.medium.items = fixture.medium.items.map((item, index) =>
    index < 3 ? item : standardArticle(item.id, item.title)
  );
  assert.equal(run(workspace, fixture).status, 0);

  fixture.medium.items.push(strongArticle("eeeeeeeeeeee", "Architecture and deployment case study"));
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.publications.data.length, 6);
  assert.ok(ids(result.publications).includes("eeeeeeeeeeee"));
  assert.equal(result.report.changes.publications.removed.length, 1);
});

test("low-scoring content is excluded and never published", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  fixture.repos.push(weakRepo("tiny-demo"));
  fixture.medium.items.push(weakArticle("999999999999"));
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(!ids(result.projects).includes("tiny-demo"));
  assert.ok(!ids(result.publications).includes("999999999999"));
  assert.notEqual(decisionFor(result.report, "projects", "tiny-demo").status, "selected");
  assert.equal(decisionFor(result.report, "publications", "999999999999").status, "below-threshold");
  result.projects.data
    .filter((project) => project.curationScore < curationCore.MIN_PROJECT_SCORE)
    .forEach((project) => assert.fail(`${project.id} is below the threshold`));
});

test("forks, archived, and empty repositories are excluded", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  fixture.repos.push(
    { ...strongRepo("a-fork"), fork: true },
    { ...strongRepo("old-and-archived"), archived: true },
    { ...strongRepo("empty-repo"), size: 0 }
  );
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  ["a-fork", "old-and-archived", "empty-repo"].forEach((id) =>
    assert.ok(!ids(result.projects).includes(id), `${id} must not be featured`)
  );
  assert.equal(result.report.projects.forks, 1);
  assert.equal(result.report.projects.archived, 1);
  assert.equal(result.report.projects.empty, 1);
});

test("duplicate articles are published once", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  fixture.medium.items = fixture.medium.items.slice(0, 2);
  fixture.medium.items.push(
    strongArticle("dddddddddd01", "A Cross-Posted Guide to Cloud Deployment"),
    strongArticle("dddddddddd02", "A cross-posted guide to cloud deployment!")
  );
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  const duplicates = result.publications.data.filter((item) => item.id.startsWith("dddddddddd"));
  assert.equal(duplicates.length, 1);
  assert.equal(
    result.report.publications.decisions.filter((decision) => decision.status === "duplicate").length,
    1
  );
});

test("a GitHub rate limit fails the run and leaves existing content untouched", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  assert.equal(run(workspace, fixture).status, 0);
  const before = [workspace.projectsPath, workspace.publicationsPath].map((file) =>
    fs.readFileSync(file, "utf8")
  );

  const limited = run(workspace, { ...fixture, githubStatus: 403 });
  assert.equal(limited.status, 1);
  assert.match(limited.stderr, /rate limited/);
  assert.deepEqual(
    [workspace.projectsPath, workspace.publicationsPath].map((file) => fs.readFileSync(file, "utf8")),
    before
  );
});

test("a Medium outage or empty feed fails the run and leaves existing content untouched", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  assert.equal(run(workspace, fixture).status, 0);
  const before = [workspace.projectsPath, workspace.publicationsPath].map((file) =>
    fs.readFileSync(file, "utf8")
  );

  const outage = run(workspace, { ...fixture, medium: { status: 503, items: [] } });
  assert.equal(outage.status, 1);
  assert.match(outage.stderr, /Medium RSS request failed/);

  const empty = run(workspace, { ...fixture, medium: { status: 200, items: [] } });
  assert.equal(empty.status, 1);
  assert.match(empty.stderr, /no usable articles/);
  assert.deepEqual(
    [workspace.projectsPath, workspace.publicationsPath].map((file) => fs.readFileSync(file, "utf8")),
    before
  );
});

test("a run with nothing new is deterministic and does not rewrite content", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  const first = run(workspace, fixture);
  const second = run(workspace, fixture);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(second.report.changed, false);
  assert.match(fs.readFileSync(workspace.outputPath, "utf8"), /changed=false/);
  assert.deepEqual(second.projects, first.projects);
  assert.deepEqual(second.publications, first.publications);
  assert.deepEqual(second.report.projects.decisions, first.report.projects.decisions);
});

test("a featured article that falls out of the 10-item feed is carried forward", () => {
  const workspace = createWorkspace();
  const fixture = baseline();
  assert.equal(run(workspace, fixture).status, 0);
  const featuredBefore = fixture.medium.items[0].id;

  fixture.medium.items = [
    ...fixture.medium.items.slice(1),
    strongArticle("cccccccccccc", "Another technical deployment article"),
  ];
  const result = run(workspace, fixture);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(ids(result.publications).includes(featuredBefore));
  assert.equal(result.report.publications.carriedForward, 1);
});

test("dry runs report decisions but write nothing", () => {
  const workspace = createWorkspace();
  const result = run(workspace, baseline(), ["--dry-run"]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.projects, null);
  assert.equal(result.publications, null);
  assert.equal(result.report.dryRun, true);
});

test("stored data validates, and tampered below-threshold data is rejected", () => {
  const workspace = createWorkspace();
  assert.equal(run(workspace, baseline()).status, 0);
  const valid = run(workspace, baseline(), ["--validate"]);
  assert.equal(valid.status, 0, valid.stderr);

  const tampered = JSON.parse(fs.readFileSync(workspace.projectsPath, "utf8"));
  tampered.data[0].curationScore = 3;
  fs.writeFileSync(workspace.projectsPath, JSON.stringify(tampered));
  const rejected = run(workspace, baseline(), ["--validate"]);
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /below the quality threshold/);
});

test("invalid or ineligible pinned items abort without writing", () => {
  const workspace = createWorkspace({ pinnedProjects: ["a-fork"] });
  const fixture = baseline();
  fixture.repos.push({ ...strongRepo("a-fork"), fork: true });
  const result = run(workspace, fixture);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /not eligible/);
  assert.equal(result.projects, null);
});
