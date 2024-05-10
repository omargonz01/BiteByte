import React, { useState } from 'react';
import uploadImageAndGetNutrition from '../../backend/service/apiService';
import bitebyteSpinner from '../../assets/bite1.gif';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

function ImageUpload({ onImageSelected, onNutritionData }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleImageChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            await processImage(file);
        }
    };

    const processImage = async (file) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const nutritionData = await uploadImageAndGetNutrition(file);
            console.log("Nutrition data received:", nutritionData);
            onNutritionData(nutritionData);
            onImageSelected && onImageSelected(file);
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
            setErrorMessage(
                <>
                  <strong>Error</strong>
                  <br />
                  <span>Oops! Unable to fetch nutrition data. Please ensure the image is of food and try again.</span>
                </>
            );
        } finally {
            setIsLoading(false);
            setSelectedImage(null);
        }
    };

    return (
        <div>
    <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
    {isLoading ? (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100px', 
            width: '100%' 
        }}>
            <img src={bitebyteSpinner} alt="Loading..." style={{ 
                maxWidth: '100px', 
                maxHeight: '100px'  
            }} />
            
        </div>
    ) : selectedImage && (
        <img src={URL.createObjectURL(selectedImage)} alt="Preview" style={{ 
            width: '100px', 
            height: '100px' 
        }} />
    )}
    {errorMessage && (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            color: '#DB4F23', 
            marginTop: '10px'
        }}>
            <ErrorOutlineOutlinedIcon style={{ marginRight: '8px' }} />
            <div>{errorMessage}</div>
        </div>
    )}
</div>
    );
}

export default ImageUpload;
