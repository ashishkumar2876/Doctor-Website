import User from '../models/user.model';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import prescriptionModel from '../models/prescription.model';

// 1. Patient sends request
export const sendPatientRequest = async (req: Request, res: Response):Promise<void> => {
  const {doctorId} = req.body;
  const patientId = req.user._id;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      res.status(404).json({ message: 'Doctor not found' });
    }

    if (
      doctor!.pendingPatients.includes(patientId) ||
      doctor!.approvedPatients.includes(patientId)
    ) {
      res.status(400).json({ message: 'Already requested or approved' });
    }

    doctor!.pendingPatients.push(patientId);
    await doctor!.save();

    res.status(200).json({ message: 'Request sent to doctor' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Doctor gets list of pending patients
export const getPendingRequests = async (req: Request, res: Response):Promise<void> => {
  try {
    const doctor = await User.findById(req.user._id).populate('pendingPatients');
    if (!doctor)  res.status(404).json({ message: 'Doctor not found' });
    const patients = await User.find({
      _id: { $in: doctor!.pendingPatients },
      role: 'patient'
    }).select('-pendingPatients -approvedPatients -password -doctors');
    

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Doctor approves patient
export const approvePatientRequest = async (req: Request, res: Response): Promise<void> => {
  const doctorId = req.user._id;
  const patientId = req.params.patientId;

  try {
    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor || doctor.role !== 'doctor') {
      res.status(404).json({ message: 'Doctor not found or invalid role' });
    }

    if (!patient || patient.role !== 'patient') {
       res.status(404).json({ message: 'Patient not found or invalid role' });
    }

    const patientObjectId = new mongoose.Types.ObjectId(patientId);

    // Remove from pendingPatients
    doctor!.pendingPatients = doctor!.pendingPatients.filter(
      (id) => id.toString() !== patientId
    );

    // Add to approvedPatients if not already there
    if (!doctor!.approvedPatients.some((id) => id.toString() === patientId)) {
      doctor!.approvedPatients.push(patientObjectId);
    }

    // Also add doctor to patient's doctor list if not already there
    if (!patient!.doctors.some((id) => id.toString() === doctorId.toString())) {
      patient!.doctors.push(doctor!._id);
    }

    await doctor!.save();
    await patient!.save();

    res.status(200).json({ message: 'Patient approved successfully' });
  } catch (error) {

    res.status(500).json({ message: 'Server error', error });
  }
};
// 4. Doctor gets list of approved patients
export const getApprovedPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await User.findById(req.user._id).populate('approvedPatients');
    if (!doctor) res.status(404).json({ message: 'Doctor not found' });

    const patients = await User.find({
      _id: { $in: doctor!.approvedPatients },
      role: 'patient'
    }).select('-pendingPatients -approvedPatients -password -doctors');

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const rejectPatientRequest = async (req: Request, res: Response): Promise<void> => {
  const doctorId = req.user._id;
  const patientId = req.params.patientId;

  try {
    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      res.status(404).json({ message: "Doctor not found or invalid role" });
      return;
    }

    doctor.pendingPatients = doctor.pendingPatients.filter(
      (id) => id.toString() !== patientId
    );

    await doctor.save();

    res.status(200).json({ message: "Patient request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const getRequestStatus = async (req: Request, res: Response): Promise<void> => {
  const doctorId = req.params.doctorId;
  const patientId = req.user._id;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      res.status(404).json({ message: 'Doctor not found' });
    }

    const isPending = doctor!.pendingPatients.includes(patientId);
    const isApproved = doctor!.approvedPatients.includes(patientId);

    if (isApproved) {
      res.status(200).json({ status: 'approved' });
    }

    if (isPending) {
      res.status(200).json({ status: 'pending' });
    }

    res.status(200).json({ status: 'not requested' });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const removeApprovedPatient = async (req: Request, res: Response):Promise<void> => {
  const doctorId = req.user._id;
  const patientId = req.params.patientId;

  try {
    const doctor = await User.findById(doctorId);
    const patient = await User.findById(patientId);

    if (!doctor || doctor.role !== "doctor" || !patient || patient.role !== "patient") {
      res.status(404).json({ message: "Doctor or Patient not found or invalid role" });
    }

    // Remove patient from doctor's approved list
    doctor!.approvedPatients = doctor!.approvedPatients.filter(
      (id) => id.toString() !== patientId
    );

    // Remove doctor from patient's doctor list
    patient!.doctors = patient!.doctors.filter(
      (id) => id.toString() !== doctorId.toString()
    );

    await doctor!.save();
    await patient!.save();

    // Delete all prescriptions between this doctor and patient
    await prescriptionModel.deleteMany({
      doctor: doctorId,
      patient: patientId,
    });

    res.status(200).json({ message: "Patient removed and prescriptions deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



