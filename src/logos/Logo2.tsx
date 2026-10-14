import React from 'react';

export const Logo2: React.FC<{opacity: number; scale: number}> = ({opacity, scale}) => {
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
        <rect x="50" y="50" width="300" height="300" rx="40" fill="url(#grad2)" />
        <defs>
          <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ef4444" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <text x="200" y="215" textAnchor="middle" fontSize="48" fontWeight="bold" fill="white">
          LOGO 2
        </text>
      </svg>
    </div>
  );
};

export const logo2Img = Logo2;