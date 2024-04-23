// Function to calculate the average nutrition data from two sources
function averageNutrition(ingredientName, nutritionA, nutritionB) {
  const avgFat = ((nutritionA.fat || 0) + (nutritionB.fat || 0)) / 2;
  const avgCarbohydrates = ((nutritionA.carbohydrates || 0) + (nutritionB.carbohydrates || 0)) / 2;
  const avgProtein = ((nutritionA.protein || 0) + (nutritionB.protein || 0)) / 2;

  const calculatedCalories = (4 * avgProtein) + (4 * avgCarbohydrates) + (9 * avgFat);

  return {
    name: ingredientName,
    calories: calculatedCalories,
    fat: avgFat,
    carbohydrates: avgCarbohydrates,
    protein: avgProtein,
  };
}

// Function to sum up nutritional data for a list of ingredients
function sumNutrition(ingredients) {
  if (!ingredients || !Array.isArray(ingredients)) {
    console.error("Invalid ingredients array:", ingredients);
    return { calories: 0, fat: 0, carbohydrates: 0, protein: 0 };
  }
  return ingredients.reduce((totals, ingredient) => {
    totals.calories += ingredient.calories || 0;
    totals.fat += ingredient.fat || 0;
    totals.carbohydrates += ingredient.carbohydrates || 0;
    totals.protein += ingredient.protein || 0;
    return totals;
  }, { calories: 0, fat: 0, carbohydrates: 0, protein: 0 });
}

// Function to combine nutritional data from two sources and compute the average calories from macronutrients
function combineNutritionData(nutritionA, nutritionB) {
  const avgFat = (nutritionA.fat + nutritionB.fat) / 2;
  const avgCarbohydrates = (nutritionA.carbohydrates + nutritionB.carbohydrates) / 2;
  const avgProtein = (nutritionA.protein + nutritionB.protein) / 2;

  const calculatedCalories = (4 * avgProtein) + (4 * avgCarbohydrates) + (9 * avgFat);

  return {
      calories: calculatedCalories,
      fat: avgFat,
      carbohydrates: avgCarbohydrates,
      protein: avgProtein
  };
}

export {
  averageNutrition,
  sumNutrition,
  combineNutritionData
};
