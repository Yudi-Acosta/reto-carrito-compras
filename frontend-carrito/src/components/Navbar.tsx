import type React from "react"
import { AppBar, Toolbar, Typography, Button, Badge, IconButton } from "@mui/material"
import { ShoppingCart, Dashboard, Brightness4, Brightness7} from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/cartContext/useCart"
import { useTheme } from "../context/themeContext/useTheme"
import { supabase } from "../config/supabaseClient"


const Navbar: React.FC = () => {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  const { darkMode, toggleDarkMode } = useTheme()
  

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Error al cerrar sesión:", error.message)
    } else {
      localStorage.removeItem("role"); // Eliminar el rol del localStorage
      console.log("Sesión cerrada correctamente")
      navigate("/login")
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mi Tienda
        </Typography>
        <Button color="inherit" component={Link} to="/catalog">
          Catálogo
        </Button>
        <Button color="inherit" component={Link} to="/cart">
          <Badge badgeContent={getTotalItems()} color="secondary">
            <ShoppingCart />
          </Badge>
        </Button>
        {role === "administrador" && (
          <Button color="inherit" component={Link} to="/admin">
            <Dashboard sx={{ mr: 1 }} />
            Panel de Administración
          </Button>
        )}

        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Button color="inherit" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

