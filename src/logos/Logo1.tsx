import React from 'react';
import {Img} from 'remotion';

export const Logo1: React.FC<{opacity: number; scale: number}> = ({opacity, scale}) => {
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="400" height="400" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="150" fill="url(#grad1)" />
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <text x="200" y="215" textAnchor="middle" fontSize="48" fontWeight="bold" fill="white">
          LOGO 1
        </text>
      </svg>
    </div>
  );
};

export const logo1Img = Logo1;