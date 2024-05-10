import { formatNutritionValues } from './parseNutritionalData.js';

// Utility function to calculate calories based on macronutrients
function calculateCalories({ protein, carbohydrates, fat }) {
  if ([protein, carbohydrates, fat].some(val => typeof val !== 'number')) {
    throw new TypeError('Nutritional values must be numbers');
  }
  return (4 * protein) + (4 * carbohydrates) + (9 * fat);
}

// Function to calculate the average nutrition data from two sources
function averageNutrition(ingredientName, nutritionA, nutritionB) {
  if (!nutritionA || !nutritionB) {
    throw new Error('Nutritional data must not be null');
  }
  const averageData = {
    fat: ((nutritionA.fat || 0) + (nutritionB.fat || 0)) / 2,
    carbohydrates: ((nutritionA.carbohydrates || 0) + (nutritionB.carbohydrates || 0)) / 2,
    protein: ((nutritionA.protein || 0) + (nutritionB.protein || 0)) / 2,
  };

  averageData.calories = calculateCalories(averageData);

  return {
    name: ingredientName,
    ...formatNutritionValues(averageData)
  };
}

// Function to sum up nutritional data for a list of ingredients
function sumNutrition(ingredients) {
  if (!Array.isArray(ingredients)) {
    throw new TypeError('Ingredients must be an array');
  }
  const sumData = ingredients.reduce((totals, ingredient) => {
    totals.fat += ingredient.fat || 0;
    totals.carbohydrates += ingredient.carbohydrates || 0;
    totals.protein += ingredient.protein || 0;
    return totals;
  }, { fat: 0, carbohydrates: 0, protein: 0 });

  sumData.calories = calculateCalories(sumData);

  return formatNutritionValues(sumData);
}

// Function to combine nutritional data from two sources
function combineNutritionData(nutritionA, nutritionB) {
  const combinedData = {
    fat: (nutritionA.fat + nutritionB.fat) / 2,
    carbohydrates: (nutritionA.carbohydrates + nutritionB.carbohydrates) / 2,
    protein: (nutritionA.protein + nutritionB.protein) / 2,
  };

  combinedData.calories = calculateCalories(combinedData); // Calculate total calories based on combined macros

  return formatNutritionValues(combinedData);
}

export {
  calculateCalories, // Export if you find it useful elsewhere
  averageNutrition,
  sumNutrition,
  combineNutritionData
};
