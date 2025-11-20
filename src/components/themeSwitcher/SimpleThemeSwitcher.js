import React, { useState } from "react";
import "./SimpleThemeSwitcher.css";

const SimpleThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: "Minimal", value: "techMinimalTheme" },
    { name: "Blue", value: "blueTheme" },
    { name: "Dark", value: "materialDarkTheme" },
  ];

  const handleThemeClick = (themeValue) => {
    onThemeChange(themeValue);
    setIsOpen(false);
  };

  return (
    <div className="simple-theme-switcher">
      <button
        className="theme-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
      >
        🎨
      </button>

      {isOpen && (
        <>
          <div className="theme-menu">
            {themes.map((theme) => (
              <button
                key={theme.value}
                className={`theme-item ${
                  currentTheme === theme.value ? "active" : ""
                }`}
                onClick={() => handleThemeClick(theme.value)}
              >
                {theme.name}
              </button>
            ))}
          </div>
          <div className="theme-backdrop" onClick={() => setIsOpen(false)} />
        </>
      )}
    </div>
  );
};

export default SimpleThemeSwitcher;
