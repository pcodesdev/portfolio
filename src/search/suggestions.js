const DOMAIN_RULES = [
  {
    id: "profile",
    label: "Professional Profile",
    select: (document) =>
      ["home-positioning", "about-biography"].includes(document.id) ||
      document.id.startsWith("about-impact-"),
    examples: [
      "What is Peter's professional background?",
      "How has Peter's career evolved?",
    ],
  },
  {
    id: "project-management",
    label: "Project Management",
    select: (document) =>
      document.id.includes("project-management") ||
      document.id.includes("experience-project-"),
    examples: [
      "What project management responsibilities has Peter handled?",
      "What evidence documents Peter's project delivery experience?",
    ],
  },
  {
    id: "digital-transformation",
    label: "Digital Transformation",
    select: (document) =>
      /digital transformation|technology implementation/i.test(
        document.content
      ),
    examples: [
      "How has Peter supported digital transformation?",
      "Which roles connect technology implementation with programme delivery?",
    ],
  },
  {
    id: "ai-technology",
    label: "Technology & AI",
    select: (document) =>
      document.id === "ai-engineering-expertise" ||
      document.id.startsWith("technology-"),
    examples: [
      "What are Peter's AI Engineering and AI Implementation capabilities?",
      "Which programming languages, frameworks, and tools are listed?",
    ],
  },
  {
    id: "digital-learning",
    label: "Digital Skills & EdTech",
    select: (document) =>
      [
        "edtech-expertise",
        "digital-skills-expertise",
        "learning-platforms",
        "experience-project-officer",
        "experience-project-assistant",
      ].includes(document.id),
    examples: [
      "What digital skills programmes has Peter coordinated?",
      "What experience does Peter have with digital learning and LMS support?",
    ],
  },
  {
    id: "projects-impact",
    label: "Projects & Impact",
    select: (document) =>
      document.id.startsWith("project-") ||
      document.id.startsWith("experience-") ||
      document.id.startsWith("about-impact-"),
    examples: [
      "What problems does Pemanju Farm Manager address?",
      "Which projects demonstrate Peter's software development capabilities?",
    ],
  },
  {
    id: "education",
    label: "Education & Qualifications",
    select: (document) =>
      document.id.startsWith("education-") ||
      document.id.startsWith("credential-"),
    examples: [
      "What education and professional learning are documented?",
      "Which technology topics are listed in Peter's ICT education?",
    ],
  },
  {
    id: "open-source",
    label: "Open Source",
    select: (document) =>
      document.id === "opensource-profile" || document.id.startsWith("github-"),
    examples: [
      "What are Peter's open-source contributions?",
      "Which repositories have author-verified activity?",
    ],
  },
  {
    id: "contact",
    label: "Contact & Availability",
    select: (document) => document.id === "contact",
    examples: [
      "How can I contact Peter?",
      "What kinds of roles and projects is Peter open to?",
    ],
  },
];

function buildSuggestionGroups(documents) {
  const uniqueDocuments = documents.filter(
    (document, index, list) =>
      list.findIndex(
        (candidate) =>
          candidate.id === document.id ||
          (document.externalUrl &&
            candidate.externalUrl === document.externalUrl)
      ) === index
  );
  return DOMAIN_RULES.map((rule) => {
    const matchingDocuments = uniqueDocuments.filter(rule.select);
    if (!matchingDocuments.length) return null;
    const generated = matchingDocuments
      .slice(0, 3)
      .map(
        (document) =>
          `What does the portfolio document about ${document.title}?`
      );
    const questions = [...new Set([...rule.examples, ...generated])];
    return {
      id: rule.id,
      label: rule.label,
      sourceCount: matchingDocuments.length,
      questions,
    };
  }).filter(Boolean);
}

function rotateSuggestionGroups(groups, offset = 0, visibleCount = 3) {
  if (!groups.length) return [];
  const start = ((offset % groups.length) + groups.length) % groups.length;
  return Array.from(
    { length: Math.min(visibleCount, groups.length) },
    (_, index) => groups[(start + index) % groups.length]
  );
}

module.exports = { buildSuggestionGroups, rotateSuggestionGroups };
