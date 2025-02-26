"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  CircularProgress, 
  Box, 
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  SelectChangeEvent 
} from "@mui/material"
import { useTranslation } from "react-i18next"

interface Product {
  id: string
  name: string
  price: number
  image_url: string
}

interface ProductResponse {
  products: Product[]
  totalProducts: number
  totalPages: number
  currentPage: number
}

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("name")
  const [order, setOrder] = useState<string>("asc")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { t } = useTranslation()
  const theme = useTheme();
  
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:5000/api/products?sortBy=${sortBy}&order=${order}&page=${page}&limit=10`,
      )
      if (!response.ok) {
        throw new Error("Error al obtener los productos")
      }
      const data: ProductResponse = await response.json()
      setProducts(data.products)
      setTotalPages(data.totalPages)
    } catch (err) {
      setError("Error al cargar los productos. Por favor, intente de nuevo más tarde.")
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }, [sortBy, order, page])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string)
    setPage(1)
  }

  const handleOrderChange = (event: SelectChangeEvent) => {
    setOrder(event.target.value as string)
    setPage(1)
  }

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value)
  }

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
        {t("productCatalog.title")}
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="sort-by-label">{t("productCatalog.sortBy")}</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            onChange={handleSortByChange}
            label={t("productCatalog.sortBy")}
          >
            <MenuItem value="name">{t("productCatalog.name")}</MenuItem>
            <MenuItem value="price">{t("productCatalog.price")}</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <InputLabel id="order-label">{t("productCatalog.order")}</InputLabel>
          <Select 
            labelId="order-label" 
            value={order} 
            onChange={handleOrderChange} 
            label={t("productCatalog.order")}
            >
            <MenuItem value="asc">{t("productCatalog.ascending")}</MenuItem>
            <MenuItem value="desc">{t("productCatalog.descending")}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                border: `1px solid ${theme.palette.mode === "dark" ? "#757575" : "#e0e0e0"}`,
                borderRadius: 2,
                boxShadow: theme.palette.mode === "dark" ? "0px 4px 10px rgba(255, 255, 255, 0.1)" : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: theme.palette.mode === "dark" ? "0px 6px 12px rgba(255, 255, 255, 0.2)" : "0px 6px 12px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
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
                  {t("productCatalog.price")}: ${product.price.toFixed(2)}
                </Typography>
                <Button
                  component={Link}
                  to={`/product/${product.id}`}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  {t("productCatalog.viewDetails")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Box>
    </Container>
  )
}

export default ProductCatalog

