import React from 'react';
import type { MoodLevel } from '../types/safespace';

export interface MoodOption {
  id: MoodLevel;
  label: string;
  trackerLabel: string;
  bg: string;
  stroke: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'great', label: 'Great', trackerLabel: 'Great', bg: '#57D38C', stroke: '#103521' },
  { id: 'good', label: 'Good', trackerLabel: 'Good', bg: '#A4DA6B', stroke: '#233611' },
  { id: 'okay', label: 'Okay', trackerLabel: 'Okay', bg: '#F4C950', stroke: '#3B2D07' },
  { id: 'low', label: 'Low', trackerLabel: 'Low', bg: '#F08E4B', stroke: '#3D1E08' },
  { id: 'bad', label: 'Not okay', trackerLabel: 'Bad', bg: '#EB5D68', stroke: '#3D0F13' },
];

interface MoodFaceIconProps {
  mood: MoodLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodFaceIcon({ mood, size = 'md' }: MoodFaceIconProps) {
  const option = MOOD_OPTIONS.find((m) => m.id === mood) ?? MOOD_OPTIONS[2];
  const dim =
    size === 'lg' ? 'w-11 h-11' : size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';

  return (
    <span
      className={`${dim} rounded-full inline-flex items-center justify-center shrink-0 shadow-sm`}
      style={{ backgroundColor: option.bg }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 36 36" fill="none" className="w-[72%] h-[72%]">
        {/* Eyes */}
        {mood === 'great' ? (
          <>
            <path d="M10.5 14.5C11.2 12.8 13.3 12.8 14 14.5" stroke={option.stroke} strokeWidth="2.3" strokeLinecap="round" />
            <path d="M22 14.5C22.7 12.8 24.8 12.8 25.5 14.5" stroke={option.stroke} strokeWidth="2.3" strokeLinecap="round" />
          </>
        ) : mood === 'bad' ? (
          <>
            <path d="M10.5 13.5L14 15.2" stroke={option.stroke} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M25.5 13.5L22 15.2" stroke={option.stroke} strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12.5" cy="16.5" r="1.5" fill={option.stroke} />
            <circle cx="23.5" cy="16.5" r="1.5" fill={option.stroke} />
          </>
        ) : (
          <>
            <circle cx="12.5" cy="14.5" r="1.8" fill={option.stroke} />
            <circle cx="23.5" cy="14.5" r="1.8" fill={option.stroke} />
          </>
        )}

        {/* Mouth */}
        {mood === 'great' && (
          <path d="M11 20.5C12.5 25 23.5 25 25 20.5" stroke={option.stroke} strokeWidth="2.4" strokeLinecap="round" />
        )}
        {mood === 'good' && (
          <path d="M12.5 21.5C14.3 24.2 21.7 24.2 23.5 21.5" stroke={option.stroke} strokeWidth="2.3" strokeLinecap="round" />
        )}
        {mood === 'okay' && (
          <path d="M13 22.5H23" stroke={option.stroke} strokeWidth="2.3" strokeLinecap="round" />
        )}
        {mood === 'low' && (
          <path d="M13 24C14.8 21.5 21.2 21.5 23 24" stroke={option.stroke} strokeWidth="2.3" strokeLinecap="round" />
        )}
        {mood === 'bad' && (
          <path d="M12 24.8C14 21 22 21 24 24.8" stroke={option.stroke} strokeWidth="2.4" strokeLinecap="round" />
        )}
      </svg>
    </span>
  );
}
