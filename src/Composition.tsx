import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Logo1} from './logos/Logo1';
import {Logo2} from './logos/Logo2';
import {Logo3} from './logos/Logo3';

export const Test: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [0, 20], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          color: '#ffffff',
          fontSize: 96,
          fontFamily: 'Arial, sans-serif',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        Hello
      </div>
    </AbsoluteFill>
  );
};

export const LogoTransition: React.FC = () => {
  const frame = useCurrentFrame();

  // Logo 1: fades in, holds, fades out as Logo 2 enters
  const logo1Opacity = interpolate(frame, [0, 30, 90, 120, 240], [0, 1, 1, 0, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logo1Scale = interpolate(frame, [0, 120, 240], [0.7, 1, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo 2: overlaps both for smooth transitions
  const logo2Opacity = interpolate(frame, [0, 90, 120, 180, 240], [0, 0, 1, 0, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logo2Scale = interpolate(frame, [0, 120, 240], [1.3, 1, 1.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Logo 3: enters as Logo 2 exits, holds to end
  const logo3Opacity = interpolate(frame, [0, 150, 180, 210, 240], [0, 0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const logo3Scale = interpolate(frame, [0, 120, 240], [0.7, 1, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#0f172a'}}>
      <Logo1 opacity={logo1Opacity} scale={logo1Scale} />
      <Logo2 opacity={logo2Opacity} scale={logo2Scale} />
      <Logo3 opacity={logo3Opacity} scale={logo3Scale} />
    </AbsoluteFill>
  );
};