import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import AnalyticsConsent from "./AnalyticsConsent";

let root;

function renderWithId(id) {
  act(() => {
    ReactDOM.render(React.createElement(AnalyticsConsent, { id }), root);
  });
}

function click(text) {
  const button = Array.from(root.querySelectorAll("button")).find(
    (item) => item.textContent === text
  );
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

beforeEach(() => {
  root = document.createElement("div");
  document.body.appendChild(root);
  localStorage.clear();
  window.history.replaceState(null, "", "/#/");
  delete window.dataLayer;
  delete window.gtag;
});

afterEach(() => {
  act(() => {
    ReactDOM.unmountComponentAtNode(root);
  });
  root.remove();
  const script = document.getElementById("portfolio-ga4");
  if (script) script.remove();
});

test("does nothing without a configured measurement ID", () => {
  renderWithId("");
  expect(root.textContent).toBe("");
  expect(document.getElementById("portfolio-ga4")).toBeNull();
});

test("tracks routes only after consent and stops after withdrawal", () => {
  renderWithId("G-TEST123");
  expect(document.getElementById("portfolio-ga4")).toBeNull();
  click("Allow analytics");
  expect(root.querySelector("aside")).toBeNull();
  expect(document.getElementById("portfolio-ga4")).not.toBeNull();
  const views = () =>
    window.dataLayer.filter(
      (entry) => entry[0] === "event" && entry[1] === "page_view"
    );
  expect(views()).toHaveLength(1);
  act(() => {
    window.history.replaceState(null, "", "/#/projects?secret=ignored");
    window.dispatchEvent(new Event("hashchange"));
    window.dispatchEvent(new Event("hashchange"));
  });
  expect(views()).toHaveLength(2);
  expect(views()[1][2].page_location).not.toContain("secret");
  act(() => {
    window.dispatchEvent(new Event("open-analytics-preferences"));
  });
  click("Decline");
  expect(root.querySelector("aside")).toBeNull();
  expect(window["ga-disable-G-TEST123"]).toBe(true);
  act(() => {
    window.dispatchEvent(new Event("hashchange"));
  });
  expect(views()).toHaveLength(2);
  expect(localStorage.getItem("portfolio-analytics-consent")).toBe("denied");
});
