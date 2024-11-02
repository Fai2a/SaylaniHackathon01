// src/components/Schedule.js
import React from 'react';

const Schedule = () => {
  return (
    <div>
      <h2 className="text-2xl mb-4">Your Schedule</h2>
      <ul>
        <li>Monday: 9 AM - 12 PM</li>
        <li>Tuesday: 1 PM - 5 PM</li>
        <li>Wednesday: 9 AM - 12 PM</li>
        {/* Add more slots as needed */}
      </ul>
    </div>
  );
};

export default Schedule;
