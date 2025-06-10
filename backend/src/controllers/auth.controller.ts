import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
 // Import the file upload middleware

const JWT_SECRET = process.env.JWT_SECRET as string;

// Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!["patient", "doctor"].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name,
        email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Doctors
export const getAllDoctors = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors", error });
  }
};

// Get User Profile
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Update Name, Email, and Profile Photo (Optional)
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (name) user!.name = name;
    if (email) user!.email = email;

    // Handle profile photo if uploaded
    if (req.file) {
      user!.profilePhoto = req.file.path; // Save the uploaded photo's path
    }

    await user!.save();

    res.status(200).json({
      id: user!._id,
      name: user!.name,
      email: user!.email,
      role: user!.role,
      profilePhoto: user!.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// Change Password
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user!.password);
    if (!isMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    user!.password = await bcrypt.hash(newPassword, 10);
    await user!.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to change password" });
  }
};
