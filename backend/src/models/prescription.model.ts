import mongoose from 'mongoose';

const timingSchema = new mongoose.Schema({
  time: { type: String, required: true },         // e.g. "08:00"
  dosage: { type: String, required: true }        // e.g. "500mg"
});

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  frequency: { type: String, required: true },     // e.g. "Twice a day"
  timings: [timingSchema],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const prescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [medicineSchema],
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);
