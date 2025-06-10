// reminder.controller.ts
import {Request,Response} from 'express'
import moment from 'moment';
import reminderModel from '../models/reminder.model';
import mongoose from 'mongoose';
export const getRemindersByPrescriptionAndDate = async (req: Request, res: Response) => {
    const { prescriptionId } = req.params;
    const { date } = req.query; // YYYY-MM-DD format
  
    const startOfDay = moment.tz(date as string, 'Asia/Kolkata').startOf('day').toDate();
    const endOfDay = moment.tz(date as string, 'Asia/Kolkata').endOf('day').toDate();
  
    const reminders = await reminderModel.find({
      prescriptionId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
  
    res.json(reminders);
  };
  export const markReminderAsTaken = async (req: Request, res: Response):Promise<void> => {
    const { reminderId } = req.params;
  
    const reminder = await reminderModel.findById(reminderId);
    if (!reminder) res.status(404).json({ message: "Reminder not found" });
  
    const now = moment();
    const reminderTime = moment(reminder!.date);
  
    if (now.isBefore(reminderTime)) {
      res.status(400).json({ message: "You can only mark it as taken after the scheduled time." });
    }
  
    reminder!.status = "taken";
    reminder!.markedAt = now.toDate();
    await reminder!.save();
  
    res.json({ message: "Marked as taken", reminder });
  };
  
  export const getReminderStatusSummary = async (req: Request, res: Response):Promise<void> => {
  try {
    const { prescriptionId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(prescriptionId)) {
      res.status(400).json({ message: "Invalid prescription ID" });
    }

    // Aggregate count of each status for the given prescription
    const summary = await reminderModel.aggregate([
      {
        $match: {
          prescriptionId: new mongoose.Types.ObjectId(prescriptionId)
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Initialize result with all 3 status types
    const result = {
      taken: 0,
      missed: 0,
      pending: 0
    };

    // Fill in actual counts from DB result
    summary.forEach(({ _id, count }) => {
      if (_id === "taken" || _id === "missed" || _id === "pending") {
        result[_id as "taken" | "missed" | "pending"] = count;
      }
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching summary" });
  }
};
