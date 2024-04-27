import React, { useState, useEffect } from 'react';
import Nav from './components/Nav/Nav';
import Welcome from './views/Welcome';
import Header from './components/Home/Header';
import MacroBreakdown from './components/Home/MacroBreakdown';
import DateDisplay from './components/Home/DateDisplay';
import './App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [nutritionData, setNutritionData] = useState({
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNutritionData = (data) => {
    // console.log("Nutrition data received in App:", data);
    // Check if the received data has the macros and set up flag
    if (data && data.success && data.finalNutritionData && data.finalNutritionData.macros) {
      // Change where im pulling data from
      setNutritionData({
        calories: data.finalNutritionData.macros.calories,
        carbohydrates: data.finalNutritionData.macros.carbohydrates,
        protein: data.finalNutritionData.macros.protein,
        fat: data.finalNutritionData.macros.fat
      });
    } else {
      // Log an error if the data is missing the required fields
      console.error("Received data is missing 'finalNutritionData' or 'macros'");
    }
  };

  if (showWelcome) {
    return <Welcome />;
  }

  return (
    
    <div className="app">
      <Header />
      <DateDisplay />
      <main className="main-content">
        {nutritionData && <MacroBreakdown nutrition={nutritionData} />}
      </main>
      <Nav onNutritionDataReceived={handleNutritionData} />
    </div>
  );
}

export default App;
