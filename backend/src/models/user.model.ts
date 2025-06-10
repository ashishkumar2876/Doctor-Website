import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "", // Optional: You can set a default avatar URL here if you want
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pendingPatients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  approvedPatients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("User", userSchema);
