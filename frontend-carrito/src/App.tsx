import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CartProvider } from "./context/CartProvider"
import Login from "./components/Login"
import Register from "./components/Register"
import ProductCatalog from "./components/ProductCatalog"
import ProductDetails from "./components/ProductDetails"
import Cart from "./components/Cart"
import Layout from "./components/Layout"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminPanel from "./components/AdminPanel"

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  )
}

export default App
