import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../config/supabaseClient"
import { Container, Box, TextField, Button, Typography, Alert } from "@mui/material"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

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
      })

      const data = await response.json()
      console.log("El servidor dice: ", data)

      // if (!response.ok) {
      //   throw new Error(data.error || "Error en el inicio de sesión")
      // }
      // console.log("Login exitoso, redirigiendo...");
      // navigate("/catalog")
      if (data.session) {   //probando este if por lo anterior
        await supabase.auth.setSession(data.session); // ✅ Guardar la sesión en el frontend
        console.log("Login exitoso, redirigiendo...");
        navigate("/catalog");
      } else {
        console.error("Error al iniciar sesión:", data.error);
      }

      // Guardar el token y el rol en el localStorage
      // localStorage.setItem("token", data.user.access_token)
      // localStorage.setItem("role", data.role)

      // Redirigir basado en el rol
      // if (data.role === "administrador") {
      //   navigate("/catalog")
      // } else {
      //   navigate("/catalog")
      // }
      
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
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo electrónico"
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
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 3, mb: 2 }}>
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ mt: 2 }}>
            <Link to="/register">¿No tienes una cuenta? Regístrate</Link>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login