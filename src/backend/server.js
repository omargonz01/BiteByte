import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { admin } from './firebaseAdminSetup.js';
import { analyzeImage } from './api/GeminiAPI.js';
import { getNutritionalInfoForIngredient } from './api/EdamamAPI.js';
import { formatNutritionValues } from './service/parseNutritionalData.js';
import { averageNutrition, sumNutrition, combineNutritionData, calculateCalories } from './service/nutritionUtils.js';

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'https://6629adcaaedc0a268c763f6f--ornate-pavlova-d0d03d.netlify.app',
  'https://bitebyte.onrender.com',
  'http://localhost:5173'
];


// Enable CORS for client-side app on a different port or domain
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  }
}));

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Define a route for the root URL path
app.get('/', (req, res) => {
  res.send('Hello, World! This is BiteByte');
});


app.post('/analyze-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded.' });
  }

  try {
    // Prepare the image for upload to Firebase Storage
    const bucket = admin.storage().bucket(); // Assuming admin is already configured
    const filePath = req.file.path;
    const fileName = `${Date.now()}_${req.file.originalname}`;
    const destination = `uploads/${fileName}`;

    // Upload the file to Firebase Storage
    const [file] = await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Retrieve the public URL of the uploaded file
    const signedUrls = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491' // Far future date
    });
    const imageURL = signedUrls[0];
    const imageBase64 = Buffer.from(fs.readFileSync(filePath)).toString('base64');

    // Analyze image and calculate nutrition
    const structuredData = await analyzeImage(Buffer.from(fs.readFileSync(filePath)).toString('base64'));
    if (!structuredData || !Array.isArray(structuredData.ingredients)) {
      throw new Error("Invalid structured data from image analysis.");
    }

    // Fetch and average ingredient nutrition data from Edamam
    const edamamIngredientsNutrition = await Promise.all(structuredData.ingredients.map(async ingredient => {
      const nutritionData = await getNutritionalInfoForIngredient(ingredient);
      return {
        ...ingredient,
        nutrition: formatNutritionValues(nutritionData)
      };
    }));

    // Calculate summed and averaged nutrition
    const edamamTotalNutrition = sumNutrition(edamamIngredientsNutrition.map(ing => ing.nutrition));
    const averagedIngredientsNutrition = edamamIngredientsNutrition.map(ing =>
      averageNutrition(ing.name, ing.nutrition, structuredData.ingredients.find(geminiIng => geminiIng.name === ing.name)?.nutrition || {}));
    const sumAveragedIngredientsNutrition = sumNutrition(averagedIngredientsNutrition);
    const averagedTotalNutrition = averageNutrition("Total", structuredData.totals, edamamTotalNutrition);
  
    // Final combination of all data
    const combinedGeminiEdamamIngredientsNutrition = combineNutritionData(averagedTotalNutrition, sumAveragedIngredientsNutrition);
    const finalNutritionData = {
      dish: structuredData.dish, // The name of the dish
      imageURL: imageURL,
      macros: combinedGeminiEdamamIngredientsNutrition, // The formatted macro values and calories
      ingredients: averagedIngredientsNutrition // The detailed nutrition per ingredient
    };

    // Debug Check
    console.log("Gemini Ingredients Nutrition:", JSON.stringify(structuredData.ingredients, null, 2));
    console.log("Edamam Ingredients Nutrition:", JSON.stringify(edamamIngredientsNutrition, null, 2));
    console.log("Averaged Ingredients Nutrition:", JSON.stringify(averagedIngredientsNutrition, null, 2));
    console.log("Sum Averaged Ingredients Nutrition:", JSON.stringify(sumAveragedIngredientsNutrition, null, 2));
    console.log("Gemini Total Nutrition:", JSON.stringify(structuredData.totals, null, 2));
    console.log("Edamam Total Nutrition:", JSON.stringify(edamamTotalNutrition, null, 2));
    console.log("Averaged Ingredients Total Nutrition:", JSON.stringify(averagedTotalNutrition, null, 2));
    console.log("Averaged (Gemini, Edamam, & Ingredients) Total Nutrition:", JSON.stringify(finalNutritionData, null, 2));


    // Save and respond
    const newDataKey = admin.database().ref('dishes').push().key;
    await admin.database().ref(`dishes/${newDataKey}`).set(finalNutritionData);

    return res.json({
      success: true,
      firebaseKey: newDataKey,
      // data: structuredData,  // Unaltered initial data from image analysis
      // edamamIngredientsNutrition,  // Detailed nutrition per ingredient from Edamam
      // averagedIngredientsNutrition,  // Average of Gemini and Edamam data per ingredient
      // sumAveragedIngredientsNutrition,  // Sum of the averaged ingredient nutrition
      // geminiTotalNutrition: structuredData.totals,  // Gemini original total nutrition calculation
      // edamamTotalNutrition,  // Sum of all Edamam nutritional data for all ingredients
      // averagedTotalNutrition,  // Average of Gemini's total nutrition and Edamam's total nutrition
      finalNutritionData  // Final formatted nutritional data (Gemini + Edamam + SummedIngredients)
    });

  } catch (error) {
    console.error("User-friendly error message:", error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});


export default app;

