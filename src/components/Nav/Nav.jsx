import React, { useState } from 'react';
import './Nav.css';
import { Modal } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FeaturedPlayListOutlinedIcon from '@mui/icons-material/FeaturedPlayListOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AddFoodNav from './AddFoodNav';
import Camera from '../Forms/CameraAccess';  
import ImageUpload from '../Forms/ImageUpload';
import uploadImageAndGetNutrition from '../../backend/service/apiService';

function Nav({ onNutritionDataReceived }) {
  const [showAddFoodNav, setShowAddFoodNav] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' }); // Added state for snackbar

  
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
    // Convert the blob to a file object
    const imageFile = new File([imageBlob], "capturedImage.jpg", { type: 'image/jpeg' });
    setIsLoading(true);
    try {      
      // Upload the image and wait for the nutrition data
      const nutritionData = await uploadImageAndGetNutrition(imageFile);
      if (nutritionData) {
        onNutritionDataReceived(nutritionData);
      } else {
        console.error('Failed to receive nutrition data.');
      }
    } catch (error) {
      console.error('Error fetching nutrition data. Please upload an image of food');
    } finally {
      setIsLoading(false); // Set loading to false after the process is complete
    }
  };

  const handleImageClear = () => {
    setCapturedImage(null); // Clear the captured image
    setShowCamera(false); // Hide the camera component
    // Clear any other related states or UI elements if necessary
  };

  const handleSelectAction = (action) => {
    console.log('Action received:', action);
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
    }
  };

  const handleCloseModal = () => {
    setShowImageUploadModal(false);
    setShowAddFoodNav(false);
  };

  const handleNavClick = (page) => {
    console.log(`${page} clicked`);
  };

  const handleSubmit = (formData) => {
    fetch('/analyze-image', { method: 'POST', body: formData })
      .then(response => response.json())
      .then(data => {
          if (!data.success) {
              setSnackbar({ open: true, message: data.error, severity: 'error' });
          } else {
              handleNutritionData(data);
          }
      })
      .catch(error => {
          setSnackbar({ open: true, message: 'Failed to connect to the server.', severity: 'error' });
      });
  };
  

  return (
    <>
      <nav className="nav w-full fixed bottom-0 left-0 z-10">
        <a href="#home" className="nav-item" onClick={() => handleNavClick('Home')}>
          <HomeOutlinedIcon className="nav-icon"/>
          <span>Home</span>
        </a>
        <a href="#stats" className="nav-item" onClick={() => handleNavClick('Stats')}>
          <CalendarMonthOutlinedIcon className="nav-icon" />
          <span>Stats</span>
        </a>
        <button className="nav-item" onClick={handlePlusClick}>
          <AddCircleOutlinedIcon className="nav-icon" sx={{ fontSize: '46px', width: '46px', height: '46px' }} />
        </button>
        <a href="#recipes" className="nav-item" onClick={() => handleNavClick('Recipes')}>
          <FeaturedPlayListOutlinedIcon className="nav-icon text-3xl" />
          <span>Recipes</span>
        </a>
        <a href="#profile" className="nav-item" onClick={() => handleNavClick('Profile')}>
          <PermIdentityOutlinedIcon className="nav-icon" />
          <span>Profile</span>
        </a>
      </nav>

      {showAddFoodNav && <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={handleCloseAddFoodNav}></div>}
      {showAddFoodNav && <AddFoodNav onClose={handleCloseAddFoodNav} onSelect={handleSelectAction} />}
      {showCamera && <Camera 
          onCapture={handleImageCapture} 
          onClear={handleImageClear} 
          onClose={() => setShowCamera(false)} 
          onNutritionDataReceived={onNutritionDataReceived} // Assuming you need to use this here
          handleSubmit={handleSubmit}
        />}
        {capturedImage && (
          <img src={URL.createObjectURL(capturedImage)} alt="Captured" />
          // Optionally handle data when displaying captured image
        )}
      <Modal open={showImageUploadModal} onClose={handleCloseModal} aria-labelledby="image-upload-modal" aria-describedby="Modal for image upload">
        <div className="modal-content p-4 relative">
          <ImageUpload onImageSelected={(file) => {
            console.log('Image selected:', file);
            setShowImageUploadModal(false);
          }} onNutritionData={onNutritionDataReceived} handleSubmit={handleSubmit} />
          <button className="absolute right-0 p-1 bg-white rounded-full shadow-lg" onClick={() => setShowImageUploadModal(false)}>
            <CloseIcon fontSize="large" />
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Nav;
