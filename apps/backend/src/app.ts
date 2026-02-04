import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib";

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.USER_APP_URL, env.ADMIN_APP_URL],
    credentials: true,
  }),
);

// Body parsing
app.use(express.json());

// Better Auth routes - must come before other routes
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      error:
        env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
  },
);

export { app };
