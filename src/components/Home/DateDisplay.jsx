import React from 'react';
import './DateDisplay.css'; // Make sure to create this CSS file
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Correctly imported

const DateDisplay = () => {
  // Function to format the date as "TODAY, APR 17"
  const getFormattedDate = () => {
    const now = new Date();
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    
    return `TODAY, ${formattedDate.toUpperCase()}`;
  };

  // Placeholder functions for changing the date
  const goToPreviousDay = () => {
    console.log('Previous day');
  };

  const goToNextDay = () => {
    console.log('Next day');
  };

  return (
    <div className="date-display-container">
      <button className="date-change-button" onClick={goToPreviousDay}>
        <FaArrowLeft className="date-arrow-icon" /> {/* Corrected Icon */}
      </button>
      <span className="date-text">{getFormattedDate()}</span>
      <button className="date-change-button" onClick={goToNextDay}>
        <FaArrowRight className="date-arrow-icon" /> {/* Corrected Icon */}
      </button>
    </div>
  );
};

export default DateDisplay;
