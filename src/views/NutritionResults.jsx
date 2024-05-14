import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NutritionResults.css';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { auth } from '../backend/config/firebaseClient';

const NutritionResults = ({ nutritionData, onEditComplete }) => {
  const [details, setDetails] = useState({
    mealName: '',
    imageURL: '',
    date: '',
    totalCalories: 0,
    totalCarbs: 0,
    totalFat: 0,
    totalProteins: 0,
    ingredients: [],
  });
  const [isEditing, setIsEditing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (nutritionData) {
      setDetails({
        mealName: nutritionData.dish || 'N/A',
        imageURL: nutritionData.imageURL || 'default_image_url_here',
        date: moment().format('MMMM Do YYYY, h:mm:ss a'),
        totalCalories: nutritionData.macros.calories || 0,
        totalCarbs: nutritionData.macros.carbohydrates || 0,
        totalFat: nutritionData.macros.fat || 0,
        totalProteins: nutritionData.macros.protein || 0,
        ingredients: nutritionData.ingredients.map(ing => ({
          name: ing.name || 'N/A',
          calories: ing.calories || 0,
          carbs: ing.carbohydrates || 0,
          fat: ing.fat || 0,
          protein: ing.protein || 0,
        })),
      });
    }
  }, [nutritionData]);

  const handleNutritionChange = (e) => {
    const value = parseFloat(e.target.value);
    setDetails(prevDetails => ({
      ...prevDetails,
      [e.target.name]: isNaN(value) ? 0 : value
    }));
  };

  const handleSave = async () => {
    const updatedNutritionData = {
      ...nutritionData,
      id: nutritionData.id,
      mealName: details.mealName,
      imageURL: details.imageURL,
      totalCalories: details.totalCalories,
      totalCarbs: details.totalCarbs,
      totalFat: details.totalFat,
      totalProteins: details.totalProteins,
      ingredients: details.ingredients,
      lastUpdated: moment().format('MMMM Do YYYY, h:mm:ss a')
    };

    try {
      const user = auth.currentUser;
      if (user && user.uid) { // Check if user exists and has a UID
        const userId = user.uid;
        const mealId = nutritionData.id;
        const response = await fetch(`${import.meta.env.VITE_FIREBASE_PROJECT_ID}/users/${userId}/meals/${mealId}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedNutritionData),
        });
  
        if (response.ok) {
          onEditComplete(updatedNutritionData);
          setIsEditing(false);
          navigate('/');
        } else {
          throw new Error('Failed to update meal data');
        }
      } else {
        // User is not authenticated, just update the state with the edited data
        onEditComplete(updatedNutritionData);
        setIsEditing(false);
        navigate('/');
      }
    } catch (error) {
      console.error("Error updating meal data:", error);
      alert("Failed to update meal data. Please try again.");
    }
  };

  const handleClose = () => {
    onEditComplete({
      mealName: details.mealName,
      imageURL: details.imageURL,
      totalCalories: details.totalCalories,
      totalCarbs: details.totalCarbs,
      totalFat: details.totalFat,
      totalProteins: details.totalProteins,
      ingredients: details.ingredients
    }, true);
    setIsEditing(false);
  };

  const handleDelete = async () => {
  try {
    const user = auth.currentUser;
    if (user && user.uid) { 
      const userId = user.uid;
      const mealId = nutritionData.id;
      const response = await fetch(`${import.meta.env.VITE_FIREBASE_PROJECT_ID}/users/${userId}/meals/${mealId}.json`, {
        method: 'DELETE',
      });

      if (response.ok) {
        navigate('/');
      } else {
        throw new Error('Failed to delete meal');
      }
    } else {
      // User is not authenticated, just navigate to the home page
      navigate('/');
    }
  } catch (error) {
    console.error("Error deleting meal:", error);
    alert("Failed to delete meal. Please try again.");
  }
};

  return (
  <div className="nutrition-results">
    <div className="meal-header">
      <div className="meal-header-content">
        <h2>{details.mealName}</h2>
        <p>{details.date}</p>
      </div>
      <IconButton onClick={handleClose} aria-label="close" className="close-button">
        <CloseIcon />
      </IconButton>
      {!isEditing && (
        <>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
          <button onClick={handleDelete} className="delete-button">
            Delete
          </button>
        </>
      )}
    </div>
      <div className="meal-image">
        {details.imageURL && <img src={details.imageURL} alt={details.mealName} />}
      </div>
      <div className="nutrition-breakdown">
        {isEditing ? (
          <>
            <div className="nutrition-item">
              <label htmlFor="totalCalories">Calories</label>
              <input
                type="number"
                id="totalCalories"
                name="totalCalories"
                value={details.totalCalories}
                onChange={handleNutritionChange}
              />
            </div>
            <div className="nutrition-item">
              <label htmlFor="totalCarbs">Carbs</label>
              <input
                type="number"
                id="totalCarbs"
                name="totalCarbs"
                value={details.totalCarbs}
                onChange={handleNutritionChange}
              />
            </div>
            <div className="nutrition-item">
              <label htmlFor="totalProteins">Proteins</label>
              <input
                type="number"
                id="totalProteins"
                name="totalProteins"
                value={details.totalProteins}
                onChange={handleNutritionChange}
              />
            </div>
            <div className="nutrition-item">
              <label htmlFor="totalFat">Fats</label>
              <input
                type="number"
                id="totalFat"
                name="totalFat"
                value={details.totalFat}
                onChange={handleNutritionChange}
              />
            </div>
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          </>
        ) : (
          <>
            <div className="nutrition-item">Calories: {details.totalCalories} kcal</div>
            <div className="nutrition-item">Carbs: {details.totalCarbs} g</div>
            <div className="nutrition-item">Proteins: {details.totalProteins} g</div>
            <div className="nutrition-item">Fats: {details.totalFat} g</div>
          </>
        )}
      </div>
      <div className="ingredients-list">
        <h3>Ingredients</h3>
        <ul>
          {details.ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
              <strong>{ingredient.name}</strong>
              <div>
                <strong>Calories:</strong> {ingredient.calories} kcal
              </div>
              <div>
                <strong>Carbs:</strong> {ingredient.carbs} g,{' '}
                <strong>Protein:</strong> {ingredient.protein} g,{' '}
                <strong>Fat:</strong> {ingredient.fat} g
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NutritionResults; 