import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { admin } from './firebaseAdminSetup.js';
import { analyzeImage } from './api/GeminiAPI.js';
import { getNutritionalInfoForIngredient } from './api/EdamamAPI.js';
import { averageNutrition, sumNutrition, combineNutritionData } from './service/nutritionUtils.js';

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/analyze-image', upload.single('image'), async (req, res) => {
  let responseToSend = { success: false, error: 'An error occurred' };

  if (!req.file) {
    responseToSend.error = 'No file uploaded.';
    return res.status(400).json(responseToSend);
  }

  try {
    const imageBase64 = Buffer.from(fs.readFileSync(req.file.path)).toString('base64');
    const structuredData = await analyzeImage(imageBase64);

    if (!structuredData || !Array.isArray(structuredData.ingredients)) {
      throw new Error("Missing or invalid structured data from image analysis.");
    }

    // Compute nutritional data for each ingredient using Edamam API and average it with Gemini's data
    const edamamIngredientsNutrition = await Promise.all(structuredData.ingredients.map(async ingredient => {
      const nutritionData = await getNutritionalInfoForIngredient(ingredient);
      return {
        ...ingredient,
        nutrition: nutritionData
      };
    }));

    let edamamTotalNutrition = { calories: 0, fat: 0, carbohydrates: 0, protein: 0 };
    edamamIngredientsNutrition.forEach(ing => {
      edamamTotalNutrition.calories += ing.nutrition.calories;
      edamamTotalNutrition.fat += ing.nutrition.fat;
      edamamTotalNutrition.carbohydrates += ing.nutrition.carbohydrates;
      edamamTotalNutrition.protein += ing.nutrition.protein;
    });

    const averagedIngredientsNutrition = edamamIngredientsNutrition.map(ing => averageNutrition(ing.name, ing.macronutrients, ing.nutrition));
    const sumAveragedIngredientsNutrition = sumNutrition(averagedIngredientsNutrition);

    const averagedTotalNutrition = averageNutrition(
      "Total Nutrition",
      {
        calories: structuredData.totals.totalCalories || 0,
        fat: structuredData.totals.totalFat || 0,
        carbohydrates: structuredData.totals.totalCarbohydrates || 0,
        protein: structuredData.totals.totalProtein || 0
      },
      edamamTotalNutrition
    );
    const combinedGeminiEdamamIngredientsNutrition = combineNutritionData(averagedTotalNutrition, sumAveragedIngredientsNutrition);

    console.log("Edamam Ingredients Nutrition:", JSON.stringify(edamamIngredientsNutrition, null, 2));

    // const averagedIngredientsNutrition = edamamIngredientsNutrition.map(ing => averageNutrition(ing.name, ing.macronutrients, ing.nutrition));
    console.log("Averaged Ingredients Nutrition:", JSON.stringify(averagedIngredientsNutrition, null, 2));

    // const sumAveragedIngredientsNutrition = sumNutrition(averagedIngredientsNutrition);
    console.log("Sum Averaged Ingredients Nutrition:", JSON.stringify(sumAveragedIngredientsNutrition, null, 2));

    // const edamamTotalNutrition = sumNutrition(edamamIngredientsNutrition.map(ing => ing.nutrition));
    console.log("Gemini Total Nutrition:", JSON.stringify(structuredData.totals, null, 2));

    // const edamamTotalNutrition = sumNutrition(edamamIngredientsNutrition.map(ing => ing.nutrition));
    console.log("Edamam Total Nutrition:", JSON.stringify(edamamTotalNutrition, null, 2));

    // const averagedTotalNutrition = averageNutrition("Total Nutrition", structuredData.totals, edamamTotalNutrition);
    console.log("Averaged (Gemini & Edamam) Total Nutrition:", JSON.stringify(averagedTotalNutrition, null, 2));

    // const averagedTotalNutrition = averageNutrition("Total Nutrition", structuredData.totals, edamamTotalNutrition);
    console.log("Averaged (Gemini, Edamam, & Ingredients) Total Nutrition:", JSON.stringify(combinedGeminiEdamamIngredientsNutrition, null, 2));


    // Save and respond
    const newDataKey = admin.database().ref('dishes').push().key;
    await admin.database().ref(`dishes/${newDataKey}`).set(structuredData);

    return res.json({
      success: true,
      firebaseKey: newDataKey,
      data: structuredData,
      edamamIngredientsNutrition,
      averagedIngredientsNutrition,
      sumAveragedIngredientsNutrition,
      geminiTotalNutrition: structuredData.totals,
      edamamTotalNutrition,
      averagedTotalNutrition,
      combinedGeminiEdamamIngredientsNutrition
    });

  } catch (error) {
    console.error("Error:", error);
    responseToSend.error = `Server error processing image: ${error.message}`;
    return res.status(500).json(responseToSend);
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});


export default app;