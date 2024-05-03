import React, { useState } from 'react';
import './Nav.css';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

//  component  appears when the "plus" button is clicked
const AddFoodNav = ({ onClose, onSelect }) => {
  const handleSelect = (action, event) => {
    onSelect(action);
    onClose();
  };

  return (
    <div className="add-food-nav fixed inset-x-0 bottom-0 p-4 bg-white shadow-lg z-20">
      <button onClick={(event) => handleSelect('search', event)} className="nav-button">
        <SearchIcon fontSize="large" />
        <span>Search</span> 
      </button>
      <button onClick={(event) => handleSelect('upload', event)} className="nav-button">
        <AddPhotoAlternateOutlinedIcon fontSize="large" />
        <span>Upload</span> 
      </button>
      <button onClick={(event) => handleSelect('camera', event)} className="nav-button">
        <CameraAltOutlinedIcon fontSize="large" />
        <span>Camera</span> 
      </button>
      <button onClick={(event) => handleSelect('barcode', event)} className="nav-button">
        <QrCodeScannerIcon fontSize="large" />
        <span>Barcode</span> 
      </button>
    </div>
  );
};

export default AddFoodNav;
