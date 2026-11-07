import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import OpenSourceShowcase from "./OpenSourceShowcase";

jest.mock("../../components/motion/Reveal", () => ({
  Fade: ({ children }) => children,
}));

const theme = {
  body: "#ffffff",
  text: "#172b4d",
  secondaryText: "#40566f",
};

test("Open Source showcase renders publications without featured project cards", () => {
  const container = document.createElement("div");

  act(() => {
    ReactDOM.render(<OpenSourceShowcase theme={theme} />, container);
  });

  expect(container.querySelector("#featured-projects-heading")).toBeNull();
  expect(container.textContent).not.toContain("Featured GitHub Projects");
  expect(container.querySelector("#articles-heading")).not.toBeNull();
  expect(container.querySelectorAll(".repo-card-div")).toHaveLength(0);
  expect(container.querySelectorAll(".publication-card-div")).toHaveLength(6);
  expect(
    container.querySelectorAll(".showcase-grid--articles article")
  ).toHaveLength(6);
  expect(container.textContent).toContain("Read more on Medium");

  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});
