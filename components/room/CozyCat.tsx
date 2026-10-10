'use client';

import React, { useState, useEffect } from 'react';
import { CatState, CatLocation } from '@/types/game';
import { sound } from '@/lib/audio';
import { Heart } from 'lucide-react';

interface CozyCatProps {
  onPet: () => void;
  petCount: number;
  reducedMotion?: boolean;
}

export const CozyCat: React.FC<CozyCatProps> = ({ onPet, petCount, reducedMotion = false }) => {
  const [catState, setCatState] = useState<CatState>('SLEEPING');
  const [catLocation, setCatLocation] = useState<CatLocation>('BED');
  const [facing, setFacing] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [tailWag, setTailWag] = useState(0);

  // Autonomous cat schedule state machine
  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      // Pick next state naturally
      setCatState((prev) => {
        if (prev === 'PURRING') return 'SITTING';

        const rand = Math.random();
        if (prev === 'SLEEPING') {
          // 40% wake up and stretch
          if (rand < 0.45) return 'WAKING_UP';
          return 'SLEEPING';
        }
        if (prev === 'WAKING_UP') {
          return 'STRETCHING';
        }
        if (prev === 'STRETCHING') {
          return 'SITTING';
        }
        if (prev === 'SITTING') {
          if (rand < 0.4) return 'GROOMING';
          if (rand < 0.75) {
            setFacing((f) => (f === 'LEFT' ? 'RIGHT' : 'LEFT'));
            return 'WATCHING_WINDOW';
          }
          return 'SLEEPING';
        }
        if (prev === 'GROOMING') {
          return rand < 0.5 ? 'SITTING' : 'SLEEPING';
        }
        if (prev === 'WATCHING_WINDOW') {
          return 'SITTING';
        }
        return 'SLEEPING';
      });
    }, 18000 + Math.random() * 12000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Gentle tail animation loop
  useEffect(() => {
    const tailTimer = setInterval(() => {
      setTailWag((w) => (w === 0 ? 1 : 0));
    }, 2800);
    return () => clearInterval(tailTimer);
  }, []);

  const handlePet = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCatPurr();
    setCatState('PURRING');
    onPet();

    const newHeart = { id: Date.now(), x: 30 + Math.random() * 25, y: -10 + Math.random() * 15 };
    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      setCatState('SITTING');
    }, 3500);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1400);
  };

  return (
    <div
      onClick={handlePet}
      className="relative cursor-pointer select-none group transition-transform active:scale-95"
      title="Tap to gently pet Mochi the cat"
    >
      {/* Floating Hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute pointer-events-none text-rose-400 animate-[float-up_1.4s_ease-out_forwards] z-40"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          <Heart className="w-4 h-4 fill-rose-400/80 drop-shadow" />
        </div>
      ))}

      {/* DETAILED LUXURY FABRIC CAT BED */}
      <div className="relative w-36 h-20 rounded-[44px] bg-gradient-to-b from-[#6b4238] via-[#59332a] to-[#42221b] shadow-xl border-2 border-[#825449] flex items-center justify-center p-2">
        {/* Soft quilted rim folds */}
        <div className="absolute inset-1 rounded-[38px] border border-[#966356]/40 pointer-events-none" />
        {/* Inner plush cushion indentation */}
        <div className="w-28 h-14 rounded-[30px] bg-gradient-to-b from-[#4a2720] to-[#361a15] shadow-inner flex items-center justify-center relative overflow-hidden">
          {/* Cushion fabric tufts */}
          <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#2d1511]/60 rounded-full" />
          <div className="absolute left-1/3 top-1/3 w-1 h-1 rounded-full bg-[#59332a]/50" />
          <div className="absolute right-1/3 top-1/3 w-1 h-1 rounded-full bg-[#59332a]/50" />

          {/* MOCHI THE CALICO CAT (Vector Illustration with Multiple Postures) */}
          <svg
            viewBox="0 0 110 70"
            className="w-28 h-16 overflow-visible transition-transform duration-300"
            style={{
              transform: `${facing === 'LEFT' ? 'scaleX(-1)' : 'scaleX(1)'}`,
            }}
          >
            <defs>
              <linearGradient id="mochiWhite" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fdfbf9" />
                <stop offset="100%" stopColor="#ebe1d7" />
              </linearGradient>
            </defs>

            {/* POSTURE 1: SLEEPING (Curled tight ball) */}
            {catState === 'SLEEPING' && (
              <g id="cat-sleeping">
                {/* Curled Body */}
                <ellipse cx="55" cy="40" rx="30" ry="20" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="1" />
                {/* Calico orange and black spots */}
                <path d="M 45 23 Q 65 20 74 34 Q 60 40 42 36 Z" fill="#d97736" />
                <path d="M 68 34 Q 82 38 80 50 Q 66 48 64 40 Z" fill="#2d2826" />
                {/* Head curled inward */}
                <ellipse cx="36" cy="38" rx="16" ry="14" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="1" />
                <path d="M 28 27 Q 38 25 42 32 Q 32 35 26 32 Z" fill="#d97736" />
                {/* Ears folded sleepily */}
                <polygon points="28,27 23,16 33,22" fill="#d97736" />
                <polygon points="40,24 45,14 47,26" fill="#2d2826" />
                {/* Closed happy sleeping eyes */}
                <path d="M 27 38 Q 30 41 33 38" stroke="#4a3b34" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <path d="M 37 38 Q 40 41 43 38" stroke="#4a3b34" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                <polygon points="34,42 36,42 35,44" fill="#e88989" />
                {/* Curled tail wrapped around */}
                <path
                  d={tailWag === 0 ? "M 82 42 Q 92 32 80 26" : "M 82 42 Q 90 28 78 24"}
                  stroke="#d97736"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700"
                />
              </g>
            )}

            {/* POSTURE 2: WAKING UP / HEAD LIFTED */}
            {catState === 'WAKING_UP' && (
              <g id="cat-waking">
                <ellipse cx="55" cy="42" rx="28" ry="18" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="1" />
                <path d="M 45 26 Q 65 24 74 36 Q 60 42 42 38 Z" fill="#d97736" />
                {/* Lifted head */}
                <ellipse cx="36" cy="30" rx="16" ry="14" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="1" />
                <polygon points="28,19 22,8 32,14" fill="#d97736" />
                <polygon points="40,16 46,6 48,18" fill="#2d2826" />
                {/* Half-lidded sleepy eyes blinking */}
                <ellipse cx="30" cy="28" rx="2.5" ry="1" fill="#4a3b34" />
                <ellipse cx="40" cy="28" rx="2.5" ry="1" fill="#4a3b34" />
                <polygon points="34,34 36,34 35,36" fill="#e88989" />
                <path d="M 80 44 Q 90 32 82 24" stroke="#d97736" strokeWidth="5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* POSTURE 3: STRETCHING (Arched back, paws forward) */}
            {catState === 'STRETCHING' && (
              <g id="cat-stretching">
                {/* Front paws stretched out */}
                <path d="M 20 48 L 12 56 M 26 48 L 18 56" stroke="#fdfbf9" strokeWidth="5" strokeLinecap="round" />
                {/* Arched body */}
                <path d="M 24 44 Q 50 16 75 42 Q 60 52 32 50 Z" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="1" />
                <path d="M 44 26 Q 60 22 66 36 Q 52 40 40 36 Z" fill="#d97736" />
                {/* Head low */}
                <ellipse cx="26" cy="40" rx="14" ry="12" fill="url(#mochiWhite)" />
                <polygon points="20,32 16,22 24,28" fill="#d97736" />
                <polygon points="30,30 35,20 36,32" fill="#2d2826" />
                {/* Tail pointing high */}
                <path d="M 75 42 Q 86 20 80 12" stroke="#d97736" strokeWidth="5" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* POSTURE 4: SITTING / WATCHING / PURRING / GROOMING */}
            {(catState === 'SITTING' ||
              catState === 'PURRING' ||
              catState === 'GROOMING' ||
              catState === 'WATCHING_WINDOW') && (
              <g id="cat-sitting">
                {/* Sitting Haunches */}
                <ellipse cx="62" cy="45" rx="24" ry="18" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="1" />
                <path d="M 52 30 Q 72 26 78 40 Q 64 46 50 42 Z" fill="#d97736" />
                {/* Front legs upright */}
                <rect x="36" y="38" width="6" height="20" rx="3" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="0.8" />
                <rect x="44" y="38" width="6" height="20" rx="3" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="0.8" />
                {/* Upright Head */}
                <ellipse cx="44" cy="24" rx="16" ry="14" fill="url(#mochiWhite)" stroke="#cfc0b0" strokeWidth="1" />
                <path d="M 36 12 Q 46 10 50 18 Q 40 20 34 18 Z" fill="#d97736" />
                {/* Upright alert ears */}
                <polygon points="34,14 28,2 40,8" fill="#d97736" />
                <polygon points="48,11 56,1 55,14" fill="#2d2826" />

                {/* Eyes based on state */}
                {catState === 'PURRING' ? (
                  /* Blissful closed purring arches */
                  <>
                    <path d="M 36 24 Q 39 27 42 24" stroke="#4a3b34" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    <path d="M 46 24 Q 49 27 52 24" stroke="#4a3b34" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </>
                ) : catState === 'GROOMING' ? (
                  /* Paw raised grooming ear */
                  <>
                    <path d="M 36 24 Q 39 26 42 24" stroke="#4a3b34" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                    <ellipse cx="48" cy="24" rx="2" ry="2" fill="#4a3b34" />
                    <ellipse cx="32" cy="18" rx="4" ry="7" transform="rotate(-30 32 18)" fill="#fdfbf9" stroke="#cfc0b0" strokeWidth="1" />
                  </>
                ) : (
                  /* Wide amber curious eyes */
                  <>
                    <ellipse cx="38" cy="23" rx="3" ry="3.5" fill="#f59e0b" />
                    <ellipse cx="38" cy="23" rx="1.5" ry="3" fill="#1e1b18" />
                    <circle cx="37" cy="21.5" r="1" fill="#fff" />
                    <ellipse cx="48" cy="23" rx="3" ry="3.5" fill="#f59e0b" />
                    <ellipse cx="48" cy="23" rx="1.5" ry="3" fill="#1e1b18" />
                    <circle cx="47" cy="21.5" r="1" fill="#fff" />
                  </>
                )}

                {/* Pink nose & whiskers */}
                <polygon points="42,28 44,28 43,30" fill="#e88989" />
                <line x1="28" y1="28" x2="38" y2="29" stroke="#a89a8c" strokeWidth="0.8" />
                <line x1="28" y1="31" x2="38" y2="30" stroke="#a89a8c" strokeWidth="0.8" />
                <line x1="48" y1="29" x2="58" y2="28" stroke="#a89a8c" strokeWidth="0.8" />
                <line x1="48" y1="30" x2="58" y2="31" stroke="#a89a8c" strokeWidth="0.8" />

                {/* Swishing Tail */}
                <path
                  d={tailWag === 0 ? "M 80 48 Q 96 46 92 34" : "M 80 48 Q 96 36 94 24"}
                  stroke="#d97736"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Cat Nameplate & State Hint */}
      <div className="flex items-center justify-center gap-1.5 mt-1 text-[11px] text-stone-300 font-medium">
        <span>Mochi</span>
        <span className="text-stone-500">·</span>
        <span className="text-[10px] text-amber-300 capitalize">
          {catState === 'PURRING'
            ? 'Purring happily'
            : catState === 'SLEEPING'
            ? 'Napping'
            : catState === 'WAKING_UP'
            ? 'Waking up'
            : catState === 'STRETCHING'
            ? 'Stretching'
            : catState === 'GROOMING'
            ? 'Grooming'
            : catState === 'WATCHING_WINDOW'
            ? 'Watching window'
            : 'Sitting'}
        </span>
      </div>
    </div>
  );
};
