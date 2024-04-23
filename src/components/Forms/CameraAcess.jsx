import React, { useState, useRef, useEffect } from 'react';

const Camera = ({ onCapture, onClear }) => {
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
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={handleCapture}>Capture</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

export default Camera;
