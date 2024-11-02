import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { doc, getDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import AppointmentManager from './AppointmentManager';
import PatientDetails from './PatientDetails';

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedWeekday, setSelectedWeekday] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 
  const doctorId = localStorage.getItem('doctorId');
  const auth = getAuth();

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!doctorId) return;
      const docRef = doc(db, 'doctors', doctorId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDoctor(docSnap.data());
      } else {
        console.error("No such doctor found!");
      }
    };

    const fetchSchedule = async () => {
      const querySnapshot = await getDocs(collection(db, 'schedules'));
      const schedules = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSchedule(schedules);
    };

    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, 'appointments'));
      const appointmentsList = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(appointment => appointment.doctorId === doctorId);
      setAppointments(appointmentsList);
    };

    fetchDoctorData();
    fetchSchedule();
    fetchAppointments();
  }, [doctorId]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!startTime || !endTime || !selectedWeekday) {
        throw new Error("All fields are required.");
      }

      await addDoc(collection(db, 'schedules'), {
        doctorId,
        startTime,
        endTime,
        weekday: selectedWeekday,
        specialization: doctor?.specialization || '',
      });
      setMessage('Schedule added successfully!');
      setStartTime('');
      setEndTime('');
      setSelectedWeekday('');
    } catch (error) {
      console.error("Error adding schedule: ", error);
      setMessage(`Schedule Error: ${error.message}`);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteDoc(doc(db, 'schedules', id));
      setMessage('Schedule deleted successfully!');
    } catch (error) {
      console.error("Error deleting schedule: ", error);
      setMessage(`Schedule Deletion Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); 
      localStorage.removeItem('doctorId'); 
      navigate('/'); 
      setDoctor(null);
    } catch (error) {
      console.error("Sign out error: ", error);
    }
  };

  const renderScheduleCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {schedule.map((sched) => (
        <div key={sched.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold">{sched.weekday}</h3>
          <p className="text-gray-600">Start Time: {sched.startTime}</p>
          <p className="text-gray-600">End Time: {sched.endTime}</p>
          <p className="text-gray-600">Specialization: {sched.specialization}</p>
          <button onClick={() => handleDeleteSchedule(sched.id)} className="mt-2 text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Doctor Dashboard</h1>
      {doctor && (
        <div className="mb-4 text-center">
          <h2 className="text-xl">Welcome, Dr. {doctor.name}!</h2>
          <p className="text-lg">Specialization: {doctor.specialization}</p>
        </div>
      )}
      
      <div className="flex justify-center space-x-4 mb-4">
        <button onClick={handleSignOut} className="btn bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Sign Out
        </button>
      </div>

      <form onSubmit={handleScheduleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl mb-2">Add Schedule</h2>
        <label className="block mb-2">
          Start Time:
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="border border-gray-300 rounded w-full py-2 px-3 mt-1" />
        </label>
        <label className="block mb-2">
          End Time:
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="border border-gray-300 rounded w-full py-2 px-3 mt-1" />
        </label>
        <label className="block mb-2">
          Weekday:
          <select value={selectedWeekday} onChange={(e) => setSelectedWeekday(e.target.value)} required className="border border-gray-300 rounded w-full py-2 px-3 mt-1">
            <option value="" disabled>Select a weekday</option>
            {weekdays.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Schedule
        </button>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </form>
      {renderScheduleCards()}
    </div>
  );
};

export default DoctorDashboard;
