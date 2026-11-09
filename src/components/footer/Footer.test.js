import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Footer from "./Footer";
import { degrees } from "../../portfolio";

jest.mock("../motion/Reveal", () => ({ Fade: ({ children }) => children }));

test("professional footer shows copyright, brand link, and analytics preferences", () => {
  const container = document.createElement("div");
  act(() => {
    ReactDOM.render(<Footer theme={{ secondaryText: "#40566f" }} />, container);
  });

  const link = container.querySelector(".footer-brand-link");
  expect(link.textContent).toBe("pemahtech.com");
  expect(link.href).toBe("https://pemahtech.com/");
  expect(container.querySelector("footer")).not.toBeNull();
  expect(container.querySelector(".footer-attribution").textContent).toMatch(
    /Portfolio designed and developed by pemahtech\.com/
  );
  expect(container.textContent).not.toContain("❤️");
  expect(container.textContent).toContain("AI engineering and implementation");
  expect(container.textContent).toContain("Programme coordination");
  expect(container.textContent).toContain("Open to");
  expect(
    container.querySelector('.footer-contact-link[href="#/contact"]')
  ).not.toBeNull();
  expect(container.querySelector(".footer-copyright").textContent).toMatch(
    /^©\s*\d{4}\s*Peter Njuguna$/
  );
  expect(container.querySelector(".analytics-settings-link").textContent).toBe(
    "Analytics preferences"
  );
  expect(degrees.degrees[0].website_link).toBe(
    "https://scrimba.com/u017h29:certs"
  );

  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});
