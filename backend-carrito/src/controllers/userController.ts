import type { Request, Response } from "express"
import { supabase } from "../config/supabase"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("users").select("id, email, role")

    if (error) throw error

    res.status(200).json(data)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({ error: "Error al obtener usuarios" })
  }
}