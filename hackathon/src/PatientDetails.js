// src/components/PatientDetails.js
import React from 'react';

const PatientDetails = () => {
  // Example patient data
  const patient = {
    name: 'John Doe',
    age: 30,
    medicalHistory: ['Allergy to penicillin', 'Asthma'],
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Patient Details</h2>
      <p>Name: {patient.name}</p>
      <p>Age: {patient.age}</p>
      <h3 className="mt-4">Medical History:</h3>
      <ul>
        {patient.medicalHistory.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default PatientDetails;
