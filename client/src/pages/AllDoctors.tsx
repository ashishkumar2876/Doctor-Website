import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

interface Doctor {
  _id: string;
  name: string;
  email: string;
}

const AllDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestStatuses, setRequestStatuses] = useState<Record<string, string>>({}); // Store request statuses by doctorId

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Fetch list of doctors
        const res = await axios.get("http://localhost:5000/api/auth/doctors", {
          withCredentials: true,
        });
  
        setDoctors(res.data);

        // Check request status for each doctor
        const statuses: Record<string, string> = {};

        for (const doctor of res.data) {
          const statusRes = await axios.get(
            `http://localhost:5000/api/doctor/request/status/${doctor._id}`,
            { withCredentials: true }
          );
  
          statuses[doctor._id] = statusRes.data.status;
        }

        setRequestStatuses(statuses); // Set statuses for each doctor
      } catch (error) {
    
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleRequest = async (doctorId: string) => {
    try {
      await axios.post(
        "http://localhost:5000/api/doctor/request",
        { doctorId },
        { withCredentials: true }
      );
      setRequestStatuses((prev) => ({ ...prev, [doctorId]: "pending" })); // Update status to pending after request
    } catch (error) {
      
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Available Doctors</h1>

        {loading ? (
          <p>Loading...</p>
        ) : doctors.length === 0 ? (
          <p>No doctors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="border border-gray-200 p-4 rounded shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-800">{doctor.name}</h2>
                <p className="text-sm text-gray-600">{doctor.email}</p>

                {/* Button logic based on request status */}
                <button
                  onClick={() => handleRequest(doctor._id)}
                  disabled={requestStatuses[doctor._id] === "Approved" || requestStatuses[doctor._id] === "Pending"}
                  className={`mt-2 px-4 py-2 rounded text-sm font-semibold ${
                    requestStatuses[doctor._id] === "approved"
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : requestStatuses[doctor._id] === "pending"
                      ? "bg-yellow-500 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {requestStatuses[doctor._id] === "approved"
                    ? "Approved"
                    : requestStatuses[doctor._id] === "pending"
                    ? "Pending"
                    : "Request to Connect"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctors;
