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
      dish: structuredData.dish || 'N/A', // Ensure a valid value for the "dish" property
      imageURL: imageURL,
      macros: combinedGeminiEdamamIngredientsNutrition, // The formatted macro values and calories
      ingredients: averagedIngredientsNutrition // The detailed nutrition per ingredient
    };

    // Check if the user is authenticated
    if (req.user && req.user.uid) {
      const userId = req.user.uid;

      // Save the meal data under the user's ID
      const newMealKey = admin.database().ref(`users/${userId}/meals`).push().key;
      await admin.database().ref(`users/${userId}/meals/${newMealKey}`).set(finalNutritionData);

      return res.json({
        success: true,
        firebaseKey: newMealKey,
        // data: structuredData,  // Unaltered initial data from image analysis
        // edamamIngredientsNutrition,  // Detailed nutrition per ingredient from Edamam
        // averagedIngredientsNutrition,  // Average of Gemini and Edamam data per ingredient
        // sumAveragedIngredientsNutrition,  // Sum of the averaged ingredient nutrition
        // geminiTotalNutrition: structuredData.totals,  // Gemini original total nutrition calculation
        // edamamTotalNutrition,  // Sum of all Edamam nutritional data for all ingredients
        // averagedTotalNutrition,  // Average of Gemini's total nutrition and Edamam's total nutrition
        finalNutritionData  // Final formatted nutritional data (Gemini + Edamam + SummedIngredients)
      });
    } else {
      // User is not authenticated, return the macro breakdown without saving to the database
      return res.json({
        success: true,
        finalNutritionData
      });
    }
  } catch (error) {
    console.error("User-friendly error message:", error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// Get all meals for a specific user
app.get('/meals/:userId', async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const snapshot = await admin.database().ref(`users/${userId}/meals`).once('value');
    const meals = snapshot.val();
    const totalMeals = meals ? Object.keys(meals).length : 0;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMeals = meals ? Object.entries(meals).slice(startIndex, endIndex).map(([key, value]) => ({ id: key, ...value })) : [];

    res.json({
      success: true,
      meals: paginatedMeals,
      currentPage: page,
      totalPages: Math.ceil(totalMeals / limit),
      totalMeals
    });
  } catch (error) {
    console.error("Error retrieving meals:", error);
    res.status(500).json({ success: false, error: 'Failed to retrieve meals' });
  }
});

// Update a specific meal for a user
app.put('/meals/:userId/:mealId', async (req, res) => {
  const userId = req.params.userId;
  const mealId = req.params.mealId;
  const updatedMeal = req.body;

  try {
    await admin.database().ref(`users/${userId}/meals/${mealId}`).update(updatedMeal);
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating meal:", error);
    res.status(500).json({ success: false, error: 'Failed to update meal' });
  }
});

export default app; 