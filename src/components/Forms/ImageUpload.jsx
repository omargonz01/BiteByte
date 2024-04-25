import React, { useState } from 'react';
import uploadImageAndGetNutrition from '../../backend/service/apiService';

function ImageUpload({ onImageSelected, onNutritionData }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            try {
                // Call the API service function and wait for the nutrition data
                const nutritionData = await uploadImageAndGetNutrition(file);
                // Call the callback with the received nutrition data
                onNutritionData(nutritionData);
                // Also call the onImageSelected callback to handle the selected image
                onImageSelected(URL.createObjectURL(file)); 
            } catch (error) {
                // Handle any errors here
                console.error('Error fetching nutrition data:', error);
            }
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {selectedImage && (
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ width: '100px', height: '100px' }} />
            )}
        </div>
    );
}

export default ImageUpload;
