import React, { useState, useEffect } from "react";
import "./App.css";
import Main from "./containers/Main";
import { ThemeProvider } from "styled-components";
import * as themes from "./theme";
import { GlobalStyles } from "./global";
import SimpleThemeSwitcher from "./components/themeSwitcher/SimpleThemeSwitcher";

function App() {
  const [currentTheme, setCurrentTheme] = useState("blueTheme");

  useEffect(() => {
    const saved = localStorage.getItem("portfolioTheme");
    if (saved && themes[saved]) setCurrentTheme(saved);
  }, []);

  const handleThemeChange = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem("portfolioTheme", themeName);
  };

  const theme = themes[currentTheme] || themes.blueTheme;

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyles />
        <SimpleThemeSwitcher
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
        />
        <Main theme={theme} />
      </>
    </ThemeProvider>
  );
}

export default App;
