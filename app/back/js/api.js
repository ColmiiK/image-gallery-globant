import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
const app = express();

dotenv.config();

const PORT = 5000;
const UNSPLASH_API_KEY = process.env.UNSPLASH_API_KEY;
const UNSPLASH_SECRET_KEY = process.env.UNSPLASH_SECRET_KEY;
const CALLBACK = "http://localhost:5000/auth/callback";
const REDIRECT_URI = "http://localhost:8080";
let accessToken = null;

app.use(cors());
app.use(express.json());

app.get("/query", async (req, res) => {
  const query = req.query.query;
  const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=4&client_id=${UNSPLASH_API_KEY}`;
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
  )}&count=4&client_id=${UNSPLASH_API_KEY}`;
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

app.get("/auth", async (req, res) => {
  const apiUrl = `https://unsplash.com/oauth/authorize?client_id=${UNSPLASH_API_KEY}&redirect_uri=${CALLBACK}&response_type=code&scope=${encodeURIComponent(
    "public",
  )}`;
  res.redirect(apiUrl);
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  // const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: "Authorization code is missing" });
  }
  try {
    const tokenUrl = "https://unsplash.com/oauth/token";
    const payload = {
      client_id: UNSPLASH_API_KEY,
      client_secret: UNSPLASH_SECRET_KEY,
      redirect_uri: CALLBACK,
      code: code,
      grant_type: "authorization_code",
    };
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "Failed to fetch access token");
    accessToken = data.access_token;
    console.log("Access Token:", accessToken);
    res.redirect(REDIRECT_URI);
  } catch (error) {
    console.error("Error exchanging code for token:", error.message);
    res.status(500).json({ error: "Failed to fetch access token" });
  }
});

app.get("/auth/confirmation", async (req, res) => {
  if (accessToken) res.json({ isLogged: true });
  else res.json({ isLogged: false });
});

app.post("/logout", (req, res) => {
  accessToken = null;
  console.log("User logged out");
  res.json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
