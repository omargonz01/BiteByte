import React, { useState } from 'react';
import uploadImageAndGetNutrition from '../../backend/service/apiService';
import bitebyteSpinner from '../../assets/bite1.gif';


function ImageUpload({ onImageSelected, onNutritionData }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);

            await processImage(file);
        }
    };

    const processImage = async (file) => {
        setIsLoading(true);
        try {
            const nutritionData = await uploadImageAndGetNutrition(file);
            console.log("Nutrition data received in ImageUpload:", nutritionData); // Log received data
            onNutritionData(nutritionData);
            onImageSelected && onImageSelected(file);
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        } finally {
            setIsLoading(false);
            setSelectedImage(null); // Optionally clear the selected image
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
            {isLoading ? (
                // Show spinner when image is being processed
                <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                    <img src={bitebyteSpinner} alt="Loading..." style={{ width: '100%', height: '100%' }} />
                </div>
            ) : selectedImage && (
                <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ width: '100px', height: '100px' }} />
            )}
            {/* When not loading, show the selected image */}
        </div>
    );
}

export default ImageUpload;
