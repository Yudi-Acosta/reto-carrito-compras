import type React from "react"
import { useEffect } from "react"
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Select, MenuItem, SelectChangeEvent, useTheme as useMuiTheme} from "@mui/material"
import { ShoppingCart, Dashboard, Brightness4, Brightness7} from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/cartContext/useCart"
import { useTheme } from "../context/themeContext/useTheme"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/authContext/useAuth"


const Navbar: React.FC = () => {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode } = useTheme()
  const { t, i18n } = useTranslation()
  const theme = useMuiTheme()
  const { role, setUser, setRole } = useAuth()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        setUser(null)
        setRole(null)
        navigate("/login")
      } else {
        console.error(`Error al cerrar sesión: ${response.status}`)
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const newLang = event.target.value
    i18n.changeLanguage(newLang)
  }

  return (
    <AppBar position="static" sx={{ bgcolor: theme.palette.mode === 'dark' ? "#1E3A8A" : "primary.main" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t("navbar.title")}
        </Typography>
        <Button color="inherit" component={Link} to="/catalog">
          {t("navbar.catalog")}
        </Button>

        <Button color="inherit" component={Link} to="/cart">
          <Badge badgeContent={getTotalItems()} color="secondary">
            <ShoppingCart />
          </Badge>
        </Button>

        {role === "administrador" && (
          <Button color="inherit" component={Link} to="/admin">
            <Dashboard sx={{ mr: 1 }} />
            {t("navbar.adminPanel")}
          </Button>
        )}

        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Select value={i18n.language} onChange={handleLanguageChange} sx={{ color: "inherit", marginLeft: 2 }}>
          <MenuItem value="es">{t("language.es")}</MenuItem>
          <MenuItem value="en">{t("language.en")}</MenuItem>
        </Select>

        <Button color="inherit" onClick={handleLogout}>
          {t("navbar.logout")}
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

