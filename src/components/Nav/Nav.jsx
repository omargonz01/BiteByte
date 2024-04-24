import React, { useState } from 'react';
import './Nav.css';
import { ImageUpload } from '../Forms';
import { Modal } from '@mui/material';
import { FaHome, FaChartLine, FaBook, FaUser } from 'react-icons/fa';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddFoodNav from './AddFoodNav';
import Camera from '../Forms/CameraAcess';

function Nav() {
  const [showAddFoodNav, setShowAddFoodNav] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null); 

  //  handle the "plus" button click
  const handlePlusClick = () => {
    setShowAddFoodNav(true);
  };

  //  handle closing the AddFoodNav
  const handleCloseAddFoodNav = () => {
    setShowAddFoodNav(false);
  };

  const handleImageCapture = async (imageBlob) => {
    console.log('Captured image blob:', imageBlob);
    // Convert the blob to a file object (if needed)
    const imageFile = new File([imageBlob], "capturedImage.jpg", { type: 'image/jpeg' });
    
    try {
      // Upload the image and wait for the nutrition data
      const nutritionData = await uploadImageAndGetNutrition(imageFile);
      console.log(nutritionData); // Handle the received nutrition data
      // You might want to set this data to state, or pass to another component
    } catch (error) {
      // Handle any errors from the API call here
      console.error('Error fetching nutrition data:', error);
    }
  };


  const handleImageClear = () => {
    setCapturedImage(null); // Clear the captured image
    setShowCamera(false); // Hide the camera component
    // Clear any other related states or UI elements if necessary
  };

  const handleSelectAction = (action) => {
    console.log('Action received:', action); // Debug log

    // Based on the action, do something
    switch (action) {
      case 'upload':
        setShowImageUploadModal(true); // Determines visibility state to show the modal
        setShowAddFoodNav(false); // Optionally close the AddFoodNav
        break;
      case 'camera':
        // Set state to show Camera component
        setShowCamera(true);
        setShowAddFoodNav(false);
        break;
      case 'barcode':
        // Placeholder for barcode action
        console.log('Barcode action selected');
        setShowAddFoodNav(false);
        break;
      default:
        console.log(`Unknown action: ${action}`);
        break;
    }
  };

  const handleCloseModal = () => setShowImageUploadModal(false);


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
      {showCamera && <Camera onCapture={handleImageCapture} onClear={handleImageClear} />}
      {capturedImage && (
        <img src={URL.createObjectURL(capturedImage)} alt="Captured" />
      )}
      {/* MUI Modal for image upload */}
      <Modal
        open={showImageUploadModal}
        onClose={handleCloseModal}
        aria-labelledby="image-upload-modal"
        aria-describedby="Modal for image upload"
      >
        <div className="modal-content">
          <ImageUpload onImageSelected={(file) => {
            console.log('Image selected:', file);
            handleCloseModal(); // Close the modal after an image is selected
          }} />
        </div>
      </Modal>
    </>
  );
}

export default Nav;
