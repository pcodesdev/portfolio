import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import PublicationCard from "./PublicationCard";

jest.mock("../motion/Reveal", () => ({ Fade: ({ children }) => children }));

test("publication card renders its title, date, canonical URL, and cover alt text", () => {
  const container = document.createElement("div");
  const article = {
    id: "post-123",
    name: "Practical Technology Adoption",
    description: "An article about technology adoption in real settings.",
    createdAt: "2026-01-24T09:14:47.000Z",
    url: "https://medium.com/@pcodesdev/practical-technology-adoption-post-123",
    image: "https://cdn-images-1.medium.com/cover.png",
  };
  act(() => {
    ReactDOM.render(
      <PublicationCard
        pub={article}
        theme={{ body: "#fff", text: "#172b4d", secondaryText: "#40566f" }}
      />,
      container
    );
  });

  const link = container.querySelector(`a[href="${article.url}"]`);
  expect(link).not.toBeNull();
  expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  expect(link.getAttribute("aria-label")).toContain(article.name);
  expect(container.textContent).toContain(article.name);
  expect(container.textContent).toContain("2026-01-24");
  expect(container.querySelector("img").alt).toContain(article.name);
  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});
