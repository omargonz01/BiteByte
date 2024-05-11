import axios from 'axios';
import { formatNutritionValues } from '../service/parseNutritionalData.js';

// Define Edamam API endpoints
const NUTRITION_API_ENDPOINT = 'https://api.edamam.com/api/nutrition-data';
const FOOD_DATABASE_API_ENDPOINT = 'https://api.edamam.com/api/food-database/v2/parser';
const RECIPE_SEARCH_API_ENDPOINT = 'https://api.edamam.com/api/recipes/v2';

/**
 * Retrieves information about a specific ingredient from the Edamam Food Database API.
 * Uses API keys stored in environment variables for front-end use.
 * 
 * @param {string} ingredient - The name of the ingredient to search for.
 * @returns {Promise<Object>} A promise that resolves to the API response data.
 * @throws {Error} Throws an error if the API request fails.
 */
async function getFoodDatabaseInfo(ingredient) {
  try {
    const response = await axios.get(FOOD_DATABASE_API_ENDPOINT, {
      params: {
        app_id: import.meta.env.VITE_EDAMAM_FOOD_APP_ID,
        app_key: import.meta.env.VITE_EDAMAM_FOOD_APP_KEY,
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
 * Searches for recipes based on a given query using the Edamam Recipe Search API.
 * Uses API keys configured for client-side use.
 * 
 * @param {string} query - The search query.
 * @returns {Promise<Object>} A promise that resolves to the search results from the API.
 * @throws {Error} Throws an error if the API request fails.
 */
async function searchRecipes(query) {
  try {
    const response = await axios.get(RECIPE_SEARCH_API_ENDPOINT, {
      params: {
        app_id: import.meta.env.VITE_EDAMAM_RECIPE_APP_ID,
        app_key: import.meta.env.VITE_EDAMAM_RECIPE_APP_KEY,
        type: 'public',
        q: query
      }
    });

    // Transform the data to include additional details
    return response.data.hits.map(hit => ({
      name: hit.recipe.label,
      image: hit.recipe.image,
      url: hit.recipe.url,
      calories: Math.floor(hit.recipe.calories),
      servings: hit.recipe.yield,
      dietLabels: hit.recipe.dietLabels,
      healthLabels: hit.recipe.healthLabels,
      ingredientLines: hit.recipe.ingredientLines,
      totalNutrients: { 
        protein: hit.recipe.totalNutrients.PROCNT.quantity,
        fat: hit.recipe.totalNutrients.FAT.quantity,
        carbs: hit.recipe.totalNutrients.CHOCDF.quantity}
    }));
  } catch (error) {
    console.error('Error in Recipe Search API:', error.message);
    throw error;
  }
}

/**
 * Formats a list of ingredients into a string suitable for API calls to Edamam.
 * 
 * @param {Array} ingredients - The ingredients to format.
 * @returns {string} A formatted string of ingredients.
 */
function formatIngredientsForEdamam(ingredients) {
  return ingredients.map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`).join(',\n');
}

/**
 * Retrieves nutritional information for a specific ingredient from the Edamam Nutrition API.
 * 
 * @param {Object} ingredient - The ingredient with quantity, unit, and name.
 * @returns {Promise<Object>} A promise that resolves to formatted nutritional information.
 * @throws {Error} Throws an error if the API request fails or if no nutritional data is found.
 */
async function getNutritionalInfoForIngredient(ingredient) {
  const ingredientString = `${ingredient.quantity} ${ingredient.unit || 'g'} ${ingredient.name}`;
  
  try {
    const response = await axios.get(NUTRITION_API_ENDPOINT, {
      params: {
        app_id: process.env.EDAMAM_NUTRITION_APP_ID,
        app_key: process.env.EDAMAM_NUTRITION_APP_KEY,
        ingr: ingredientString
      }
    });
    if (response.data && response.data.totalNutrients) {
      return formatNutritionValues(extractKeyNutrients(response.data));
    } else {
      console.error('No nutritional data found or missing totalNutrients:', response.data);
      throw new Error('Nutritional data is missing from the response.');
    }
  } catch (error) {
    console.error('Error getting nutritional info for ingredient:', ingredient.name, error);
    throw error;
  }
}

/**
 * Extracts and formats key nutritional values from API response data.
 * 
 * @param {Object} data - The API response data.
 * @returns {Object} Formatted nutritional values.
 */
function extractKeyNutrients(data) {
  if (!data || !data.totalNutrients) {
    console.error("Invalid Edamam data structure:", data);
    return null;
  }

  let nutrients = {
    calories: data.calories,
    fat: data.totalNutrients.FAT?.quantity || 0,
    carbohydrates: data.totalNutrients.CHOCDF?.quantity || 0,
    protein: data.totalNutrients.PROCNT?.quantity || 0
  };
  return formatNutritionValues(nutrients);
}

export { getFoodDatabaseInfo, searchRecipes, getNutritionalInfoForIngredient };
