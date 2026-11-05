import React from "react";
import ReactDOM from "react-dom";
import Opensource from "./Opensource";

jest.mock("../../components/header/Header", () => () => null);
jest.mock("../../components/footer/Footer", () => () => null);
jest.mock("../../components/topButton/TopButton", () => () => null);

test("Open Source route restores summary and distribution layout without unsupported totals", () => {
  const container = document.createElement("div");
  ReactDOM.render(
    <Opensource theme={{ text: "#172b4d", secondaryText: "#40566f" }} />,
    container
  );

  expect(container.querySelectorAll("h1")).toHaveLength(1);
  expect(container.querySelector("h1").textContent).toBe(
    "Open Source Contributions"
  );
  expect(container.querySelectorAll(".opensource-summary-card")).toHaveLength(
    3
  );
  expect(container.querySelectorAll(".opensource-chart-card")).toHaveLength(2);
  expect(container.querySelectorAll(".opensource-record-card")).toHaveLength(
    18
  );
  expect(container.textContent).toContain("Pull Request Distribution");
  expect(container.textContent).toContain("Issue Distribution");
  expect(
    container.querySelectorAll(
      '[role="img"][aria-label*="Pull Request Distribution"], [role="img"][aria-label*="Issue Distribution"]'
    )
  ).toHaveLength(2);
  expect(container.textContent).toContain("author attribution is verified");
  expect(
    container.querySelector('a[href="https://github.com/pcodesdev"]')
  ).not.toBeNull();
  expect(container.textContent).not.toContain("Total Contributions");
  expect(container.textContent).toContain("Pull Requests");
  expect(container.textContent).toContain("Issues Closed");
  expect(container.textContent).toContain("Stars Earned");
  expect(container.textContent).not.toContain("PR_golclinics");
  expect(container.textContent).not.toContain("I_ashutosh1919");
  expect(container.querySelector(".opensource-data-note")).toBeNull();
  expect(container.textContent).not.toContain("Stale cached data");
  expect(container.textContent).not.toContain("Last successful retrieval:");

  ReactDOM.unmountComponentAtNode(container);
});
