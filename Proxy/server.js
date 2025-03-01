import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors()); // Allow frontend access

app.get("/api/completed-tasks", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.todoist.com/sync/v9/completed/get_all",
      {
        headers: { Authorization: `Bearer ${process.env.TODOIST_API_KEY}` },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log("Proxy server running on port 3001"));
