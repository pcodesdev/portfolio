import React from "react";
import ReactDOM from "react-dom";
import ExpertiseComponent from "./ExpertiseComponent";

jest.mock("../../components/header/Header", () => () => null);
jest.mock("../../components/footer/Footer", () => () => null);
jest.mock("../../components/topButton/TopButton", () => () => null);
jest.mock("../../components/motion/Reveal", () => ({
  Fade: ({ children }) => children,
}));
jest.mock("../../components/technologySkills/TechnologySkills", () => () => (
  <section aria-label="Technology skills mock">
    Technologies, Tools &amp; Professional Skills
  </section>
));

test("Expertise renders Project Management with practical delivery capabilities", () => {
  const container = document.createElement("div");
  ReactDOM.render(
    <ExpertiseComponent
      theme={{ text: "#172b4d", secondaryText: "#40566f" }}
    />,
    container
  );

  const projectManagement = Array.from(
    container.querySelectorAll(".expertise-area")
  ).find(
    (area) => area.querySelector("h2")?.textContent === "Project Management"
  );

  expect(projectManagement).not.toBeUndefined();
  expect(projectManagement.textContent).toContain(
    "Workplan development and scheduling"
  );
  expect(projectManagement.textContent).toContain(
    "Risk identification and mitigation"
  );
  expect(projectManagement.textContent).toContain(
    "Deliverable and milestone tracking"
  );
  expect(projectManagement.textContent).toContain("12+ trainers");
  expect(container.textContent).toContain("Project Management");
  expect(container.textContent).toContain("AI Engineering & Implementation");
  expect(container.textContent).toContain("AI-Powered Workflow Automation");
  expect(container.textContent).toContain(
    "Technologies, Tools & Professional Skills"
  );

  ReactDOM.unmountComponentAtNode(container);
});
