import type React from "react"
import { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { CircularProgress, Box } from "@mui/material"
import { supabase } from "../config/supabaseClient" 

const ProtectedRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {data } = await supabase.auth.getUser()
      console.log("Usuario autenticado:", data?.user);
      setIsAuthenticated(!!data?.user)
    }

    checkAuth()
  }, [])

  if (isAuthenticated === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute