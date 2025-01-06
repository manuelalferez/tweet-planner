import React, { useState, useRef, useCallback } from "react";
import {
  XMarkIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useTweets } from "../contexts/TweetContext";
import { Tweet } from "../types/Tweet";
import { DateSelector } from "./DateSelector";
import { ImageDropzone } from "./ImageDropzone";

const FloppyDiskIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25z"
    />
    <rect x="7" y="3" width="10" height="6" rx="1" />
    <rect x="6" y="12" width="12" height="6" rx="1" />
  </svg>
);

interface EditTweetModalProps {
  tweet: Tweet;
  onClose: () => void;
}

export const EditTweetModal: React.FC<EditTweetModalProps> = ({
  tweet,
  onClose,
}) => {
  const [text, setText] = useState(tweet.text);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(tweet.image);
  const { updateTweet } = useTweets();
  const dateRef = useRef<HTMLSelectElement>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleImageChange = useCallback((newImage: string | null) => {
    setImagePreview(newImage);
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    setImage(file);
  }, []);

  const handleSave = async () => {
    if (!text.trim()) return;
    setIsSaved(true);

    const updatedTweet: Tweet = {
      ...tweet,
      text: text.trim(),
      image: imagePreview,
      date: dateRef.current?.value || tweet.date,
    };

    try {
      await updateTweet(tweet.id, updatedTweet);
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error("Failed to update tweet:", error);
      setIsSaved(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Edit Tweet</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none h-32"
            placeholder="What's happening?"
          />

          <ImageDropzone
            image={imagePreview}
            onImageChange={handleImageChange}
            onFileChange={handleFileChange}
          />

          <DateSelector ref={dateRef} defaultValue={tweet.date} />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium rounded-md hover:bg-gray-100 flex items-center gap-2"
          >
            <XCircleIcon className="h-5 w-5" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 min-w-[120px] flex items-center justify-center gap-2"
          >
            {isSaved ? (
              <CheckCircleIcon
                className={`h-5 w-5 transition-transform ${
                  isSaved ? "scale-110" : ""
                }`}
              />
            ) : (
              <FloppyDiskIcon />
            )}
            <span className={`transition-all ${isSaved ? "scale-105" : ""}`}>
              {isSaved ? "Saved!" : "Save Changes"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
