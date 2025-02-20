"use client"
import { createContext } from "react"

type ThemeContextType = {
  darkMode: boolean
  toggleDarkMode: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
