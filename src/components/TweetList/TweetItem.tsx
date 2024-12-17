import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EllipsisHorizontalIcon, PencilIcon, TrashIcon, ClipboardDocumentIcon, ArrowTopRightOnSquareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useTweets } from '../../contexts/TweetContext';
import { Tweet } from '../../types/Tweet';
import { EditTweetModal } from '../EditTweetModal';

interface TweetItemProps {
  tweet: Tweet;
  index: number;
}

export const TweetItem: React.FC<TweetItemProps> = ({ tweet, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { deleteTweet } = useTweets();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isDeleteConfirming) {
      timeoutId = setTimeout(() => {
        setIsDeleteConfirming(false);
      }, 3000);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDeleteConfirming]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleDelete = async () => {
    if (!isDeleteConfirming) {
      setIsDeleteConfirming(true);
      return;
    }
    
    setIsDeleting(true);
    await deleteTweet(index);
    setIsDeleteConfirming(false);
    setShowMenu(false);
  };

  const getTweetUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.text)}`;
  };

  const handleCopyImage = useCallback(async () => {
    if (!tweet.image) return;
    
    // Immediately show copied state
    setIsCopied(true);
    
    try {
      // Create an image element and load the image
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Enable CORS
      img.src = tweet.image;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create a canvas and draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      // Convert canvas to blob and copy
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
    } catch (err) {
      console.error('Failed to copy image:', err);
      // Fallback to copying URL if image copying fails
      try {
        await navigator.clipboard.writeText(tweet.image);
      } catch (fallbackErr) {
        console.error('Failed to copy image URL:', fallbackErr);
      }
    }

    // Reset copied state after 2 seconds regardless of success/failure
    setTimeout(() => setIsCopied(false), 2000);
  }, [tweet.image]);

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
              <div className="relative" ref={menuRef}>
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
                      {isDeleteConfirming ? 'Sure?' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tweet.image && (
                <button
                  onClick={handleCopyImage}
                  className={`px-3 py-1.5 text-sm bg-gray-100 text-gray-700 
                  rounded-lg hover:bg-gray-200 flex items-center justify-center gap-1.5 
                  transition-all duration-200 border border-gray-200
                  disabled:cursor-not-allowed disabled:opacity-80 overflow-hidden`}
                  disabled={isCopied}
                >
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="relative w-4 h-4 flex-shrink-0">
                      <ClipboardDocumentIcon 
                        className={`absolute inset-0 h-4 w-4 transition-all duration-300 ${
                          isCopied ? '-translate-y-6 opacity-0' : 'translate-y-0 opacity-100'
                        }`}
                      />
                      <CheckIcon 
                        className={`absolute inset-0 h-4 w-4 text-green-600 transition-all duration-300 ${
                          isCopied ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                        }`}
                      />
                    </div>
                    <span className={`font-medium transition-all duration-300 whitespace-nowrap inline-block ${
                      isCopied ? 'text-green-600' : ''
                    }`}>
                      {isCopied ? 'Copied!' : 'Copy Image'}
                    </span>
                  </div>
                </button>
              )}
              <a
                href={getTweetUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
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