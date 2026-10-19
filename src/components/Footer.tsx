import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-zinc-200/80 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span>AdCopy Studio</span>
          <span className="text-zinc-300">•</span>
          <span>Creative-grounded ad copy generation</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>Powered by Gemini 3.1</span>
          <span className="text-zinc-300">•</span>
          <span>Meta • Google • LinkedIn</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
