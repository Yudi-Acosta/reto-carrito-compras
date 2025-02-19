"use client"

import type React from "react"
import { useState } from "react"
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert } from "@mui/material"
import { supabase } from "../config/supabaseClient"

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  onProductAdded: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({ open, onClose, onProductAdded }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const uploadFile = async (file: File) => {
    console.log("Subiendo imagen a Supabase:", file.name); //Verificar que el archivo llega
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `images/${fileName}`

    const { error: uploadError } = await supabase.storage.from("products").upload(filePath, file)

    if (uploadError) {
        console.error("Error al subir la imagen:", uploadError); // Ver si hay error en la subida
        throw uploadError
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath)
    console.log("URL de la imagen generada:", data.publicUrl); //Verificar que la URL es válida

    return data.publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      if (!name || !price || !stock) {
        throw new Error("Nombre, precio y stock son campos requeridos")
      }

      let image_url = null
      if (image) {
        image_url = await uploadFile(image)
      }
      
      // verificar que productos se envian al backend
      console.log("Enviando producto al backend:", {
        name,
        description,
        price: Number.parseFloat(price),
        stock: Number.parseInt(stock),
        image_url,
      });

      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: Number.parseFloat(price),
          stock: Number.parseInt(stock),
          image_url,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al agregar el producto")
      }
      console.log("Producto agregado correctamente"); // Confirmar que la petición fue exitosa

      setSuccess(true)
      onProductAdded()
      setTimeout(() => {
        onClose()
        setName("")
        setDescription("")
        setPrice("")
        setStock("")
        setImage(null)
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
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Agregar Nuevo Producto
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Precio"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            type="number"
            required
            margin="normal"
          />
          <input
            accept="image/*"
            type="file"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            style={{ margin: "16px 0" }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Producto agregado con éxito
            </Alert>
          )}
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} sx={{ mr: 2 }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Guardar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default AddProductModal