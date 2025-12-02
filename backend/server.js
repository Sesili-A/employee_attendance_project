import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import autoAbsentMiddleware from "./middlewares/autoAbsentMiddleware.js";

dotenv.config();
connectDB();

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:3000",
];

const app = express();

app.use(express.json());
app.use(autoAbsentMiddleware);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Employee Attendance System API Running...");
});

// REQUIRED FOR VERCEL:
export default function handler(req, res) {
  return app(req, res);
}
