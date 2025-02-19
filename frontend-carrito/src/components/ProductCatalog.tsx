"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Container, Grid, Card, CardContent, CardMedia, Typography, Button, CircularProgress, Box } from "@mui/material"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products")
        if (!response.ok) {
          throw new Error("Error al obtener los productos")
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError("Error al cargar los productos. Por favor, intente de nuevo más tarde.")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Catálogo de Productos
      </Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image_url || "/placeholder.svg"}
                alt={product.name}
                sx={{ objectFit: "scale-down" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio: ${product.price.toFixed(2)}
                </Typography>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ProductCatalog

