import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import TechnologySkills from "./TechnologySkills";

jest.mock("../motion/Reveal", () => ({ Fade: ({ children }) => children }));

const theme = {
  body: "#ffffff",
  text: "#172b4d",
  secondaryText: "#40566f",
  dark: "#001c55",
};

test("technology icons have visible captions and keyboard-readable tooltip descriptions", () => {
  const container = document.createElement("div");
  const previousIconify = window.Iconify;
  const scanDOM = jest.fn();
  window.Iconify = { scanDOM };
  act(() => {
    ReactDOM.render(<TechnologySkills theme={theme} />, container);
  });

  expect(container.querySelector("h2").textContent).toBe(
    "Technologies, Tools & Professional Skills"
  );
  expect(container.querySelectorAll(".technology-category")).toHaveLength(8);
  expect(container.textContent).toContain("AI Engineering & Implementation");
  expect(container.textContent).not.toContain("not AI engineering");

  const aiEngineering = Array.from(
    container.querySelectorAll(".technology-icon-tile")
  ).find(
    (tile) =>
      tile.getAttribute("aria-label") ===
      "AI Engineering professional competency"
  );
  expect(aiEngineering).not.toBeUndefined();
  expect(aiEngineering.title).toBe("AI Engineering");
  expect(aiEngineering.querySelector('[role="tooltip"]').textContent).toBe(
    "AI Engineering"
  );

  const openAi = Array.from(
    container.querySelectorAll(".technology-icon-tile")
  ).find(
    (tile) => tile.getAttribute("aria-label") === "ChatGPT / OpenAI technology"
  );
  expect(openAi).not.toBeUndefined();
  expect(openAi.tabIndex).toBe(0);
  expect(openAi.title).toBe("ChatGPT / OpenAI");
  expect(openAi.querySelector(".technology-icon-name").textContent).toBe(
    "ChatGPT / OpenAI"
  );
  expect(openAi.getAttribute("aria-describedby")).toBe(
    openAi.querySelector('[role="tooltip"]').id
  );
  expect(scanDOM).toHaveBeenCalledWith(
    container.querySelector(".technology-skills-section")
  );

  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  if (previousIconify) window.Iconify = previousIconify;
  else delete window.Iconify;
});
