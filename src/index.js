import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "../config/swagger.js";
import authRouter from "./routes/AuthRoute.js";
import userRouter from "./routes/UserRoute.js";
import attendanceRouter from "./routes/AttendanceRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.APP_ENV === 'prod';
const SERVER = isProduction ? process.env.SERVER : `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/attend", attendanceRouter);

// Swagger
app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: "Attendance API Docs",
    customCss: `
      .swagger-ui .topbar .wrapper .topbar-wrapper {
        display: none;
      }
      .swagger-ui .topbar .wrapper {
        display: flex;
        align-items: center;
      }
      .swagger-ui .topbar .wrapper:before { 
        content: "DEVLITE"; 
        font-size: 20px; 
        font-weight: bold; 
        color: white;
        margin-right: 20px;
      }
      .swagger-ui .topbar .topbar-wrapper img { 
        display: none !important; 
      }
      .swagger-ui .topbar { background-color: #0ead95; }
    `,
  })
);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at ${SERVER}`);
});