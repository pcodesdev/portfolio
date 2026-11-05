import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import PortfolioSearch from "./PortfolioSearch";

const theme = {
  body: "#ffffff",
  text: "#172b4d",
  secondaryText: "#40566f",
};
let container;
let originalFetch;

function mount(props = {}) {
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<PortfolioSearch theme={theme} {...props} />, container);
  });
}

async function openSearch() {
  await act(async () => {
    container.querySelector(".portfolio-search-open").click();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function setQuestion(value) {
  const input = container.querySelector("#portfolio-question");
  act(() => {
    input.value = value;
    Simulate.change(input, { target: { value } });
  });
}

async function submitQuestion() {
  const form = container.querySelector(".portfolio-search-form");
  await act(async () => {
    Simulate.submit(form, { preventDefault: jest.fn() });
    await Promise.resolve();
  });
}

beforeEach(() => {
  originalFetch = global.fetch;
});

afterEach(() => {
  if (container) {
    act(() => {
      ReactDOM.unmountComponentAtNode(container);
    });
    container.remove();
  }
  if (originalFetch === undefined) delete global.fetch;
  else global.fetch = originalFetch;
});

test("search entry is available globally and local fallback returns source-linked results", async () => {
  const fetchSpy = jest.fn();
  global.fetch = fetchSpy;
  mount();
  expect(
    container.querySelector(".portfolio-search-open").textContent
  ).toContain("Ask My Portfolio");
  await openSearch();
  expect(container.querySelector('[role="dialog"]')).not.toBeNull();
  expect(container.textContent).toContain(
    "Explore my experience, projects, skills, and professional background using AI."
  );
  setQuestion("What project management experience does Peter have?");
  await submitQuestion();

  expect(container.querySelector('[role="status"]').textContent).toContain(
    "AI answers are not connected"
  );
  expect(
    container.querySelector(".portfolio-search-answer").textContent
  ).toContain("Project Management");
  expect(container.querySelector('a[href="/#/expertise"]')).not.toBeNull();
  expect(fetchSpy).not.toHaveBeenCalled();
});

test("unsupported local questions return a clear no-information message", async () => {
  mount();
  await openSearch();
  setQuestion("What is Peter's favorite black hole?");
  await submitQuestion();

  expect(container.querySelector('[role="status"]').textContent).toContain(
    "No relevant information"
  );
  expect(container.querySelector(".portfolio-search-answer")).toBeNull();
});

test("AI endpoint shows loading and renders grounded answer with its source", async () => {
  mount({ endpoint: "https://search.example/api/ask" });
  let resolveResponse;
  global.fetch = jest.fn(
    () =>
      new Promise((resolve) => {
        resolveResponse = resolve;
      })
  );
  await openSearch();
  setQuestion("Tell me about Pemanju Farm Manager.");
  let pending;
  await act(async () => {
    pending = submitQuestion();
    await Promise.resolve();
  });
  expect(container.querySelector('[role="status"]').textContent).toContain(
    "Searching"
  );
  await act(async () => {
    resolveResponse({
      ok: true,
      json: async () => ({
        answer:
          "Pemanju Farm Manager is an offline-first livestock records application.",
        sources: [
          {
            id: "pemanju",
            title: "Pemanju Farm Manager Case Study",
            url: "/#/projects",
          },
        ],
      }),
    });
    await pending;
  });

  expect(
    container.querySelector(".portfolio-search-answer").textContent
  ).toContain("offline-first");
  expect(
    container.querySelector('a[href="/#/projects"]').textContent
  ).toContain("Pemanju");
  expect(container.querySelector('[role="status"]').textContent).toContain(
    "AI answer grounded"
  );
});

test("AI endpoint failures preserve keyword results and report fallback", async () => {
  mount({ endpoint: "https://search.example/api/ask" });
  global.fetch = jest.fn().mockRejectedValue(new Error("network error"));
  await openSearch();
  setQuestion("What AI engineering skills does Peter have?");
  await submitQuestion();

  expect(container.querySelector('[role="status"]').textContent).toContain(
    "showing matching portfolio content"
  );
  expect(
    container.querySelector(".portfolio-search-answer").textContent
  ).toContain("AI Engineering");
});

test("AI endpoint abstention shows the no-information state instead of an error", async () => {
  mount({ endpoint: "https://search.example/api/ask" });
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ answer: "", sources: [] }),
  });
  await openSearch();
  setQuestion("What is Peter's favorite black hole?");
  await submitQuestion();

  expect(container.querySelector('[role="status"]').textContent).toContain(
    "No relevant information"
  );
  expect(container.querySelector(".portfolio-search-answer")).toBeNull();
});

test("Escape closes the dialog and restores focus to the opener", async () => {
  mount();
  const opener = container.querySelector(".portfolio-search-open");
  await openSearch();
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
  });

  expect(container.querySelector('[role="dialog"]')).toBeNull();
  expect(document.activeElement).toBe(opener);
});

test("Tab navigation wraps within the search dialog", async () => {
  mount();
  await openSearch();
  const dialog = container.querySelector('[role="dialog"]');
  const focusable = dialog.querySelectorAll(
    "button:not([disabled]), input:not([disabled]), a[href]"
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  act(() => {
    last.focus();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true })
    );
  });
  expect(document.activeElement).toBe(first);

  act(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Tab",
        shiftKey: true,
        bubbles: true,
      })
    );
  });
  expect(document.activeElement).toBe(last);
});
