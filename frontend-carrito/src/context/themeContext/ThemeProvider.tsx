import { useState, useEffect } from "react"
import { ThemeContext } from "./ThemeContext"

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme")
    return savedTheme === "dark"
  })

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}