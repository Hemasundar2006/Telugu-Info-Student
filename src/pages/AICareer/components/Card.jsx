import React from 'react';

export function Card({ children, className = '' }) {
  return (
    <div
      className={`bg-slate-800/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
