import React from "react";
import ReactDOM from "react-dom";
import SocialMedia from "./SocialMedia";
import { socialMediaLinks } from "../../portfolio";

test("shared social links expose an accessible X icon and the correct profile URL", () => {
  const container = document.createElement("div");
  ReactDOM.render(<SocialMedia theme={{ text: "#172b4d" }} />, container);
  const xLink = container.querySelector('a[aria-label="X-Twitter"]');

  expect(xLink).not.toBeNull();
  expect(xLink.href).toBe("https://twitter.com/pcodesdev");
  expect(xLink.target).toBe("_blank");
  expect(xLink.rel).toBe("noopener noreferrer");
  expect(xLink.querySelector("svg path")).not.toBeNull();
  expect(xLink.querySelector("i")).toBeNull();
  expect(xLink.style.textDecoration).toBe("none");
  expect(xLink.querySelector("svg").style.textDecoration).toBe("none");
  expect(container.querySelectorAll(".icon-button")).toHaveLength(
    socialMediaLinks.length
  );
  ReactDOM.unmountComponentAtNode(container);
});
