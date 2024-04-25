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
    console.log("Nutrition data received in App:", data);
    if (data && data.success) {
      setNutritionData(data.sumAveragedIngredientsNutrition); // Extracting the specific data slice
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
