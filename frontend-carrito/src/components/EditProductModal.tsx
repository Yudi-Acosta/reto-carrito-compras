"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert, useTheme } from "@mui/material"
import { supabase } from "../config/supabaseClient"
import { useTranslation } from "react-i18next"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
}

interface EditProductModalProps {
  open: boolean
  onClose: () => void
  product: Product
  onProductUpdated: (updatedProduct: Product) => void
}

const EditProductModal: React.FC<EditProductModalProps> = ({ open, onClose, product, onProductUpdated }) => {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(product.price.toString())
  const [stock, setStock] = useState(product.stock.toString())
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation()

  useEffect(() => {
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price.toString())
    setStock(product.stock.toString())
  }, [product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `images/${fileName}`

    const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file)

    if (uploadError) {
        throw new Error(`Error al subir la imagen: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath)

    return data.publicUrl
  }

  const deleteOldImage = async (oldImageUrl: string) => {
    if (!oldImageUrl) return; // No hay imagen previa, no hacer nada

    const oldFileName = oldImageUrl.split("/").pop();
    if (oldFileName) {
      const { error } = await supabase.storage.from("products").remove([`images/${oldFileName}`]);

      if (error) {
        console.error("Error al eliminar la imagen anterior:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      let image_url = product.image_url

      if (image) {
        await deleteOldImage(product.image_url) // elimina la imagen anterior antes de subirla
        image_url = await uploadFile(image) // sube la nueva imagen
      }

      const updatedProduct = {
        name,
        description,
        price: Number.parseFloat(price),
        stock: Number.parseInt(stock),
        image_url,
      }

      const response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el producto")
      }

      const data = await response.json()
      setSuccess(true)
      onProductUpdated(data)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err: unknown) {
        if(err instanceof Error){
            console.error("Error en la subida del producto:", err.message); // Ver error específico
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
          {t("editProduct.title")}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t("editProduct.name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label={t("editProduct.description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            fullWidth
            label={t("editProduct.price")}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label= {t("editProduct.stock")}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            required
            margin="normal"
          />
          <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
            />
            <input accept="image/*" type="file" onChange={handleImageChange} />
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {t("editProduct.successMessage")}
            </Alert>
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              {t("editProduct.cancel")}
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : t("editProduct.save")}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default EditProductModal

