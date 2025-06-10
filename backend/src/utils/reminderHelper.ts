import mongoose from "mongoose";
import Reminder from "../models/reminder.model";
import moment from "moment-timezone"; // Use moment-timezone
import { extendMoment } from "moment-range";

const range = extendMoment(moment as any);

const generateReminders = async (
  prescriptionId: mongoose.Types.ObjectId,
  patientId: mongoose.Types.ObjectId,
  doctorId: mongoose.Types.ObjectId,
  medicines: {
    name: string;
    frequency: string;
    timings: { time: string; dosage: string }[];
    startDate: string;
    endDate: string;
  }[]
) => {
  const now = moment.utc(); // Get current UTC time once

  // Array to collect all reminders
  const remindersToSave = [];

  for (const medicine of medicines) {
    const { name, frequency, timings, startDate, endDate } = medicine;

    // Parse start and end dates in IST timezone
    const start = moment.tz(startDate, "Asia/Kolkata");
    const end = moment.tz(endDate, "Asia/Kolkata");

    // Create a date range from start to end in IST
    const dateRange = range.range(start, end);

    // Iterate over the days in the date range
    for (let day of dateRange.by("days", { exclusive: false })) {
      for (const timing of timings) {
        const { time, dosage } = timing;

        const [hour, minute] = time.split(":").map((str) => parseInt(str));

        // Set time on the day in IST
        const reminderDate = day
          .clone()
          .tz("Asia/Kolkata") // Ensure time is in IST
          .set({ hour, minute, second: 0, millisecond: 0 })
          .toDate();

        // Convert the reminderDate to UTC before saving to MongoDB
        const utcReminderDate = moment(reminderDate).utc().toDate();

        // Ensure reminder is created for future dates only
        if (utcReminderDate >= now.toDate()) {
          remindersToSave.push({
            prescriptionId,
            patientId,
            doctorId,
            medicineName: name,
            dosage,
            time,
            date: utcReminderDate, // Store date in UTC in MongoDB
            emailSent: false,
          });
        }
      }
    }
  }

  // Bulk insert reminders if there are any
  if (remindersToSave.length > 0) {
    try {
      await Reminder.insertMany(remindersToSave);
  
    } catch (error) {
    
    }
  } else {
    
  }
};

export default generateReminders;
