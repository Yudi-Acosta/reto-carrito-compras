import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import productRoutes from "./routes/productRoutes"
import userRoutes from "./routes/userRoutes"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})