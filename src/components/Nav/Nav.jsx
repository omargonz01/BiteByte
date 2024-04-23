import React, { useState } from 'react';
import './Nav.css';
import { FaHome, FaChartLine, FaBook, FaUser } from 'react-icons/fa';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';

//  component  appears when the "plus" button is clicked
const AddFoodNav = ({ onClose, onSelect }) => {
  // Function to handle selection of each action
  const handleSelect = (action) => {
    onSelect(action);
    onClose();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 flex items-center justify-around p-4 bg-white shadow-lg z-20">
      <button onClick={() => handleSelect('search')} className="flex flex-col items-center">
        <PhotoLibraryIcon fontSize="large" />
        <span>Search</span> 
      </button>
      <button onClick={() => handleSelect('camera')} className="flex flex-col items-center">
        <CameraAltIcon fontSize="large" />
        <span>Camera</span> 
      </button>
      <button onClick={() => handleSelect('barcode')} className="flex flex-col items-center">
        <QrCodeScannerIcon fontSize="large" />
        <span>Barcode</span> 
      </button>
    </div>
  );
};

function Nav() {
  const [showAddFoodNav, setShowAddFoodNav] = useState(false);

  //  handle the "plus" button click
  const handlePlusClick = () => {
    setShowAddFoodNav(true);
  };

  //  handle closing the AddFoodNav
  const handleCloseAddFoodNav = () => {
    setShowAddFoodNav(false);
  };

  //  handle selection of an action from AddFoodNav
  const handleSelectAction = (action) => {
    console.log(`Action selected: ${action}`);
    
  };

  
  const handleNavClick = (page) => {
    console.log(`${page} clicked`);
  };

  return (
    <>
      <nav className="nav w-full fixed bottom-0 left-0 z-10">
        <a href="#home" className="nav-item" onClick={() => handleNavClick('Home')}>
          <FaHome className="nav-icon" />
          <span>Home</span>
        </a>
        <a href="#stats" className="nav-item" onClick={() => handleNavClick('Stats')}>
          <FaChartLine className="nav-icon" />
          <span>Stats</span>
        </a>
        <button className="nav-item" onClick={handlePlusClick}>
          <AddCircleOutlineIcon className="nav-icon" />
        </button>
        <a href="#recipes" className="nav-item" onClick={() => handleNavClick('Recipes')}>
          <FaBook className="nav-icon" />
          <span>Recipes</span>
        </a>
        <a href="#profile" className="nav-item" onClick={() => handleNavClick('Profile')}>
          <FaUser className="nav-icon" />
          <span>Profile</span>
        </a>
      </nav>

      {/* Overlay to dim main content and add 2nd nav */}
      {showAddFoodNav && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={handleCloseAddFoodNav}></div>
      )}

      {showAddFoodNav && <AddFoodNav onClose={handleCloseAddFoodNav} onSelect={handleSelectAction} />}
    </>
  );
}

export default Nav;
