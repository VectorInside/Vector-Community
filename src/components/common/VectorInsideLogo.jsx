'use client';

import React from 'react';

export const VectorInsideLogo = ({ size = 'md', showCommunity = true, className = '' }) => {
  const sizeMap = {
    sm: { width: 32, height: 26, fontSize: 'text-xs', subSize: 'text-[8px]' },
    md: { width: 44, height: 36, fontSize: 'text-sm', subSize: 'text-[9px]' },
    lg: { width: 68, height: 54, fontSize: 'text-xl', subSize: 'text-xs' },
    xl: { width: 95, height: 75, fontSize: 'text-2xl', subSize: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Glitched Neon V Symbol (from Vector Inside brand) */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 100 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-[0_0_12px_rgba(229,255,0,0.4)]"
        >
          {/* Main Neon V Shape */}
          <path
            d="M10 0 L40 75 L60 75 L90 0 L72 0 L50 56 L28 0 Z"
            fill="#E5FF00"
          />
          {/* Signature Glitch Cutout Blocks (Image 2 identity) */}
          <rect x="36" y="24" width="16" height="6" fill="#050505" />
          <rect x="52" y="40" width="14" height="7" fill="#050505" />
          <rect x="30" y="52" width="10" height="5" fill="#050505" />
          <rect x="62" y="16" width="12" height="4" fill="#050505" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-[0.14em] text-white uppercase font-sans ${currentSize.fontSize}`}>
            VECTOR
          </span>
          <span className={`font-black tracking-[0.14em] text-neon uppercase font-sans ${currentSize.fontSize}`}>
            INSIDE
          </span>
        </div>

        {showCommunity && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-neon font-mono font-bold text-[9px]">//</span>
            <span className={`font-mono font-bold tracking-[0.22em] text-zinc-300 uppercase ${currentSize.subSize}`}>
              VECTOR COMMUNITY
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
