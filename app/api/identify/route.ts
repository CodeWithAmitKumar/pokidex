import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    // Prepare the prompt
    const prompt = `You are a nature expert. Please analyze this image and identify the species shown. 
    Provide a detailed response in this exact JSON format:
    {
      "name": "[Common Name] ([Scientific Name])",
      "category": "[one of: Animal, Bird, or Plant]",
      "description": "[2-3 sentences describing the species]",
      "habitat": "[natural habitat and geographic distribution]",
      "characteristics": [
        "[physical characteristic 1]",
        "[physical characteristic 2]",
        "[physical characteristic 3]",
        "[physical characteristic 4]"
      ],
      "funFacts": [
        "[interesting fact 1]",
        "[interesting fact 2]",
        "[interesting fact 3]"
      ]
    }`;

    // Generate content
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image
        }
      },
      prompt
    ]);

    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean and parse the response
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const jsonResponse = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (!jsonResponse.name || !jsonResponse.category || !jsonResponse.description) {
        throw new Error('Invalid response structure');
      }

      return NextResponse.json(jsonResponse);
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return NextResponse.json(
        { error: 'Failed to analyze the image. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}