import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Test MySQL connection
app.get("/connection", async (req, res) => {
  try {
    const result = await pool.query("SELECT DATABASE()");
    console.log(result);
    res.status(200).send(`Database connected is ${result[0][0]["DATABASE()"]}`);
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).send("Database connection failed");
  }
});

// Route API

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});