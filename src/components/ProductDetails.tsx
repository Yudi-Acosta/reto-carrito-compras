import React, { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Snackbar,
  SnackbarContent,
} from "@mui/material"
import products from "../mock/products.json"
import { useCart } from "../context/useCart"

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return <Typography>Producto no encontrado</Typography>
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  const handleContinueShopping = () => {
    setOpenSnackbar(false)
    navigate("/catalog")
  }

  const handleViewCart = () => {
    setOpenSnackbar(false)
    navigate("/cart")
  }

  return (
    <Container>
      <Button onClick={() => navigate("/catalog")} sx={{ mt: 2, mb: 2 }}>
        Volver al Catálogo
      </Button>
      <Card>
        <CardMedia component="img" height="300" image={product.image} alt={product.name} />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
          <Typography variant="h6" color="text.primary">
            Precio: ${product.price.toFixed(2)}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleAddToCart}>
              Agregar al Carrito
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <SnackbarContent
          message="Producto agregado al carrito"
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={handleContinueShopping}>
                Seguir Comprando
              </Button>
              <Button color="secondary" size="small" onClick={handleViewCart}>
                Ver Carrito
              </Button>
            </React.Fragment>
          }
        />
      </Snackbar>
    </Container>
  )
}

export default ProductDetails

