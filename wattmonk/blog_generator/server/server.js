import express from "express"
import blogRoutes from "./routes/blogRoutes.js"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/api/blogs", blogRoutes)

app.get("/", (req, res) => {
  res.send("Blog Generator API is running")
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
