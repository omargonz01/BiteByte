import React, { useState } from 'react';
import './Nav.css';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

//  component  appears when the "plus" button is clicked
const AddFoodNav = ({ onClose, onSelect }) => {
    // Function to handle selection of each action
    const handleSelect = (action, event) => {
      onSelect(action);
      onClose();
    };
  
    return (
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-around p-4 bg-white shadow-lg z-20">
        <button onClick={(event) => handleSelect('search', event)} className="flex flex-col items-center">
          <SearchIcon fontSize="large" />
          <span>Search</span> 
        </button>
        <button onClick={(event) => handleSelect('upload', event)} className="flex flex-col items-center">
          <AddPhotoAlternateOutlinedIcon fontSize="large" />
          <span>Upload</span> 
        </button>
        <button onClick={(event) => handleSelect('camera', event)} className="flex flex-col items-center">
          <CameraAltOutlinedIcon fontSize="large" />
          <span>Camera</span> 
        </button>
        <button onClick={(event) => handleSelect('barcode', event)} className="flex flex-col items-center">
          <QrCodeScannerIcon fontSize="large" />
          <span>Barcode</span> 
        </button>
      </div>
    );
  };

export default AddFoodNav;
