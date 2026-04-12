import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { runMigrations } from "@my-app/backend";
import { authRouter } from "./routes/auth.js";
import { nativeRouter } from "./routes/native.js";

const app = express();
const PORT = parseInt(process.env["PORT"] ?? "3000", 10);

// Security middleware
app.use(cors({
  origin: process.env["NODE_ENV"] === "production"
    ? process.env["ALLOWED_ORIGINS"]?.split(",") ?? []
    : true,
  credentials: true,
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/native", nativeRouter);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
async function start(): Promise<void> {
  try {
    await runMigrations();
    app.listen(PORT, () => {
      console.log(`my-app-express running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
