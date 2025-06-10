import { Request, Response } from "express";
import Prescription from "../models/prescription.model";
import generateReminders  from "../utils/reminderHelper";
import User from "../models/user.model";
import reminderModel from "../models/reminder.model";

// Create a prescription (Doctor only)
export const createPrescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = (req as any).user.id;
    const { patientId, medicines } = req.body;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      res.status(404).json({ message: "Invalid patient ID" });
      return;
    }

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    const isApproved = doctor!.approvedPatients.some(
      (id) => id.toString() === patientId
    );

    if (!isApproved) {
      res.status(403).json({ message: "Patient not approved by this doctor" });
      return;
    }

    // Create prescription
    const newPrescription = await Prescription.create({
      doctor: doctorId,
      patient: patientId,
      medicines,
    });

    // Generate reminders for the prescription
    await generateReminders(
      newPrescription._id,
      patientId,
      doctorId,
      medicines
    );

    res.status(201).json({ message: "Prescription created", prescription: newPrescription });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all prescriptions for a specific doctor
export const getPrescriptionsByDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = (req as any).user.id;

    const prescriptions = await Prescription.find({ doctor: doctorId })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all prescriptions for a patient (only from approved doctors)
export const getPrescriptionsByPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const patientId = (req as any).user.id;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== "patient") {
      res.status(404).json({ message: "Patient not found" });
    }

    const prescriptions = await Prescription.find({
      patient: patientId,
      doctor: { $in: patient!.doctors }, // only fetch from approved doctors
    })
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getPrescriptionByPatientId = async (req: Request, res: Response): Promise<void> => {
  const patientId = req.params.id;
  const doctorId = req.user.id;

  try {
    const prescription = await Prescription.findOne({
      doctor: doctorId,
      patient: patientId,
    });

    if (!prescription) {
      res.status(404).json({
        message: 'Prescription not found'
      });
      return; // 👉 'return' here to STOP function after sending 404
    }

    res.status(200).json({prescription}); // 👉 also 'return' here for good practice
  } catch (error) {
    console.error('Error fetching prescription by patient ID:', error);
    res.status(500).json({ message: 'Internal server error' }); // 👉 even here
  }
};

export const updatePrescription = async (req: Request, res: Response): Promise<void> => {
  const prescriptionId = req.params.id;
  const { medicines } = req.body;

  try {
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    const oldMedicines = prescription.medicines;
    const oldMedicineNames = oldMedicines.map(m => m.name);
    const newMedicineNames = medicines.map((m: any) => m.name);

    // Update prescription medicines in DB
    prescription.medicines = medicines;
    await prescription.save();

    // 1️⃣ Delete reminders for removed medicines
    const removedMedicineNames = oldMedicineNames.filter(name => !newMedicineNames.includes(name));

    if (removedMedicineNames.length > 0) {
      await reminderModel.deleteMany({
        prescriptionId,
        medicineName: { $in: removedMedicineNames },
      });
    }

    // 2️⃣ Identify newly added or modified medicines
    const newOrUpdatedMedicines = medicines.filter((med: any) => {
      const existing = oldMedicines.find(old => old.name === med.name);
      return !existing || JSON.stringify(existing) !== JSON.stringify(med); // new or updated
    });

    // 3️⃣ Delete reminders for new or updated medicines before regenerating
    if (newOrUpdatedMedicines.length > 0) {
      await reminderModel.deleteMany({
        prescriptionId,
        medicineName: { $in: newOrUpdatedMedicines.map((m: any) => m.name) },
      });

      await generateReminders(
        prescription._id,
        prescription.patient,
        prescription.doctor,
        newOrUpdatedMedicines
      );
    }

    res.status(200).json({
      message: 'Prescription and reminders updated successfully',
      prescription,
    });
  } catch (error) {
    console.error("Error updating prescription:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deletePrescription = async (req: Request, res: Response): Promise<void> => {
  const prescriptionId = req.params.id;

  try {
    const deleted = await Prescription.findByIdAndDelete(prescriptionId);

    if (!deleted) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    // Delete all reminders related to this prescription
    await reminderModel.deleteMany({ prescriptionId });

    res.status(200).json({ message: 'Prescription and related reminders deleted successfully' });
  } catch (error) {
    console.error("Error deleting prescription:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};

