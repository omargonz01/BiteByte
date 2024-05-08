import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material'; 
import Nav from './components/Nav/Nav';
import Welcome from './views/Welcome';
import Header from './components/Home/Header';
import MacroBreakdown from './components/Home/MacroBreakdown';
import DateDisplay from './components/Home/DateDisplay';
import NutritionResults from './views/NutritionResults';
import Stats from './views/Stats'; 
import Recipes from './views/Recipes'; 
import Profile from './views/Profile'; 
import Barcode from './views/Barcode';
import Search from './views/Search';
import './App.css';

const initialState = {
  dish: '',
  imageURL: '',
  macros: {
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0
  },
  originalMacros: {
    calories: 0,
    carbohydrates: 0,
    protein: 0,
    fat: 0
  },
  ingredients: [],
  editVersion: 0
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [nutritionData, setNutritionData] = useState(initialState);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' }); // Added state for snackbar

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNutritionData = (data) => {
    console.log("Received nutrition data:", data); // Add this log
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
      console.log("Nutrition data set in state:", nutritionData); // Log after state update
    } else {
      // Log an error or handle the case where data is missing
      console.log("Data missing or invalid:", data);
      setSnackbar({
        open: true,
        message: "No food detected or data is missing.",
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleEditComplete = (updatedData, resetMacros = false) => {
    setNutritionData(prevData => {
      const newMacros = resetMacros ? {
        calories: 0,
        carbohydrates: 0,
        protein: 0,
        fat: 0
      } : {
        calories: parseFloat(updatedData.totalCalories) || 0,
        carbohydrates: parseFloat(updatedData.totalCarbs) || 0,
        protein: parseFloat(updatedData.totalProteins) || 0,
        fat: parseFloat(updatedData.totalFat) || 0
      };
  
      // Directly update without calculating differences
      return {
        ...prevData,
        dish: updatedData.mealName,
        imageURL: updatedData.imageURL,
        macros: newMacros, // Update directly with new values
        originalMacros: newMacros, // Keep sync between original and current
        ingredients: updatedData.ingredients,
        editVersion: prevData.editVersion + 1
      };
    });
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
              <Routes>
                <Route path="/" element={<MacroBreakdown nutrition={nutritionData.macros} />} />
                <Route path="/stats" element={<Stats />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/barcode" element={<Barcode />} />
                <Route path="/search" element={<Search />} />
                <Route path="/nutrition-results" element={<NutritionResults nutritionData={nutritionData} onEditComplete={handleEditComplete} />} />
              </Routes>
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
        <Snackbar open={false} autoHideDuration={6000}>
          <Alert severity="info">
            Sample message
          </Alert>
        </Snackbar>
      </div>
    </BrowserRouter>
  );
}

export default App;
