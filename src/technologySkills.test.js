import { technologySkillCategories } from "./technologySkills";

const items = technologySkillCategories.flatMap((category) =>
  category.groups.flatMap((group) => group.items)
);
const itemNames = items.map((item) => item.name);

test("technology skills cover the requested categories with nonduplicated labeled items", () => {
  expect(technologySkillCategories.map((category) => category.title)).toEqual([
    "AI Engineering & Implementation",
    "Programming Languages & Web Technologies",
    "Databases & Data Technologies",
    "Cloud Computing & Infrastructure",
    "Operating Systems",
    "Project Management & Delivery",
    "Digital Skills Training & EdTech",
    "Design, Collaboration & Productivity",
  ]);
  expect(new Set(itemNames).size).toBe(itemNames.length);
  expect(items.every((item) => item.name && item.icon)).toBe(true);
});

test("AI category positions engineering and implementation without unsupported product claims", () => {
  const aiCategory = technologySkillCategories[0];
  expect(aiCategory.description).toContain("AI engineering and integration");
  expect(aiCategory.description).toContain("workflow automation");
  expect(aiCategory.groups[0].items.map((item) => item.name)).toEqual([
    "AI Engineering",
    "AI Implementation & Integration",
    "AI-Assisted Software Development",
    "AI-Powered Workflow Automation",
    "AI Solutions Development",
    "AI Applications in EdTech & Digital Learning",
  ]);
  expect(aiCategory.groups[1].items.map((item) => item.name)).toEqual([
    "ChatGPT / OpenAI",
    "Google Gemini",
    "Claude",
    "Microsoft Copilot",
    "GitHub Copilot",
    "Perplexity",
  ]);
  expect(JSON.stringify(aiCategory)).not.toMatch(
    /not AI engineering|not a production AI implementation/i
  );
});

test("project-management competencies are separate from PM and collaboration software", () => {
  const projectManagement = technologySkillCategories.find(
    (category) => category.id === "project-management"
  );
  expect(projectManagement.groups[0].title).toBe("Professional competencies");
  expect(projectManagement.groups[1].title).toBe(
    "Project and collaboration tools"
  );
  expect(projectManagement.groups[0].items.map((item) => item.name)).toContain(
    "Monitoring, Evaluation & Reporting"
  );
  expect(projectManagement.groups[1].items.map((item) => item.name)).toContain(
    "Trello"
  );
});
