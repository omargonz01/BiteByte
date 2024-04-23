import { formatNutritionValues } from './parseNutritionalData.js';

// Function to calculate the average nutrition data from two sources
function averageNutrition(ingredientName, nutritionA, nutritionB) {
  const averageData = {
    fat: ((nutritionA.fat || 0) + (nutritionB.fat || 0)) / 2,
    carbohydrates: ((nutritionA.carbohydrates || 0) + (nutritionB.carbohydrates || 0)) / 2,
    protein: ((nutritionA.protein || 0) + (nutritionB.protein || 0)) / 2,
  };

  averageData.calories = (4 * averageData.protein) + (4 * averageData.carbohydrates) + (9 * averageData.fat);

  return {
    name: ingredientName,
    ...formatNutritionValues(averageData)
  };
}

// Function to sum up nutritional data for a list of ingredients
function sumNutrition(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) {
    console.error("Invalid ingredients array:", ingredients);
    return { calories: 0, fat: 0, carbohydrates: 0, protein: 0 };
  }
  const sumData = ingredients.reduce((totals, ingredient) => {
    totals.calories += ingredient.calories || 0;
    totals.fat += ingredient.fat || 0;
    totals.carbohydrates += ingredient.carbohydrates || 0;
    totals.protein += ingredient.protein || 0;
    return totals;
  }, { calories: 0, fat: 0, carbohydrates: 0, protein: 0 });

  return formatNutritionValues(sumData);
}

// Function to combine nutritional data from two sources and compute the average calories from macronutrients
function combineNutritionData(nutritionA, nutritionB) {
  let combinedData = {
    fat: (nutritionA.fat + nutritionB.fat) / 2,
    carbohydrates: (nutritionA.carbohydrates + nutritionB.carbohydrates) / 2,
    protein: (nutritionA.protein + nutritionB.protein) / 2,
  };

  combinedData.calories = (4 * combinedData.protein) + (4 * combinedData.carbohydrates) + (9 * combinedData.fat);
  combinedData = formatNutritionValues(combinedData);

  return combinedData;
}

export {
  averageNutrition,
  sumNutrition,
  combineNutritionData
};
