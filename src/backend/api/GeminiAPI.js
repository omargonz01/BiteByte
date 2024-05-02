import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  parseNutritionalData,
  cleanJsonText,
  isValidJson,
} from "../service/parseNutritionalData.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function analyzeImage(imagePath) {
  const imageData = { inlineData: { data: imagePath, mimeType: "image/jpeg" } };
  const detectionPrompt = `
    Detect if the image contains any food items. If no food is detected, state 'No food detected.' 
    If food is present, confirm with 'Food detected.'`;

  try {
    console.log("Checking for food presence...");
    const detectionResult = await genAI
      .getGenerativeModel({ model: "gemini-pro-vision" })
      .generateContent([detectionPrompt, imageData]);
    const detectionResponse = await detectionResult.response;
    const detectionText = await detectionResponse.text();
    console.log(`Detection result: ${detectionText}`);

    if (detectionText.includes("No food detected")) {
      console.error("No food in image.");
      throw new Error("No food detected. Please upload an image of food.");
    }

    if (detectionText.includes("Food detected")) {
      console.log("Food detected, analyzing...");
      const analysisPrompt = `
        Analyze the provided image to accurately identify each major food item and estimate portion sizes
        Use visual recognition to estimate portion sizes, comparing them to known objects in the image or by referencing common serving sizes. 
        Output the nutritional information in a structured JSON format, based closely on standard nutritional databases. 
        Ensure all numerical values for quantity and measures are provided in decimals without unit descriptions (e.g., '100', '50.5', not '100g', '1/2 cup'). 
        When encountering ambiguous items, ask for user input or provide a range of estimated values. 
        Consider the typical preparation methods and ingredients that are characteristic of the cuisine type depicted. 
        Include potential cooking additives such as oils and condiments in your estimation. 
        Acknowledge that the macronutrient content can vary with different cooking methods and recipe variations. 
        Regularly update estimations based on a feedback loop with user corrections to refine accuracy over time. 
        The following JSON structure should be used for displaying the nutritional information:
        
        {
          "dish": "Identified name of the dish from the image",
          "ingredients": [
            {
              "name": "Commonly known ingredient name",
              "quantity": "Exact quantity of the ingredient in the dish, default weight is measured in grams",
              "unit": "standardized unit of measurement (e.g., grams, cups). default measurement is in grams",
              "calories": "Total calories for the specified weight, numeric value only",
              "macronutrients": {
                "fat": "Total fat in grams for the specified weight, numeric value only",
                "carbohydrates": "Total carbohydrates in grams for the specified weight, numeric value only",
                "protein": "Total protein in grams for the specified weight, numeric value only"
              }
            }
            // ... other ingredients
          ],
          "totalNutrition": {
            "calories": "Sum of calories from all ingredients in the dish, numeric value only",
            "fat": "Sum of fat in grams from all ingredients, numeric value only",
            "carbohydrates": "Sum of carbohydrates in grams from all ingredients, numeric value only",
            "protein": "Sum of protein in grams from all ingredients, numeric value only"
          }
        }
        `;

      const analysisResult = await genAI
        .getGenerativeModel({ model: "gemini-pro-vision" })
        .generateContent([analysisPrompt, imageData]);
      const analysisResponse = await analysisResult.response;
      const rawText = await analysisResponse.text();
      const cleanText = cleanJsonText(rawText);

      if (!isValidJson(cleanText)) {
        throw new Error("Invalid JSON returned from Gemini API");
      }

      const jsonData = JSON.parse(cleanText);
      return parseNutritionalData(jsonData);  // Returning structured data
    } else {
      console.error("Unexpected response from detection model:", detectionText);
      throw new Error("Unexpected response. Please try again.");
    }
  } catch (error) {
    console.error("Error in analyzeImage:", error);
    throw new Error(error.message); // or respond with a custom error message to the client
  }
}

export { analyzeImage };
