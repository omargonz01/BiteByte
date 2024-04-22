import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { admin } from './firebaseAdminSetup.js';
import { analyzeImage } from './api/GeminiAPI.js';
import { getNutritionalInfoForIngredient } from './api/EdamamAPI.js';

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
    
    let EdamamtotalNutrition = { calories: 0, fat: 0, carbohydrates: 0, protein: 0 };
    let EdamamingredientsNutrition = [];

    for (const ingredient of structuredData.ingredients) {
      const nutrientData = await getNutritionalInfoForIngredient(ingredient);
      EdamamingredientsNutrition.push({
        ...ingredient,
        nutrition: nutrientData
      });

      EdamamtotalNutrition.calories += nutrientData.calories;
      EdamamtotalNutrition.fat += nutrientData.fat;
      EdamamtotalNutrition.carbohydrates += nutrientData.carbohydrates;
      EdamamtotalNutrition.protein += nutrientData.protein;
    }

    const newDataKey = admin.database().ref('dishes').push().key;
    await admin.database().ref(`dishes/${newDataKey}`).set(structuredData);

    return res.json({
      success: true,
      firebaseKey: newDataKey,
      data: structuredData,
      EdamamtotalNutrition,
      EdamamingredientsNutrition
    });

  } catch ( error) {
    console.error("Error:", error);
    responseToSend.error = 'Server error processing image';
    return res.status(500).json(responseToSend);
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

export default app;
