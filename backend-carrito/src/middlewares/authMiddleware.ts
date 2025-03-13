import type { Request, Response, NextFunction } from "express"
import { supabase } from "../config/supabase"

// Middleware de autenticación
export const authenticate = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies["supabase-auth-token"]

    if (!token ) {
      res.status(401).json({ error: "No autenticado" })
      return
    }

    // Verificar el token con Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      res.status(401).json({ error: "Token inválido" })
      return
    }

    // Obtener el rol del usuario desde la base de datos
    const { data: userData, error: userError } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userError) {
      res.status(500).json({ error: "Error al obtener el rol del usuario" })
      return
    }

    // Adjuntar la información del usuario a la solicitud
    req.user = {
      id: user.id,
      email: user.email || "",
      role: userData.role,
    }

    next()
  } catch (error) {
    console.error("Error en middleware de autenticación:", error)
    res.status(500).json({ error: "Error del servidor" })
  }
}

// Middleware de autorización para administradores
export const isAdmin = (req: Request, res: Response, next: NextFunction) : void  => {
  if (!req.user) {
    res.status(401).json({ error: "No autenticado" })
    return
  }

  if (req.user.role !== "administrador") {
    res.status(403).json({ error: "Acceso denegado. Se requiere rol de administrador" })
    return
  }

  next()
}

