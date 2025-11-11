import { useTheme } from "../ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        id="theme-switch"
      />
      <label htmlFor="theme-switch" className="theme-slider">
        <FaSun className="theme-icon sun" />
        <FaMoon className="theme-icon moon" />
      </label>
    </div>
  );
};

export default ThemeToggle;
