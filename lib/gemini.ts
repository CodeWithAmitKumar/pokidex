import { GoogleGenerativeAI } from '@google/generative-ai';
import { IdentificationResult } from './types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function identifyImage(imageData: string): Promise<IdentificationResult> {
  try {
    // Use the updated model name
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this image and provide detailed information about the species shown. 
    Include the following details:
    1. Species name
    2. Category (Animal, Bird, or Plant)
    3. Brief description
    4. Natural habitat
    5. Key characteristics (3-4 points)
    6. Interesting facts (2-3 points)
    Format the response as a JSON object.`;

    // Send the request
    const result = await model.generateContent([prompt, { inlineData: { data: imageData, mimeType: 'image/jpeg' } }]);
    const response = await result.response.text();

    // Clean up response text to make sure it's valid JSON
    const cleanedResponse = response.replace(/```json|\`\`\`|\n/g, '').trim();  // Remove backticks and newlines

    // Try to parse the cleaned response
    const jsonResponse = JSON.parse(cleanedResponse);

    return jsonResponse;
  } catch (error) {
    console.error('Error identifying image:', error);
    throw new Error('Failed to identify the image. Please try again.');
  }
}
