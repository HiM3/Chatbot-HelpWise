// src/components/Mode.jsx
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Mode = ({ darkMode, setDarkMode }) => {
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    // The body class is handled in ChatbotApp.jsx or can be managed directly with Tailwind's dark mode classes
    // document.body.className = !darkMode ? "dark" : "light"; 
  };

  return (
    <button 
      className="bg-transparent border-none text-base flex items-center gap-2 cursor-pointer text-inherit transition-colors duration-200 hover:text-[#4e7cff]"
      onClick={toggleTheme}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
};

export default Mode;
