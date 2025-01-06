import { Tweet } from '../types/Tweet';

class DatabaseService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'TweetPlannerDB';
  private readonly STORE_NAME = 'tweets';
  private readonly VERSION = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.VERSION);

      request.onerror = () => {
        console.error('Error opening IndexedDB');
        reject(request.error);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async getAllTweets(): Promise<Tweet[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async saveTweets(tweets: Tweet[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      // Clear existing tweets
      store.clear().onsuccess = () => {
        let completed = 0;
        tweets.forEach((tweet) => {
          const request = store.add(tweet);
          
          request.onsuccess = () => {
            completed++;
            if (completed === tweets.length) {
              resolve();
            }
          };

          request.onerror = () => {
            reject(request.error);
          };
        });
      };
    });
  }
}

export const databaseService = new DatabaseService(); 