import React from 'react';
import './DateDisplay.css'; 
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 

const DateDisplay = () => {
  
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
    <ArrowBackIosOutlinedIcon className="date-arrow-icon" />
  </button>
  
  <div className="date-text-container">
    <CalendarTodayOutlinedIcon className="calendar-icon"sx={{ fontSize: '16px', width: '16px', height: '16px' }}/>
    <span className="date-text">{getFormattedDate()}</span>
  </div>
  
  <button className="date-change-button" onClick={goToNextDay}>
    <ArrowForwardIosOutlinedIcon className="date-arrow-icon" />
  </button>
</div>

  );
};

export default DateDisplay;
