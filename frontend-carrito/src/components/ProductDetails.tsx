"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  SnackbarContent,
} from "@mui/material"
import { useCart } from "../context/cartContext/useCart"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`)
        if (!response.ok) {
          throw new Error("Error al obtener el producto")
        }
        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError("Error al cargar el producto. Por favor, intente de nuevo más tarde.")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      })
      setOpenSnackbar(true)
    }
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product) {
    return (
      <Container>
        <Typography color="error" variant="h6" align="center">
          {error || "Producto no encontrado"}
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Button onClick={() => navigate("/catalog")} sx={{ mt: 2, mb: 2 }}>
        Volver al Catálogo
      </Button>
      <Card>
        <CardMedia
          component="img"
          height="350"
          image={product.image_url || "/placeholder.svg"}
          alt={product.name}
          sx={{ objectFit: "scale-down" }}
        />
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

