import React, { useState, useRef, useEffect } from 'react';

const Camera = ({ onCapture, onClear, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // Access the user's media devices
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    getMedia();

    // Clean up the stream on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

  return (
    <div className="camera-container" style={{ position: 'relative' }}>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      <div style={{ position: 'absolute', top: 0, padding: '10px', width: '100%', display: 'flex', justifyContent: 'space-around', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <button onClick={handleCapture} style={{ color: 'white', fontSize: '16px' }}>Capture</button>
        <button onClick={handleClear} style={{ color: 'white', fontSize: '16px' }}>Clear</button>
        <button onClick={onClose} style={{ color: 'white', fontSize: '16px' }}>Close</button>
      </div>
    </div>
  );
};

export default Camera;