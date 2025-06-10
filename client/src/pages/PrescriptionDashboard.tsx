import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import PrescriptionPieChart from "@/components/PrescriptionPieChart"; // 👈 import your pie chart component

interface Medicine {
  name: string;
  frequency: string;
  timings: {
    time: string;
    dosage: string;
  }[];
  startDate: string;
  endDate: string;
}

interface Prescription {
  _id: string;
  doctor: {
    name: string;
    email: string;
  };
  medicines: Medicine[];
  createdAt: string;
}

const PrescriptionDashboard: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/prescriptions/patient", {
          withCredentials: true,
        });
        setPrescriptions(res.data.prescriptions);
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Your Prescriptions</h2>
        {loading ? (
          <p>Loading...</p>
        ) : prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions found.</p>
        ) : (
          prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="border p-4 mb-4 rounded shadow-sm bg-white flex flex-col md:flex-row justify-between"
            >
              {/* Left Side - Prescription Info */}
              <div className="md:w-2/3">
                <div className="mb-2">
                  <span className="font-semibold text-gray-800">Doctor:</span>{" "}
                  {prescription.doctor.name} ({prescription.doctor.email})
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Issued on:</span>{" "}
                  {new Date(prescription.createdAt).toLocaleDateString()}
                </div>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {prescription.medicines.map((medicine, index) => (
                    <li key={index} className="mb-1">
                      <strong>{medicine.name}</strong> — {medicine.frequency}, from{" "}
                      {medicine.startDate.substring(0, 10)} to {medicine.endDate.substring(0, 10)}
                      <ul className="list-disc pl-5">
                        {medicine.timings.map((timing, i) => (
                          <li key={i}>
                            {timing.time} — {timing.dosage}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(`/calendar/${prescription._id}`)}
                  className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Calendar
                </button>
              </div>

              {/* Right Side - Pie Chart */}
              <div className="md:w-1/3 flex justify-center items-center mt-4 md:mt-0">
                <PrescriptionPieChart prescriptionId={prescription._id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PrescriptionDashboard;
