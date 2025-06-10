import express from "express";
import cors from 'cors'
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import prescriptionRoutes from "./routes/prescription.routes";
import doctorRoutes from "./routes/doctor.routes"
import reminderRoute from "./routes/reminder.routes"
import cookieParser from "cookie-parser";
import './jobs/reminderJobs'
import path from "path"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "https://doctor-website-jfrv.onrender.com", // or your frontend URL
    credentials: true,
  }));

connectDB();

const _dirname=path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/doctor",doctorRoutes);
app.use("/api/reminders",reminderRoute)

app.use(express.static(path.join(_dirname,"/client/dist")));
app.get('/*splat', (req, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});
export default app;
