'use client';

import React from 'react';

// ============================================================================
// 1. HANDCRAFTED KEEPSAKES (Zero emoji, pure 2D cozy game vector art)
// ============================================================================

export const KeepsakeAsset: React.FC<{
  assetKey: 'clover' | 'pebble' | 'crane' | 'stamp' | 'key' | 'acorn';
  size?: number;
  className?: string;
}> = ({ assetKey, size = 40, className = '' }) => {
  switch (assetKey) {
    case 'clover':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Parchment backing */}
          <rect x="8" y="8" width="48" height="48" rx="8" fill="#f5ede0" stroke="#d5c4af" strokeWidth="1.5" />
          <path d="M 12 16 L 52 16" stroke="#ebdccb" strokeWidth="1" strokeDasharray="2 2" />
          {/* Clover stem */}
          <path d="M 32 34 Q 30 50 25 54" stroke="#4a6b47" strokeWidth="2" strokeLinecap="round" />
          {/* 4 Pressed Leaflets */}
          {/* Top Leaf */}
          <path d="M 32 32 C 26 22 38 20 32 32" fill="#588157" opacity="0.9" />
          <path d="M 32 32 C 38 22 26 20 32 32" fill="#699768" opacity="0.9" />
          {/* Right Leaf */}
          <path d="M 32 32 C 42 26 44 38 32 32" fill="#4f774e" opacity="0.9" />
          <path d="M 32 32 C 42 38 44 26 32 32" fill="#588157" opacity="0.9" />
          {/* Bottom Leaf */}
          <path d="M 32 32 C 38 42 26 44 32 32" fill="#446a43" opacity="0.9" />
          <path d="M 32 32 C 26 42 38 44 32 32" fill="#588157" opacity="0.9" />
          {/* Left Leaf */}
          <path d="M 32 32 C 22 38 20 26 32 32" fill="#4f774e" opacity="0.9" />
          <path d="M 32 32 C 22 26 20 38 32 32" fill="#699768" opacity="0.9" />
          {/* Leaf center & veins */}
          <circle cx="32" cy="32" r="2" fill="#3a5a39" />
          {/* Little dried flower ribbon */}
          <rect x="18" y="44" width="28" height="3" rx="1.5" fill="#d4a373" opacity="0.6" />
        </svg>
      );

    case 'pebble':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow */}
          <ellipse cx="32" cy="46" rx="22" ry="7" fill="rgba(30,25,20,0.25)" />
          {/* Layered smooth river stone */}
          <path
            d="M 16 38 C 12 28 20 18 34 16 C 48 14 54 24 50 36 C 46 46 22 46 16 38 Z"
            fill="url(#pebbleGrad)"
            stroke="#5c5752"
            strokeWidth="1.5"
          />
          {/* Mineral bands */}
          <path d="M 20 28 Q 32 26 46 24" stroke="#a8a29e" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          <path d="M 22 34 Q 34 32 44 32" stroke="#d6d3d1" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          {/* Water sheen reflection */}
          <ellipse cx="28" cy="22" rx="6" ry="2.5" transform="rotate(-15 28 22)" fill="#ffffff" opacity="0.45" />
          <defs>
            <linearGradient id="pebbleGrad" x1="20" y1="16" x2="48" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8c857f" />
              <stop offset="60%" stopColor="#6e6660" />
              <stop offset="100%" stopColor="#4e4843" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'crane':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft shadow */}
          <ellipse cx="32" cy="48" rx="18" ry="5" fill="rgba(30,25,20,0.2)" />
          {/* Origami Crane Facets */}
          {/* Body */}
          <polygon points="32,24 24,42 40,42" fill="#f4ede2" stroke="#b09f8c" strokeWidth="1.2" />
          {/* Left Wing */}
          <polygon points="32,24 8,30 24,42" fill="#faf6f0" stroke="#b09f8c" strokeWidth="1.2" />
          {/* Right Wing */}
          <polygon points="32,24 56,30 40,42" fill="#e8ded1" stroke="#b09f8c" strokeWidth="1.2" />
          {/* Tail */}
          <polygon points="40,42 54,46 36,36" fill="#ded2c3" stroke="#b09f8c" strokeWidth="1.2" />
          {/* Neck & Head */}
          <polygon points="24,42 12,22 28,32" fill="#f0e6d8" stroke="#b09f8c" strokeWidth="1.2" />
          <polygon points="12,22 8,24 14,26" fill="#c7b7a3" stroke="#9e8b77" strokeWidth="1" />
          {/* Fold creases */}
          <line x1="32" y1="24" x2="32" y2="42" stroke="#c4b5a2" strokeWidth="0.8" />
        </svg>
      );

    case 'stamp':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Serrated postage edge */}
          <rect x="10" y="8" width="44" height="48" rx="2" fill="#fdfbf7" stroke="#997b66" strokeWidth="1.5" />
          {/* Inner blue vignette */}
          <rect x="14" y="12" width="36" height="40" fill="#3a5a6c" rx="1" />
          {/* Sea waves */}
          <path d="M 14 42 Q 23 38 32 42 Q 41 46 50 42 L 50 52 L 14 52 Z" fill="#243a47" />
          {/* Lighthouse tower */}
          <polygon points="28,44 32,24 34,24 38,44" fill="#fdfbf7" />
          <rect x="29" y="32" width="8" height="3" fill="#9e3b33" />
          {/* Lantern room & beacon glow */}
          <rect x="30" y="21" width="6" height="4" fill="#fbbf24" />
          <polygon points="30,21 33,17 36,21" fill="#9e3b33" />
          {/* Light rays */}
          <path d="M 33 23 L 16 18" stroke="#fef08a" strokeWidth="1" strokeDasharray="1 1" opacity="0.8" />
          {/* Postmark cancellation ink */}
          <circle cx="44" cy="22" r="8" stroke="#1e293b" strokeWidth="1" fill="none" opacity="0.6" />
          <line x1="38" y1="22" x2="50" y2="22" stroke="#1e293b" strokeWidth="0.8" opacity="0.6" />
        </svg>
      );

    case 'key':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow */}
          <ellipse cx="32" cy="50" rx="16" ry="4" fill="rgba(30,25,20,0.25)" />
          {/* Ornate heart bow */}
          <path
            d="M 32 12 C 24 6 16 14 22 22 C 26 27 32 30 32 30 C 32 30 38 27 42 22 C 48 14 40 6 32 12 Z"
            fill="url(#brassGrad)"
            stroke="#78590c"
            strokeWidth="1.5"
          />
          {/* Inner cutout */}
          <path d="M 32 16 C 28 12 24 16 26 20 C 28 23 32 25 32 25 C 32 25 36 23 38 20 C 40 16 36 12 32 16 Z" fill="#2b2420" />
          {/* Shaft */}
          <rect x="30" y="28" width="4" height="24" rx="1" fill="url(#brassGrad)" stroke="#78590c" strokeWidth="1.2" />
          {/* Bit teeth */}
          <path d="M 34 44 H 42 V 47 H 37 V 49 H 42 V 52 H 34 Z" fill="url(#brassGrad)" stroke="#78590c" strokeWidth="1.2" />
          <defs>
            <linearGradient id="brassGrad" x1="20" y1="10" x2="44" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'acorn':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 64 64"
          fill="none"
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow */}
          <ellipse cx="32" cy="50" rx="14" ry="5" fill="rgba(30,25,20,0.25)" />
          {/* Stem */}
          <path d="M 32 12 Q 36 6 40 8" stroke="#4a3319" strokeWidth="2.5" strokeLinecap="round" />
          {/* Textured Cupule */}
          <path
            d="M 18 24 C 18 18 46 18 46 24 C 47 28 17 28 18 24 Z"
            fill="#5c4028"
            stroke="#382414"
            strokeWidth="1.5"
          />
          {/* Crosshatch scales */}
          <path d="M 22 20 L 42 26 M 26 20 L 38 26 M 22 26 L 42 20 M 26 26 L 38 20" stroke="#7a5839" strokeWidth="1" opacity="0.6" />
          {/* Nut body */}
          <path
            d="M 20 26 C 20 40 28 48 32 50 C 36 48 44 40 44 26 Z"
            fill="url(#acornGrad)"
            stroke="#5c3818"
            strokeWidth="1.5"
          />
          {/* Nut highlight */}
          <ellipse cx="26" cy="34" rx="3" ry="7" transform="rotate(-15 26 34)" fill="#ffffff" opacity="0.3" />
          <defs>
            <linearGradient id="acornGrad" x1="22" y1="26" x2="42" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#b4783c" />
              <stop offset="60%" stopColor="#8c5324" />
              <stop offset="100%" stopColor="#5c3313" />
            </linearGradient>
          </defs>
        </svg>
      );
  }
};

// ============================================================================
// 2. MILESTONE BADGES (Handcrafted insignia, zero emoji)
// ============================================================================

export const MilestoneBadgeAsset: React.FC<{
  badgeKey: 'tea' | 'cat' | 'rain' | 'companion' | 'seeker';
  size?: number;
  unlocked?: boolean;
}> = ({ badgeKey, size = 36, unlocked = true }) => {
  const filterClass = unlocked ? '' : 'grayscale opacity-50';

  return (
    <div className={`inline-block ${filterClass}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        {/* Seal circular background */}
        <circle cx="24" cy="24" r="21" fill={unlocked ? '#452b1e' : '#292524'} stroke={unlocked ? '#d4af37' : '#57534e'} strokeWidth="2" />
        <circle cx="24" cy="24" r="18" stroke={unlocked ? '#b45309' : '#44403c'} strokeWidth="1" strokeDasharray="2 2" />

        {badgeKey === 'tea' && (
          <g>
            <path d="M 17 26 C 17 32 31 32 31 26 Z" fill="#d97706" />
            <path d="M 16 26 H 32 V 22 H 16 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <path d="M 32 23 Q 36 24 32 27" stroke="#b45309" strokeWidth="1.2" />
            <path d="M 24 16 Q 22 13 24 10" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          </g>
        )}

        {badgeKey === 'cat' && (
          <g>
            <circle cx="24" cy="24" r="9" fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />
            <polygon points="17,19 15,12 21,16" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <polygon points="31,19 33,12 27,16" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
            <circle cx="21" cy="23" r="1" fill="#78350f" />
            <circle cx="27" cy="23" r="1" fill="#78350f" />
            <path d="M 22 26 Q 24 28 26 26" stroke="#78350f" strokeWidth="1" strokeLinecap="round" fill="none" />
          </g>
        )}

        {badgeKey === 'rain' && (
          <g>
            <path d="M 24 12 C 24 12 16 22 16 27 C 16 32 20 35 24 35 C 28 35 32 32 32 27 C 32 22 24 12 24 12 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.2" />
            <ellipse cx="21" cy="26" rx="2" ry="5" transform="rotate(-20 21 26)" fill="#ffffff" opacity="0.6" />
          </g>
        )}

        {badgeKey === 'companion' && (
          <g>
            <path d="M 24 16 C 20 12 14 15 17 21 C 20 26 24 30 24 30 C 24 30 28 26 31 21 C 34 15 28 12 24 16 Z" fill="#fb7185" stroke="#e11d48" strokeWidth="1.2" />
            <circle cx="24" cy="22" r="1.5" fill="#ffffff" />
          </g>
        )}

        {badgeKey === 'seeker' && (
          <g>
            <circle cx="24" cy="24" r="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.2" />
            <polygon points="24,18 26,24 24,23 22,24" fill="#ef4444" />
            <polygon points="24,30 26,24 24,25 22,24" fill="#cbd5e1" />
          </g>
        )}
      </svg>
    </div>
  );
};
