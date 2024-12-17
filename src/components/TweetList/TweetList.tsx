import React, { useState } from 'react';
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTweets } from '../../contexts/TweetContext';
import { TweetItem } from './TweetItem';
import { format } from 'date-fns';

export const TweetList: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { tweets } = useTweets();

  const groupTweetsByDate = () => {
    const groups: { [key: string]: typeof tweets } = {};
    tweets.forEach(tweet => {
      const dateKey = format(new Date(tweet.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(tweet);
    });
    return groups;
  };

  const getReadableDate = (date: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const targetDate = new Date(date);

    // Remove time component for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate.getTime() === today.getTime()) {
      return "Today";
    } else if (targetDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow";
    } else if (targetDate < nextWeek) {
      return format(targetDate, 'EEEE');
    } else {
      return format(targetDate, 'MMM d, yyyy');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="space-y-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left flex items-center justify-between gap-2 focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Scheduled Tweets
              </h2>
              <span className="bg-blue-100 text-blue-600 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {tweets.length}
              </span>
            </div>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isExpanded && (
          <div className="space-y-6">
            {tweets.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No tweets scheduled yet
                </h3>
                <p className="text-gray-500">
                  Start planning your content by creating your first tweet above!
                </p>
              </div>
            ) : (
              Object.entries(groupTweetsByDate()).map(([date, dateTweets]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <h3 className="text-base text-gray-600">
                      {getReadableDate(date)}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {dateTweets.map((tweet, index) => (
                      <TweetItem
                        key={tweet.text + index}
                        tweet={tweet}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 