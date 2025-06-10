import express from "express";
import {
  createPrescription,
  getPrescriptionsByDoctor,
  getPrescriptionsByPatient,
  getPrescriptionByPatientId,
  updatePrescription,
  deletePrescription
} from "../controllers/prescription.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// Create prescription (Doctor only)
router.post("/", protect, createPrescription);

// Get all prescriptions assigned by logged-in doctor
router.get("/doctor", protect, getPrescriptionsByDoctor);

// Get all prescriptions assigned to logged-in patient
router.get("/patient", protect, getPrescriptionsByPatient);

router.get("/patient/:id",protect,getPrescriptionByPatientId);

router.put("/:id",protect,updatePrescription);

router.delete('/:id', protect, deletePrescription);


export default router;
