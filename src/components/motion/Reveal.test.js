import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { Fade, Flip } from "./Reveal";

let container;
let originalIntersectionObserver;

beforeEach(() => {
  originalIntersectionObserver = window.IntersectionObserver;
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  if (originalIntersectionObserver) {
    window.IntersectionObserver = originalIntersectionObserver;
  } else {
    delete window.IntersectionObserver;
  }
});

test("Fade preserves the child root and applies a subtle bounded entrance class", () => {
  ReactDOM.render(
    <Fade bottom duration={900}>
      <section className="existing-class" style={{ color: "red" }}>
        Content
      </section>
    </Fade>,
    container
  );

  expect(container.children).toHaveLength(1);
  const section = container.querySelector("section");
  expect(section.className).toContain("existing-class");
  expect(section.className).toContain("motion-reveal--fade");
  expect(section.className).toContain("motion-reveal--bottom");
  expect(section.getAttribute("data-motion-duration")).toBe("460");
  expect(section.style.animationDuration).toBe("460ms");
  expect(section.style.color).toBe("red");
  expect(section.className).toContain("motion-reveal--visible");
});

test("Flip uses the same lightweight motion system without adding a wrapper", () => {
  ReactDOM.render(
    <Flip left duration={220}>
      <img alt="Project preview" src="/preview.png" />
    </Flip>,
    container
  );

  expect(container.children).toHaveLength(1);
  const image = container.querySelector("img");
  expect(image.className).toContain("motion-reveal--flip");
  expect(image.className).toContain("motion-reveal--left");
  expect(image.getAttribute("data-motion-duration")).toBe("220");
  expect(image.style.animationDuration).toBe("220ms");
});

test("scroll reveal activates once on intersection and disconnects on cleanup", () => {
  let intersectionCallback;
  const observe = jest.fn();
  const unobserve = jest.fn();
  const disconnect = jest.fn();
  window.IntersectionObserver = jest.fn((callback) => {
    intersectionCallback = callback;
    return { observe, unobserve, disconnect };
  });

  act(() => {
    ReactDOM.render(
      <Fade bottom duration={320} delay={90}>
        <section>Reveal on scroll</section>
      </Fade>,
      container
    );
  });

  const section = container.querySelector("section");
  expect(observe).toHaveBeenCalledWith(section);
  expect(section.className).toContain("motion-reveal--pending");
  expect(section.getAttribute("data-motion-delay")).toBe("90");
  expect(section.style.animationDelay).toBe("90ms");

  act(() => intersectionCallback([{ isIntersecting: true, target: section }]));
  expect(section.className).toContain("motion-reveal--visible");
  expect(unobserve).toHaveBeenCalledWith(section);

  act(() => {
    ReactDOM.unmountComponentAtNode(container);
  });
  expect(disconnect).toHaveBeenCalled();
});

test("leaves non-DOM siblings untouched while observing the native root", () => {
  const ComponentChild = () => null;
  const consoleError = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  ReactDOM.render(
    <Fade bottom>
      <ComponentChild />
      <section>Native content</section>
    </Fade>,
    container
  );

  expect(container.querySelector("section").className).toContain(
    "motion-reveal"
  );
  expect(consoleError).not.toHaveBeenCalled();
  consoleError.mockRestore();
});
