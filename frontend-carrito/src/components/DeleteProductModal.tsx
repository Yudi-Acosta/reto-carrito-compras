"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Box, Typography, Button, CircularProgress, Alert } from "@mui/material"

interface DeleteProductModalProps {
  open: boolean
  onClose: () => void
  productId: string
  productName: string
  onProductDeleted: () => void
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  open,
  onClose,
  productId,
  productName,
  onProductDeleted,
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar el producto")
      }

      setSuccess(true)
      onProductDeleted()
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err: unknown) {
        if(err instanceof Error){
            console.error("Error eliminado el producto:", err.message); // Ver error específico
            setError(err.message)
        } else{
            console.error("Error desconocido:", err);
            setError(String(err))
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Eliminar Producto
        </Typography>
        <Typography variant="body1" gutterBottom>
          ¿Estás seguro de que deseas eliminar el producto "{productName}"?
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Producto eliminado correctamente
          </Alert>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Confirmar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteProductModal

