"use client";

import { ImageUploaderProps } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*', // Accepts any image format
    maxFiles: 1,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragActive && !isDragReject
          ? 'border-primary bg-primary/5'
          : isDragReject
          ? 'border-red-500 bg-red-100'
          : 'border-gray-300 hover:border-primary'
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {isDragActive
          ? isDragReject
            ? 'This file type is not supported. Please drop a valid image.'
            : 'Drop the image here...'
          : 'Drag and drop an image, or click to select'}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Supports: JPG, PNG, WebP
      </p>
    </div>
  );
}
