// Function to calculate the average nutrition data from two sources
function averageNutrition(ingredientName, nutritionA, nutritionB) {
  return {
    name: ingredientName,
    calories: ((nutritionA.calories || 0) + (nutritionB.calories || 0)) / 2,
    fat: ((nutritionA.fat || 0) + (nutritionB.fat || 0)) / 2,
    carbohydrates: ((nutritionA.carbohydrates || 0) + (nutritionB.carbohydrates || 0)) / 2,
    protein: ((nutritionA.protein || 0) + (nutritionB.protein || 0)) / 2,
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


export {
  averageNutrition,
  sumNutrition,
};
