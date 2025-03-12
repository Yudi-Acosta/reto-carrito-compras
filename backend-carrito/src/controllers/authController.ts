import type { Request, Response } from "express"
import { supabase } from "../config/supabase"

export const login = async (req: Request, res: Response) : Promise<void> => {
  //console.log("Datos recibidos signIn:", req.body); 
  const { email, password } = req.body

  try {
    //console.log("Enviando solicitud a Supabase con:", { email, password });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    //console.log("Respuesta de Supabase:", data, error);

    // if (error) throw error
    if (error) {
      console.error('Error Supabase signIn:', error.message);
      res.status(401).json({ error: error.message });
      return;
    }
    //console.log("Usuario autenticado:", data.user);

    // Obtener el rol del usuario
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle()

      if (userError) {
        console.error("Error obteniendo el rol:", userError.message);
        res.status(500).json({ error: "Error obteniendo el rol" });
        return;
      }

    // Configurar la cookie con el token de sesión
    const token = data.session.access_token
    if (!token) {
      console.error("No se generó un token");
      res.status(500).json({ error: "No se pudo generar el token" });
      return;
    }

    res.cookie("supabase-auth-token", token, {
      httpOnly: true, // Evita acceso desde JavaScript en el navegador
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "strict", // Protege contra ataques CSRF
      maxAge: 60 * 60 * 24 * 1000, // 1 día
      path: "/",
    })

    //console.log("Headers de la respuesta:", res.getHeaders());

    if (!userData) {
      console.warn("No se encontró el usuario en la tabla users");
      res.status(404).json({ error: "Usuario no encontrado en la base de datos" });
      return;
    }

    // Devolver solo el rol y la información básica del usuario
    res.json({
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      role: userData.role,
    }) 
  } catch (error: unknown) {
    console.error("Error en el backend:", error);
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

    const userId = data.user?.id;
    if (!userId) {
      throw new Error("No se pudo obtener el ID del usuario después del registro.");
    }

    // Crear un registro en la tabla 'users' con el rol por defecto y el id de supabase
    const { error: insertError } = await supabase
      .from("users")
      .insert({ 
        id: userId,
        email: data.user?.email, 
        role: "cliente" 
      })

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

// Nuevo endpoint para obtener el usuario actual y su rol
export const getCurrentUser = async (req: Request, res: Response) : Promise<void> => {
  try {
    // Obtener el token de la cookie
    const token = req.cookies["supabase-auth-token"]

    if (!token) {
      res.clearCookie("supabase-auth-token"); // limpiar la cookie si no existe el token
      res.status(401).json({ error: "No autenticado" })
      return;
    }

    // Verificar el token con Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      console.error("Error al verificar token:", error)
      res.clearCookie("supabase-auth-token"); // limpiar la cookie si el token es invalido
      res.status(401).json({ error: "Token inválido" })
      return;
    }

    // Obtener el rol del usuario
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (userError) {
      console.error("Error al obtener rol:", userError)
      res.status(500).json({ error: "Error al obtener el rol del usuario" })
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      role: userData.role,
    })
  } catch (error) {
    console.error("Error del servidor:", error)
    res.status(500).json({ error: "Error del servidor" })
  }
}

// Nuevo endpoint para cerrar sesión
export const logout = async (req: Request, res: Response) => {
  try {
    // Cerrar sesión en Supabase
    // await supabase.auth.signOut()

    // Eliminar la cookie
    res.clearCookie("supabase-auth-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })

    // Evitar almacenamiento en caché
    res.setHeader("Cache-Control", "no-store")

    res.json({ message: "Sesión cerrada correctamente" })
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    res.status(500).json({ error: "Error al cerrar sesión" })
  }
}

