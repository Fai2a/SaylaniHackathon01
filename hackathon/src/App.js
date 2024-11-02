// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/DoctorDashboard" element={<DoctorDashboard />} />
    <Route path="/PatientDashboard" element ={<PatientDashboard/>}/>
    {/* Add other routes here */}
  </Routes>
);

export default App;
