"use client";

import { ImageUploader } from '@/components/ImageUploader';
import { ResultCard } from '@/components/ResultCard';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { identifyImage } from '@/lib/gemini';
import { IdentificationResult } from '@/lib/types';
import { Bird, Camera, Leaf } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [image, setImage] = useState<string | null>(null); // State to hold uploaded image
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        setImage(base64Data); // Set the uploaded image to state

        try {
          // Call the updated identifyImage function
          const identificationResult = await identifyImage(base64Data);
          setResult(identificationResult);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to identify the image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center gap-4 mb-4">
            <Camera className="h-12 w-12 text-primary" />
            <Leaf className="h-12 w-12 text-green-500" />
            <Bird className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Nature Identifier
          </h1>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
            Upload an image to identify animals, birds, or plants instantly
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <ImageUploader onImageUpload={handleImageUpload} />
          <ResultCard loading={loading} result={result} image={image} /> {/* Pass image to ResultCard */}
        </div>
      </div>
      <Toaster />
    </main>
  );
}
