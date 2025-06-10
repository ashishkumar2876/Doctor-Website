import React from 'react';

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

interface PrescriptionCardProps {
  patientName: string;
  medicines: Medicine[];
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ patientName, medicines }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-6 shadow-sm bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Patient: {patientName}</h2>
      <div className="space-y-4">
        {medicines.map((medicine, index) => (
          <div key={index} className="bg-blue-50 p-3 rounded">
            <h3 className="font-semibold text-blue-800">{medicine.name}</h3>
            <p className="text-sm text-gray-600">Frequency: {medicine.frequency}</p>
            <p className="text-sm text-gray-600">
              Duration: {new Date(medicine.startDate).toLocaleDateString()} - {new Date(medicine.endDate).toLocaleDateString()}
            </p>
            <ul className="mt-2 pl-4 list-disc text-sm text-gray-700">
              {medicine.timings.map((t, i) => (
                <li key={i}>Time: {t.time}, Dosage: {t.dosage}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionCard;
