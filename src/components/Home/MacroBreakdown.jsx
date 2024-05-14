import React, { useState, useEffect } from 'react';
import './MacroBreakdown.css';
import { auth } from '../../backend/config/firebaseClient';
import Meal from '../Forms/Meal'; 

const MacroCounter = ({ label, value }) => (
  <div className="text-center py-1 px-4">
    <div className="text-lg font-bold">{value.toFixed(0)}g</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const MacroBreakdown = ({ nutritionData }) => {
  const [macros, setMacros] = useState({ calories: 0, carbohydrates: 0, protein: 0, fat: 0 });
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    if (nutritionData.macros) {
      setMacros(nutritionData.macros);
    }
  }, [nutritionData]);

  useEffect(() => {
    const fetchMacros = async () => {
      try {
        setIsLoading(true);
        const user = auth.currentUser;
        if (user && user.uid) { 
          const userId = user.uid;
          const response = await fetch(`${import.meta.env.VITE_FIREBASE_PROJECT_ID}/users/${userId}/meals.json?page=${currentPage}&limit=10`);
    
          if (response.ok) {
            const data = await response.json();
            const meals = data ? Object.values(data) : [];
            const totalMacros = meals.reduce((total, meal) => ({
              calories: total.calories + meal.macros.calories,
              carbohydrates: total.carbohydrates + meal.macros.carbohydrates,
              protein: total.protein + meal.macros.protein,
              fat: total.fat + meal.macros.fat,
            }), { calories: 0, carbohydrates: 0, protein: 0, fat: 0 });
    
            setMacros(totalMacros);
            setMeals(meals);
            setError(null);
            setTotalPages(Math.ceil(meals.length / 10));
          } else {
            throw new Error('Failed to fetch macros');
          }
        } else {
          // User is not authenticated or signed in
          setMeals([]); // Clear the meals array
          // setMacros({ calories: 0, carbohydrates: 0, protein: 0, fat: 0 }); // Reset macros to 0
          setError(null); // Clear any previous error
        }
      } catch (error) {
        console.error('Error fetching macros:', error);
        setError('Failed to fetch macros. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMacros();
  }, [currentPage, nutritionData]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="text-3xl font-bold text-gray-700 mb-1">
            {macros.calories.toFixed(0)}
          </div>
          <div className="text-xl text-gray-600">CALS EATEN</div>
          <div className="text-gray-600 text-md font-semibold mt-20 mb-5">
            MACRO BREAKDOWN
          </div>
          <div className="bg-white rounded-lg shadow p-2 flex justify-around w-80">
            <MacroCounter label="Carbs" value={macros.carbohydrates} />
            <MacroCounter label="Protein" value={macros.protein} />
            <MacroCounter label="Fat" value={macros.fat} />
          </div>
          <div className="mt-8">
            {meals.map((meal, index) => (
              <Meal key={index} meal={meal} />
            ))}
          </div>
          
        </>
      )}
    </div>
  );
};

export default MacroBreakdown;