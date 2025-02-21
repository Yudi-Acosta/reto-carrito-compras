"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Box, Typography, Button, CircularProgress, Alert, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next"

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
  const theme = useTheme()
  const { t } = useTranslation()


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
          bgcolor: theme.palette.mode === 'dark' ? "#424242":"background.paper",
          boxShadow: 24,
          p: 4,
          border: `2px solid ${theme.palette.mode === 'dark' ? '#757575' : '#e0e0e0'}`,
          borderRadius: 2,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          {t("deleteproduct.title")}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t("deleteproduct.confirmation", { productName })}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t("deleteproduct.successMessage")}
          </Alert>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            {t("deleteproduct.cancel")}
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t("deleteproduct.confirm")}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DeleteProductModal

