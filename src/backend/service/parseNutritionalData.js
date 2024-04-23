function parseNutritionalData(jsonData) {
    // Assuming jsonData is a valid JavaScript object already parsed from JSON
    const structuredData = {
        dish: jsonData.dish, 
        ingredients: jsonData.ingredients.map(ingredient => ({
            name: ingredient.name,
            quantity: ingredient.quantity || 'unknown quantity',
            unit: ingredient.unit || 'unknown unit', 
            calories: ingredient.calories,
            macronutrients: {
                fat: ingredient.macronutrients.fat,
                carbohydrates: ingredient.macronutrients.carbohydrates,
                protein: ingredient.macronutrients.protein
            }
        })),
        totals: {
          totalCalories: jsonData.totalNutrition.calories,
          totalFat: jsonData.totalNutrition.fat,
          totalCarbohydrates: jsonData.totalNutrition.carbohydrates,
          totalProtein: jsonData.totalNutrition.protein
        }
    };

    // Format all numerical values in totals using the formatNutritionValues function
    structuredData.totals = formatNutritionValues(structuredData.totals);
    return structuredData;
}

function extractKeyNutrients(edamamData) {
  // Extract only the required nutrients from the Edamam response
  let requiredNutrients = {
    calories: edamamData.totalNutrientsKCal.ENERC_KCAL.quantity || 0,
    fat: edamamData.totalNutrients.FAT.quantity || 0,
    carbohydrates: edamamData.totalNutrients.CHOCDF.quantity || 0,
    protein: edamamData.totalNutrients.PROCNT.quantity || 0
  };

  // Format all numerical values using the formatNutritionValues function
  return formatNutritionValues(requiredNutrients);
}

function cleanJsonText(rawText) {
    // Removes Markdown code block syntax and trims any unwanted whitespace
    return rawText.replace(/^[^{\[]+|[^}\]]+$/g, '').trim(); // Removes anything before the first { or [ and after the last } or ]
  }

function isValidJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
  
      if (!data.dish || !Array.isArray(data.ingredients) || !data.totalNutrition) {
        throw new Error("JSON structure does not meet expected format.");
      }
  
      data.ingredients.forEach(ingredient => {
        // Convert quantity to a number if it's a string that represents a number
        if (typeof ingredient.quantity === "string" && !isNaN(ingredient.quantity)) {
          ingredient.quantity = parseFloat(ingredient.quantity);
        }
  
        if (typeof ingredient.quantity !== "number") {
          console.error(`Invalid quantity format for ingredient:`, ingredient);
          throw new Error("Quantity must be numeric.");
        }
      });
  
      return data; // Return the parsed and corrected data
    } catch (e) {
      console.error("Invalid JSON:", e);
      return false; // Return false if JSON is invalid
    }
  }

function formatNutritionValues(nutritionData) {
    // Create a new object to prevent mutation of the original data
    let formattedData = {};
  
    // Iterate over each key in the nutritionData object
    for (let key in nutritionData) {
      if (typeof nutritionData[key] === 'number') {
        // Format the numeric values to two decimal places
        formattedData[key] = parseFloat(nutritionData[key].toFixed(2));
      } else {
        // Copy non-numeric values as they are
        formattedData[key] = nutritionData[key];
      }
    }
  
    return formattedData;
  }
  
  
  export { parseNutritionalData, extractKeyNutrients, cleanJsonText, isValidJson, formatNutritionValues };
