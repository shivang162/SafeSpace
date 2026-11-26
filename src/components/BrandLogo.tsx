import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  label?: string;
  stacked?: boolean;
}

export function BrandLogo({
  size = 'md',
  showText = true,
  label = 'SafeSpace',
  stacked = false,
}: BrandLogoProps) {
  const iconDimensions =
    size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  const textClass =
    size === 'lg'
      ? 'text-2xl font-bold tracking-tight'
      : size === 'sm'
      ? 'text-[15px] font-bold tracking-tight'
      : 'text-[17px] font-bold tracking-tight';

  return (
    <div
      className={`inline-flex items-center ${
        stacked ? 'flex-col gap-2.5' : 'gap-2.5'
      } shrink-0 select-none`}
    >
      <div
        className={`${iconDimensions} rounded-full bg-[#16223B] border border-[#2C3E61] flex items-center justify-center shadow-[0_0_16px_rgba(130,136,255,0.22)] shrink-0`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 36 36" fill="none" className="w-[68%] h-[68%]">
          <defs>
            <linearGradient id="ssLeafLeft" x1="6" y1="8" x2="18" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B8A9FF" />
              <stop offset="100%" stopColor="#648BFF" />
            </linearGradient>
            <linearGradient id="ssLeafRight" x1="30" y1="8" x2="18" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9BCBFF" />
              <stop offset="100%" stopColor="#7C7BFF" />
            </linearGradient>
          </defs>
          {/* Left curved leaf */}
          <path
            d="M17.5 27C11 25.5 6.5 20.5 6.5 13C6.5 10.6 7.1 8.8 8 7.5C12.8 9.2 16.8 14.3 17.5 21.5V27Z"
            fill="url(#ssLeafLeft)"
          />
          {/* Right curved leaf */}
          <path
            d="M18.5 27C25 25.5 29.5 20.5 29.5 13C29.5 10.6 28.9 8.8 28 7.5C23.2 9.2 19.2 14.3 18.5 21.5V27Z"
            fill="url(#ssLeafRight)"
          />
          {/* Subtle stem */}
          <path
            d="M18 22V30"
            stroke="#C7C2FF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {showText && (
        <span className={`${textClass} text-[#F4F6FC] whitespace-nowrap`}>
          {label}
        </span>
      )}
    </div>
  );
}
