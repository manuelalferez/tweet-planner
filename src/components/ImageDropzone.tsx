import React, { useCallback, useRef } from "react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ImageDropzoneProps {
  image: string | null;
  onImageChange: (image: string | null) => void;
  onFileChange?: (file: File | null) => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  image,
  onImageChange,
  onFileChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.currentTarget.classList.remove("dragover");
  }, []);

  const handleImage = useCallback(
    (file: File) => {
      if (onFileChange) {
        onFileChange(file);
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onFileChange, onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.currentTarget.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleImage(file);
      }
    },
    [handleImage]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImage(file);
      }
    },
    [handleImage]
  );

  const handleRemoveImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onImageChange(null);
      if (onFileChange) {
        onFileChange(null);
      }
    },
    [onFileChange, onImageChange]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div
      className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {!image ? (
        <>
          <PhotoIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 text-center">
            Drag and drop an image here, or click to select
          </p>
        </>
      ) : (
        <div className="relative">
          <img
            src={image}
            alt="Preview"
            className="max-w-[50%] h-auto rounded-lg mx-auto"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-75 transition-opacity"
          >
            <XMarkIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
    </div>
  );
};
