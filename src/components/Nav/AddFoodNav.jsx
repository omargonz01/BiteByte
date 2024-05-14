import React from 'react';
import { Link } from 'react-router-dom';
import './Nav.css';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

// Component appears when the "plus" button is clicked
const AddFoodNav = ({ onClose, onSelect }) => {
  return (
    <div className="add-food-nav fixed inset-x-0 bottom-0 p-4 bg-white shadow-lg z-20">
      <Link to="/chat" className="nav-button" onClick={onClose}>
        <TextsmsOutlinedIcon fontSize="large" />
        <span>Chat</span>
      </Link>
      <button onClick={() => { onSelect('upload'); onClose(); }} className="nav-button">
        <AddPhotoAlternateOutlinedIcon fontSize="large" />
        <span>Upload</span>
      </button>
      <button onClick={() => { onSelect('camera'); onClose(); }} className="nav-button">
        <CameraAltOutlinedIcon fontSize="large" />
        <span>Camera</span>
      </button>
      <Link to="/barcode" className="nav-button" onClick={onClose}>
        <QrCodeScannerIcon fontSize="large" />
        <span>Barcode</span>
      </Link>
    </div>
  );
};

export default AddFoodNav;
