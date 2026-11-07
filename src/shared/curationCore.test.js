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
  expect(relevant.score).toBeGreaterThanOrEqual(curation.MIN_PROJECT_SCORE);
  expect(popular.score).toBeLessThan(curation.MIN_PROJECT_SCORE);
  expect(relevant.reasons.join(" ")).toContain("technical complexity");
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

test("scores articles on depth and analysis rather than a single keyword in the excerpt", () => {
  const headline = curation.scorePublication({
    name: "Kenya Is #1 in AI Usage",
    description: "An unexpected headline.",
    contentText:
      "Digital skills, technology adoption, and local value capture shape the digital economy.",
  });
  const rich = curation.scorePublication({
    name: "Architecture and deployment case study",
    description:
      "A walkthrough of how I implemented a cloud data workflow, including the trade-offs and lessons learned.",
    contentText: "In my experience, digital transformation depends on architecture. For example, I built an API and tested the deployment; however the analysis shows risks, impact and outcomes. ".repeat(
      40
    ),
    metrics: {
      wordCount: 1200,
      headingCount: 4,
      paragraphCount: 12,
      listItemCount: 4,
      codeBlockCount: 1,
      imageCount: 1,
    },
  });

  expect(headline.score).toBeLessThan(curation.MIN_PUBLICATION_SCORE);
  expect(headline.reasons.join(" ")).toContain("superficial length penalty");
  expect(rich.score).toBeGreaterThanOrEqual(curation.MIN_PUBLICATION_SCORE);
});

test("rubric weights are explicit and total 100 points for both content types", () => {
  const total = (rubric) => rubric.reduce((sum, { max }) => sum + max, 0);
  expect(total(curation.PROJECT_RUBRIC)).toBe(100);
  expect(total(curation.PUBLICATION_RUBRIC)).toBe(100);
  expect(curation.MIN_PROJECT_SCORE).toBe(50);
  expect(curation.MIN_PUBLICATION_SCORE).toBe(50);
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

const rank = (candidates, options = {}) =>
  curation.rankCandidates({
    candidates,
    pinnedIds: [],
    excludedIds: [],
    scoreFunction: (item) => ({ score: item.score }),
    minimumScore: 50,
    kind: "projects",
    ...options,
  });

test("ranking is deterministic, independent of input order, and never favours recency", () => {
  const candidates = [
    { id: "b", score: 60, updatedAt: "2026-12-01T00:00:00Z" },
    { id: "a", score: 60, updatedAt: "2020-01-01T00:00:00Z" },
    { id: "c", score: 90, updatedAt: "2019-01-01T00:00:00Z" },
  ];
  const forward = rank(candidates).selected.map((item) => item.id);
  const reversed = rank([...candidates].reverse()).selected.map(
    (item) => item.id
  );
  expect(forward).toEqual(["c", "a", "b"]);
  expect(reversed).toEqual(forward);
});

test("a newcomer that scores higher displaces the lowest featured item", () => {
  const featured = Array.from({ length: 6 }, (_, index) => ({
    id: `old-${index}`,
    score: 55 + index,
  }));
  const { selected, decisions } = rank([...featured, { id: "new", score: 80 }]);

  expect(selected).toHaveLength(6);
  expect(selected[0].id).toBe("new");
  expect(decisions.find((item) => item.id === "old-0")).toMatchObject({
    status: "outranked",
  });
});

test("below-threshold items are reported and never selected", () => {
  const { selected, decisions } = rank([
    { id: "good", score: 70 },
    { id: "weak", score: 49.99 },
    { id: "ineligible", score: -Infinity },
  ]);

  expect(selected.map((item) => item.id)).toEqual(["good"]);
  expect(decisions.find((item) => item.id === "weak").status).toBe(
    "below-threshold"
  );
  expect(decisions.find((item) => item.id === "ineligible").status).toBe(
    "ineligible"
  );
});

test("duplicates by id, URL, or normalized title keep only the highest-scoring copy", () => {
  const { selected, decisions } = rank(
    [
      {
        id: "a1",
        name: "Cloud Guide!",
        url: "https://medium.com/@pcodesdev/cloud-1",
        score: 60,
      },
      {
        id: "a2",
        name: "cloud guide",
        url: "https://medium.com/@pcodesdev/cloud-2",
        score: 75,
      },
      {
        id: "a3",
        name: "Other",
        url: "https://medium.com/@pcodesdev/cloud-2/",
        score: 70,
      },
      {
        id: "a4",
        name: "Distinct",
        url: "https://medium.com/@pcodesdev/distinct",
        score: 65,
      },
    ],
    { dedupeKeys: curation.publicationDedupeKeys, kind: "publications" }
  );

  expect(selected.map((item) => item.id)).toEqual(["a2", "a4"]);
  expect(
    decisions
      .filter((item) => item.status === "duplicate")
      .map((item) => item.id)
      .sort()
  ).toEqual(["a1", "a3"]);
});

test("pinned items must be eligible and bypass only the score threshold", () => {
  expect(() =>
    rank([{ id: "forked", score: -Infinity }], { pinnedIds: ["forked"] })
  ).toThrow("not eligible");
  const { selected } = rank(
    [
      { id: "owner-choice", score: 20 },
      { id: "good", score: 70 },
    ],
    { pinnedIds: ["owner-choice"] }
  );
  expect(selected.map((item) => item.id)).toEqual(["owner-choice", "good"]);
});

test("site, profile, and GitHub Pages repositories are never scored", () => {
  expect(
    curation.scoreProject({ name: "pcodesdev.github.io", size: 900 }).exclusion
  ).toBe("site or profile repository excluded");
  expect(
    curation.scoreProject({ name: "pcodesdev", owner: "pcodesdev", size: 10 })
      .eligible
  ).toBe(false);
});

test("stored featured items below the quality threshold are rejected unless pinned", () => {
  const items = [
    { id: "ok", curationScore: 60 },
    { id: "low", curationScore: 12 },
  ];
  expect(() =>
    curation.validateQuality(items, { minimumScore: 50, kind: "projects" })
  ).toThrow("below the quality threshold");
  expect(
    curation.validateQuality(items, {
      minimumScore: 50,
      pinnedIds: ["low"],
      kind: "projects",
    })
  ).toHaveLength(2);
});

test("repeated repositories or articles cannot pass validation", () => {
  expect(() =>
    curation.validateProjects([
      project("one"),
      project("two", { url: "https://github.com/pcodesdev/one/" }),
    ])
  ).toThrow("must not repeat a repository");
  expect(() =>
    curation.validatePublications([
      publication("a", { name: "Same Title" }),
      publication("b", { name: "same title!" }),
    ])
  ).toThrow("must not repeat an article");
});
