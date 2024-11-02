// src/AppointmentManagement.js
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const AppointmentManagement = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    // Fetch available slots from the doctor's schedule
    const fetchAvailableSlots = () => {
      // Simulated available slots for the sake of this example
      const slots = [
        { id: 1, time: '2024-11-05T10:00:00', booked: false },
        { id: 2, time: '2024-11-05T10:30:00', booked: false },
        { id: 3, time: '2024-11-05T11:00:00', booked: false },
      ];
      setAvailableSlots(slots);
    };

    fetchAvailableSlots();
  }, []);

  const bookAppointment = () => {
    if (patientName && selectedSlot) {
      const newAppointment = { id: selectedSlot.id, patient: patientName, time: selectedSlot.time };
      setAppointments([...appointments, newAppointment]);
      setAvailableSlots(availableSlots.map(slot => slot.id === selectedSlot.id ? { ...slot, booked: true } : slot));
      setPatientName('');
      setShowBookingForm(false);
      alert('Appointment booked!');
    }
  };

  const cancelAppointment = (id) => {
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    const updatedSlots = availableSlots.map(slot => slot.id === id ? { ...slot, booked: false } : slot);
    setAppointments(updatedAppointments);
    setAvailableSlots(updatedSlots);
    alert('Appointment canceled!');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Appointment Management</h2>
      <DoctorSchedule 
        availableSlots={availableSlots} 
        setSelectedSlot={setSelectedSlot} 
        setShowBookingForm={setShowBookingForm} 
      />
      {showBookingForm && (
        <BookingForm 
          patientName={patientName} 
          setPatientName={setPatientName} 
          bookAppointment={bookAppointment} 
          closeForm={() => setShowBookingForm(false)} 
        />
      )}
      <AppointmentList appointments={appointments} cancelAppointment={cancelAppointment} />
    </div>
  );
};

const DoctorSchedule = ({ availableSlots, setSelectedSlot, setShowBookingForm }) => (
  <div>
    <h3 className="text-xl mb-2">Available Slots:</h3>
    <ul>
      {availableSlots.map(slot => (
        <li key={slot.id} className={`mb-2 ${slot.booked ? 'text-gray-400' : 'cursor-pointer'}`}>
          {slot.booked ? (
            `Booked`
          ) : (
            <span onClick={() => {
              setSelectedSlot(slot);
              setShowBookingForm(true);
            }}>
              {new Date(slot.time).toLocaleString()}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const BookingForm = ({ patientName, setPatientName, bookAppointment, closeForm }) => (
  <div className="p-4 bg-blue-500 rounded-lg text-white relative">
    <button onClick={closeForm} className="absolute top-2 left-2 text-lg"><FaTimes /></button>
    <h4 className="text-xl mb-4">Book Appointment</h4>
    <label className="block mb-2">
      Patient Name:
      <input 
        type="text" 
        value={patientName} 
        onChange={(e) => setPatientName(e.target.value)} 
        className="mt-1 block w-full p-2 rounded bg-gray-700" 
        required 
      />
    </label>
    <button 
      onClick={bookAppointment} 
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      Confirm Booking
    </button>
  </div>
);

const AppointmentList = ({ appointments, cancelAppointment }) => (
  <div className="mt-6">
    <h3 className="text-xl mb-2">Booked Appointments:</h3>
    <ul>
      {appointments.map(appointment => (
        <li key={appointment.id} className="flex justify-between mb-2">
          <span>{appointment.patient} - {new Date(appointment.time).toLocaleString()}</span>
          <button 
            onClick={() => cancelAppointment(appointment.id)} 
            className="text-red-500 hover:underline"
          >
            Cancel
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default AppointmentManagement;
