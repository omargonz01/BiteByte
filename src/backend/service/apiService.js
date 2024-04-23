import axios from 'axios';

const API_URL = 'http://localhost:5000'; 

// Function to upload the image and get the nutritional data
const uploadImageAndGetNutrition = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await axios.post(`${API_URL}/analyze-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data); // Log the response data in the console
    return response.data; // This should contain the nutritional data
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // You may want to handle this error differently
  }
};

export default uploadImageAndGetNutrition;
