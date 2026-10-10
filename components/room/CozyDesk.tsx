'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sound } from '@/lib/audio';
import { Sparkles } from 'lucide-react';

interface CozyDeskProps {
  lampOn: boolean;
  onToggleLamp: () => void;
  currentTea: string | null;
  onOpenTea: () => void;
  onOpenJournal: () => void;
  onWaterPlant: () => void;
  onTapFigurine: () => void;
  onDiscoverHiddenItem: (itemId: string) => void;
  discoveredItemIds: string[];
  plantBloomed: boolean;
  decor?: {
    deskMat?: string;
    figurine?: string;
    lampShade?: string;
    plantType?: string;
  };
}

export const CozyDesk: React.FC<CozyDeskProps> = ({
  lampOn,
  onToggleLamp,
  currentTea,
  onOpenTea,
  onOpenJournal,
  onWaterPlant,
  onTapFigurine,
  onDiscoverHiddenItem,
  discoveredItemIds,
  plantBloomed,
}) => {
  const isStampFound = discoveredItemIds.includes('vintage_stamp');
  const isCraneFound = discoveredItemIds.includes('origami_crane');
  const isKeyFound = discoveredItemIds.includes('brass_key');

  // Tooltip state for hover or long-press ONLY (no permanent modern text labels)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [bloomSparkles, setBloomSparkles] = useState<boolean>(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper for touch long-press
  const handlePointerDown = (label: string) => {
    pressTimerRef.current = setTimeout(() => {
      setActiveTooltip(label);
    }, 350);
  };

  const handlePointerUp = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setActiveTooltip(null);
  };

  const handleWaterVase = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCuteInteraction();
    setBloomSparkles(true);
    setTimeout(() => setBloomSparkles(false), 1800);
    onWaterPlant();
  };

  const handleBooksClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPaperTurn();
    onTapFigurine();
  };

  const handleLetterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPaperTurn();
    if (!isCraneFound) {
      onDiscoverHiddenItem('origami_crane');
    } else {
      sound.playCuteInteraction();
    }
  };

  const handleDrawerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isStampFound) {
      onDiscoverHiddenItem('vintage_stamp');
    } else {
      sound.playCuteInteraction();
    }
  };

  return (
    <div
      className="relative w-full select-none"
      onPointerLeave={handlePointerUp}
      onPointerUp={handlePointerUp}
    >
      {/* DESK CONTAINER WITH LEFT VASE AND MAIN TABLE */}
      <div className="relative flex items-end justify-center w-full max-w-[520px] mx-auto">
        {/* Subtle Vintage Diegetic Tooltip (Only on hover or touch long-press - zero modern UI) */}
        {activeTooltip && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#271912]/95 border border-[#855335] text-[#fde047] text-[11px] font-serif shadow-xl whitespace-nowrap pointer-events-none z-50 animate-in fade-in zoom-in-95 tracking-wide">
            <span className="text-amber-400 mr-1.5 font-bold">✦</span>
            {activeTooltip}
          </div>
        )}

        {/* ========================================================== */}
        {/* LEFT: TALL PLUM BLOSSOM CERAMIC VASE (EXACTLY LIKE PICTURE) */}
        {/* ========================================================== */}
        <div
          onClick={handleWaterVase}
          onMouseEnter={() => setActiveTooltip('Plum Blossom Vase')}
          onMouseLeave={() => setActiveTooltip(null)}
          onPointerDown={() => handlePointerDown('Plum Blossom Vase')}
          className="relative z-30 cursor-pointer group flex flex-col items-center -mr-2 sm:-mr-3 mb-2 shrink-0 transition-transform active:scale-95"
          title="Plum Blossom Vase"
        >
          {/* Blossom Watering Sparkles */}
          {bloomSparkles && (
            <div className="absolute -top-4 inset-x-0 flex justify-center gap-1 pointer-events-none animate-bounce">
              <Sparkles className="w-4 h-4 text-pink-300" />
            </div>
          )}

          <svg viewBox="0 0 72 160" className="w-14 sm:w-16 h-36 sm:h-42 overflow-visible drop-shadow-md">
            {/* Soft contact shadow */}
            <ellipse cx="36" cy="154" rx="20" ry="5" fill="rgba(0,0,0,0.45)" />

            {/* Green Flower Stalk & Branches */}
            <path d="M 36 90 L 36 30" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 36 60 L 22 48" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 36 72 L 50 62" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />

            {/* 4 Layered Pink Blossom Flowers with Golden Centers */}
            {/* Top Center Blossom */}
            <g transform="translate(36, 26)">
              <rect x="-14" y="-12" width="28" height="24" rx="6" fill="#f472b6" stroke="#be185d" strokeWidth="1.5" />
              <rect x="-10" y="-8" width="20" height="16" rx="4" fill="#fb7185" />
              <circle cx="0" cy="0" r="4.5" fill="#fde047" />
            </g>

            {/* Left Blossom */}
            <g transform="translate(18, 48)">
              <rect x="-10" y="-9" width="20" height="18" rx="4" fill="#f472b6" stroke="#be185d" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3.5" fill="#fde047" />
            </g>

            {/* Right Blossom */}
            <g transform="translate(52, 62)">
              <rect x="-10" y="-9" width="20" height="18" rx="4" fill="#f472b6" stroke="#be185d" strokeWidth="1.2" />
              <circle cx="0" cy="0" r="3.5" fill="#fde047" />
            </g>

            {/* Lower Stem Blossom */}
            <g transform="translate(36, 75)">
              <rect x="-8" y="-7" width="16" height="14" rx="3" fill="#f472b6" stroke="#be185d" strokeWidth="1" />
              <circle cx="0" cy="0" r="2.8" fill="#fde047" />
            </g>

            {/* Ceramic Plum Vase Body */}
            {/* Vase Neck & Rim */}
            <ellipse cx="36" cy="92" rx="14" ry="4" fill="#581c87" stroke="#3b0764" strokeWidth="1.5" />
            <ellipse cx="36" cy="90" rx="12" ry="3" fill="#701a75" />

            {/* Vase Curvaceous Silhouette */}
            <path
              d="M 24 92 C 14 102 12 118 12 132 C 12 144 20 152 36 152 C 52 152 60 144 60 132 C 60 118 58 102 48 92 Z"
              fill="#701a75"
              stroke="#3b0764"
              strokeWidth="2"
            />

            {/* Glossy Reflection Highlight */}
            <path
              d="M 18 102 C 15 112 15 124 16 134"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* Geometric Fret Pattern Engraving Bands (Greek Key style) */}
            <path
              d="M 14 122 H 58 M 14 128 H 58 M 16 122 V 128 M 24 122 V 128 M 32 122 V 128 M 40 122 V 128 M 48 122 V 128 M 56 122 V 128"
              stroke="#3b0764"
              strokeWidth="1.5"
              opacity="0.8"
            />
            <path
              d="M 14 138 H 58 M 16 134 V 142 M 28 134 V 142 M 44 134 V 142 M 56 134 V 142"
              stroke="#4a044e"
              strokeWidth="1.2"
              opacity="0.8"
            />

            {/* Vase Sturdy Base */}
            <ellipse cx="36" cy="151" rx="16" ry="3.5" fill="#4a044e" />
          </svg>
        </div>

        {/* ========================================================== */}
        {/* CENTER/RIGHT: THE WOODEN STUDY DESK (MATCHING SCREENSHOT 3) */}
        {/* ========================================================== */}
        <div className="relative flex-1 max-w-[440px]">
          {/* Warm Candle Light Radial Glow when lit */}
          {lampOn && (
            <div
              className="absolute -top-12 left-4 w-56 h-56 pointer-events-none z-10 transition-opacity duration-500"
              style={{
                background:
                  'radial-gradient(circle at 35% 35%, rgba(254, 240, 138, 0.48) 0%, rgba(245, 158, 11, 0.22) 42%, transparent 72%)',
                filter: 'blur(6px)',
              }}
            />
          )}

          {/* MAIN WOODEN DESK SVG RIG */}
          <div className="relative w-full">
            <svg
              viewBox="0 0 380 230"
              className="w-full h-auto overflow-visible drop-shadow-xl"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Wood plank gradient */}
                <linearGradient id="tabletopWood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c5783f" />
                  <stop offset="25%" stopColor="#b66a33" />
                  <stop offset="70%" stopColor="#9e5625" />
                  <stop offset="100%" stopColor="#87461c" />
                </linearGradient>

                {/* Dark Wood Apron Gradient */}
                <linearGradient id="apronWood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7a3b15" />
                  <stop offset="100%" stopColor="#5c290b" />
                </linearGradient>
              </defs>

              {/* 1. DESK LEGS (Sturdy wooden legs with footer blocks) */}
              {/* Left leg */}
              <rect x="24" y="140" width="22" height="76" fill="#69300e" stroke="#4a1f07" strokeWidth="1.5" />
              <rect x="20" y="206" width="30" height="14" fill="#4a1f07" rx="1" />
              {/* Right leg */}
              <rect x="334" y="140" width="22" height="76" fill="#69300e" stroke="#4a1f07" strokeWidth="1.5" />
              <rect x="330" y="206" width="30" height="14" fill="#4a1f07" rx="1" />

              {/* 2. TABLETOP (Warm wooden surface with bevel edges & planks) */}
              {/* Tabletop Main Slab */}
              <rect
                x="8"
                y="14"
                width="364"
                height="128"
                rx="3"
                fill="url(#tabletopWood)"
                stroke="#542409"
                strokeWidth="2.5"
              />

              {/* Top Edge Bevel Highlight */}
              <path d="M 9 16 L 371 16" stroke="#e09459" strokeWidth="2.5" strokeLinecap="round" />

              {/* Horizontal Wooden Planks Delineation */}
              <path d="M 8 48 L 372 48" stroke="#753811" strokeWidth="1.8" />
              <path d="M 8 50 L 372 50" stroke="#d48348" strokeWidth="0.8" opacity="0.6" />

              <path d="M 8 86 L 372 86" stroke="#753811" strokeWidth="1.8" />
              <path d="M 8 88 L 372 88" stroke="#d48348" strokeWidth="0.8" opacity="0.6" />

              <path d="M 8 122 L 372 122" stroke="#753811" strokeWidth="1.8" />
              <path d="M 8 124 L 372 124" stroke="#d48348" strokeWidth="0.8" opacity="0.6" />

              {/* Natural wood grain flecks */}
              <path d="M 40 32 H 80 M 160 38 H 210 M 290 30 H 330" stroke="#874316" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 70 70 H 120 M 240 66 H 310" stroke="#874316" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 30 106 H 90 M 210 102 H 260 M 320 110 H 350" stroke="#874316" strokeWidth="1.5" strokeLinecap="round" />

              {/* 3. DESK FRONT APRON & DRAWERS */}
              <rect x="8" y="142" width="364" height="42" fill="url(#apronWood)" stroke="#4a1f07" strokeWidth="2" />

              {/* Left Drawer (Closed, with brass pull) */}
              <rect x="22" y="148" width="156" height="30" rx="1.5" fill="#8c471b" stroke="#542409" strokeWidth="1.5" />
              {/* Golden Rectangular Drawer Pull */}
              <rect x="86" y="157" width="28" height="11" rx="2" fill="#facc15" stroke="#a16207" strokeWidth="1.2" />
              <rect x="91" y="160" width="18" height="5" rx="1" fill="#ca8a04" />

              {/* Right Drawer (PULLED OPEN, with papers sticking out!) */}
              {/* Open drawer dark interior cavity */}
              <rect x="202" y="148" width="156" height="30" fill="#2d1305" stroke="#4a1f07" strokeWidth="1.5" />
              {/* Pulled Out Drawer Face */}
              <g
                onClick={handleDrawerClick}
                className="cursor-pointer group/drawer"
              >
                {/* Drawer Box dropped down */}
                <rect x="202" y="156" width="156" height="32" rx="1.5" fill="#8c471b" stroke="#542409" strokeWidth="1.5" />
                {/* Golden Pull */}
                <rect x="266" y="167" width="28" height="11" rx="2" fill="#facc15" stroke="#a16207" strokeWidth="1.2" />
                <rect x="271" y="170" width="18" height="5" rx="1" fill="#ca8a04" />

                {/* Parchment Documents & Letters inside Drawer */}
                <rect x="216" y="150" width="56" height="12" rx="1" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
                <line x1="222" y1="154" x2="252" y2="154" stroke="#78350f" strokeWidth="1" />
                <line x1="222" y1="158" x2="260" y2="158" stroke="#78350f" strokeWidth="1" />

                {/* Secret item gleam if stamp not found */}
                {!isStampFound && (
                  <circle cx="340" cy="168" r="4.5" fill="#fde047" className="animate-pulse" />
                )}
              </g>

              {/* ========================================================== */}
              {/* 4. TABLETOP OBJECTS (DIEGETIC & PLACED EXACTLY LIKE PICTURE) */}
              {/* ========================================================== */}

              {/* ---------------------------------------------------------- */}
              {/* OBJECT A: STACK OF 3 BOOKS (Top-Left of Desk) */}
              {/* ---------------------------------------------------------- */}
              <g
                onClick={handleBooksClick}
                onMouseEnter={() => setActiveTooltip('Stack of Tales')}
                onMouseLeave={() => setActiveTooltip(null)}
                onPointerDown={() => handlePointerDown('Stack of Tales')}
                className="cursor-pointer group/books transition-transform hover:scale-[1.02]"
              >
                {/* Bottom Book: Navy Blue Cover */}
                <rect x="68" y="58" width="76" height="18" rx="2" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
                <rect x="74" y="61" width="68" height="12" fill="#fef3c7" />

                {/* Middle Book: Forest Green Cover */}
                <rect x="68" y="44" width="76" height="16" rx="2" fill="#166534" stroke="#14532d" strokeWidth="1.2" />
                <rect x="74" y="47" width="68" height="10" fill="#fef3c7" />

                {/* Top Book: Crimson Red with Gold Inlaid Frame */}
                <rect x="76" y="24" width="64" height="22" rx="2" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                {/* Gold Inlaid Border on Front Cover */}
                <rect x="85" y="28" width="46" height="14" fill="none" stroke="#facc15" strokeWidth="1.5" />
                <rect x="94" y="32" width="28" height="6" fill="#991b1b" stroke="#facc15" strokeWidth="1" />
              </g>

              {/* ---------------------------------------------------------- */}
              {/* OBJECT B: MODERN CUTE DESIGNER MUSHROOM LAMP (Middle-Left of Desk) */}
              {/* ---------------------------------------------------------- */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playLampClick();
                  onToggleLamp();
                }}
                onMouseEnter={() => setActiveTooltip('Modern Cute Lamp')}
                onMouseLeave={() => setActiveTooltip(null)}
                onPointerDown={() => handlePointerDown('Modern Cute Lamp')}
                className="cursor-pointer group/lamp transition-transform hover:scale-105"
              >
                {/* Soft Lamp Contact Shadow */}
                <ellipse cx="66" cy="85" rx="20" ry="4.5" fill="rgba(0,0,0,0.32)" />

                {/* Light Cone Downward Illumination when ON */}
                {lampOn && (
                  <g className="pointer-events-none">
                    <polygon points="44,56 88,56 112,89 20,89" fill="rgba(254, 240, 138, 0.26)" />
                    <ellipse cx="66" cy="86" rx="42" ry="7" fill="rgba(254, 240, 138, 0.22)" />
                  </g>
                )}

                {/* Modern Weighted Ceramic Pedestal Base */}
                <path
                  d="M 52 84 C 52 76 80 76 80 84 Z"
                  fill="#fefce8"
                  stroke="#ca8a04"
                  strokeWidth="1.4"
                />
                <ellipse cx="66" cy="84" rx="14" ry="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                {/* Touch Power Switch with tiny glow */}
                <circle cx="66" cy="79.5" r="2.2" fill={lampOn ? '#f59e0b' : '#a8a29e'} stroke="#78350f" strokeWidth="0.6" />
                {lampOn && <circle cx="66" cy="79.5" r="1" fill="#ffffff" />}

                {/* Sleek Modern Slender Brass Stem */}
                <rect x="64.5" y="52" width="3" height="26" rx="1.5" fill="#ca8a04" stroke="#a16207" strokeWidth="0.8" />

                {/* Cute Modern Mushroom Dome Lampshade */}
                <path
                  d="M 42 56 C 42 30 90 30 90 56 Z"
                  fill={lampOn ? '#fef08a' : '#fffbeb'}
                  stroke="#d97706"
                  strokeWidth="1.6"
                />
                {/* Modern Dome Shade Lower Lip */}
                <ellipse
                  cx="66"
                  cy="56"
                  rx="24"
                  ry="4"
                  fill={lampOn ? '#fde047' : '#fef3c7'}
                  stroke="#d97706"
                  strokeWidth="1.3"
                />

                {/* Inner Warm Bulb Radiance */}
                {lampOn ? (
                  <g className="animate-pulse">
                    <ellipse cx="66" cy="57" rx="14" ry="4" fill="#ffffff" />
                    <circle cx="66" cy="57" r="3.5" fill="#ffffff" />
                  </g>
                ) : (
                  <ellipse cx="66" cy="57" rx="7" ry="2" fill="#d6d3d1" />
                )}
              </g>

              {/* ---------------------------------------------------------- */}
              {/* OBJECT C: OPEN JOURNAL / TOME (Center of Desk) */}
              {/* ---------------------------------------------------------- */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playPaperTurn();
                  onOpenJournal();
                }}
                onMouseEnter={() => setActiveTooltip('Rain Journal')}
                onMouseLeave={() => setActiveTooltip(null)}
                onPointerDown={() => handlePointerDown('Rain Journal')}
                className="cursor-pointer group/journal transition-transform hover:scale-[1.03]"
              >
                {/* Red Leather Binding Backing */}
                <rect x="144" y="58" width="112" height="64" rx="3" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />

                {/* Left Open Page: Cream Parchment */}
                <path
                  d="M 148 62 C 168 60 196 61 200 64 L 200 118 C 196 116 168 116 148 118 Z"
                  fill="#fef3c7"
                  stroke="#d97706"
                  strokeWidth="0.8"
                />
                {/* Right Open Page: Cream Parchment */}
                <path
                  d="M 200 64 C 204 61 232 60 252 62 L 252 118 C 232 116 204 116 200 118 Z"
                  fill="#fef9c3"
                  stroke="#d97706"
                  strokeWidth="0.8"
                />

                {/* Handwritten Ink Lines on Left Page */}
                <line x1="156" y1="72" x2="192" y2="72" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="80" x2="192" y2="80" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="88" x2="190" y2="88" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="96" x2="186" y2="96" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="104" x2="192" y2="104" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />

                {/* Handwritten Ink Lines on Right Page */}
                <line x1="208" y1="72" x2="244" y2="72" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="80" x2="244" y2="80" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="88" x2="240" y2="88" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="96" x2="236" y2="96" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="104" x2="244" y2="104" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />

                {/* Crimson Center Bookmark Ribbon */}
                <line x1="200" y1="58" x2="200" y2="124" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* ---------------------------------------------------------- */}
              {/* OBJECT D: MODERN CUTE CERAMIC MUG (Top-Right of Desk) */}
              {/* ---------------------------------------------------------- */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playTeaPour();
                  onOpenTea();
                }}
                onMouseEnter={() => setActiveTooltip('Cute Ceramic Mug')}
                onMouseLeave={() => setActiveTooltip(null)}
                onPointerDown={() => handlePointerDown('Cute Ceramic Mug')}
                className="cursor-pointer group/mug transition-transform hover:scale-105"
              >
                {/* Soft Mug Contact Shadow */}
                <ellipse cx="290" cy="56" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />

                {/* Modern Rounded Ceramic Mug Body */}
                <rect x="274" y="24" width="32" height="31" rx="7" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.4" />
                {/* Ceramic Mug Bottom Base Accent */}
                <path d="M 276 52 C 280 55 300 55 304 52" stroke="#ea580c" strokeWidth="1" fill="none" opacity="0.6" />

                {/* Kawaii Cute Face on Mug */}
                {/* Happy curved eyes */}
                <path d="M 283 37 Q 286 34 289 37" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                <path d="M 293 37 Q 296 34 299 37" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                {/* Cute sweet smile */}
                <path d="M 289.5 41 Q 291 43 292.5 41" stroke="#7c2d12" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                {/* Soft rosy blush cheeks */}
                <circle cx="280.5" cy="39" r="1.8" fill="#fb7185" opacity="0.7" />
                <circle cx="301.5" cy="39" r="1.8" fill="#fb7185" opacity="0.7" />

                {/* Modern Sleek Loop Handle on Right */}
                <path
                  d="M 306 28 C 316 28 316 46 306 46"
                  stroke="#ea580c"
                  strokeWidth="3.2"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Tea Liquid Rim & Latte Art */}
                <ellipse cx="290" cy="24" rx="15" ry="4.5" fill="#78350f" stroke="#ea580c" strokeWidth="1.2" />
                <ellipse cx="290" cy="24" rx="13" ry="3.2" fill="#fef08a" />
                {/* Adorable little Latte Art Heart */}
                <path
                  d="M 290 22.5 C 288 20 285.5 22.5 290 25.5 C 294.5 22.5 292 20 290 22.5 Z"
                  fill="#c2410c"
                  opacity="0.8"
                />

                {/* Gentle Rising Steam Vapor */}
                {currentTea && (
                  <g className="animate-pulse">
                    <path
                      d="M 286 16 C 284 10 288 6 286 2"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                    <path
                      d="M 294 14 C 296 9 292 5 295 1"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.65"
                    />
                  </g>
                )}
              </g>

              {/* ---------------------------------------------------------- */}
              {/* OBJECT E: WAX-SEALED LETTER ENVELOPE (Far Top-Right of Desk) */}
              {/* ---------------------------------------------------------- */}
              <g
                onClick={handleLetterClick}
                onMouseEnter={() => setActiveTooltip('Wax-Sealed Letter')}
                onMouseLeave={() => setActiveTooltip(null)}
                onPointerDown={() => handlePointerDown('Wax-Sealed Letter')}
                className="cursor-pointer group/letter transition-transform hover:scale-105"
              >
                {/* Folded Parchment Envelope */}
                <rect x="320" y="24" width="50" height="34" rx="2" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.2" />

                {/* Envelope Triangular Fold Lines */}
                <line x1="320" y1="24" x2="345" y2="40" stroke="#ea580c" strokeWidth="1.2" />
                <line x1="370" y1="24" x2="345" y2="40" stroke="#ea580c" strokeWidth="1.2" />
                <line x1="320" y1="58" x2="338" y2="42" stroke="#ea580c" strokeWidth="0.8" opacity="0.6" />
                <line x1="370" y1="58" x2="352" y2="42" stroke="#ea580c" strokeWidth="0.8" opacity="0.6" />

                {/* Crimson Red Wax Seal Button */}
                <circle cx="345" cy="40" r="5.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                <circle cx="345" cy="40" r="2.8" fill="#ef4444" />
              </g>

              {/* ---------------------------------------------------------- */}
              {/* OBJECT F: GLASS INKWELL & WHITE FEATHER QUILL (Middle-Right) */}
              {/* ---------------------------------------------------------- */}
              <g
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playCuteInteraction();
                  onTapFigurine();
                }}
                onMouseEnter={() => setActiveTooltip('Ink & Quill')}
                onMouseLeave={() => setActiveTooltip(null)}
                onPointerDown={() => handlePointerDown('Ink & Quill')}
                className="cursor-pointer group/quill transition-transform hover:scale-105"
              >
                {/* Clear Faceted Glass Inkwell */}
                <ellipse cx="286" cy="88" rx="10" ry="3.5" fill="rgba(0,0,0,0.3)" />
                <path
                  d="M 280 86 L 278 76 L 284 72 L 288 72 L 294 76 L 292 86 Z"
                  fill="#1e293b"
                  stroke="#0f172a"
                  strokeWidth="1.2"
                />
                {/* Glass reflection highlight */}
                <path d="M 281 78 L 283 84" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
                {/* Cork Stopper Rim */}
                <rect x="283" y="70" width="6" height="3" fill="#b45309" rx="0.5" />

                {/* White Feather Quill Pen */}
                {/* Quill Shaft */}
                <line x1="316" y1="62" x2="316" y2="104" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                {/* Ink Nib Tip */}
                <polygon points="314,103 318,103 316,108" fill="#0f172a" />

                {/* Feather Vanes (Detailed classic white quill) */}
                <path
                  d="M 316 64 C 310 68 310 82 316 92 C 322 82 322 68 316 64 Z"
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
                <line x1="312" y1="72" x2="316" y2="74" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="312" y1="80" x2="316" y2="82" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="320" y1="72" x2="316" y2="74" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="320" y1="80" x2="316" y2="82" stroke="#cbd5e1" strokeWidth="1" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
