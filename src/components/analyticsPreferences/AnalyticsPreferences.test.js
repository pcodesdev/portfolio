import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import AnalyticsPreferences from "./AnalyticsPreferences";

let container;

beforeEach(() => {
  localStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<AnalyticsPreferences />, container);
  });
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  document.getElementById("portfolio-analytics-script")?.remove();
  delete window.gtag;
  delete window.dataLayer;
});

test("declining hides the prompt without loading analytics and allows reopening", () => {
  expect(document.getElementById("portfolio-analytics-script")).toBeNull();
  act(() => container.querySelectorAll("button")[1].click());
  expect(container.querySelector("aside")).toBeNull();
  expect(localStorage.getItem("portfolio-analytics-consent")).toBe("declined");
  expect(document.getElementById("portfolio-analytics-script")).toBeNull();
  act(() => {
    window.dispatchEvent(new Event("open-analytics-preferences"));
  });
  expect(container.querySelector("aside")).not.toBeNull();
});

test("allowing analytics loads the script and remembers the choice", () => {
  act(() => container.querySelector("button").click());
  expect(container.querySelector("aside")).toBeNull();
  expect(localStorage.getItem("portfolio-analytics-consent")).toBe("allowed");
  expect(document.getElementById("portfolio-analytics-script").src).toContain(
    "G-ZR4HM0S3MY"
  );
  act(() => {
    window.dispatchEvent(new Event("open-analytics-preferences"));
  });
  act(() => container.querySelectorAll("button")[1].click());
  expect(window["ga-disable-G-ZR4HM0S3MY"]).toBe(true);
});
