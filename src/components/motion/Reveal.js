import React from "react";
import "./reveal.css";

const MAX_DURATION_MS = 460;
const MAX_DELAY_MS = 240;

function shouldRevealImmediately() {
  if (typeof window === "undefined" || !window.IntersectionObserver)
    return true;
  return Boolean(
    window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function normalizedDuration(duration) {
  const parsed = Number(duration);
  if (!Number.isFinite(parsed) || parsed <= 0) return 340;
  return Math.min(parsed, MAX_DURATION_MS);
}

function normalizedDelay(delay) {
  const parsed = Number(delay);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.min(parsed, MAX_DELAY_MS);
}

function Motion({ children, kind, direction, duration, delay }) {
  const nodeRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(shouldRevealImmediately);

  React.useEffect(() => {
    const node = nodeRef.current;
    if (!node || shouldRevealImmediately()) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { rootMargin: "0px 0px -24px 0px", threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child) || typeof child.type !== "string")
      return child;
    const className = [
      child.props.className,
      "motion-reveal",
      `motion-reveal--${kind}`,
      direction ? `motion-reveal--${direction}` : "",
      isVisible ? "motion-reveal--visible" : "motion-reveal--pending",
    ]
      .filter(Boolean)
      .join(" ");

    return React.cloneElement(child, {
      className,
      "data-motion-duration": normalizedDuration(duration),
      "data-motion-delay": normalizedDelay(delay),
      ref: (node) => {
        nodeRef.current = node;
        if (typeof child.ref === "function") child.ref(node);
        else if (child.ref) child.ref.current = node;
      },
      style: {
        ...child.props.style,
        animationDuration: `${normalizedDuration(duration)}ms`,
        animationDelay: `${normalizedDelay(delay)}ms`,
      },
    });
  });
}

export function Fade({ children, top, bottom, left, right, duration, delay }) {
  const direction = top
    ? "top"
    : left
    ? "left"
    : right
    ? "right"
    : bottom
    ? "bottom"
    : "still";

  return (
    <Motion kind="fade" direction={direction} duration={duration} delay={delay}>
      {children}
    </Motion>
  );
}

export function Flip({ children, left, right, duration, delay }) {
  const direction = left ? "left" : right ? "right" : "still";
  return (
    <Motion kind="flip" direction={direction} duration={duration} delay={delay}>
      {children}
    </Motion>
  );
}
