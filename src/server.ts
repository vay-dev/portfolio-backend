import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import swaggerUi from "swagger-ui-express";
import projectRoutes from "./routes/projectRoutes";
import authRoutes from "./routes/authRoutes";
import mediaRoutes from "./routes/mediaRoutes";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { swaggerSpec } from "./lib/swagger";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(logger);

// Serve uploaded files as static
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.send("Welcome to the Portfolio API! Docs at /api-docs");
});

// error handler must be last
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger docs at http://localhost:${PORT}/api-docs`);
});
