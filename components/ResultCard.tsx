import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { IdentificationResult } from '@/lib/types';
import { Bird, Cat, HelpCircle, Leaf } from 'lucide-react';

interface ResultCardProps {
  loading: boolean;
  result: IdentificationResult | null;
  image: string | null; // The uploaded image in base64 format
  imageName: string | null; // Name or identifier of the uploaded image
}

export function ResultCard({ loading, result, image, imageName }: ResultCardProps) {
  // Loading skeleton state
  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </Card>
    );
  }

  // No result available
  if (!result) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center text-gray-500">
        <div className="flex gap-4 mb-4">
          <Bird className="h-8 w-8" />
          <Leaf className="h-8 w-8" />
          <Cat className="h-8 w-8" />
        </div>
        <p className="mb-2">Upload an image to identify the species</p>
        <p className="text-sm">Please upload a valid image to start identification.</p>
      </Card>
    );
  }

  // Helper function to select category icons
  const getCategoryIcon = () => {
    switch (result.category) {
      case 'Bird':
        return <Bird className="h-6 w-6" />;
      case 'Plant':
        return <Leaf className="h-6 w-6" />;
      case 'Animal':
        return <Cat className="h-6 w-6" />;
      default:
        return <HelpCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Displaying Image with Name */}
      {image && (
        <div className="flex justify-center mb-4">
          <img
            src={`data:image/jpeg;base64,${image}`}
            alt={imageName || 'Uploaded image'}
            className="w-40 h-40 object-cover rounded-md" // Adjust image size here
          />
        </div>
      )}

      {/* Image Name */}
      {imageName && (
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{imageName}</h3>
        </div>
      )}

      {/* Category and Name */}
      <div className="flex items-center gap-3">
        {getCategoryIcon()}
        <h2 className="text-2xl font-semibold">{result.name}</h2>
      </div>

      {/* Category Badge */}
      <Badge variant="secondary" className="text-sm">
        {result.category}
      </Badge>

      {/* Details Section */}
      <div className="space-y-4">
        {/* Description */}
        <div>
          <h3 className="font-medium mb-2">Description</h3>
          <p className="text-gray-600 dark:text-gray-300">{result.description || "No description available."}</p>
        </div>

        {/* Specification */}
        <div>
          <h3 className="font-medium mb-2">Specifications</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            {result.specifications && result.specifications.length > 0 ? (
              result.specifications.map((spec, index) => (
                <li key={index}>{spec}</li>
              ))
            ) : (
              <li>No specifications available.</li>
            )}
          </ul>
        </div>

        {/* Weight */}
        <div>
          <h3 className="font-medium mb-2">Weight</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {result.weight || "No weight information available."}
          </p>
        </div>

        {/* Dangerousness */}
        <div>
          <h3 className="font-medium mb-2">Dangerousness</h3>
          <p className="text-gray-600 dark:text-gray-300">
            {result.dangerousness
              ? result.dangerousness
              : "No information on dangerousness available."}
          </p>
        </div>

        {/* Where It’s Mostly Found */}
        <div>
          <h3 className="font-medium mb-2">Where It’s Mostly Found</h3>
          <p className="text-gray-600 dark:text-gray-300">{result.foundIn || "No information available."}</p>
        </div>

        {/* Characteristics (Check for available data) */}
        <div>
          <h3 className="font-medium mb-2">Characteristics</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
            {Array.isArray(result.characteristics) && result.characteristics.length > 0 ? (
              result.characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))
            ) : (
              <li>No characteristics available.</li>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
}
