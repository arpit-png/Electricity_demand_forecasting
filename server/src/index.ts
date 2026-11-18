import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { helmetMiddleware, corsMiddleware, globalRateLimiter } from "./middleware/security.js";
import authRoutes from "./routes/auth.routes.js";
import vaultRoutes from "./routes/vault.routes.js";
import { initDatabase, pool } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware Stack
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(globalRateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Healthcheck Route
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Primary API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/vault", vaultRoutes);

// Graceful Shutdown Handler
async function startServer() {
  try {
    await initDatabase();
    const server = app.listen(PORT, () => {
      console.log(`🔒 Antigravity Security Server running on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log("Gracefully closing PostgreSQL pool and stopping server...");
      server.close(async () => {
        await pool.end();
        console.log("PostgreSQL pool terminated. Offline.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("Fatal startup error:", err);
    process.exit(1);
  }
}

startServer();
