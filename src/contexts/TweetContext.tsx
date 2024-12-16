import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tweet } from '../types/Tweet';
import { databaseService } from '../services/DatabaseService';

interface TweetContextType {
  tweets: Tweet[];
  addTweet: (tweet: Tweet) => Promise<void>;
  updateTweet: (index: number, tweet: Tweet) => Promise<void>;
  deleteTweet: (index: number) => Promise<void>;
}

const TweetContext = createContext<TweetContextType | undefined>(undefined);

export const TweetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tweets, setTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    const initializeDB = async () => {
      await databaseService.init();
      const savedTweets = await databaseService.getAllTweets();
      setTweets(savedTweets.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    };

    initializeDB();
  }, []);

  const addTweet = async (tweet: Tweet) => {
    const newTweets = [...tweets, tweet].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    await databaseService.saveTweets(newTweets);
    setTweets(newTweets);
  };

  const updateTweet = async (index: number, tweet: Tweet) => {
    const newTweets = [...tweets];
    newTweets[index] = tweet;
    const sortedTweets = newTweets.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    await databaseService.saveTweets(sortedTweets);
    setTweets(sortedTweets);
  };

  const deleteTweet = async (index: number) => {
    const newTweets = tweets.filter((_, i) => i !== index);
    await databaseService.saveTweets(newTweets);
    setTweets(newTweets);
  };

  return (
    <TweetContext.Provider value={{ tweets, addTweet, updateTweet, deleteTweet }}>
      {children}
    </TweetContext.Provider>
  );
};

export const useTweets = () => {
  const context = useContext(TweetContext);
  if (context === undefined) {
    throw new Error('useTweets must be used within a TweetProvider');
  }
  return context;
}; 