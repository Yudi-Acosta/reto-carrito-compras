import express from "express"
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController"
import { authenticate, isAdmin } from "../middlewares/authMiddleware"

const router = express.Router()

router.get("/", getAllProducts)
router.get("/:id", getProductById)
// rutas protegidas solo para administradores
router.post("/", authenticate, isAdmin,  createProduct)
router.put("/:id", authenticate, isAdmin, updateProduct)
router.delete("/:id", authenticate, isAdmin, deleteProduct)

export default router