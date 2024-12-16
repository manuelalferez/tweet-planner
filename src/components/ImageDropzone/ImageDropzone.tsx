import React, { useCallback } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageDropzoneProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({ image, onImageChange }) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove('dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImage(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImage(file);
    }
  }, []);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="dropzone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <PhotoIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
      <p className="text-gray-500">
        Drag and drop an image here, or click to select
      </p>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
      {image && (
        <img
          src={image}
          alt="Preview"
          className="max-w-[50%] h-auto mt-4 rounded-lg mx-auto"
        />
      )}
    </div>
  );
}; 