import type { Request, Response } from "express"
import { supabase } from "../config/supabase"

export const login = async (req: Request, res: Response) => {
  // console.log("Datos recibidos signIn:", req.body); 
  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    // if (error) throw error
    if (error) {
      console.error('Error Supabase signIn:', error.message);
      throw error;
    }
    // console.log("Usuario autenticado:", data.user);

    res.json({ 
      message: "Login exitoso", 
      user: data.user,
      session: data.session
    }); 
  } catch (error: unknown) {
    if(error instanceof Error){
        res.status(400).json({ error: error.message })
    } else {
        res.status(400).json({ error: "An unknown error occurred" })
    }
  }
}

// REGISTRO (signUp)
export const register = async (req: Request, res: Response) => {
  console.log("Datos recibidos signUp:", req.body);
  const { email, password } = req.body

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Error Supabase signUp:', error.message);
      throw error;
    }

    // Crear un registro en la tabla 'users' con el rol por defecto
    const { error: insertError } = await supabase
      .from("users")
      .insert({ email: data.user?.email, role: "cliente" })

    // if (insertError) throw insertError
    if (insertError) {
      console.error("Error al insertar en users:", insertError.message);
      throw insertError
    }
    
    res.status(201).json({ message: "Usuario registrado exitosamente", user: data.user })
  } catch (error: unknown) {
    if(error instanceof Error){
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: "An unknown error occurred" })
    }
  }
}
