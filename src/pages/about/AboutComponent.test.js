import React from "react";
import ReactDOM from "react-dom";
import AboutComponent from "./AboutComponent";

jest.mock("../../components/header/Header", () => () => null);
jest.mock("../../components/footer/Footer", () => () => null);
jest.mock("../../components/topButton/TopButton", () => () => null);

test("About renders the planning-stage EdTech initiative and illustration", () => {
  const container = document.createElement("div");
  ReactDOM.render(
    <AboutComponent theme={{ text: "#172b4d", secondaryText: "#40566f" }} />,
    container
  );

  expect(container.querySelector("h1").textContent).toBe(
    "Technology grounded in people and practice"
  );
  expect(container.textContent).toContain("EdTech solution in planning");
  expect(container.textContent.toLowerCase()).toContain(
    "planning/conceptual stage only"
  );
  expect(container.textContent).toContain("learners are not yet using it");
  expect(container.querySelector(".about-biography-image img")).not.toBeNull();
  ReactDOM.unmountComponentAtNode(container);
});
