require('dotenv').config();
const axios = require('axios');

// Edamam API Endpoints
const NUTRITION_API_ENDPOINT = 'https://api.edamam.com/api/nutrition-data';
const FOOD_DATABASE_API_ENDPOINT = 'https://api.edamam.com/api/food-database/v2/parser';
const RECIPE_SEARCH_API_ENDPOINT = 'https://api.edamam.com/api/recipes/v2';

// Function to call the Nutrition Analysis API
async function getNutritionalAnalysis(ingredients) {
  try {
    const response = await axios.get(NUTRITION_API_ENDPOINT, {
      params: {
        app_id: process.env.EDAMAM_NUTRITION_APP_ID,
        app_key: process.env.EDAMAM_NUTRITION_APP_KEY,
        ingr: ingredients
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in Nutrition Analysis API:', error.message);
    throw error;
  }
}

// Function to call the Food Database API
async function getFoodDatabaseInfo(ingredient) {
  try {
    const response = await axios.get(FOOD_DATABASE_API_ENDPOINT, {
      params: {
        app_id: process.env.EDAMAM_FOOD_APP_ID,
        app_key: process.env.EDAMAM_FOOD_APP_KEY,
        ingr: ingredient
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in Food Database API:', error.message);
    throw error;
  }
}

// Function to call the Recipe Search API
async function searchRecipes(query) {
  try {
    const response = await axios.get(RECIPE_SEARCH_API_ENDPOINT, {
      params: {
        app_id: process.env.EDAMAM_RECIPE_APP_ID,
        app_key: process.env.EDAMAM_RECIPE_APP_KEY,
        type: 'public',
        q: query
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in Recipe Search API:', error.message);
    throw error;
  }
}

module.exports = {
  getNutritionalAnalysis,
  getFoodDatabaseInfo,
  searchRecipes
};
