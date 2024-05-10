import axios from 'axios';

// Ensure your environment variable in .env file is prefixed with VITE_
// const API_URL = 'https://bitebyte-backend.onrender.com' || 'http://localhost:5000';
const API_URL = 'http://localhost:5000';


// Function to upload the image and get the nutritional data
const uploadImageAndGetNutrition = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  console.log('API_URL:', API_URL);
  try {
    const response = await axios.post(`${API_URL}/analyze-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data); // Log the response data in the console
    if (response.data.error) { 
      throw new Error(response.data.error);
    }
    return response.data; 
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; 
  }
};



export default uploadImageAndGetNutrition;
