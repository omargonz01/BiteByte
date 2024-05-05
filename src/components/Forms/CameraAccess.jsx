import React, { useState, useRef, useEffect } from "react";
import { Snackbar, Button, Alert } from "@mui/material";
import uploadImageAndGetNutrition from "../../backend/service/apiService";
import bitebyteSpinner from "../../assets/bite1.gif";
import CameraFrontIcon from '@mui/icons-material/CameraFront';
import CameraRearIcon from '@mui/icons-material/CameraRear';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const Camera = ({ onCapture, onClear, onClose, onNutritionDataReceived }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const getMedia = async (facingMode) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      console.log("Media stream tracks stopped");
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode ? "user" : "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setError("Unable to access camera.");
    }
  };

  useEffect(() => {
    getMedia(useFrontCamera);
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useFrontCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;
  
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
  
    canvas.toBlob((blob) => {
      handleImageCapture(blob);
      // Stop the video stream after capturing the image
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    });
  };

  const handleImageCapture = async (imageBlob) => {
    setIsProcessing(true);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null); // Ensure the stream is stopped and set to null
    }
    const imageFile = new File([imageBlob], "capturedImage.jpg", {
      type: "image/jpeg",
    });

    try {
      const nutritionData = await uploadImageAndGetNutrition(imageFile);
      // Assuming if we got valid data, proceed to handle it
      if (nutritionData) {
        onNutritionDataReceived(nutritionData);
        onClose(); // Close the camera if the image processing was successful
      } else {
        throw new Error(
          "Unable to process the image."
        );
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      // Set a user-friendly error message, overriding any specific backend messages
      setError(
        "Oops! Unable to process the image. Please ensure the image is of food and try again."
      );
      // Add logic to reset the camera after setting the error
      resetCamera();
    } finally {
      setIsProcessing(false);
    }
  };

  const resetCamera = () => {
    if (stream) {
      // Stop each track on the current stream
      stream.getTracks().forEach(track => track.stop());
    }
    // Optionally set stream to null here if you still need to clear the reference
    setStream(null);
  
    // Call getMedia to reinitialize the camera with the current settings
    getMedia(useFrontCamera).catch(console.error); // Handle errors appropriately
  };  

  const toggleCamera = () => {
    setUseFrontCamera((prevUseFrontCamera) => !prevUseFrontCamera);
  };

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <div className="camera-controls">
        <button onClick={onClose} className="camera-button">
            <CloseIcon />
        </button>
        <button onClick={handleCapture} disabled={isProcessing} className="camera-button capture">
            <PhotoCameraIcon />
        </button>
        <button onClick={toggleCamera} disabled={isProcessing} className="camera-button" aria-label="Toggle Camera">
            {useFrontCamera ? <CameraRearIcon /> : <CameraFrontIcon />}
        </button>
     </div>
      {isProcessing && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#E7EFED",
            display: "flex",
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            zIndex: 2,
          }}
        >
          <img
            src={bitebyteSpinner}
            alt="Loading..."
            style={{ width: "100px", height: "100px", marginTop: "20px" }}
          />
          <div className="w-[292px] text-center text-neutral-800 text-3xl font-normal font-['Work Sans']">
            Yum! We’re identifying your meal.
          </div>
        </div>
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError("")} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
  };

export default Camera;
