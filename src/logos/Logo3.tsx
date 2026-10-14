import React from 'react';

export const Logo3: React.FC<{opacity: number; scale: number}> = ({opacity, scale}) => {
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
        <path
          d="M200,50 L350,200 L200,350 L50,200 Z"
          fill="url(#grad3)"
          stroke="none"
        />
        <defs>
          <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#10b981" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <text x="200" y="215" textAnchor="middle" fontSize="36" fontWeight="bold" fill="white">
          LOGO 3
        </text>
      </svg>
    </div>
  );
};

export const logo3Img = Logo3;