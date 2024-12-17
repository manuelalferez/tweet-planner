import React, { useState, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTweets } from '../contexts/TweetContext';
import { Tweet } from '../types/Tweet';
import { DateSelector } from './DateSelector';
import { ImageDropzone } from './ImageDropzone';

interface EditTweetModalProps {
  tweet: Tweet;
  onClose: () => void;
}

export const EditTweetModal: React.FC<EditTweetModalProps> = ({
  tweet,
  onClose,
}) => {
  const [text, setText] = useState(tweet.text);
  const [image, setImage] = useState<string | null>(tweet.image);
  const { updateTweet } = useTweets();
  const dateRef = useRef<HTMLSelectElement>(null);

  const handleSave = async () => {
    if (!text.trim()) return;

    const updatedTweet: Tweet = {
      ...tweet,
      text: text.trim(),
      image,
      date: dateRef.current?.value || tweet.date,
    };

    try {
      await updateTweet(tweet.id, updatedTweet);
      onClose();
    } catch (error) {
      console.error('Failed to update tweet:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
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
          
          <ImageDropzone image={image} onImageChange={setImage} />
          <DateSelector ref={dateRef} defaultValue={tweet.date} />
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 