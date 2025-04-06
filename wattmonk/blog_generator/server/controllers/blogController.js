import { generateBlogContent } from "../services/blogService.js"

export const generateBlog = (req, res) => {
  const { title, keywords, tone } = req.body

  if (!title || !keywords || !tone) {
    return res.status(400).json({ message: "Missing fields" })
  }

  const blog = generateBlogContent(title, keywords, tone)
  res.json({ blog })
}
