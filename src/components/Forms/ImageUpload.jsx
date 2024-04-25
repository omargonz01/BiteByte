import React, { useState } from 'react';
import uploadImageAndGetNutrition from '../../backend/service/apiService';

function ImageUpload({ onImageSelected, onNutritionData }) {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            try {
                // Here you call the API service function and wait for the nutrition data
                const nutritionData = await uploadImageAndGetNutrition(file);
                console.log(nutritionData); // Log or set state with this data
                // Instead of logging now, we call the callback with nutrition data
                onNutritionData(nutritionData);
                onImageSelected(file); 
            } catch (error) {
                // Handle any errors here, such as updating the state to show an error message to the user
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
