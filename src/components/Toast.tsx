import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 pointer-events-none flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-5">
      <span className="material-symbols-outlined text-emerald-400 text-[18px]">
        check_circle
      </span>
      <span>{message}</span>
    </div>
  );
};
