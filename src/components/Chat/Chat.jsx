import React, { useState } from 'react';
import { analyzeTextAndGetNutrition } from '../../backend/service/apiService';
import bitebyteSpinner from '../../assets/bite1.gif';

function Chat({ onTextSubmitted, onNutritionData }) {
    const [textDescription, setTextDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!textDescription.trim()) return;

        const userMessage = { sender: 'user', text: textDescription };
        setMessages([...messages, userMessage]);
        setIsLoading(true);

        try {
            const nutritionData = await analyzeTextAndGetNutrition(textDescription);
            console.log("Nutrition data received from text description:", nutritionData);
            onNutritionData(nutritionData);
            onTextSubmitted && onTextSubmitted(textDescription);

            const aiMessage = { sender: 'ai', text: generateCoachResponse(nutritionData) };
            setMessages([...messages, userMessage, aiMessage]);
        } catch (error) {
            console.error('Error fetching nutrition data:', error);
        } finally {
            setIsLoading(false);
            setTextDescription('');  
        }
    };

    const generateCoachResponse = (data) => {
        if (data && data.success && data.finalNutritionData) {
            const macros = data.finalNutritionData.macros;
            return `Great choice! Your meal contains approximately ${macros.calories} calories, ${macros.protein}g of protein, ${macros.carbohydrates}g of carbohydrates, and ${macros.fat}g of fat. Keep it balanced!`;
        } else {
            return 'I couldn\'t analyze your meal. Please try again with a different description.';
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            backgroundColor: '#E7EFED'
        }}>
            <div style={{
                maxWidth: '768px',
                width: '100%',
                backgroundColor: '#FEFDF8',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                marginBottom: '14px'  
            }}>
                <h1 style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#5A6D57',
                    marginBottom: '1px'
                }}>Search & Chat</h1>
                <h1 style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#5A6D57',
                    marginBottom: '5px'
                }}>Search meals & chat with your AI Health Coach</h1>
                
            </div>
            <div className="chat-container" style={{
                maxWidth: '768px',
                width: '100%',
                backgroundColor: '#FEFDF8',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                padding: '24px'
            }}>
                <div className="messages space-y-4 overflow-y-auto h-80">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="loading-spinner text-center text-gray-500">Loading...</div>}
                </div>
                <div className="input-container flex mt-4">
                    <input
                        className="flex-grow p-2 border rounded-lg focus:outline-none"
                        type="text"
                        value={textDescription}
                        onChange={e => setTextDescription(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                        placeholder="Describe your meal..."
                        disabled={isLoading}
                    />
                    <button
                        className="text-white p-2 rounded-lg"
                        style={{ backgroundColor: '#5A6D57' }}
                        onClick={handleSubmit}
                        disabled={isLoading || !textDescription.trim()}
                    >
                        Chat
                    </button>
                </div>
                {isLoading && (
                    <div style={{ width: '50px', height: '50px', position: 'relative' }}>
                        <img src={bitebyteSpinner} alt="Loading..." style={{ width: '100%', height: '100%' }} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
