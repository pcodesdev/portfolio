import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import fs from "fs";
import path from "path";
import OpenSourceOverview from "./OpenSourceOverview";

jest.mock("../../containers/organizations/Organizations", () => () => (
  <div className="organizations-header-div">
    <h1>Open Source Contributions</h1>
  </div>
));

const theme = {
  body: "#ffffff",
  text: "#172b4d",
  secondaryText: "#40566f",
};

test("overview renders GitHub-backed summary cards, distributions, and author-filtered records", () => {
  const container = document.createElement("div");
  ReactDOM.render(<OpenSourceOverview theme={theme} />, container);

  expect(container.querySelectorAll(".opensource-summary-card")).toHaveLength(
    3
  );
  expect(container.querySelectorAll(".opensource-chart-card")).toHaveLength(2);
  expect(container.querySelectorAll(".opensource-record-card")).toHaveLength(
    18
  );
  expect(container.textContent).toContain("Issues Closed");
  expect(container.textContent).not.toContain("contribution-calendar");
  expect(container.textContent).not.toContain("Total Contributions");
  expect(container.textContent).toContain(
    "Stars across 307 repositories owned by pcodesdev"
  );
  expect(
    container.querySelectorAll(
      '[role="img"][aria-label*="Pull Request Distribution"], [role="img"][aria-label*="Issue Distribution"]'
    )
  ).toHaveLength(2);
  expect(container.textContent).toContain("GitHub profile: pcodesdev");
  expect(container.textContent).not.toContain("12 of 14 matching rows");
  expect(container.textContent).toContain(
    "unusually large diff; verify the PR details"
  );
  expect(container.querySelectorAll(".opensource-activity")).toHaveLength(0);
  expect(
    container.querySelectorAll(".opensource-repository-contributions")
  ).toHaveLength(0);
  expect(container.querySelector(".opensource-data-note")).toBeNull();
  expect(container.textContent).not.toContain("Stale cached data");
  expect(container.querySelectorAll(".opensource-legend li")).toHaveLength(5);
  expect(container.querySelectorAll(".opensource-chart-total")).toHaveLength(2);
  expect(
    container.querySelectorAll('.opensource-record-card a[href*="github.com/"]')
  ).toHaveLength(18);

  ReactDOM.unmountComponentAtNode(container);
});

test("summary and chart card surfaces inherit the active theme", () => {
  const container = document.createElement("div");
  ReactDOM.render(<OpenSourceOverview theme={theme} />, container);

  expect(
    container.querySelector(".opensource-summary-card").style.backgroundColor
  ).toBe("rgb(255, 255, 255)");
  expect(
    container.querySelector(".opensource-chart-card").style.backgroundColor
  ).toBe("rgb(255, 255, 255)");
  ReactDOM.unmountComponentAtNode(container);
});

test("overview stylesheet includes tablet and mobile responsive layouts", () => {
  const css = fs.readFileSync(
    path.join(__dirname, "OpenSourceOverview.css"),
    "utf8"
  );
  expect(css).toContain("@media (max-width: 900px)");
  expect(css).toContain("@media (max-width: 560px)");
  expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))");
  expect(css).toContain("grid-template-columns: 1fr");
});

test("scans dynamically rendered summary glyphs with the available Iconify runtime", () => {
  const container = document.createElement("div");
  const previousIconify = window.Iconify;
  const scanDOM = jest.fn();
  window.Iconify = { scanDOM };

  act(() => {
    ReactDOM.render(<OpenSourceOverview theme={theme} />, container);
  });

  expect(scanDOM).toHaveBeenCalledWith(
    container.querySelector(".opensource-page")
  );
  expect(container.querySelectorAll(".opensource-summary-icon")).toHaveLength(
    3
  );

  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  if (previousIconify) window.Iconify = previousIconify;
  else delete window.Iconify;
});
