import React, { useState, useEffect } from "react";
import "./ThemeSwitcher.css";

const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { name: "Blue", value: "blueTheme", emoji: "🔵" },
    { name: "Material Teal", value: "materialTealTheme", emoji: "🌊" },
    { name: "Material Light", value: "materialLightTheme", emoji: "☀️" },
    { name: "Teal", value: "tealTheme", emoji: "💎" },
    { name: "Purple", value: "purpleTheme", emoji: "💜" },
    { name: "Violet", value: "violetTheme", emoji: "🟣" },
    { name: "Pink", value: "pinkTheme", emoji: "🌸" },
    { name: "Red", value: "redTheme", emoji: "🔴" },
    { name: "Orange", value: "orangeTheme", emoji: "🟠" },
    { name: "Green", value: "greenTheme", emoji: "🟢" },
    { name: "Brown", value: "brownTheme", emoji: "🟤" },
    { name: "Black", value: "blackTheme", emoji: "⚫" },
    { name: "Dark Mode", value: "materialDarkTheme", emoji: "🌙" },
  ];

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolioTheme");
    if (savedTheme && onThemeChange) {
      onThemeChange(savedTheme);
    }
  }, [onThemeChange]);

  const handleThemeSelect = (themeValue) => {
    localStorage.setItem("portfolioTheme", themeValue);
    onThemeChange(themeValue);
    setIsOpen(false);
  };

  const getCurrentThemeName = () => {
    const theme = themes.find((t) => t.value === currentTheme);
    return theme ? `${theme.emoji} ${theme.name}` : "🔵 Blue";
  };

  return (
    <div className="theme-switcher">
      <button
        className="theme-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change color theme"
        aria-expanded={isOpen}
      >
        <span className="theme-icon">🎨</span>
        <span className="theme-name">{getCurrentThemeName()}</span>
        <span className="theme-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown">
          <div className="theme-dropdown-header">
            <h3>Choose Theme</h3>
            <p className="theme-subtitle">Select your preferred color scheme</p>
          </div>
          <div className="theme-grid">
            {themes.map((theme) => (
              <button
                key={theme.value}
                className={`theme-option ${
                  currentTheme === theme.value ? "active" : ""
                }`}
                onClick={() => handleThemeSelect(theme.value)}
                aria-label={`Switch to ${theme.name} theme`}
              >
                <span className="theme-option-emoji">{theme.emoji}</span>
                <span className="theme-option-name">{theme.name}</span>
                {currentTheme === theme.value && (
                  <span className="theme-check">✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="theme-dropdown-footer">
            <small>Theme preference is saved automatically</small>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="theme-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
