" use client\;
import React from 'react';

export const Dock = ({ children, className = "" }) => {
  return (
    <div className={`flex gap-2 items-center ${className}`}>
      {children}
    </div>
  );
};

export const DockItem = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Dock;
