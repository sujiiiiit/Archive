import { useState, useEffect } from "react";

const Header = () => {
  // Get system theme preference using prefers-color-scheme
  const getSystemThemePreference = () => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDarkMode ? "dark" : "light";
  };

  // Get initial theme, prioritizing local storage over system preference
  const getInitialTheme = () => {
    try {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme || getSystemThemePreference(); // Use system theme if no theme is stored
    } catch (error) {
      console.error("Error retrieving theme from local storage:", error);
      return getSystemThemePreference(); // Use system theme if local storage retrieval fails
    }
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode === "dark"); // Apply theme class to body
    localStorage.setItem("theme", darkMode); // Save theme to local storage
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <header className="flex items-center bg-transparent p-4 px-5 font-SyoogBold">
      <div
        className={`text-2xl sm:text-3xl dark:text-white text-black font-bold`}
      >
        /Developer
      </div>
      <button
        onClick={toggleDarkMode}
        className="flex align-middle items-center justify-center ml-auto bg-transparent outline-none focus:outline-none border-none"
        style={{ border: "none" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 xs:w-6 xs:h-6 fill-black	dark:fill-white "
          viewBox="0 0 256 256"
        >
          {darkMode === "light" ? (
            <path d="M124,40V16a4,4,0,0,1,8,0V40a4,4,0,0,1-8,0Zm64,88a60,60,0,1,1-60-60A60.07,60.07,0,0,1,188,128Zm-8,0a52,52,0,1,0-52,52A52.06,52.06,0,0,0,180,128ZM61.17,66.83a4,4,0,0,0,5.66-5.66l-16-16a4,4,0,0,0-5.66,5.66Zm0,122.34-16,16a4,4,0,0,0,5.66,5.66l16-16a4,4,0,0,0-5.66-5.66ZM192,68a4,4,0,0,0,2.83-1.17l16-16a4,4,0,1,0-5.66-5.66l-16,16A4,4,0,0,0,192,68Zm2.83,121.17a4,4,0,0,0-5.66,5.66l16,16a4,4,0,0,0,5.66-5.66ZM40,124H16a4,4,0,0,0,0,8H40a4,4,0,0,0,0-8Zm88,88a4,4,0,0,0-4,4v24a4,4,0,0,0,8,0V216A4,4,0,0,0,128,212Zm112-88H216a4,4,0,0,0,0,8h24a4,4,0,0,0,0-8Z"></path>
          ) : (
            <path d="M230.72,145.06a4,4,0,0,0-4-1A92.08,92.08,0,0,1,111.94,29.27a4,4,0,0,0-5-5A100.78,100.78,0,0,0,56.08,59.88a100,100,0,0,0,140,140,100.78,100.78,0,0,0,35.59-50.87A4,4,0,0,0,230.72,145.06ZM191.3,193.53A92,92,0,0,1,62.47,64.7a93,93,0,0,1,39.88-30.35,100.09,100.09,0,0,0,119.3,119.3A93,93,0,0,1,191.3,193.53Z"></path>
          )}
        </svg>
      </button>
    </header>
  );
};

export default Header;
