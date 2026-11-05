import React from "react";
import ReactDOM from "react-dom";
import ExperienceCard from "./ExperienceCard";

jest.mock("../motion/Reveal", () => ({ Fade: ({ children }) => children }));

const theme = {
  body: "#ffffff",
  text: "#172b4d",
  secondaryText: "#40566f",
  headerColor: "#0c9d58",
};

test("experience cards render each attributed achievement as a readable list item", () => {
  const container = document.createElement("div");
  const item = {
    title: "Project Officer – Digital Skills",
    company: "Finn Church Aid Kenya",
    company_url: "https://example.com",
    logo_path: "fca.png",
    duration: "December 2024 - Present",
    location: "Kakuma & Dadaab, Kenya",
    description: "Coordinates digital skills programme delivery.",
    achievements: [
      "500+ youth supported; approximately 70% are women and girls.",
      "Reported placement success in this role: 50%.",
    ],
  };
  ReactDOM.render(
    <ExperienceCard experience={item} index={0} totalCards={1} theme={theme} />,
    container
  );

  const achievementItems = [
    ...container.querySelectorAll(".experience-card-achievements li"),
  ];
  expect(achievementItems.map((node) => node.textContent)).toEqual(
    item.achievements
  );
  expect(
    container.querySelector(".experience-card-company").textContent
  ).toContain(item.company);
  ReactDOM.unmountComponentAtNode(container);
});
