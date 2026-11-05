const {
  buildSuggestionGroups,
  rotateSuggestionGroups,
} = require("./suggestions");
const knowledgeBase = require("./knowledge-base.json");
const githubSnapshot = require("../shared/opensource/github_stats_snapshot.json");
const { snapshotToKnowledgeDocuments } = require("./github-data");
const documents = [
  ...snapshotToKnowledgeDocuments(githubSnapshot),
  ...knowledgeBase,
];

test("question suggestions are derived from indexed public domains rather than a four-item fixed list", () => {
  const groups = buildSuggestionGroups(documents);
  expect(groups.map((group) => group.label)).toEqual(
    expect.arrayContaining([
      "Professional Profile",
      "Project Management",
      "Digital Transformation",
      "Technology & AI",
      "Digital Skills & EdTech",
      "Projects & Impact",
      "Education & Qualifications",
      "Open Source",
      "Contact & Availability",
    ])
  );
  expect(
    groups.every((group) => group.sourceCount > 0 && group.questions.length > 0)
  ).toBe(true);
  expect(
    groups
      .find((group) => group.id === "open-source")
      .questions.some((question) =>
        /contributions|repositories/i.test(question)
      )
  ).toBe(true);
  expect(
    groups
      .find((group) => group.id === "open-source")
      .questions.some((question) =>
        /Verified GitHub Profile Statistics/i.test(question)
      )
  ).toBe(true);
});

test("suggestion rotation exposes different domains instead of repeating only the first topics", () => {
  const groups = buildSuggestionGroups(documents);
  const first = rotateSuggestionGroups(groups, 0, 3).map((group) => group.id);
  const next = rotateSuggestionGroups(groups, 3, 3).map((group) => group.id);
  expect(first).toHaveLength(3);
  expect(next).toHaveLength(3);
  expect(next.some((id) => !first.includes(id))).toBe(true);
});

test("rotated suggestion groups wrap around the available corpus domains", () => {
  const groups = buildSuggestionGroups(documents);
  expect(
    rotateSuggestionGroups(groups, groups.length, 3).map((group) => group.id)
  ).toEqual(rotateSuggestionGroups(groups, 0, 3).map((group) => group.id));
});
