import type React from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
} from "@mui/material"
import { Add, Remove, Delete } from "@mui/icons-material"
import { useCart } from "../context/useCart"

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const navigate = useNavigate()

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity)
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Carrito de Compras
      </Typography>
      {cart.length === 0 ? (
        <Typography>El carrito está vacío</Typography>
      ) : (
        <>
          <List>
            {cart.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText primary={item.name} secondary={`Precio: $${item.price.toFixed(2)}`} />
                <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                  <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                    <Remove />
                  </IconButton>
                  <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                    <Add />
                  </IconButton>
                </Box>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total: ${getTotalPrice().toFixed(2)}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => navigate("/catalog")}>
              Seguir Comprando
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate("/checkout")}>
              Ir a la página de pago
            </Button>
          </Box>
          <Button variant="outlined" color="secondary" onClick={clearCart} sx={{ mt: 2 }}>
            Vaciar Carrito
          </Button>
        </>
      )}
    </Container>
  )
}

export default Cart

