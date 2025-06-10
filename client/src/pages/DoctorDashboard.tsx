import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "../store/authStore"; // Assuming the doctor info is in the auth store

interface Timing {
  time: string;
  dosage: string;
}

interface Medicine {
  name: string;
  frequency: string;
  timings: Timing[];
  startDate: string;
  endDate: string;
}

interface Prescription {
  _id: string;
  patient: { name: string };
  medicines: Medicine[];
}

const SkeletonCard = () => (
  <div className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm animate-pulse">
    <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
    <div className="space-y-4">
      <div className="bg-blue-100 p-3 rounded space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="bg-blue-100 p-3 rounded space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

const DoctorDashboard: React.FC = () => {
  const { user } = useAuthStore(); // Get doctor info from the store
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/prescriptions/doctor", {
          withCredentials: true,
        });
        setPrescriptions(res.data);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
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
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Doctor Dashboard</h1>
        {user && (
          <h2 className="text-lg text-gray-600">
            {user.name} ({user.role})
          </h2>
        )}
        <hr className="my-4" />

        {loading ? (
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="text-gray-500">No prescriptions found.</p>
        ) : (
          prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Patient: {prescription.patient.name}
              </h2>
              <div className="space-y-4">
                {prescription.medicines.map((medicine, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded">
                    <h3 className="font-semibold text-blue-800">{medicine.name}</h3>
                    <p className="text-sm text-gray-600">Frequency: {medicine.frequency}</p>
                    <p className="text-sm text-gray-600">
                      Duration:{" "}
                      {new Date(medicine.startDate).toLocaleDateString()} -{" "}
                      {new Date(medicine.endDate).toLocaleDateString()}
                    </p>
                    <ul className="mt-2 pl-4 list-disc text-sm text-gray-700">
                      {medicine.timings.map((t, i) => (
                        <li key={i}>
                          Time: {t.time}, Dosage: {t.dosage}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
