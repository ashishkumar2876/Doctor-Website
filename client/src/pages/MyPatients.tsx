import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

interface Patient {
  _id: string;
  name: string;
  email: string;
}

const MyPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    try {
      const res = await axios.get("https://doctor-website-jfrv.onrender.com/api/doctor/approved-patients", {
        withCredentials: true,
      });
      setPatients(res.data);
    } catch (error) {
    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleRemove = async (patientId: string) => {
    try {
      await axios.delete(`https://doctor-website-jfrv.onrender.com/api/doctor/remove-patient/${patientId}`, {
        withCredentials: true,
      });
      setPatients((prev) => prev.filter((p) => p._id !== patientId));
    } catch (error) {
      
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">My Patients</h2>
        {loading ? (
          <p>Loading...</p>
        ) : patients.length === 0 ? (
          <p className="text-gray-500">No approved patients yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <div
                key={patient._id}
                className="p-4 border rounded shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{patient.name}</h3>
                <p className="text-sm text-gray-600">{patient.email}</p>
                <button
                  onClick={() => handleRemove(patient._id)}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPatients;
