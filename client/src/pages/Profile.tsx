import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { FaUserAlt } from "react-icons/fa";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser); // to update global state

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfilePhoto(user.profilePhoto || null);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview URL for the selected file
      const fileURL = URL.createObjectURL(file);
      setProfilePhoto(fileURL); // Update the preview immediately
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (selectedFile) {
      formData.append("profilePhoto", selectedFile);
    }

    setLoading(true);
    try {
      const response = await axios.put("http://localhost:5000/api/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      const updatedUser = {
        ...user!,
        name,
        email,
        profilePhoto: response.data.profilePhoto || user?.profilePhoto,
      };

      setUser(updatedUser); // 🔁 update store
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>

        <div className="flex justify-center mb-6">
          <div className="relative">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white">
                <FaUserAlt className="w-16 h-16 text-gray-500" />
              </div>
            )}

            <label
              htmlFor="file-input"
              className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full cursor-pointer"
            >
              <span className="text-sm">Edit</span>
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <span className="text-lg font-medium text-gray-600">Role: </span>
          <span className="text-lg font-semibold text-blue-600">{user?.role}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
