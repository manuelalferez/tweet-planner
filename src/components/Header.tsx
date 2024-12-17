import React from 'react';
import { AppLogo } from './AppLogo';

export const Header: React.FC = () => {
  return (
    <header>
      <div className="max-w-2xl mx-auto px-8 pt-8">
        <div className="bg-blue-600 rounded-xl shadow-lg p-4 flex items-center space-x-3">
          <AppLogo />
          <span className="text-xl font-semibold text-white">Tweet Planner</span>
        </div>
      </div>
    </header>
  );
}; 