const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate keyword suggestions
function getKeywordSuggestions(keyword) {
  return [
    `${keyword} best practices`,
    `how to ${keyword} for beginners`,
    `${keyword} tips and tricks`,
    `${keyword} vs alternative solutions`,
    `${keyword} case studies`,
  ];
}

app.post("/generate-blog", async (req, res) => {
  const { keyword, topic } = req.body;

  if (!keyword || !topic) {
    return res.status(400).json({ error: "Keyword and topic are required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
Write an SEO-optimized blog post on the topic: "${topic}".
Use the following keywords naturally throughout the content: ${keyword}.
Make the content informative, engaging, and structured with subheadings.
Length: 300-400 words.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const blogContent = response.text();

    return res.json({
      blog: blogContent,
      suggestions: getKeywordSuggestions(keyword),
    });
  } catch (err) {
    console.error("Error generating blog:", err);
    return res.status(500).json({ error: "Failed to generate blog" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
