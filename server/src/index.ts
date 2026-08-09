import express from "express";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});