import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// Define the storage strategy using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    return {
      folder: "profile_photos",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

// Create multer instance
const uploadProfilePhoto = multer({ storage });

// Middleware to handle single file upload with field name "profilePhoto"
export const upload = uploadProfilePhoto.single("profilePhoto");
