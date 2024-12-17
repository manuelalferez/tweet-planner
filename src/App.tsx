import React from 'react';
import { Header } from './components/Header';
import { TweetForm } from './components/TweetForm';
import { TweetList } from './components/TweetList/TweetList';
import { Footer } from './components/Footer';
import { TweetProvider } from './contexts/TweetContext';
import './styles/globals.css';

function App() {
  return (
    <TweetProvider>
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="space-y-8">
              <TweetForm />
              <TweetList />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </TweetProvider>
  );
}

export default App; 