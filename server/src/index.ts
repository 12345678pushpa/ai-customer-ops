import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});