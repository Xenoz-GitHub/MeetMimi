'use client';

import React, { useState, useEffect } from 'react';
import { sound } from '@/lib/audio';
import { Sparkles } from 'lucide-react';

interface DeskFigurineProps {
  styleId: 'cat' | 'bunny' | 'bear' | 'duck';
  onTap: () => void;
  lampOn?: boolean;
}

export const DeskFigurine: React.FC<DeskFigurineProps> = ({
  styleId,
  onTap,
  lampOn = true,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [tiltAngle, setTiltAngle] = useState(0);
  const [sparkle, setSparkle] = useState(false);

  // Whimsical idle animations (periodic tilt & blink)
  useEffect(() => {
    const blinkTimer = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 6000 + Math.random() * 4000);

    const tiltTimer = setInterval(() => {
      setTiltAngle((prev) => (prev === 0 ? (Math.random() > 0.5 ? 4 : -4) : 0));
    }, 7500);

    return () => {
      clearInterval(blinkTimer);
      clearInterval(tiltTimer);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCuteInteraction();
    setSparkle(true);
    setTiltAngle((a) => (a >= 0 ? -6 : 6));
    onTap();

    setTimeout(() => {
      setSparkle(false);
      setTiltAngle(0);
    }, 1200);
  };

  return (
    <div
      onClick={handleClick}
      className="relative cursor-pointer select-none group flex flex-col items-center"
      title="Tap the desk companion figurine"
    >
      {/* Sparkle burst on tap */}
      {sparkle && (
        <div className="absolute -top-4 pointer-events-none text-amber-300 animate-ping z-30">
          <Sparkles className="w-4 h-4 fill-amber-200" />
        </div>
      )}

      {/* Figurine contact shadow */}
      <div className="absolute bottom-1 w-12 h-3.5 rounded-full bg-black/35 blur-[1.5px] pointer-events-none" />

      {/* 2D Handcrafted Figurine Vector Artwork */}
      <svg
        viewBox="0 0 60 70"
        className="w-12 h-14 overflow-visible transition-transform duration-300 group-hover:scale-105"
        style={{
          transformOrigin: '30px 60px',
          transform: `rotate(${tiltAngle}deg)`,
        }}
      >
        <defs>
          <radialGradient id="ceramicShine" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Polished wooden or ceramic pedestal base */}
        <ellipse cx="30" cy="62" rx="18" ry="5" fill="#4a301d" stroke="#2c1a0e" strokeWidth="1" />
        <ellipse cx="30" cy="60" rx="17" ry="4.5" fill="#66462c" />

        {/* ==================== STYLE 1: CERAMIC CALICO KITTEN ==================== */}
        {styleId === 'cat' && (
          <g id="fig-cat">
            {/* Body */}
            <path
              d="M 20 60 C 18 42 22 36 30 36 C 38 36 42 42 40 60 Z"
              fill="#faf6f0"
              stroke="#cfc3b4"
              strokeWidth="1.2"
            />
            {/* Calico spot */}
            <path d="M 22 44 Q 28 40 32 46 Q 26 52 20 50 Z" fill="#d97706" />
            {/* Head */}
            <circle cx="30" cy="28" r="14" fill="#faf6f0" stroke="#cfc3b4" strokeWidth="1.2" />
            <path d="M 22 18 Q 30 16 34 24 Q 26 26 20 22 Z" fill="#d97706" />
            {/* Ears */}
            <polygon points="20,20 16,10 26,16" fill="#d97706" />
            <polygon points="40,20 44,10 34,16" fill="#374151" />
            {/* Eyes */}
            {isBlinking ? (
              <path d="M 23 28 Q 26 31 29 28 M 31 28 Q 34 31 37 28" stroke="#473e35" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <circle cx="25" cy="27" r="2" fill="#292524" />
                <circle cx="24.5" cy="26" r="0.7" fill="#fff" />
                <circle cx="35" cy="27" r="2" fill="#292524" />
                <circle cx="34.5" cy="26" r="0.7" fill="#fff" />
              </>
            )}
            {/* Nose & Rosy Cheeks */}
            <polygon points="29,31 31,31 30,32" fill="#f43f5e" />
            <ellipse cx="23" cy="31" rx="2" ry="1.2" fill="#fda4af" opacity="0.6" />
            <ellipse cx="37" cy="31" rx="2" ry="1.2" fill="#fda4af" opacity="0.6" />
            {/* Little golden bell on ribbon */}
            <path d="M 22 36 Q 30 39 38 36" stroke="#dc2626" strokeWidth="1.5" fill="none" />
            <circle cx="30" cy="38" r="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
            {/* Glaze reflection */}
            <ellipse cx="26" cy="22" rx="4" ry="2" fill="url(#ceramicShine)" transform="rotate(-20 26 22)" />
          </g>
        )}

        {/* ==================== STYLE 2: PORCELAIN MEADOW BUNNY ==================== */}
        {styleId === 'bunny' && (
          <g id="fig-bunny">
            {/* Body */}
            <ellipse cx="30" cy="48" rx="14" ry="12" fill="#fbf8f5" stroke="#cfc3b4" strokeWidth="1.2" />
            {/* Head */}
            <circle cx="30" cy="30" r="13" fill="#fbf8f5" stroke="#cfc3b4" strokeWidth="1.2" />
            {/* Long upright ears */}
            <ellipse cx="24" cy="14" rx="4" ry="12" transform="rotate(-8 24 14)" fill="#fbf8f5" stroke="#cfc3b4" strokeWidth="1.2" />
            <ellipse cx="24" cy="14" rx="2" ry="8" transform="rotate(-8 24 14)" fill="#fecdd3" opacity="0.6" />
            <ellipse cx="36" cy="14" rx="4" ry="12" transform="rotate(8 36 14)" fill="#fbf8f5" stroke="#cfc3b4" strokeWidth="1.2" />
            <ellipse cx="36" cy="14" rx="2" ry="8" transform="rotate(8 36 14)" fill="#fecdd3" opacity="0.6" />
            {/* Eyes */}
            {isBlinking ? (
              <path d="M 23 30 Q 26 33 29 30 M 31 30 Q 34 33 37 30" stroke="#473e35" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <ellipse cx="25" cy="29" rx="1.8" ry="2.2" fill="#be123c" />
                <circle cx="24.5" cy="28" r="0.7" fill="#fff" />
                <ellipse cx="35" cy="29" rx="1.8" ry="2.2" fill="#be123c" />
                <circle cx="34.5" cy="28" r="0.7" fill="#fff" />
              </>
            )}
            <polygon points="29,33 31,33 30,34" fill="#fb7185" />
            <ellipse cx="22" cy="33" rx="2" ry="1.2" fill="#fda4af" opacity="0.7" />
            <ellipse cx="38" cy="33" rx="2" ry="1.2" fill="#fda4af" opacity="0.7" />
            {/* Tiny green clover in paws */}
            <circle cx="30" cy="45" r="2" fill="#15803d" />
            <circle cx="32" cy="44" r="1.8" fill="#16a34a" />
            <circle cx="28" cy="44" r="1.8" fill="#22c55e" />
            {/* Ceramic Glaze */}
            <ellipse cx="26" cy="25" rx="4" ry="2" fill="url(#ceramicShine)" transform="rotate(-15 26 25)" />
          </g>
        )}

        {/* ==================== STYLE 3: CARVED WALNUT BEAR ==================== */}
        {styleId === 'bear' && (
          <g id="fig-bear">
            {/* Body */}
            <ellipse cx="30" cy="48" rx="15" ry="14" fill="#854d0e" stroke="#543007" strokeWidth="1.2" />
            {/* Head */}
            <circle cx="30" cy="28" r="14" fill="#854d0e" stroke="#543007" strokeWidth="1.2" />
            {/* Round ears */}
            <circle cx="19" cy="18" r="5" fill="#854d0e" stroke="#543007" strokeWidth="1.2" />
            <circle cx="19" cy="18" r="2.5" fill="#a16207" />
            <circle cx="41" cy="18" r="5" fill="#854d0e" stroke="#543007" strokeWidth="1.2" />
            <circle cx="41" cy="18" r="2.5" fill="#a16207" />
            {/* Muzzle */}
            <ellipse cx="30" cy="32" rx="7" ry="5.5" fill="#a16207" />
            <polygon points="28,30 32,30 30,32" fill="#292524" />
            {/* Eyes */}
            {isBlinking ? (
              <path d="M 23 26 Q 26 28 29 26 M 31 26 Q 34 28 37 26" stroke="#1c1917" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <circle cx="25" cy="25" r="1.8" fill="#1c1917" />
                <circle cx="24.5" cy="24" r="0.6" fill="#fff" />
                <circle cx="35" cy="25" r="1.8" fill="#1c1917" />
                <circle cx="34.5" cy="24" r="0.6" fill="#fff" />
              </>
            )}
            {/* Tiny honey pot in paws */}
            <rect x="26" y="44" width="8" height="7" rx="2" fill="#ca8a04" stroke="#713f12" strokeWidth="1" />
            <ellipse cx="30" cy="44" rx="3.5" ry="1.5" fill="#fde047" />
          </g>
        )}

        {/* ==================== STYLE 4: RAINCOAT DUCKLING ==================== */}
        {styleId === 'duck' && (
          <g id="fig-duck">
            {/* Yellow Raincoat Body */}
            <path
              d="M 20 60 C 18 44 24 38 30 38 C 36 38 42 44 40 60 Z"
              fill="#eab308"
              stroke="#ca8a04"
              strokeWidth="1.2"
            />
            {/* Hood & Head */}
            <circle cx="30" cy="28" r="13" fill="#eab308" stroke="#ca8a04" strokeWidth="1.2" />
            <circle cx="30" cy="29" r="10" fill="#fef08a" />
            {/* Orange Bill */}
            <ellipse cx="30" cy="32" rx="6" ry="3.5" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
            {/* Eyes */}
            {isBlinking ? (
              <path d="M 23 27 Q 26 29 29 27 M 31 27 Q 34 29 37 27" stroke="#292524" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <circle cx="25" cy="27" r="1.8" fill="#1c1917" />
                <circle cx="24.5" cy="26" r="0.6" fill="#fff" />
                <circle cx="35" cy="27" r="1.8" fill="#1c1917" />
                <circle cx="34.5" cy="26" r="0.6" fill="#fff" />
              </>
            )}
            {/* Tiny umbrella emblem */}
            <path d="M 27 48 Q 30 44 33 48 Z" fill="#0284c7" />
            <path d="M 30 48 V 52 Q 30 53 29 53" stroke="#0369a1" strokeWidth="0.8" fill="none" />
          </g>
        )}

        {/* Lamp Light Glow on Figurine Glaze */}
        {lampOn && (
          <ellipse
            cx="22"
            cy="20"
            rx="5"
            ry="2.5"
            transform="rotate(-25 22 20)"
            fill="#fef08a"
            opacity="0.5"
            className="pointer-events-none"
          />
        )}
      </svg>
    </div>
  );
};
