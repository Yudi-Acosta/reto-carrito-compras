"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  CircularProgress,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material"
import { Edit, Delete, Add } from "@mui/icons-material"
import AddProductModal from "./AddProductModal"
import EditProductModal from "./EditProductModal"
import DeleteProductModal from "./DeleteProductModal"
import { useTranslation } from "react-i18next"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
}

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { t } = useTranslation()

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

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = () => {
    setIsAddModalOpen(true)
  }

  const handleEditProduct = (product: Product) => { //abrir el modal de edición y establecer el producto seleccionado que se va a editar
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
  }

  const handleCloseEditModal = () => { //cerrar el modal de edición y limpiar el producto seleccionado
    setIsEditModalOpen(false)
    setSelectedProduct(null)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedProduct(null)
  }

  const handleProductAdded = () => {
    fetchProducts()
  }

  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  const handleProductDeleted = () => {
    fetchProducts()
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
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
        {t("adminPanel.title")}
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddProduct}>
        {t("adminPanel.addProduct")}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("adminPanel.image")}</TableCell>
              <TableCell>{t("adminPanel.name")}</TableCell>
              <TableCell>{t("adminPanel.description")}</TableCell>
              <TableCell>{t("adminPanel.price")}</TableCell>
              <TableCell>{t("adminPanel.stock")}</TableCell>
              <TableCell>{t("adminPanel.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="editar" onClick={() => handleEditProduct(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" aria-label="eliminar" onClick={() => handleDeleteProduct(product)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddProductModal open={isAddModalOpen} onClose={handleCloseAddModal} onProductAdded={handleProductAdded} />
      {selectedProduct && (
        <>
          <EditProductModal
            open={isEditModalOpen}
            onClose={handleCloseEditModal}
            product={selectedProduct}
            onProductUpdated={handleProductUpdated}
          />
          <DeleteProductModal
            open={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            productId={selectedProduct.id}
            productName={selectedProduct.name}
            onProductDeleted={handleProductDeleted}
          />
        </>
      )}
    </Container>
  )
}

export default AdminPanel

