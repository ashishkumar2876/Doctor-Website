import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { toast } from 'react-hot-toast';

const CreatePrescription: React.FC = () => {
  const [approvedPatients, setApprovedPatients] = useState<
    { _id: string; name: string }[]
  >([]);
  const [patientId, setPatientId] = useState("");
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
  const [medicines, setMedicines] = useState([
    {
      name: "",
      frequency: "",
      timings: [{ time: "", dosage: "" }],
      startDate: "",
      endDate: "",
    },
  ]);

  useEffect(() => {
    const fetchApprovedPatients = async () => {
      try {
        const res = await axios.get(
          "https://doctor-website-jfrv.onrender.com/api/doctor/approved-patients",
          {
            withCredentials: true,
          }
        );
        setApprovedPatients(res.data);
      } catch (error) {
        
      }
    };

    fetchApprovedPatients();
  }, []);

  const handleMedicineChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newMeds = [...medicines];
    (newMeds[index] as any)[field] = value;
    setMedicines(newMeds);
  };

  const handleTimingChange = (
    medIndex: number,
    timeIndex: number,
    field: string,
    value: string
  ) => {
    const newMeds = [...medicines];
    (newMeds[medIndex].timings[timeIndex] as any)[field] = value;
    setMedicines(newMeds);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        frequency: "",
        timings: [{ time: "", dosage: "" }],
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeMedicine = (index: number) => {
    const newMeds = [...medicines];
    newMeds.splice(index, 1);
    setMedicines(newMeds);
  };

  const addTiming = (index: number) => {
    const newMeds = [...medicines];
    newMeds[index].timings.push({ time: "", dosage: "" });
    setMedicines(newMeds);
  };

  const handlePatientChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = e.target.value;
    setPatientId(selectedId);

    try {
      const res = await axios.get(
        `https://doctor-website-jfrv.onrender.com/api/prescriptions/patient/${selectedId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.prescription && res.data.prescription.medicines) {
        const formattedMeds = res.data.prescription.medicines.map((med: any) => ({
          ...med,
          startDate: med.startDate ? med.startDate.slice(0, 10) : "",
          endDate: med.endDate ? med.endDate.slice(0, 10) : "",
        }));
        setMedicines(formattedMeds);
        setPrescriptionId(res.data.prescription._id);
      } else {
        setMedicines([
          {
            name: "",
            frequency: "",
            timings: [{ time: "", dosage: "" }],
            startDate: "",
            endDate: "",
          },
        ]);
        setPrescriptionId(null);
      }
    } catch (err) {
      
      setPrescriptionId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { patientId, medicines };

    try {
      if (prescriptionId) {
        await axios.put(
          `https://doctor-website-jfrv.onrender.com/api/prescriptions/${prescriptionId}`,
          data,
          {
            withCredentials: true,
          }
        );
        toast.success("Prescription updated successfully!");
      } else {
        await axios.post("https://doctor-website-jfrv.onrender.com/api/prescriptions", data, {
          withCredentials: true,
        });
        toast.success("Prescription created successfully!");
        // Reset form
        setPatientId("");
        setPrescriptionId(null);
        setMedicines([
          {
            name: "",
            frequency: "",
            timings: [{ time: "", dosage: "" }],
            startDate: "",
            endDate: "",
          },
        ]);
      }
    } catch (error) {
      toast.error("An error occurred while saving the prescription.");
    }
  };

  const handleDeletePrescription = async () => {
    if (!prescriptionId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this prescription?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://doctor-website-jfrv.onrender.com/api/prescriptions/${prescriptionId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Prescription deleted successfully!");
      // Reset form
      setPatientId("");
      setPrescriptionId(null);
      setMedicines([
        {
          name: "",
          frequency: "",
          timings: [{ time: "", dosage: "" }],
          startDate: "",
          endDate: "",
        },
      ]);
    } catch (error) {
    
      toast.error("Failed to delete prescription.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 bg-white mt-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">
          Create Prescription
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Select Patient
            </label>
            <select
              value={patientId}
              onChange={handlePatientChange}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="">-- Select a patient --</option>
              {approvedPatients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {medicines.map((medicine, medIndex) => (
            <div
              key={medIndex}
              className="border border-blue-200 p-4 rounded-lg shadow-sm bg-blue-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-blue-800 font-semibold">
                  Medicine {medIndex + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeMedicine(medIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Medicine name"
                  value={medicine.name}
                  onChange={(e) =>
                    handleMedicineChange(medIndex, "name", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g., twice a day)"
                  value={medicine.frequency}
                  onChange={(e) =>
                    handleMedicineChange(medIndex, "frequency", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2"
                />
                <input
                  type="date"
                  value={medicine.startDate}
                  onChange={(e) =>
                    handleMedicineChange(medIndex, "startDate", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2"
                />
                <input
                  type="date"
                  value={medicine.endDate}
                  onChange={(e) =>
                    handleMedicineChange(medIndex, "endDate", e.target.value)
                  }
                  className="border border-gray-300 rounded p-2"
                />
              </div>

              <div>
                <h4 className="font-medium text-sm text-blue-700">
                  Timings & Dosage
                </h4>
                {medicine.timings.map((t, timeIndex) => (
                  <div key={timeIndex} className="flex gap-4 mt-2">
                    <input
                      type="time"
                      value={t.time}
                      onChange={(e) =>
                        handleTimingChange(
                          medIndex,
                          timeIndex,
                          "time",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded p-2 w-1/2"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={t.dosage}
                      onChange={(e) =>
                        handleTimingChange(
                          medIndex,
                          timeIndex,
                          "dosage",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded p-2 w-1/2"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addTiming(medIndex)}
                  className="mt-2 text-blue-600 hover:underline text-sm"
                >
                  + Add Timing
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addMedicine}
            className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
          >
            <FaPlus /> Add Medicine
          </button>

          <button
            type="submit"
            className={`${
              prescriptionId
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded font-semibold`}
          >
            {prescriptionId ? "Update Prescription" : "Submit Prescription"}
          </button>

          {/* Remove Prescription Button */}
          {prescriptionId && (
            <button
              type="button"
              onClick={handleDeletePrescription}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold ml-4"
            >
              Remove Prescription
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;
