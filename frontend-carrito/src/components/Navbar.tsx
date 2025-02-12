import type React from "react"
import { AppBar, Toolbar, Typography, Button, Badge } from "@mui/material"
import { ShoppingCart, Dashboard} from "@mui/icons-material"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/useCart"
import { supabase } from "../config/supabaseClient"


const Navbar: React.FC = () => {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const role = localStorage.getItem("role")
  

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
  // No mostrar en la página de login
  // if (location.pathname === "/") return null 

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
        <Button color="inherit" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

