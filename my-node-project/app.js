require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const limiter = require("./src/middlewares/rateLimiter");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/config/swagger");
const healthRoutes = require("./src/routes/healthRoutes");
const userRoutes = require("./src/routes/userRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const productRoutes = require("./src/routes/productRoutes");
const logger = require("./src/middlewares/logger");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT;

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

// Rate Limiting
app.use(limiter);

// Enable CORS
app.use(
  cors({
    origin: "*", // specific IP: http://192.168.1.25:3000
  }),
);

app.use(express.json());

// Serve uploaded files as static assets

app.use(logger);
// Swagger API Docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);
// routes
app.use("/", healthRoutes);
app.use("/users", userRoutes);
app.use("/profiles", profileRoutes);
app.use("/products", productRoutes);
app.set('trust proxy', 1);

// connect database
connectDB();

app.use(errorHandler);

const startServer = (port) => {
  const p = Number(port);
  const server = app.listen(p, "0.0.0.0", () => {
    console.log(`Server running on http://192.168.1.25:${p}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${p} is busy, trying ${p + 1}...`);
      startServer(p + 1);
    } else {
      console.error("Server error:", err);
    }
  });
};

startServer(PORT);

