import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth'; // Import signOut from Firebase Auth
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  const navigate = useNavigate(); // Initialize useNavigate
  const currentPatientId = ""; // Replace with actual patient ID from context or state

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, 'doctors'));
      const doctorsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDoctors(doctorsList);
    };

    const fetchSchedules = async () => {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      const schedulesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchedules(schedulesList);
    };

    fetchDoctors();
    fetchSchedules();
  }, []);

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setMessage('Please select a time slot.');
      return;
    }

    const [weekday, time] = selectedSlot.split(' ');
    const appointmentDateTime = new Date();

    try {
      await addDoc(collection(db, 'appointments'), {
        doctorId: selectedDoctor.id,
        patientId: currentPatientId,
        appointmentDateTime: appointmentDateTime.toISOString(),
        selectedSlot,
      });
      setMessage('Appointment booked successfully!');
      setShowScheduleModal(false);
      setSelectedDoctor(null);
      setSelectedSlot('');
    } catch (error) {
      console.error("Error booking appointment: ", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const getAvailableSlots = (doctorId) => {
    return schedules.filter(schedule => schedule.doctorId === doctorId);
  };

  const handleViewSchedule = (doctor) => {
    setSelectedDoctor(doctor);
    setShowScheduleModal(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(getAuth()); // Sign out the patient
      navigate('/'); // Redirect to home page
    } catch (error) {
      console.error("Sign out error: ", error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Patient Dashboard</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      
      <div className="flex justify-between mb-4">
        <h2 className="text-xl">Available Doctors</h2>
        <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {doctors.map(doctor => (
          <div key={doctor.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold">{doctor.name}</h3>
            <p>{doctor.specialization}</p>
            <button onClick={() => handleViewSchedule(doctor)} className="bg-blue-500 text-white px-4 py-2 rounded">
              View Schedule
            </button>
          </div>
        ))}
      </div>

      {showScheduleModal && selectedDoctor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl mb-2">Schedule for {selectedDoctor.name}</h2>
            {getAvailableSlots(selectedDoctor.id).length === 0 ? (
              <p>No available slots.</p>
            ) : (
              <div className="mb-4">
                {getAvailableSlots(selectedDoctor.id).map((schedule) => (
                  <div key={schedule.id} className="flex items-center bg-gray-100 p-2 mb-2 rounded">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="timeSlot"
                        value={`${schedule.weekday} ${schedule.startTime}`}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        className="mr-2"
                      />
                      {schedule.weekday} {schedule.startTime} - {schedule.endTime}
                    </label>
                  </div>
                ))}
                <button onClick={handleBookAppointment} className="bg-green-500 text-white px-4 py-2 rounded">
                  Book Appointment
                </button>
              </div>
            )}
            <button onClick={() => setShowScheduleModal(false)} className="mt-4 text-red-500">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
