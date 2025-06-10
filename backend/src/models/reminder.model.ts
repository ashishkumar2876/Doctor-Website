import mongoose, { Schema, Document } from "mongoose";

interface IReminder extends Document {
  prescriptionId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  medicineName: string;
  dosage: string;
  time: string; // "08:00" format
  date: Date; // Specific date this reminder is for
  emailSent: boolean;
  status: 'pending' | 'taken' | 'missed';
  markedAt?: Date | null;
}

const ReminderSchema: Schema = new Schema({
  prescriptionId: {
    type: Schema.Types.ObjectId,
    ref: "Prescription",
    required: true,
  },
  patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  medicineName: { type: String, required: true },
  dosage: { type: String, required: true },
  time: { type: String, required: true }, // e.g., "08:00"
  date: { type: Date, required: true },
  // reminder.model.ts
  status: {
    type: String,
    enum: ["pending", "taken", "missed"],
    default: "pending",
  },
  markedAt: {
    type: Date,
    default: null,
  },
  emailSent: { type: Boolean, default: false },
});

export default mongoose.model<IReminder>("Reminder", ReminderSchema);
