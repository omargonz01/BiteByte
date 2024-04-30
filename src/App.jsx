import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import Welcome from './views/Welcome';
import Header from './components/Home/Header';
import MacroBreakdown from './components/Home/MacroBreakdown';
import DateDisplay from './components/Home/DateDisplay';
import NutritionResults from './views/NutritionResults';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [nutritionData, setNutritionData] = useState({
    dish: '',
    imageURL: '',
    macros: {
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fat: 0
    },
    ingredients: [],
    editVersion: 0 
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNutritionData = (data) => {
    if (data && data.success && data.finalNutritionData) {
      setNutritionData({
        dish: data.finalNutritionData.dish,
        imageURL: data.finalNutritionData.imageURL,
        macros: {
          calories: data.finalNutritionData.macros.calories,
          carbohydrates: data.finalNutritionData.macros.carbohydrates,
          protein: data.finalNutritionData.macros.protein,
          fat: data.finalNutritionData.macros.fat
        },
        ingredients: data.finalNutritionData.ingredients,
        editVersion: nutritionData.editVersion + 1 
      });
      setShowEditModal(true);
    } else {
      console.error("Received data is missing 'finalNutritionData' or 'macros'");
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
  };

  const handleEditComplete = (updatedData) => {
    setNutritionData(prevData => ({
      ...prevData,
      dish: updatedData.mealName,
      imageURL: updatedData.imageURL,
      macros: {
        calories: prevData.macros.calories + parseFloat(updatedData.totalCalories),
        carbohydrates: prevData.macros.carbohydrates + parseFloat(updatedData.totalCarbs),
        protein: prevData.macros.protein + parseFloat(updatedData.totalProteins),
        fat: prevData.macros.fat + parseFloat(updatedData.totalFat)
      },
      ingredients: [...prevData.ingredients, ...updatedData.ingredients], // Assuming you want to add new ingredients
      editVersion: prevData.editVersion + 1
    }));
    setShowEditModal(false);
  };

  return (
    <BrowserRouter>
      <div className="app">
        {showWelcome ? (
          <Welcome />
        ) : (
          <>
            <Header />
            <DateDisplay />
            <main className="main-content">
            <MacroBreakdown nutrition={nutritionData.macros} />
              {showEditModal && (
                <NutritionResults
                  nutritionData={nutritionData}
                  onEditComplete={handleEditComplete}
                />
              )}
            </main>
            <Nav onNutritionDataReceived={handleNutritionData} />
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
