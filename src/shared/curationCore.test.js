const fs = require("fs");
const path = require("path");
const vm = require("vm");
const moduleStub = { exports: {} };
const source = fs.readFileSync(
  path.join(__dirname, "curationCore.cjs"),
  "utf8"
);
vm.runInNewContext(source, {
  module: moduleStub,
  exports: moduleStub.exports,
  URL,
});
const curation = moduleStub.exports;

const project = (id, overrides = {}) => ({
  id,
  name: id,
  createdAt: "2026-01-01T00:00:00.000Z",
  url: `https://github.com/pcodesdev/${id}`,
  description: "Verified project summary",
  languages: [],
  fallbackImage: "/images/projects/project-generic.svg",
  ...overrides,
});

const publication = (id, overrides = {}) => ({
  id,
  name: `Technology implementation ${id}`,
  createdAt: "2026-01-01T00:00:00.000Z",
  description:
    "A substantive article about practical technology implementation.",
  url: `https://medium.com/@pcodesdev/story-${id}`,
  ...overrides,
});

test("ranks relevant implementation above popularity-only repositories", () => {
  const relevant = curation.scoreProject({
    name: "School analytics",
    description:
      "Education assessment analytics with React, FastAPI, and cloud reporting",
    readme:
      "# Overview\n\n## Architecture\n\n## Testing\n\n## Data import\n\n" +
      "verified details ".repeat(80),
    topics: ["education", "analytics"],
    languages: ["Python", "JavaScript"],
    size: 800,
    stars: 2,
  });
  const popular = curation.scoreProject({
    name: "miscellaneous",
    description: "A personal project",
    topics: [],
    languages: ["JavaScript"],
    size: 80,
    stars: 10000,
  });

  expect(relevant.score).toBeGreaterThan(popular.score);
  expect(relevant.reasons).toContain("technical depth");
});

test("excludes forks, archived repositories, and empty repositories", () => {
  expect(curation.scoreProject({ fork: true, size: 100 }).score).toBe(
    -Infinity
  );
  expect(curation.scoreProject({ archived: true, size: 100 }).score).toBe(
    -Infinity
  );
  expect(curation.scoreProject({ fork: false, size: 0 }).score).toBe(-Infinity);
});

test("downranks tutorial repositories and excludes boilerplate-only projects", () => {
  const tutorial = curation.scoreProject({
    name: "React Hooks",
    description: "React hooks examples and learning guide",
    readme:
      "Getting started with Create React App. React Hooks are functions that demonstrate useState and useEffect.",
    topics: ["react", "react-hooks"],
    languages: ["JavaScript", "CSS"],
    size: 400,
  });
  const boilerplate = curation.scoreProject({
    name: "reactstate",
    description: "",
    readme:
      "Getting Started with Create React App. Available Scripts. npm start.",
    topics: [],
    languages: ["JavaScript", "CSS"],
    size: 200,
  });

  expect(tutorial.score).toBeLessThan(curation.MIN_PROJECT_SCORE);
  expect(boilerplate.score).toBe(-Infinity);
});

test("uses full article content signals instead of requiring a keyword in the excerpt", () => {
  const article = curation.scorePublication({
    name: "Kenya Is #1 in AI Usage",
    description: "An unexpected headline.",
    contentText:
      "Digital skills, technology adoption, and local value capture shape the digital economy.",
  });

  expect(article.score).toBeGreaterThanOrEqual(curation.MIN_PUBLICATION_SCORE);
  expect(article.reasons).toContain(
    "technology adoption and digital ecosystems"
  );
});

test("pins and excludes candidates while keeping the result within six", () => {
  const candidates = Array.from({ length: 8 }, (_, index) => ({
    id: `repo-${index}`,
    score: index,
  }));
  const selected = curation.orderCandidates(
    candidates,
    ["repo-0"],
    ["repo-7"],
    (item) => ({ score: item.score }),
    0,
    "projects"
  );

  expect(selected).toHaveLength(6);
  expect(selected[0].id).toBe("repo-0");
  expect(selected.some((item) => item.id === "repo-7")).toBe(false);
  expect(() =>
    curation.orderCandidates(
      candidates,
      candidates.slice(0, 7).map((item) => item.id),
      [],
      (item) => ({ score: item.score }),
      0,
      "projects"
    )
  ).toThrow("At most 6 projects may be pinned");
});

test("rejects malformed or over-limit project and publication data", () => {
  expect(() =>
    curation.validateProjects([
      project("bad", { url: "https://github.com.evil.test/bad" }),
    ])
  ).toThrow("valid GitHub URL");
  expect(() =>
    curation.validateProjects([project("bad", { fallbackImage: "" })])
  ).toThrow("fallback image");
  expect(() =>
    curation.validatePublications([
      publication("bad", { url: "https://example.com/story" }),
    ])
  ).toThrow("canonical to Peter's Medium profile");
  expect(() =>
    curation.validateProjects(
      Array.from({ length: 7 }, (_, index) => project(`p-${index}`))
    )
  ).toThrow("at most 6");
  expect(() =>
    curation.validatePublications(
      Array.from({ length: 7 }, (_, index) => publication(`a-${index}`))
    )
  ).toThrow("at most 6");
});

test("does not call the commit step when either upstream source fails", async () => {
  const commit = jest.fn();
  await expect(
    curation.collectValidatedData(
      () => Promise.reject(new Error("GitHub unavailable")),
      () => Promise.resolve([publication("article")]),
      commit
    )
  ).rejects.toThrow("GitHub unavailable");
  expect(commit).not.toHaveBeenCalled();
});

test("does not commit invalid generated data", async () => {
  const commit = jest.fn();
  await expect(
    curation.collectValidatedData(
      () => Promise.resolve([project("project")]),
      () => Promise.resolve([publication("article", { description: "" })]),
      commit
    )
  ).rejects.toThrow("metadata is incomplete");
  expect(commit).not.toHaveBeenCalled();
});
