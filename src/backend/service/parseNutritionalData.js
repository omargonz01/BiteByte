import { calculateCalories } from './nutritionUtils.js';

// Function to normalize nutritional data based on the sum of the ingredients
function normalizeNutritionData(ingredients) {
  const totals = { fat: 0, carbohydrates: 0, protein: 0 };
  ingredients.forEach(ingredient => {
    totals.fat += parseFloat(ingredient.macronutrients.fat);
    totals.carbohydrates += parseFloat(ingredient.macronutrients.carbohydrates);
    totals.protein += parseFloat(ingredient.macronutrients.protein);
  });
  totals.calories = calculateCalories(totals); // Calculate total calories based on summed macronutrients
  return formatNutritionValues(totals);
}

// Function to parse nutritional data from JSON, including normalizing totals
function parseNutritionalData(jsonData) {
  if (!jsonData.dish || !Array.isArray(jsonData.ingredients) || !jsonData.totalNutrition) {
    throw new Error("JSON structure does not meet expected format.");
  }

  const structuredData = {
    dish: jsonData.dish,
    ingredients: jsonData.ingredients.map(ingredient => {
      const macronutrients = {
        fat: ingredient.macronutrients.fat,
        carbohydrates: ingredient.macronutrients.carbohydrates,
        protein: ingredient.macronutrients.protein
      };
      return {
        name: ingredient.name,
        quantity: ingredient.quantity || 'unknown quantity',
        unit: ingredient.unit || 'unknown unit',
        calories: calculateCalories(macronutrients),
        macronutrients
      };
    })
  };

  // Normalize and format total nutrition data
  structuredData.totals = normalizeNutritionData(structuredData.ingredients);

  return structuredData;
}

function cleanJsonText(rawText) {
  // Assumes rawText is a string containing JSON with possible surrounding non-JSON text
  return rawText.replace(/^[^{\[]+|[^}\]]+$/g, '').trim();
}

function isValidJson(jsonString) {
  try {
    JSON.parse(jsonString);
    return true;
  } catch (error) {
    console.error("Invalid JSON:", error);
    return false;
  }
}

function formatNutritionValues(nutritionData) {
  return Object.fromEntries(
    Object.entries(nutritionData).map(([key, value]) => [
      key, typeof value === 'number' ? parseFloat(value.toFixed(2)) : value
    ])
  );
}

export { parseNutritionalData, cleanJsonText, isValidJson, formatNutritionValues };
