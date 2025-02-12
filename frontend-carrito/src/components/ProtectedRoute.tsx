"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { CircularProgress, Box } from "@mui/material"
import { supabase } from "../config/supabaseClient"

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = ["administrador", "cliente"] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const storedRole = localStorage.getItem("role") //

      if (session && storedRole) {
        setIsAuthenticated(true)
        setUserRole(storedRole)
      } else {
        setIsAuthenticated(false)
      }
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

  // Si el usuario no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si el rol del usuario no está en `allowedRoles`, redirigir a `/catalog`
  if (userRole && !allowedRoles.includes(userRole)) {
    console.log("No tienes permiso para acceder a esta página")
    return <Navigate to="/catalog" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
