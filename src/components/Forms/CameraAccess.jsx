import React, { useState, useRef, useEffect } from "react";
import { Snackbar, Button, Alert } from "@mui/material";
import uploadImageAndGetNutrition from "../../backend/service/apiService";
import bitebyteSpinner from "../../assets/bite1.gif";

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
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      handleImageCapture(blob);
    });
  };

  const handleImageCapture = async (imageBlob) => {
    setIsProcessing(true);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
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
          "Oops! Unable to process the image. Please ensure the image is of food and try again."
        );
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      // Set a user-friendly error message, overriding any specific backend messages
      setError(
        "Oops! Unable to process the image. Please ensure the image is of food and try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onClear();
  };

  const toggleCamera = () => {
    setUseFrontCamera((prevUseFrontCamera) => !prevUseFrontCamera);
  };

  return (
    <div className="camera-container" style={{ position: "relative" }}>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          padding: "10px",
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <button
          onClick={handleCapture}
          disabled={isProcessing}
          style={{ color: "white", fontSize: "16px" }}
        >
          {isProcessing ? "Processing..." : "Capture"}
        </button>
        <button
          onClick={handleClear}
          disabled={isProcessing}
          style={{ color: "white", fontSize: "16px" }}
        >
          Clear
        </button>
        <button
          onClick={toggleCamera}
          disabled={isProcessing}
          style={{ color: "white", fontSize: "16px" }}
        >
          {useFrontCamera ? "Use Back Camera" : "Use Front Camera"}
        </button>
        <button onClick={onClose} style={{ color: "white", fontSize: "16px" }}>
          Close
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
            flexDirection: "column", // Aligns children (text and spinner) in a column
            alignItems: "center", // Centers children horizontally
            justifyContent: "center", // Centers the flex container's contents vertically
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
        autoHideDuration={null}
        onClose={() => setError("")}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                setError("");
                onClose();
              }}
            >
              Close
            </Button>
          }
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Camera;
