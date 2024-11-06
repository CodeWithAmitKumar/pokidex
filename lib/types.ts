export interface IdentificationResult {
  name: string;
  category: 'Animal' | 'Bird' | 'Plant';
  description: string;
  habitat: string;
  characteristics: string[];
  funFacts: string[];
}

export interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}