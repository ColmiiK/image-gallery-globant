import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
const app = express();

dotenv.config();

const PORT = 5000;
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/query", async (req, res) => {
  const query = req.query.query;
  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&client_id=${UNSPLASH_API_KEY}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Unsplash API error: ${response.statusText}`);
    const data = await response.json();
    const imageUrls = data.results.map((image) => image.urls.small);
    res.json({ imageUrls });
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
    res.status(500).json({ error: "Failed to fetch images from Unsplash" });
  }
});

app.get("/random", async (req, res) => {
  const query = req.query.query;
  const apiUrl = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
    query,
  )}&count=12&client_id=${UNSPLASH_API_KEY}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`Unsplash API error: ${response.statusText}`);
    const data = await response.json();
    const imageUrls = data.map((image) => image.urls.small);
    res.json({ imageUrls });
  } catch (error) {
    console.error("Error fetching from Unsplash:", error);
    res.status(500).json({ error: "Failed to fetch images from Unsplash" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
