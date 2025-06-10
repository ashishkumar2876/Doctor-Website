import express from "express";
import {
  getAllDoctors,
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile, // Use the updated controller here
  changePassword,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware"; // Import the file upload middleware

const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// Get all doctors (protected route, requires authentication)
router.get("/doctors", protect, getAllDoctors);

// Profile routes (protected routes, requires authentication)

// Get user profile
router.get("/profile", protect, getUserProfile);

// Update user profile (name/email and optionally profile photo)
router.put("/profile", protect, upload, updateUserProfile);

// Change user password
router.put("/change-password", protect, changePassword);

export default router;
