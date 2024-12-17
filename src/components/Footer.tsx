import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="max-w-2xl mx-auto px-8 pb-8">
        <div className="bg-blue-600 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=manuelalferezruiz"
              alt="Footer Avatar"
              className="w-12 h-12 rounded-full shadow-md border-2 border-blue-100"
            />
            <div>
              <div className="font-medium text-white">Created by</div>
              <a
                href="https://twitter.com/manuelalferez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-100 transition-colors font-semibold flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="inline-block"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                @manuelalferez
              </a>
            </div>
          </div>
          <a
            href="https://manuelalferez.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg text-sm font-medium"
          >
            About
          </a>
        </div>
      </div>
    </footer>
  );
}; 