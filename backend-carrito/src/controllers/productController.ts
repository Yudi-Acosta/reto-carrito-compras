import type { Request, Response } from "express"
import { supabase } from "../config/supabase"

// Obtener todos los productos
export const getAllProducts = async (req: Request, res: Response) => {
  
  try {
    const { data, error } = await supabase.from("products").select("*")

    if (error) throw error

    res.status(200).json(data)
  } catch (error: unknown) {
    if(error instanceof Error){
        res.status(500).json({ error: error.message })
    } else {
        res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Obtener un solo producto por ID
export const getProductById = async (req: Request, res: Response) : Promise<void> => {
  const { id } = req.params

  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) throw error

    if (!data || Object.keys(data).length === 0) {
       res.status(404).json({ error: "Producto no encontrado" })
       return;
    }

     res.status(200).json(data)
  } catch (error: unknown) {
    if (error instanceof Error){
        res.status(500).json({ error: error.message })
    } else {
        res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Crear un nuevo producto
export const createProduct = async (req: Request, res: Response) => {
  console.log("Datos recibidos:", req.body);
  const { name, description, price, stock, image_url } = req.body

  try {
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, description, price, stock, image_url }])
      .select()

    // if (error) throw error
    if (error) {
      console.error("Error en Supabase:", error); // Ver el error de supabase en la terminal
      res.status(400).json({ error: error.message }); // Ver el error de supabase en insomnia
      return;
    }

    res.status(201).json(data[0])
  } catch (error: unknown) {
    if(error instanceof Error){
        res.status(500).json({ error: error.message })
    } else {
        res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Actualizar un producto existente
export const updateProduct = async (req: Request, res: Response) : Promise<void> => {
  const { id } = req.params
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()

    // if (error) throw error
    if (error) {
      console.error("Error en Supabase:", error); // Ver el error de supabase en la terminal
      res.status(400).json({ error: error.message }); // Ver el error de supabase en insomnia
      return;
    }

    if (!data || (Array.isArray(data) && data.length === 0)) {
      res.status(404).json({ error: "Producto no encontrado" })
      return;
    }

     res.status(200).json(data[0])
  } catch (error: unknown) {
    if(error instanceof Error){
        res.status(500).json({ error: error.message })
    } else {
        res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}

// Eliminar un producto
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    // obtener el producto antes de eliminarlo
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single()
      
    if (fetchError || !product) {
      return res.status(404).json({ error: "Producto no encontrado" })
    }

    // Si el producto tiene imagen, eliminarla primero
    if (product.image_url) {
      const fileName = product.image_url.split("/").pop()

      if (fileName) {
        // Intentar eliminar la imagen de Supabase Storage
        const { error: deleteImageError } = await supabase.storage
          .from("products") // Nombre del bucket
          .remove([`images/${fileName}`])

        if (deleteImageError) {
          console.error("Error al eliminar la imagen:", deleteImageError.message)
          return res.status(500).json({ error: "No se pudo eliminar la imagen, el producto no será eliminado" })
        }
      }
    }

    // Eliminar el producto solo si la imagen se eliminó correctamente
    const { error: deleteError  } = await supabase.from("products").delete().eq("id", id)

    if (deleteError) {
      return res.status(500).json({ error: "No se pudo eliminar el producto" })
    }

    res.status(200).json({ message: "Producto eliminado correctamente" })
  } catch (error: unknown) {
    if(error instanceof Error) {
        res.status(500).json({ error: error.message })
    } else {
        res.status(500).json({ error: "An unknown error occurred" })
    }
  }
}
