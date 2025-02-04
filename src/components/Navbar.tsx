import type React from "react"
import { AppBar, Toolbar, Typography, Button, Badge } from "@mui/material"
import { ShoppingCart } from "@mui/icons-material"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useCart } from "../context/useCart"


const Navbar: React.FC = () => {
  const { getTotalItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    // Aquí iría la lógica para cerrar sesión
    navigate("/")
  }

  if (location.pathname === "/") return null // No mostrar en la página de login

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
        <Button color="inherit" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

