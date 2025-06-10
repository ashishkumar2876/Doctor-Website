import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import {
  sendPatientRequest,
  getPendingRequests,
  approvePatientRequest,
  getApprovedPatients,
  rejectPatientRequest,
  getRequestStatus,
  removeApprovedPatient
} from '../controllers/doctorController';

const router = express.Router();

// Patient sends a connection request to a doctor
router.post('/request', protect, sendPatientRequest);

// Doctor fetches all pending requests
router.get('/requests', protect, getPendingRequests);

// Doctor approves a patient
router.post('/approve/:patientId', protect, approvePatientRequest);

router.get('/approved-patients',protect,getApprovedPatients);

router.post('/reject/:patientId', protect, rejectPatientRequest); 

router.get('/request/status/:doctorId', protect, getRequestStatus);

router.delete('/remove-patient/:patientId', protect, removeApprovedPatient);


export default router;
