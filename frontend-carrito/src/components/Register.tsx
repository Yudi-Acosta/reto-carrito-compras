"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Container, Box, TextField, Button, Typography, Alert, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next"

const Register: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme();
  const { t } = useTranslation()


  useEffect(() => {
    setEmail("")
    setPassword("")
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError("")
    setSuccess("")
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("El servidor dice: ", data)

      if (!response.ok) {
        throw new Error(data.error || "Error en el registro")
      }

      setSuccess("Registro exitoso. Revisa tu correo y confirma tu cuenta antes de iniciar sesión.")
      setTimeout(() => {
        setEmail("")
        setPassword("")
        navigate("/login", { replace: true })
      }, 3000)
    } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setIsSubmitting(false)
      }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          borderRadius: 2,
          bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "#f9f9f9",
          boxShadow: theme.palette.mode === "dark" ? "none" : "0px 2px 8px rgba(0, 0, 0, 0.1)",
          border: theme.palette.mode === "dark" ? "2px solid rgba(255, 255, 255, 0.3)" : "2px solid #1976d2",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: theme.palette.mode === "dark" ? "0px 4px 15px rgba(255, 255, 255, 0.3)" : "0px 4px 12px rgba(0, 0, 0, 0.2)",
            transform: "scale(1.02)",
          },
        }}
        
      >
        <Typography component="h1" variant="h5">
          {t("register.title")}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label= {t("register.email")}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label= {t("register.password")}
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
            {isSubmitting ? "Registrando..." : t("register.signUp")}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <Box sx={{ mt: 2 }}>
            <Link 
              to="/login"
              style={{ 
                color: theme.palette.mode === "dark" ? "#BBDEFB" : "#1976D2", 
                textDecoration: "none", 
                fontWeight: "bold" 
              }}
              >
                {t("register.confirmation")}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Register

