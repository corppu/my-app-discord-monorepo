import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { runMigrations } from "@my-app/backend";
import { authRouter } from "./routes/auth.js";
import { nativeRouter } from "./routes/native.js";
import { csrfProtection } from "./middleware/csrf.js";

const app = express();
const PORT = parseInt(process.env["PORT"] ?? "3000", 10);
const NODE_ENV = process.env["NODE_ENV"] ?? "development";

// Parse allowed origins from env or use localhost defaults for development
const allowedOrigins: string[] = process.env["ALLOWED_ORIGINS"]
  ? process.env["ALLOWED_ORIGINS"].split(",").map((o) => o.trim())
  : NODE_ENV === "development"
    ? ["http://localhost:8080", "http://localhost:3000"]
    : [];

// Security middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrfProtection);

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
