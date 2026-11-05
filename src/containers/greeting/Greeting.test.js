import React from "react";
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import Greeting from "./Greeting";

test("home portrait uses responsive optimized sources and eager loading", () => {
  const container = document.createElement("div");
  ReactDOM.render(
    <MemoryRouter>
      <Greeting theme={{ text: "#172b4d", secondaryText: "#40566f" }} />
    </MemoryRouter>,
    container
  );

  const image = container.querySelector('img[alt="Peter Njuguna Smiling"]');
  expect(image.getAttribute("src")).toContain("Peter-Portfolio-960");
  expect(image.getAttribute("srcset")).toContain("480w");
  expect(image.getAttribute("srcset")).toContain("960w");
  expect(image.getAttribute("sizes")).toBe("(max-width: 768px) 90vw, 42vw");
  expect(image.getAttribute("loading")).toBe("eager");
  expect(image.getAttribute("fetchpriority")).toBe("high");
  expect(image.getAttribute("width")).toBe("960");
  expect(image.getAttribute("height")).toBe("960");

  ReactDOM.unmountComponentAtNode(container);
});
