import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

interface Patient {
  _id: string;
  name: string;
  email: string;
}

const SkeletonCard = () => (
  <div className="animate-pulse flex justify-between items-center bg-white p-4 rounded shadow border">
    <div className="flex flex-col space-y-2 w-full">
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="h-8 w-24 bg-gray-300 rounded"></div>
  </div>
);

const PatientRequests: React.FC = () => {
  const [pendingPatients, setPendingPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingPatients = async () => {
      try {
        const res = await axios.get("https://doctor-website-jfrv.onrender.com/api/doctor/requests", {
          withCredentials: true,
        });
        setPendingPatients(res.data);
      } catch (err) {
      
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPatients();
  }, []);

  const handlePatientAction = async (patientId: string, action: "approve" | "reject") => {
    setProcessingId(patientId);
    try {
      await axios.post(
        `https://doctor-website-jfrv.onrender.com/api/doctor/${action}/${patientId}`,
        {},
        { withCredentials: true }
      );
      setPendingPatients((prev) => prev.filter((p) => p._id !== patientId));
    } catch (err) {
  
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Patient Requests</h1>

        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : pendingPatients.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {pendingPatients.map((patient) => (
              <div
                key={patient._id}
                className="flex justify-between items-center bg-white p-4 rounded shadow border"
              >
                <div>
                  <p className="text-lg font-medium">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handlePatientAction(patient._id, "approve")}
                    disabled={processingId === patient._id}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {processingId === patient._id ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handlePatientAction(patient._id, "reject")}
                    disabled={processingId === patient._id}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {processingId === patient._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRequests;
