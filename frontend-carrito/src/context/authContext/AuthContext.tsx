import { createContext } from "react"
import { User } from "./typesAuth"

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  role: string | null
  setRole: React.Dispatch<React.SetStateAction<string | null>>
  isLoading: boolean
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)





