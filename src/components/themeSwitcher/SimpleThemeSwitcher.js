import React, { useEffect, useRef, useState } from "react";
import "./SimpleThemeSwitcher.css";

const SimpleThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const themeButtonRef = useRef(null);

  const closeMenu = () => {
    setIsOpen(false);
    if (themeButtonRef.current) themeButtonRef.current.focus();
  };

  const themes = [
    { name: "Minimal", value: "techMinimalTheme" },
    { name: "Blue", value: "blueTheme" },
    { name: "Dark", value: "materialDarkTheme" },
  ];

  const handleThemeClick = (themeValue) => {
    onThemeChange(themeValue);
    closeMenu();
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        if (themeButtonRef.current) themeButtonRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="simple-theme-switcher">
      <button
        ref={themeButtonRef}
        className="theme-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "theme-menu" : undefined}
      >
        <span aria-hidden="true">🎨</span>
      </button>

      {isOpen && (
        <>
          <div
            className="theme-menu"
            id="theme-menu"
            role="group"
            aria-label="Choose a color theme"
          >
            {themes.map((theme) => (
              <button
                key={theme.value}
                className={`theme-item ${
                  currentTheme === theme.value ? "active" : ""
                }`}
                aria-pressed={currentTheme === theme.value}
                onClick={() => handleThemeClick(theme.value)}
              >
                {theme.name}
              </button>
            ))}
          </div>
          <button
            className="theme-backdrop"
            type="button"
            aria-label="Close theme menu"
            onClick={closeMenu}
          />
        </>
      )}
    </div>
  );
};

export default SimpleThemeSwitcher;
