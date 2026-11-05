import documents from "./knowledge-base.json";
import githubSnapshot from "../shared/opensource/github_stats_snapshot.json";
const { retrieve, makeLocalAnswer } = require("./retrieval");
const { snapshotToKnowledgeDocuments } = require("./github-data");
const searchDocuments = [
  ...snapshotToKnowledgeDocuments(githubSnapshot),
  ...documents,
];

test("portfolio-wide retrieval combines project-management expertise and FCA experience sources", () => {
  const results = retrieve(
    "What project management experience does Peter have?",
    documents
  );
  const titles = results.map((item) => item.title);

  expect(titles).toContain("Project Management Expertise");
  expect(results.some((item) => item.id.startsWith("experience-"))).toBe(true);
  expect(results.every((item) => item.url.startsWith("/#/"))).toBe(true);
  expect(makeLocalAnswer(results)).toContain("Project Management");
});

test("retrieval covers AI competencies and Pemanju Farm Manager details", () => {
  const ai = retrieve(
    "What are Peter's AI engineering and implementation skills?",
    documents
  );
  const project = retrieve(
    "Tell me about Pemanju Farm Manager offline records",
    documents
  );

  expect(
    ai.some((item) => item.title === "AI Engineering & Implementation")
  ).toBe(true);
  expect(
    project.some((item) => item.id === "project-pemanju-farm-manager")
  ).toBe(true);
  expect(project.some((item) => item.url === "/#/projects")).toBe(true);
});

test("technology questions retrieve language, cloud, and EdTech sources", () => {
  expect(
    retrieve(
      "Which programming languages and frameworks does Peter use?",
      documents
    ).map((item) => item.id)
  ).toContain("technology-languages");
  expect(
    retrieve("What are Peter's cloud computing skills?", documents).map(
      (item) => item.id
    )
  ).toContain("technology-cloud");
  expect(
    retrieve(
      "What digital skills learning platforms are listed?",
      documents
    ).map((item) => item.id)
  ).toContain("learning-platforms");
});

test("unsupported questions return no answer rather than inventing profile facts", () => {
  const results = retrieve("What is Peter's favorite black hole?", documents);
  expect(results).toEqual([]);
  expect(makeLocalAnswer(results)).toBeNull();
});

test("contact lookup returns only the published contact page and public email", () => {
  const results = retrieve("How can I contact Peter by email?", documents);
  const contact = results.find((item) => item.id === "contact");

  expect(contact).toBeDefined();
  expect(contact.url).toBe("/#/contact");
  expect(contact.externalUrl).toContain("mailto:");
});

test("GitHub contribution questions retrieve verified profile totals and personal source links", () => {
  const statistics = retrieve(
    "How many pull requests has Peter opened or merged?",
    searchDocuments
  );
  const repos = retrieve(
    "Which repositories has Peter contributed to?",
    searchDocuments
  );
  expect(
    statistics.some(
      (item) =>
        item.id.startsWith("github-profile-") &&
        item.content.includes("pull requests authored")
    )
  ).toBe(true);
  expect(
    repos.some(
      (item) =>
        (item.id.startsWith("github-pr-") || item.id.startsWith("pr-")) &&
        item.externalUrl
    )
  ).toBe(true);
  expect(
    statistics.find(
      (item) =>
        item.id.startsWith("github-profile-") &&
        item.content.includes("pull requests authored")
    ).content
  ).toContain("not contribution calendar");
});

test("multi-domain retrieval returns profile, experience, and project sources", () => {
  const results = retrieve(
    "How has Peter used project management across FCA experience and software projects?",
    documents,
    6
  );
  const ids = results.map((item) => item.id);
  expect(ids.some((id) => id.startsWith("experience-"))).toBe(true);
  expect(
    ids.some(
      (id) => id.startsWith("project-") || id === "project-pemanju-farm-manager"
    )
  ).toBe(true);
});
