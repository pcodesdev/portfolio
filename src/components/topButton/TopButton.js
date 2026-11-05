import React, { useEffect, useRef } from "react";
import "./TopButton.css";

export default function TopButton({ theme }) {
  const topButtonRef = useRef(null);
  const arrowRef = useRef(null);

  function GoUpEvent() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  useEffect(() => {
    function scrollFunction() {
      const topButton = topButtonRef.current;
      if (!topButton) return;

      topButton.style.visibility =
        document.body.scrollTop > 30 || document.documentElement.scrollTop > 30
          ? "visible"
          : "hidden";
    }

    window.addEventListener("scroll", scrollFunction);
    return () => window.removeEventListener("scroll", scrollFunction);
  }, []);

  const setHoverColors = (color, bgColor) => {
    const topButton = topButtonRef.current;
    const arrow = arrowRef.current;
    if (!topButton || !arrow) return;

    topButton.style.color = color;
    topButton.style.backgroundColor = bgColor;
    arrow.style.color = color;
    arrow.style.backgroundColor = bgColor;
  };

  return (
    <button
      ref={topButtonRef}
      type="button"
      onClick={GoUpEvent}
      id="topButton"
      aria-label="Back to top"
      style={{
        color: theme.body,
        backgroundColor: theme.text,
        border: `solid 1px ${theme.text}`,
      }}
      title="Go up"
      onMouseEnter={() => setHoverColors(theme.text, theme.body)}
      onMouseLeave={() => setHoverColors(theme.body, theme.text)}
    >
      <i
        className="fas fa-arrow-up"
        id="arrow"
        ref={arrowRef}
        aria-hidden="true"
      />
    </button>
  );
}
