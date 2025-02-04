import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CartProvider } from "./context/CartProvider"
import Login from "./components/Login"
import ProductCatalog from "./components/ProductCatalog"
import ProductDetails from "./components/ProductDetails"
import Cart from "./components/Cart"
import Navbar from "./components/Navbar"

const theme = createTheme()

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/catalog" element={<ProductCatalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </CartProvider>
    </ThemeProvider>
  )
}

export default App
