import express from "express";
import {
  getRemindersByPrescriptionAndDate,
  markReminderAsTaken,
  getReminderStatusSummary
} from "../controllers/reminder.controller";
import { protect } from "../middlewares/auth.middleware"; // Adjust as per your setup

const router = express.Router();

//Get reminders for a patient by prescriptionId and date (used in calendar view)
router.get("/:prescriptionId", protect, getRemindersByPrescriptionAndDate);

//Mark reminder as taken (only after scheduled time)
router.patch("/mark-taken/:reminderId", protect, markReminderAsTaken);

//Get summary of doses (taken/missed/pending) for a prescription
router.get("/status-summary/:prescriptionId", protect, getReminderStatusSummary);

export default router;
