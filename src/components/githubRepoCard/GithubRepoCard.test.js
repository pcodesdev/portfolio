import React from "react";
import ReactDOM from "react-dom";
import { act, Simulate } from "react-dom/test-utils";
import GithubRepoCard, { ProjectCardImage } from "./GithubRepoCard";

jest.mock("../motion/Reveal", () => ({ Fade: ({ children }) => children }));

const theme = {
  body: "#ffffff",
  text: "#172b4d",
  secondaryText: "#40566f",
};

function mount(element) {
  const container = document.createElement("div");
  act(() => {
    ReactDOM.render(element, container);
  });
  return container;
}

test("missing repository art starts with the project's custom illustration and alt text", () => {
  const container = mount(
    <ProjectCardImage
      repo={{
        id: "edumetrics",
        name: "EduMetrics",
        image: null,
        imageAlt: "Student analytics illustration",
        fallbackImage: "/images/projects/edumetrics.svg",
      }}
    />
  );
  const image = container.querySelector("img");

  expect(image.getAttribute("src")).toBe("/images/projects/edumetrics.svg");
  expect(image.alt).toBe("Student analytics illustration");
  expect(container.querySelector(".repo-card-media")).not.toBeNull();
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});

test("a failed repository image falls back to local art, then a stable placeholder", async () => {
  const container = mount(
    <ProjectCardImage
      repo={{
        id: "movie-app",
        name: "Movie App",
        image: "https://example.invalid/screenshot.png",
        fallbackImage: "/images/projects/movie-watchlist.svg",
      }}
    />
  );

  await act(async () => {
    Simulate.error(container.querySelector("img"));
    await Promise.resolve();
  });
  expect(container.querySelector("img").getAttribute("src")).toBe(
    "/images/projects/movie-watchlist.svg"
  );

  await act(async () => {
    Simulate.error(container.querySelector("img"));
    await Promise.resolve();
  });
  expect(container.querySelector("img").getAttribute("src")).toBe(
    "/images/projects/project-generic.svg"
  );

  await act(async () => {
    Simulate.error(container.querySelector("img"));
    await Promise.resolve();
  });
  expect(
    container.querySelector(".repo-card-image-placeholder").getAttribute("role")
  ).toBe("img");
  expect(container.querySelector("img")).toBeNull();
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});

test("project cards render the verified repository URL and summary", () => {
  const container = mount(
    <GithubRepoCard
      theme={theme}
      repo={{
        id: "edumetrics",
        name: "EduMetrics",
        createdAt: "2026-02-20T08:07:29Z",
        url: "https://github.com/pcodesdev/EduMetrics",
        description: "Assessment analytics",
        useCase: "Class insights",
        engineeringFocus: "Validated imports",
        projectType: "Original application",
        stack: "Python, React",
        image: null,
        fallbackImage: "/images/projects/edumetrics.svg",
        languages: [],
      }}
    />
  );

  const link = container.querySelector(
    'a[href="https://github.com/pcodesdev/EduMetrics"]'
  );
  expect(link).not.toBeNull();
  expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  expect(container.textContent).toContain("Assessment analytics");
  expect(container.querySelector(".repo-card-media img").alt).toContain(
    "EduMetrics"
  );
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});
