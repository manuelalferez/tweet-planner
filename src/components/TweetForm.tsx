import React, { useState, useRef, useCallback, useEffect } from "react";
import { PencilIcon, ClockIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useTweets } from "../contexts/TweetContext";
import { DateSelector } from "./DateSelector";
import { ImageDropzone } from "./ImageDropzone";

export const TweetForm: React.FC = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { addTweet } = useTweets();
  const dateRef = useRef<HTMLSelectElement>(null);
  const [buttonState, setButtonState] = useState<
    "idle" | "scheduling" | "success"
  >("idle");

  const MAX_TWEET_LENGTH = 280;
  const remainingChars = MAX_TWEET_LENGTH - text.length;
  const isNearLimit = remainingChars <= 20;
  const isOverLimit = remainingChars < 0;

  useEffect(() => {
    const savedDate = localStorage.getItem("scheduledTweetDate");
    if (savedDate && dateRef.current) {
      dateRef.current.value = savedDate;
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem("scheduledTweetDate", e.target.value);
  };

  const handleScheduleTweet = async () => {
    setButtonState("scheduling");
    try {
      if (!text.trim()) return;

      const tweetData = {
        text: text.trim(),
        image: imagePreview,
        date: dateRef.current?.value || new Date().toISOString(),
      };

      await addTweet(tweetData);
      setText("");
      setImage(null);
      setImagePreview(null);
      setButtonState("success");
      setTimeout(() => {
        setButtonState("idle");
      }, 2000);
    } catch (error) {
      setButtonState("idle");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleScheduleTweet();
    }
  };

  const handleImageChange = useCallback((newImage: string | null) => {
    setImagePreview(newImage);
  }, []);

  const handleFileChange = useCallback((file: File | null) => {
    setImage(file);
  }, []);

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

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 border rounded-lg resize-none h-40"
          placeholder="What's happening?"
        />
        <div
          className={`absolute bottom-2 right-2 text-sm ${
            isOverLimit
              ? "text-red-500"
              : isNearLimit
              ? "text-yellow-500"
              : "text-gray-500"
          }`}
        >
          {remainingChars}
        </div>
      </div>

      <ImageDropzone
        image={imagePreview}
        onImageChange={handleImageChange}
        onFileChange={handleFileChange}
      />
      <DateSelector ref={dateRef} onChange={handleDateChange} />

      <button
        onClick={handleScheduleTweet}
        disabled={buttonState !== "idle" || isOverLimit || !text.trim()}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-80"
      >
        {buttonState === "scheduling" ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            <span>Scheduling...</span>
          </>
        ) : buttonState === "success" ? (
          <>
            <CheckIcon className="h-5 w-5" />
            <span>Scheduled!</span>
          </>
        ) : (
          <>
            <ClockIcon className="h-5 w-5" />
            <span>Schedule Tweet</span>
          </>
        )}
      </button>
    </div>
  );
};
