import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Container, Box, TextField, Button, Typography, Alert, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/authContext/useAuth"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme();
  const { t } = useTranslation()
  const { setUser, setRole } = useAuth();

  useEffect(() => {
    // Limpiar los campos al montar el componente y al desmontar
    setEmail("")
    setPassword("")
    return () => {
      setEmail("")
      setPassword("")
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError("")
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Importante para incluir las cookies
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al iniciar sesión")
      }

      const data = await response.json()
      console.log("El servidor dice: ", data)

      setUser(data.user);
      setRole(data.role);
      
      console.log("Login exitoso, redirigiendo...");
      navigate("/catalog");
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
          padding: 4,
          borderRadius: 2,
          bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "background.paper",
          boxShadow: theme.palette.mode === "dark" ? "0px 4px 12px rgba(255, 255, 255, 0.2)" : "0px 4px 12px rgba(0, 0, 0, 0.15)",
          backdropFilter: "blur(5px)",
          border: theme.palette.mode === "dark" ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
        }}        
      >
        <Typography component="h1" variant="h5">
          {t("login.title")}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label= {t("login.email")}
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
            label= {t("login.password")}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
            {isSubmitting ? "Iniciando sesión..." : t("login.signIn")}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ mt: 2 }}>
          <Link 
            to="/register"
            style={{ 
              color: theme.palette.mode === "dark" ? "#BBDEFB" : "#1976D2",
              textDecoration: "none", 
              fontWeight: "bold" 
            }}
          >
            {t("login.confirmation")}
          </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login