import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { admin } from './firebaseAdminSetup.js';
import { analyzeImage, analyzeText } from './api/GeminiAPI.js';
import { getNutritionalInfoForIngredient } from './api/EdamamAPI.js';
import { formatNutritionValues } from './service/parseNutritionalData.js'
import { averageNutrition, sumNutrition, combineNutritionData } from './service/nutritionUtils.js';

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for uploaded files
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  // 'https://6629adcaaedc0a268c763f6f--ornate-pavlova-d0d03d.netlify.app',
  // 'https://bitebyte.onrender.com',
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

app.post('/analyze-text', async (req, res) => {
  const { description } = req.body;
  try {
    const result = await analyzeText(description);
    console.log("Data to be sent to client:", result);  // Log the data here
    res.json(result);  // Send the response to the client
  } catch (error) {
    console.error('Failed to analyze food description:', error);
    res.status(500).send('Server error during analysis.');
  }
});

app.post('/analyze-image', upload.single('image'), async (req, res) => {
  let responseToSend = { success: false, error: 'An error occurred' };

  if (!req.file) {
    responseToSend.error = 'No file uploaded.';
    return res.status(400).json(responseToSend);
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
    const imageURL = signedUrls[0]; // This is the public URL to access the uploaded file

    const imageBase64 = Buffer.from(fs.readFileSync(req.file.path)).toString('base64');
    const structuredData = await analyzeImage(imageBase64);

    if (!structuredData || !Array.isArray(structuredData.ingredients)) {
      throw new Error("Missing or invalid structured data from image analysis.");
    }

    // Compute nutritional data for each ingredient using Edamam API and average it with structured data
    const edamamIngredientsNutrition = await Promise.all(structuredData.ingredients.map(async ingredient => {
      const nutritionData = await getNutritionalInfoForIngredient(ingredient);
      return {
        ...ingredient,
        nutrition: formatNutritionValues(nutritionData)
      };
    }));

    // Total nutrition values from Edamam API
    const edamamTotalNutrition = sumNutrition(edamamIngredientsNutrition.map(ing => ing.nutrition));

    // Compute averaged nutrition data for each ingredient and total them
    const averagedIngredientsNutrition = edamamIngredientsNutrition.map(ing => averageNutrition(ing.name, ing.nutrition, ing.nutrition));
    const sumAveragedIngredientsNutrition = sumNutrition(averagedIngredientsNutrition);

    // Total of the averages for structured and Edamam data
    const averagedTotalNutrition = averageNutrition("Total", structuredData.totals, edamamTotalNutrition);

    // Final combination of all data
    const combinedGeminiEdamamIngredientsNutrition = combineNutritionData(averagedTotalNutrition, sumAveragedIngredientsNutrition);
    const finalNutritionData = {
      dish: structuredData.dish, // The name of the dish
      // quantity: structuredData.quantity,
      imageURL: imageURL,
      macros: formatNutritionValues(combinedGeminiEdamamIngredientsNutrition), // The formatted macro values
      ingredients: averagedIngredientsNutrition // The detailed nutrition per ingredient
    };

    // Debug Check
    // console.log("Edamam Ingredients Nutrition:", JSON.stringify(edamamIngredientsNutrition, null, 2));
    // console.log("Averaged Ingredients Nutrition:", JSON.stringify(averagedIngredientsNutrition, null, 2));
    // console.log("Sum Averaged Ingredients Nutrition:", JSON.stringify(averagedTotalNutrition, null, 2));
    // console.log("Gemini Total Nutrition:", JSON.stringify(structuredData.totals, null, 2));
    // console.log("Edamam Total Nutrition:", JSON.stringify(edamamTotalNutrition, null, 2));
    // console.log("Averaged (Gemini & Edamam) Total Nutrition:", JSON.stringify(averagedTotalNutrition, null, 2));
    console.log("Averaged (Gemini, Edamam, & Ingredients) Total Nutrition:", JSON.stringify(finalNutritionData, null, 2));


    // Save and respond
    const newDataKey = admin.database().ref('dishes').push().key;
    await admin.database().ref(`dishes/${newDataKey}`).set(finalNutritionData);

    return res.json({
      success: true,
      firebaseKey: newDataKey,
      data: structuredData,  // Unaltered initial data from image analysis
      // edamamIngredientsNutrition,  // Detailed nutrition per ingredient from Edamam
      // averagedIngredientsNutrition,  // Average of Gemini and Edamam data per ingredient
      // sumAveragedIngredientsNutrition,  // Sum of the averaged ingredient nutrition
      // geminiTotalNutrition: structuredData.totals,  // Gemini original total nutrition calculation
      // edamamTotalNutrition,  // Sum of all Edamam nutritional data for all ingredients
      // averagedTotalNutrition,  // Average of Gemini's total nutrition and Edamam's total nutrition
      finalNutritionData  // Final formatted nutritional data (Gemini + Edamam + SummedIngredients)
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

