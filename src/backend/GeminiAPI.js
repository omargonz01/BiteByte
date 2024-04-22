import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseNutritionalData, cleanJsonText, isValidJson } from './parseNutritionalData.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);


  async function analyzeImage(imagePath) {
    const imageData = { inlineData: { data: imagePath, mimeType: 'image/jpeg' } };
    const prompt = `
    Analyze the provided image and accurately identify each major food item. 
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
    
    Focus on the accuracy of macronutrient identification and quantification. Adhere to the nutritional values for these ingredients as known from reliable sources and databases. Avoid assumptions and overestimations; if in doubt, prioritize user interaction for clarification.
    `;
    
    const result = await genAI.getGenerativeModel({ model: "gemini-pro-vision" }).generateContent([prompt, imageData]);
    const response = await result.response;
    const rawText = await response.text();
    const cleanText = cleanJsonText(rawText);

    if (!isValidJson(cleanText)) {
        throw new Error("Invalid JSON returned from Gemini API");
    }

    const jsonData = JSON.parse(cleanText);
    const structuredData = parseNutritionalData(jsonData);

    return structuredData;
}

export { analyzeImage };