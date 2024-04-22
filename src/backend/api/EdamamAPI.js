import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { extractKeyNutrients as parseExtractKeyNutrients } from '../service/parseNutritionalData.js';

// Edamam API Endpoints
const NUTRITION_API_ENDPOINT = 'https://api.edamam.com/api/nutrition-data';
const FOOD_DATABASE_API_ENDPOINT = 'https://api.edamam.com/api/food-database/v2/parser';
const RECIPE_SEARCH_API_ENDPOINT = 'https://api.edamam.com/api/recipes/v2';

/**
 * Calls the Food Database API to get information about a specific ingredient.
 * @param {string} ingredient - The ingredient to search for.
 * @returns {Promise<Object>} The response from the Food Database API.
 */
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

/**
 * Searches for recipes based on a query string.
 * @param {string} query - The search query.
 * @returns {Promise<Object>} The search results.
 */
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

/**
 * Formats a list of ingredients into a string suitable for Edamam API calls.
 * @param {Array} ingredients - The ingredients to format.
 * @returns {string} A formatted string of ingredients.
 */
function formatIngredientsForEdamam(ingredients) {
  return ingredients.map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`).join(',\n');
}

/**
 * Retrieves nutritional information for a single ingredient from Edamam.
 * @param {Object} ingredient - The ingredient to analyze.
 * @returns {Promise<Object>} Nutritional information for the ingredient.
 */
async function getNutritionalInfoForIngredient(ingredient) {
  const app_id = process.env.EDAMAM_NUTRITION_APP_ID;
  const app_key = process.env.EDAMAM_NUTRITION_APP_KEY;
  const ingredientString = `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`;

  try {
    const response = await axios.get(NUTRITION_API_ENDPOINT, {
      params: {
        app_id,
        app_key,
        ingr: ingredientString
      }
    });
    return extractKeyNutrients(response.data);
  } catch (error) {
    console.error('Error getting nutritional info for ingredient:', ingredient.name, error);
    throw error;
  }
}

/**
 * Extracts key nutrients from API response data.
 * @param {Object} data - The API response data.
 * @returns {Object} Key nutritional values.
 */
function extractKeyNutrients(data) {
  const { calories, totalNutrients } = data;
  return {
    calories,
    fat: totalNutrients.FAT?.quantity || 0,
    carbohydrates: totalNutrients.CHOCDF?.quantity || 0,
    protein: totalNutrients.PROCNT?.quantity || 0
  };
}

export { getFoodDatabaseInfo, searchRecipes, getNutritionalInfoForIngredient };
