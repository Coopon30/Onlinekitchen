// File: /api/generate-recipe.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// This is the main function that will be executed by the serverless platform
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { recipeName, ingredients } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // This is a carefully crafted prompt to get the best results from the AI
    const prompt = `
      You are an expert recipe writer. Create a clear, easy-to-follow recipe for the following dish.
      
      Dish Name: ${recipeName}
      
      Must-Use Ingredients: ${ingredients}
      
      Please provide a complete recipe including:
      1. A short, enticing description of the dish.
      2. A full list of ingredients (including the ones provided and any others needed).
      3. Step-by-step instructions.
      
      Format the response clearly with headings for the description, ingredients, and instructions.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the generated recipe back to the frontend
    res.status(200).json({ recipe: text });
    
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Failed to generate recipe from AI.' });
  }
}
