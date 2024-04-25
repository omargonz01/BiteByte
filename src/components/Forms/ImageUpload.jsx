import React, { useState } from 'react';
import uploadImageAndGetNutrition from '../../backend/service/apiService';

function ImageUpload({ onImageSelected, onNutritionData }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0] && !isLoading) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setIsLoading(true); 

            try {
                const nutritionData = await uploadImageAndGetNutrition(file);
                console.log("Nutrition data received in ImageUpload:", nutritionData);  // Log received data
                onNutritionData(nutritionData);
                onImageSelected && onImageSelected(file); 
            } catch (error) {
                console.error('Error fetching nutrition data:', error);
            } finally {
                setIsLoading(false); 
            }
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
            {selectedImage && (
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ width: '100px', height: '100px' }} />
            )}
            {isLoading && <p>Loading...</p>}
        </div>
    );
}

export default ImageUpload;