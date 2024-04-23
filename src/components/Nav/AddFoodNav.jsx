import React, { useState } from 'react';
import './Nav.css';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
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
          <PhotoLibraryIcon fontSize="large" />
          <span>Search</span> 
        </button>
        <button onClick={(event) => handleSelect('camera', event)} className="flex flex-col items-center">
          <CameraAltIcon fontSize="large" />
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
