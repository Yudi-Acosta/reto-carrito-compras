"use client"

import type React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { CircularProgress, Box } from "@mui/material"
import { useAuth } from "../context/authContext/useAuth"

interface ProtectedRouteProps {
  allowedRoles?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles = ["administrador", "cliente"] }) => {
  const { user, role, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  // Si el usuario no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si el usuario está autenticado pero no tiene un rol permitido, redirigir a /catalog
  if (role && !allowedRoles.includes(role)) {
    console.log("No tienes permiso para acceder a esta página")
    return <Navigate to="/catalog" replace />
  }

  return <Outlet />
}

export default ProtectedRoute

