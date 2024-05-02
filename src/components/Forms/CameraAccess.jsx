import React, { useState, useRef, useEffect } from 'react';
import uploadImageAndGetNutrition from '../../backend/service/apiService';
import bitebyteSpinner from '../../assets/bite1.gif';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';


const Camera = ({ onCapture, onClear, onClose, onNutritionDataReceived }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 

  // Access the user's media devices with the specified camera facing mode
  const getMedia = async (facingMode) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode ? 'user' : 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  // Effect that re-runs when the useFrontCamera state changes
  useEffect(() => {
    getMedia(useFrontCamera);
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useFrontCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      handleImageCapture(blob); // Call the handleImageCapture function here with the blob
    });
  };

  const handleImageCapture = async (imageBlob) => {
    setIsProcessing(true); // Start the spinner before processing the image
    if (stream) {
      // Stop all tracks in the stream to turn off the camera
      stream.getTracks().forEach(track => track.stop());
      setStream(null); // Set stream to null to indicate it's no longer active
    }
    console.log('Captured image blob:', imageBlob);
    // Convert the blob to a file object (if needed)
    const imageFile = new File([imageBlob], "capturedImage.jpg", { type: 'image/jpeg' });
    
      try {
      // Upload the image and wait for the nutrition data
      const nutritionData = await uploadImageAndGetNutrition(imageFile);
      console.log("Nutrition data received:", nutritionData);
      
      // Check if onNutritionDataReceived is a function before calling it
      if (typeof onNutritionDataReceived === 'function') {
        onNutritionDataReceived(nutritionData);
      }
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      // Implement user-friendly error feedback here, e.g., using a snackbar
      alert("Oops! Unable to fetch nutrition data. Please ensure the image is of food and try again" ); 
    } finally {
      setIsProcessing(false);
      onClose();
    }
};

  const handleClear = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClear();
  };

  // Toggles the camera between front and back
  const toggleCamera = () => {
    setUseFrontCamera(prevUseFrontCamera => !prevUseFrontCamera);
  };

  return (
    <div className="camera-container" style={{ position: 'relative' }}>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      <div style={{ position: 'absolute', top: 0, padding: '10px', width: '100%', display: 'flex', justifyContent: 'space-around', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <button onClick={handleCapture} disabled={isProcessing} style={{ color: 'white', fontSize: '16px' }}>
          {isProcessing ? "Processing..." : "Capture"}
        </button>
        <button onClick={handleClear} disabled={isProcessing} style={{ color: 'white', fontSize: '16px' }}>Clear</button>
        <button onClick={toggleCamera} disabled={isProcessing} style={{ color: 'white', fontSize: '16px' }}>
          {useFrontCamera ? 'Use Back Camera' : 'Use Front Camera'}
        </button>
        <button onClick={onClose} style={{ color: 'white', fontSize: '16px' }}>Close</button>
      </div>
      {isProcessing && (
        <div className="processing-overlay" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2 }}>
          {/* Show spinner gif here */}
          <img src={bitebyteSpinner}  alt="Loading..." style={{ width: '100px', height: '100px' }} />
        </div>
      )}
    </div>
  );  
};

export default Camera;
