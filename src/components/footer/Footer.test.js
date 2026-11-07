import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Footer from "./Footer";

jest.mock("../motion/Reveal", () => ({ Fade: ({ children }) => children }));

test("footer links the exact pemahtech.com brand and preserves its other content", () => {
  const container = document.createElement("div");
  act(() => {
    ReactDOM.render(<Footer theme={{ secondaryText: "#40566f" }} />, container);
  });

  const link = container.querySelector(".footer-brand-link");
  expect(link.textContent).toBe("pemahtech.com");
  expect(link.href).toBe("https://pemahtech.com/");
  expect(container.textContent).toMatch(
    /^Made with\s*❤️\s*by\s*pemahtech\.com\s*©\s*\d{4}$/
  );

  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
});
