import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaUsers, FaPlus, FaUserMd, FaUserAlt } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() =>
          user?.role === 'doctor'
            ? navigate('/doctor/dashboard')
            : navigate('/patient/dashboard')
        }
      >
        MediTrack
      </div>

      <div className="flex gap-4 items-center">
        
        {/* Conditional Rendering based on User Role */}
        {user?.role === 'doctor' && (
          <div className="flex gap-4">
            {/* Doctor: Patient Requests */}
            <button
              onClick={() => navigate('/doctor/requests')}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 font-semibold shadow-md flex items-center gap-2"
            >
              <FaUsers />
              <span>Requests</span>
            </button>

            {/* Doctor: Create Prescription */}
            <button
              onClick={() => navigate('/doctor/prescriptions')}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 font-semibold shadow-md flex items-center gap-2"
            >
              <FaPlus />
              <span>Prescription</span>
            </button>

            {/* ✅ Doctor: My Patients */}
            <button
              onClick={() => navigate('/doctor/patients')}
              className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 font-semibold shadow-md flex items-center gap-2"
            >
              <FaUsers />
              <span>My Patients</span>
            </button>
          </div>
        )}

        {user?.role === 'patient' && (
          <button
            onClick={() => navigate('/patient/doctors')}
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-100 font-semibold shadow-md flex items-center gap-2"
          >
            <FaUserMd />
            <span>Doctors</span>
          </button>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>

        {/* Profile Picture */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          {/* Check if profile photo exists */}
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
          ) : (
            // Show a default avatar when profile picture doesn't exist
            <div className="w-10 h-10 flex items-center justify-center bg-gray-400 text-white rounded-full">
              <FaUserAlt className="text-xl" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
