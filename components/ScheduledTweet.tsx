import React, { useState } from 'react';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

function ScheduledTweet({ tweet }: { tweet: ScheduledTweet }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // ... existing code ...

  const handleDelete = () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }
    
    // Existing delete logic here
    deleteTweet(tweet.id);
    setIsDeleting(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="...">
      {/* ... existing tweet content ... */}
      
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="..."
        >
          <EllipsisHorizontalIcon className="..." />
        </button>

        {isMenuOpen && (
          <div className="...">
            <button
              onClick={() => {
                handleEdit();
                setIsMenuOpen(false);
              }}
              className="..."
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="..."
            >
              {isDeleting ? 'Sure?' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScheduledTweet; 