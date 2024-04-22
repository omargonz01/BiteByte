// Function to calculate the average nutrition data from two sources
function averageNutrition(nutritionA, nutritionB) {
    return {
      calories: (nutritionA.calories + nutritionB.calories) / 2,
      fat: (nutritionA.fat + nutritionB.fat) / 2,
      carbohydrates: (nutritionA.carbohydrates + nutritionB.carbohydrates) / 2,
      protein: (nutritionA.protein + nutritionB.protein) / 2,
    };
  }
  
  // Function to sum up nutritional data for a list of ingredients
  function sumNutrition(ingredients) {
    return ingredients.reduce((totals, ingredient) => {
      totals.calories += ingredient.calories;
      totals.fat += ingredient.fat;
      totals.carbohydrates += ingredient.carbohydrates;
      totals.protein += ingredient.protein;
      return totals;
    }, { calories: 0, fat: 0, carbohydrates: 0, protein: 0 });
  }
  
  // Function to create a total nutrition summary from ingredient averages
  function totalFromAverages(averagedIngredients) {
    const totals = sumNutrition(averagedIngredients);
    return {
      calories: totals.calories,
      fat: totals.fat,
      carbohydrates: totals.carbohydrates,
      protein: totals.protein
    };
  }
  
  // Function to calculate the average of two sets of nutritional information
  function totalAverages(geminiNutrition, edamamNutrition) {
    return averageNutrition(geminiNutrition, edamamNutrition);
  }
  
  export {
    averageNutrition,
    sumNutrition,
    totalFromAverages,
    totalAverages
  };
  