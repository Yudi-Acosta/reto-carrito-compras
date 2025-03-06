import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CartProvider } from "./context/cartContext/CartProvider"
import { ThemeProvider as CustomThemeProvider } from "./context/themeContext/ThemeProvider"
import { useTheme } from "./context/themeContext/useTheme"
import Login from "./components/Login"
import Register from "./components/Register"
import ProductCatalog from "./components/ProductCatalog"
import ProductDetails from "./components/ProductDetails"
import Cart from "./components/Cart"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminPanel from "./components/AdminPanel"

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
})

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

function ThemedApp() {
  const { darkMode } = useTheme()

  return (
    <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute allowedRoles={["administrador", "cliente"]} />}>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/catalog" replace />} />
                <Route path="catalog" element={<ProductCatalog />} />
                <Route path="product/:id" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route element={<ProtectedRoute allowedRoles={["administrador"]} />}>
                  <Route path="admin" element={<AdminPanel />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </MuiThemeProvider>
  )
}

function App() {
  return (
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
  )
}

export default App

