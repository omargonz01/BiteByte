import React, { useState } from 'react';
import uploadImageAndGetNutrition, { analyzeTextAndGetNutrition } from '../../backend/service/apiService';
import bitebyteSpinner from '../../assets/bite1.gif';

function Chat({ onTextSubmitted, onNutritionData }) {
    const [textDescription, setTextDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!textDescription.trim()) return;

        setIsLoading(true);
        try {
            const nutritionData = await analyzeTextAndGetNutrition(textDescription);
            console.log("Nutrition data received from text description:", nutritionData);
            onNutritionData(nutritionData);
            onTextSubmitted && onTextSubmitted(textDescription);
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        } finally {
            setIsLoading(false);
            setTextDescription('');  
            // Optionally clear the text input after processing
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={textDescription}
                    onChange={e => setTextDescription(e.target.value)}
                    placeholder="Describe your meal..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading || !textDescription.trim()}>Analyze Nutrition</button>
            </form>
            {isLoading && (
                <div style={{ width: '50px', height: '50px', position: 'relative' }}>
                    <img src={bitebyteSpinner} alt="Loading..." style={{ width: '100%', height: '100%' }} />
                </div>
            )}
        </div>
    );
}

export default Chat;
