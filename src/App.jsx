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
import SignIn from './components/Auth/AuthSignIn'; 
import SignUp from './components/Auth/AuthSignUp';
import Barcode from './views/Barcode';
import Chat from './components/Chat/Chat';
import './App.css';
import { auth } from './backend/config/firebaseClient';

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });
  const [isLoading, setIsLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [macros, setMacros] = useState({ calories: 0, carbohydrates: 0, protein: 0, fat: 0 });



  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNutritionData = async (data) => {
    console.log("Received nutrition data:", data);
  
    if (data && data.success && data.finalNutritionData) {
      setIsLoading(true);
  
      try {
        const userId = auth.currentUser?.uid;
  
        if (userId) {
          // User is authenticated, save the meal data to Firebase
          const response = await fetch(`${import.meta.env.VITE_FIREBASE_PROJECT_ID}/users/${userId}/meals.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data.finalNutritionData),
          });
  
          if (response.ok) {
            const newMealKey = await response.json();
            setNutritionData({
              id: newMealKey.name,
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
            throw new Error('Failed to save meal data');
          }
        } else {
          // User is not authenticated, update the state with the macro breakdown data without saving to Firebase
          const newMealData = data.finalNutritionData;
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
          setMeals([newMealData]); // Set the meals state with the new meal data
          setMacros(newMealData.macros); // Set the macros state with the new meal macros
          setShowEditModal(true);    
        }
      } catch (error) {
        console.error("Error saving meal data:", error);
        setSnackbar({
          open: true,
          message: "Failed to save meal data. Please try again.",
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Data missing or invalid:", data);
      setSnackbar({
        open: true,
        message: "No food detected or data is missing.",
        severity: 'error'
      });
    }
  };

  // add this function to handle chat nutrition data
  const handleChatNutritionData = (data) => {
    console.log("Received chat nutrition data:", data);
  
    if (data) {
      const formattedData = {
        totalCalories: data.total_calories || 0,
        macronutrients: {
          fats: data.macronutrients?.fats?.total || 0,
          carbohydrates: data.macronutrients?.carbohydrates?.total || 0,
          protein: data.macronutrients?.protein || 0
        }
      };
  
      console.log("Formatted chat nutrition data:", formattedData);
  
      // For now, just log the data or set it to a state variable if needed
      // setChatNutritionData(formattedData); // Optional: set this state if you need to render it somewhere
    } else {
      console.log("Data missing or invalid:", data);
      setSnackbar({
        open: true,
        message: "No food detected or data is missing.",
        severity: 'error',
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
  
      return {
        ...prevData,
        dish: updatedData.mealName,
        imageURL: updatedData.imageURL,
        macros: newMacros,
        originalMacros: newMacros,
        ingredients: updatedData.ingredients,
        editVersion: prevData.editVersion + 1
      };
    });
    
    // Update the macros state for non-signed-in users
    setMacros({
      calories: parseFloat(updatedData.totalCalories) || 0,
      carbohydrates: parseFloat(updatedData.totalCarbs) || 0,
      protein: parseFloat(updatedData.totalProteins) || 0,
      fat: parseFloat(updatedData.totalFat) || 0
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
              <Route path="/" element={<MacroBreakdown nutritionData={nutritionData} />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/barcode" element={<Barcode />} />
              <Route path="/chat" element={<Chat onTextSubmitted={() => {}} onChatNutritionData={handleChatNutritionData} />} />
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
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App; 