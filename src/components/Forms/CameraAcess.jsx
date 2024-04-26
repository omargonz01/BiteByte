import React, { useState, useRef, useEffect } from 'react';

const Camera = ({ onCapture, onClear, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [useFrontCamera, setUseFrontCamera] = useState(true);

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
    canvas.toBlob(onCapture);
  };

  const handleClear = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    onClear();
  };

  const toggleCamera = () => {
    setUseFrontCamera(prevUseFrontCamera => !prevUseFrontCamera);
  };

  return (
    <div className="camera-container" style={{ position: 'relative' }}>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      <div style={{ position: 'absolute', top: 0, padding: '10px', width: '100%', display: 'flex', justifyContent: 'space-around', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <button onClick={handleCapture} style={{ color: 'white', fontSize: '16px' }}>Capture</button>
        <button onClick={handleClear} style={{ color: 'white', fontSize: '16px' }}>Clear</button>
        <button onClick={toggleCamera} style={{ color: 'white', fontSize: '16px' }}>
          {useFrontCamera ? 'Use Back Camera' : 'Use Front Camera'}
        </button>
        <button onClick={onClose} style={{ color: 'white', fontSize: '16px' }}>Close</button>
      </div>
    </div>
  );
};

export default Camera;
