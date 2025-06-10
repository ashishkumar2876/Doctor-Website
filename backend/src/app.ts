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

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173", // or your frontend URL
    credentials: true,
  }));

connectDB();
console.log(new Date().toString());

app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/doctor",doctorRoutes);
app.use("/api/reminders",reminderRoute)


export default app;
