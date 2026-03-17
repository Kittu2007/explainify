"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const CircularText = ({ text, radius = 80, className = "" }) => {
  const letters = text.split('');
  
  return (
    <div className={`relative w-40 h-40 ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <defs>
          <path
            id="circle"
            d={`M ${100},${100 - radius} A ${radius},${radius} 0 1,1 ${100 - 1},${100 - radius}`}
            fill="none"
          />
        </defs>
        <text
          className="text-sm font-bold fill-purple-400"
          letterSpacing="2"
        >
          {letters.map((letter, i) => (
            <tspan key={i} dx={letter === ' ' ? '20' : '0'}>
              <textPath href="#circle" startOffset={`${(i / letters.length) * 100}%`} textAnchor="middle">
                {letter}
              </textPath>
            </tspan>
          ))}
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-purple-600" />
      </div>
    </div>
  );
};

export default CircularText;
