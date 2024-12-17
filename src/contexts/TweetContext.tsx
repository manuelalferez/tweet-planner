import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tweet } from '../types/Tweet';
import { databaseService } from '../services/DatabaseService';
import { v4 as uuidv4 } from 'uuid';

interface TweetContextType {
  tweets: Tweet[];
  addTweet: (tweet: Omit<Tweet, 'id'>) => Promise<void>;
  updateTweet: (id: string, tweet: Tweet) => Promise<void>;
  deleteTweet: (id: string) => Promise<void>;
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

  const addTweet = async (tweetData: Omit<Tweet, 'id'>) => {
    const tweet = { ...tweetData, id: uuidv4() };
    const newTweets = [...tweets, tweet].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    await databaseService.saveTweets(newTweets);
    setTweets(newTweets);
  };

  const updateTweet = async (id: string, tweet: Tweet) => {
    const newTweets = tweets.map(t => t.id === id ? tweet : t)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    await databaseService.saveTweets(newTweets);
    setTweets(newTweets);
  };

  const deleteTweet = async (id: string) => {
    setTweets(prevTweets => prevTweets.filter(t => t.id !== id));
    await databaseService.saveTweets(tweets.filter(t => t.id !== id));
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