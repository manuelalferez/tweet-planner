import React, { useState } from 'react';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTweets } from '../../contexts/TweetContext';
import { Tweet } from '../../types/Tweet';
import { EditTweetModal } from '../EditTweetModal/EditTweetModal';

interface TweetItemProps {
  tweet: Tweet;
  index: number;
}

export const TweetItem: React.FC<TweetItemProps> = ({ tweet, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { deleteTweet } = useTweets();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTweet(index);
    } catch (error) {
      console.error('Failed to delete tweet:', error);
    }
    setIsDeleting(false);
    setShowMenu(false);
  };

  const getTweetUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.text)}`;
  };

  return (
    <>
      <div className="bg-white border rounded-xl p-4 hover:border-gray-300 transition-colors">
        <div className="flex gap-4">
          <div className="flex-grow space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-grow">
                <p className="text-gray-900 whitespace-pre-wrap">{tweet.text}</p>
                {tweet.image && (
                  <div className="mt-3 rounded-lg overflow-hidden border w-48">
                    <img src={tweet.image} className="w-full h-32 object-cover" alt="Tweet" />
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 w-36 bg-white border rounded-lg shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        setShowEditModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4 text-blue-600" />
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={getTweetUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
              >
                Post
              </a>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditTweetModal
          tweet={tweet}
          index={index}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}; 