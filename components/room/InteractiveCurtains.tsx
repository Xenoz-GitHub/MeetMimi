'use client';

import React from 'react';
import { CurtainColorId } from '@/types/game';
import { sound } from '@/lib/audio';

interface InteractiveCurtainsProps {
  isOpen: boolean;
  colorId: CurtainColorId;
  onToggleOpen: () => void;
  onOpenColorPalette: () => void;
}

export const CURTAIN_PALETTES: Record<
  CurtainColorId,
  { name: string; hex: string; darkHex: string; lightHex: string }
> = {
  pale_blue: {
    name: 'Pale Blue',
    hex: '#9bbcd4',
    darkHex: '#6d94b0',
    lightHex: '#c7dced',
  },
  cyan: {
    name: 'Misty Cyan',
    hex: '#8ac4c2',
    darkHex: '#5e9e9c',
    lightHex: '#bde3e1',
  },
  soft_pink: {
    name: 'Soft Pink',
    hex: '#e2a8b6',
    darkHex: '#b87586',
    lightHex: '#f3cdd6',
  },
  pale_purple: {
    name: 'Pale Purple',
    hex: '#baa6d4',
    darkHex: '#8e77ac',
    lightHex: '#ded2f0',
  },
  dusty_lavender: {
    name: 'Dusty Lavender',
    hex: '#9f94a8',
    darkHex: '#73687c',
    lightHex: '#c8bfd0',
  },
  sage_green: {
    name: 'Sage Green',
    hex: '#96b499',
    darkHex: '#6d8e71',
    lightHex: '#c4d8c6',
  },
  warm_beige: {
    name: 'Warm Linen',
    hex: '#d8cdb8',
    darkHex: '#ab9e87',
    lightHex: '#eee6d8',
  },
  muted_rose: {
    name: 'Muted Rose',
    hex: '#c98a96',
    darkHex: '#9c5f6c',
    lightHex: '#e5b8c1',
  },
};

export const InteractiveCurtains: React.FC<InteractiveCurtainsProps> = ({
  isOpen,
  colorId,
  onToggleOpen,
  onOpenColorPalette,
}) => {
  const palette = CURTAIN_PALETTES[colorId] || CURTAIN_PALETTES.warm_beige;

  const handlePullCord = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playWindowTap();
    onToggleOpen();
  };

  const handleFabricClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCuteInteraction();
    onOpenColorPalette();
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 select-none">
      {/* Top Wooden Curtain Rail */}
      <div className="absolute -top-3 inset-x-2 h-3.5 bg-[#4a3427] rounded-full shadow-md border border-[#36241a] flex items-center justify-between px-1">
        {/* Left & Right Finials */}
        <div className="w-3.5 h-3.5 rounded-full bg-[#694b38] border border-[#36241a]" />
        <div className="w-3.5 h-3.5 rounded-full bg-[#694b38] border border-[#36241a]" />
      </div>

      {/* Hanging rings */}
      <div className="absolute -top-1.5 inset-x-6 flex justify-between pointer-events-none opacity-80">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="w-2 h-2.5 rounded-full border-2 border-[#bfa28d]" />
        ))}
      </div>

      {/* LEFT CURTAIN PANEL */}
      <div
        onClick={handleFabricClick}
        className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-in-out cursor-pointer pointer-events-auto group ${
          isOpen ? 'w-10 sm:w-12 opacity-95' : 'w-[48%] opacity-98'
        }`}
        title="Tap curtain fabric to customize color"
      >
        <svg
          viewBox="0 0 100 200"
          preserveAspectRatio="none"
          className="w-full h-full drop-shadow-lg"
        >
          <defs>
            <linearGradient id="leftCurtainGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={palette.darkHex} />
              <stop offset="35%" stopColor={palette.hex} />
              <stop offset="70%" stopColor={palette.lightHex} />
              <stop offset="100%" stopColor={palette.darkHex} />
            </linearGradient>
          </defs>
          {/* Main draped fabric with vertical folds */}
          <path
            d={
              isOpen
                ? 'M 0 0 C 40 0 80 10 90 20 C 60 70 50 140 70 200 L 0 200 Z'
                : 'M 0 0 L 100 0 L 100 200 L 0 200 Z'
            }
            fill="url(#leftCurtainGrad)"
          />
          {/* Fabric gather pleat shadows */}
          <path d="M 15 0 Q 20 100 15 200" stroke={palette.darkHex} strokeWidth="3" opacity="0.4" />
          <path d="M 45 0 Q 50 100 45 200" stroke={palette.darkHex} strokeWidth="3" opacity="0.35" />
          <path d="M 75 0 Q 80 100 75 200" stroke={palette.darkHex} strokeWidth="2.5" opacity="0.3" />
        </svg>

        {/* Subtle fabric hint on hover */}
        <div className="absolute top-4 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-stone-200 text-[8px] px-1.5 py-0.5 rounded border border-stone-600 whitespace-nowrap">
          Curtain color
        </div>
      </div>

      {/* RIGHT CURTAIN PANEL */}
      <div
        onClick={handleFabricClick}
        className={`absolute top-0 bottom-0 right-0 transition-all duration-700 ease-in-out cursor-pointer pointer-events-auto group ${
          isOpen ? 'w-10 sm:w-12 opacity-95' : 'w-[48%] opacity-98'
        }`}
        title="Tap curtain fabric to customize color"
      >
        <svg
          viewBox="0 0 100 200"
          preserveAspectRatio="none"
          className="w-full h-full drop-shadow-lg"
        >
          <defs>
            <linearGradient id="rightCurtainGrad" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor={palette.darkHex} />
              <stop offset="35%" stopColor={palette.hex} />
              <stop offset="70%" stopColor={palette.lightHex} />
              <stop offset="100%" stopColor={palette.darkHex} />
            </linearGradient>
          </defs>
          <path
            d={
              isOpen
                ? 'M 100 0 C 60 0 20 10 10 20 C 40 70 50 140 30 200 L 100 200 Z'
                : 'M 100 0 L 0 0 L 0 200 L 100 200 Z'
            }
            fill="url(#rightCurtainGrad)"
          />
          <path d="M 85 0 Q 80 100 85 200" stroke={palette.darkHex} strokeWidth="3" opacity="0.4" />
          <path d="M 55 0 Q 50 100 55 200" stroke={palette.darkHex} strokeWidth="3" opacity="0.35" />
          <path d="M 25 0 Q 20 100 25 200" stroke={palette.darkHex} strokeWidth="2.5" opacity="0.3" />
        </svg>
      </div>

      {/* PHYSICAL CURTAIN PULL CORD (Mounted directly to the top curtain track & bracket) */}
      <div
        onClick={handlePullCord}
        className="absolute -top-3 left-10 sm:left-12 flex flex-col items-center cursor-pointer pointer-events-auto group z-30"
        title={isOpen ? 'Pull string to draw curtains closed' : 'Pull string to open curtains'}
      >
        {/* Solid Brass & Wood Pulley Bracket connected to rail */}
        <div className="w-3.5 h-3.5 bg-[#4a3427] border border-[#2a1a11] rounded-b shadow-xs flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] border border-[#8a682b]" />
        </div>
        {/* Cord String line hanging continuously from bracket */}
        <div className="w-0.5 h-26 sm:h-30 bg-[#ebd9c8] shadow-sm group-hover:bg-amber-200 transition-colors" />
        {/* Turned Wooden Acorn Pull Bead */}
        <div className="w-3.5 h-5 rounded-b-full rounded-t-sm bg-[#5c3a21] border border-[#3d2412] shadow-md group-hover:scale-110 active:scale-95 transition-transform flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#825432]" />
        </div>
        {/* Cord Pull Hint */}
        <span className="text-[8px] font-serif text-amber-200 bg-stone-900/80 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mt-1 whitespace-nowrap border border-stone-700">
          {isOpen ? 'Close' : 'Open'}
        </span>
      </div>
    </div>
  );
};
