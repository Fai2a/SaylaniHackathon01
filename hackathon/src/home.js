// src/Home.js
import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isDoctor, setIsDoctor] = useState(null);

  const handleClose = () => {
    setIsDoctor(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.unitex.com/wp-content/uploads/2017/06/Unitex-June-Blog-Image-1.jpg')" }}
    >
      <h1 className="text-4xl font-bold text-black mb-4 text-center px-4">Welcome to Doctor Booking Appointment</h1>
      <p className="text-xl text-black mb-6 text-center px-4">Choose an option below to proceed with your appointment.</p>
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setIsDoctor(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
        >
          Doctor
        </button>
        <button
          onClick={() => setIsDoctor(false)}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full sm:w-auto"
        >
          Patient
        </button>
      </div>

      {isDoctor !== null && (
        <div className="mt-6 p-4 bg-blue-500 bg-opacity-90 rounded-lg relative w-full max-w-md mx-auto">
          <button
            onClick={handleClose}
            className="absolute top-2 left-2 text-white text-lg"
          >
            <FaTimes />
          </button>
          {isDoctor ? <DoctorForm /> : <PatientForm />}
        </div>
      )}
    </div>
  );
};

const DoctorForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await addDoc(collection(db, 'doctors'), {
        name,
        email,
        password,
        specialization,
      });
      localStorage.setItem('doctorId', data.id);
      setMessage('Doctor registered successfully!');
      // Redirect to Doctor Dashboard after successful registration
      navigate('/DoctorDashboard'); 

      // Clear form fields
      setName('');
      setEmail('');
      setPassword('');
      setSpecialization('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setMessage('Error registering doctor');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-white">
      <h2 className="text-2xl mb-4 text-center">Doctor Registration</h2>
      {message && <p className="mb-2">{message}</p>}
      {['Name', 'Email', 'Password', 'Specialization'].map((label) => (
        <label className="block mb-2" key={label}>
          {label}:
          <input
            type={label === 'Email' ? 'email' : label === 'Password' ? 'password' : 'text'}
            required
            value={label === 'Name' ? name : label === 'Email' ? email : label === 'Password' ? password : specialization}
            onChange={(e) => {
              if (label === 'Name') setName(e.target.value);
              if (label === 'Email') setEmail(e.target.value);
              if (label === 'Password') setPassword(e.target.value);
              if (label === 'Specialization') setSpecialization(e.target.value);
            }}
            className="mt-1 block w-full p-2 rounded bg-gray-700"
          />
        </label>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full">
        Register Doctor
      </button>
    </form>
  );
};

const PatientForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disease, setDisease] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'patients'), {
        name,
        email,
        password,
        disease,
      });
      setMessage('Patient registered successfully!');
      navigate('/PatientDashboard');

      setName('');
      setEmail('');
      setPassword('');
      setDisease('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setMessage('Error registering patient');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-white">
      <h2 className="text-2xl mb-4 text-center">Patient Registration</h2>
      {message && <p className="mb-2">{message}</p>}
      {['Name', 'Email', 'Password'].map((label) => (
        <label className="block mb-2" key={label}>
          {label}:
          <input
            type={label === 'Email' ? 'email' : label === 'Password' ? 'password' : 'text'}
            required
            value={label === 'Name' ? name : label === 'Email' ? email : password}
            onChange={(e) => {
              if (label === 'Name') setName(e.target.value);
              if (label === 'Email') setEmail(e.target.value);
              if (label === 'Password') setPassword(e.target.value);
            }}
            className="mt-1 block w-full p-2 rounded bg-gray-700"
          />
        </label>
      ))}
      <label className="block mb-2">
        Disease:
        <input
          type="text"
          required
          value={disease}
          onChange={(e) => setDisease(e.target.value)}
          className="mt-1 block w-full p-2 rounded bg-gray-700"
        />
      </label>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-full">
        Register Patient
      </button>
    </form>
  );
};

export default Home;
