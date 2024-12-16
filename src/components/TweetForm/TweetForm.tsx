import React, { useState, useRef } from 'react';
import { PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTweets } from '../../contexts/TweetContext';
import { DateSelector } from '../DateSelector/DateSelector';
import { ImageDropzone } from '../ImageDropzone/ImageDropzone';
import type { Tweet } from '../../types/Tweet';

export const TweetForm: React.FC = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const { addTweet } = useTweets();
  const dateRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    const tweet: Tweet = {
      text: text.trim(),
      image,
      date: dateRef.current?.value || new Date().toISOString(),
    };

    await addTweet(tweet);
    setText('');
    setImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-4">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
        <PencilIcon className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Schedule Your Tweets
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Plan and schedule your 𝕏 content ahead of time
          </p>
        </div>
      </h1>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 border rounded-lg resize-none h-24"
          placeholder="What's happening?"
        />
      </div>

      <ImageDropzone image={image} onImageChange={setImage} />
      <DateSelector ref={dateRef} />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <PhotoIcon className="h-5 w-5" />
        Schedule Tweet
      </button>
    </div>
  );
}; 