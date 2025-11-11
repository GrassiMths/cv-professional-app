import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("cv-professional-theme");
    return saved ? saved === "dark" : false;
  });

  useEffect(() => {
    localStorage.setItem("cv-professional-theme", isDark ? "dark" : "light");
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );

    document.body.classList.add("theme-transition");
    const timer = setTimeout(() => {
      document.body.classList.remove("theme-transition");
    }, 300);

    return () => clearTimeout(timer);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
