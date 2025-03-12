import { useState, useEffect, useCallback } from "react"
import { AuthContext } from "./AuthContext"
import { User } from "./typesAuth"


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
  
    const checkAuth = useCallback(async () => {
      try {
        setIsLoading(true)
        const response = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        })
  
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setRole(data.role)
        } else {
          setUser(null)
          setRole(null)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        setUser(null)
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }, [])
  
    useEffect(() => {
      checkAuth()
    }, [checkAuth])
  
    return <AuthContext.Provider value={{ user, setUser, role, setRole, isLoading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  }