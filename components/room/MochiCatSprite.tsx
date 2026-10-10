'use client';

import React from 'react';
import { CatState } from '@/types/game';

interface MochiCatSpriteProps {
  state: CatState;
  facing?: 'LEFT' | 'RIGHT';
  tailWag?: number;
  reducedMotion?: boolean;
  className?: string;
}

export const MochiCatSprite: React.FC<MochiCatSpriteProps> = ({
  state,
  facing = 'RIGHT',
  tailWag = 0,
  reducedMotion = false,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{
        transform: facing === 'LEFT' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      <svg
        viewBox="0 0 115 75"
        className="w-28 h-18 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mochiCream" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#fbf7f2" />
            <stop offset="100%" stopColor="#eee3d7" />
          </linearGradient>
          <linearGradient id="mochiGinger" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e28546" />
            <stop offset="100%" stopColor="#c26325" />
          </linearGradient>
          <linearGradient id="mochiDark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3d3632" />
            <stop offset="100%" stopColor="#221e1c" />
          </linearGradient>
          <radialGradient id="innerEarPink" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* ============================================================== */}
        {/* POSTURE 1: SLEEPING (Curled in a cozy round calico ball)       */}
        {/* ============================================================== */}
        {state === 'SLEEPING' && (
          <g
            id="cat-sleeping"
            className={reducedMotion ? '' : 'animate-[cat-purr-vibe_4s_ease-in-out_infinite]'}
            style={{ transformOrigin: '55px 42px' }}
          >
            {/* Soft contact shadow */}
            <ellipse cx="55" cy="56" rx="28" ry="6" fill="rgba(30,15,10,0.18)" filter="blur(2px)" />

            {/* Curled Body */}
            <ellipse cx="55" cy="40" rx="30" ry="20" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            {/* Calico markings */}
            <path d="M 44 22 C 62 19 74 30 74 36 C 60 41 42 36 44 22 Z" fill="url(#mochiGinger)" />
            <path d="M 68 34 C 82 38 80 50 68 49 C 64 43 64 36 68 34 Z" fill="url(#mochiDark)" />

            {/* Curled Head tucked inward */}
            <ellipse cx="36" cy="38" rx="16" ry="14" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 28 26 C 38 24 42 32 38 34 C 32 34 26 31 28 26 Z" fill="url(#mochiGinger)" />

            {/* Relaxed Ears */}
            <polygon points="28,26 22,15 33,21" fill="url(#mochiGinger)" />
            <polygon points="27,24 23,17 31,21" fill="url(#innerEarPink)" />
            <polygon points="40,23 45,13 47,25" fill="url(#mochiDark)" />

            {/* Peaceful Sleeping Eyes (Sweet curved lashes) */}
            <path d="M 27 38 Q 30 41 33 38" stroke="#4a3b34" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M 37 38 Q 40 41 43 38" stroke="#4a3b34" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            {/* Tiny Pink Nose & Whiskers */}
            <polygon points="34,42 36,42 35,44" fill="#f472b6" />
            <line x1="22" y1="41" x2="31" y2="42" stroke="#b0a294" strokeWidth="0.8" />
            <line x1="22" y1="44" x2="31" y2="43" stroke="#b0a294" strokeWidth="0.8" />

            {/* Curled Tail wrapping around with gentle animated swishing tip */}
            <g
              style={{
                transformOrigin: '78px 42px',
              }}
              className={reducedMotion ? '' : 'animate-[cat-tail-flick_4s_ease-in-out_infinite]'}
            >
              <path
                d="M 82 42 C 92 34 88 24 76 25"
                stroke="url(#mochiGinger)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="76" cy="25" r="2.5" fill="#fdfbf9" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* POSTURE 2: WAKING UP / HEAD LIFTED                             */}
        {/* ============================================================== */}
        {state === 'WAKING_UP' && (
          <g id="cat-waking">
            <ellipse cx="55" cy="42" rx="28" ry="18" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 45 26 C 65 24 74 36 68 38 C 58 42 42 38 45 26 Z" fill="url(#mochiGinger)" />
            {/* Lifted Head */}
            <ellipse cx="36" cy="30" rx="16" ry="14" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <polygon points="28,19 22,8 32,14" fill="url(#mochiGinger)" />
            <polygon points="40,16 46,6 48,18" fill="url(#mochiDark)" />
            {/* Drowsy blinking eyes */}
            <ellipse cx="30" cy="28" rx="2.5" ry="1.2" fill="#4a3b34" />
            <ellipse cx="40" cy="28" rx="2.5" ry="1.2" fill="#4a3b34" />
            <polygon points="34,34 36,34 35,36" fill="#f472b6" />
            {/* Tail */}
            <path d="M 80 44 C 90 32 86 24 78 24" stroke="url(#mochiGinger)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ============================================================== */}
        {/* POSTURE 3: STRETCHING (Front paws forward, arched back)        */}
        {/* ============================================================== */}
        {state === 'STRETCHING' && (
          <g id="cat-stretching">
            {/* Extended paws */}
            <path d="M 22 48 L 12 56 M 28 48 L 18 56" stroke="url(#mochiCream)" strokeWidth="5" strokeLinecap="round" />
            {/* Deep arch */}
            <path d="M 24 44 C 48 18 72 38 75 42 C 60 52 32 50 24 44 Z" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 44 26 C 60 22 66 36 58 38 C 50 40 40 36 44 26 Z" fill="url(#mochiGinger)" />
            {/* Low head */}
            <ellipse cx="26" cy="40" rx="14" ry="12" fill="url(#mochiCream)" />
            <polygon points="20,32 16,22 24,28" fill="url(#mochiGinger)" />
            <polygon points="30,30 35,20 36,32" fill="url(#mochiDark)" />
            {/* Tail high */}
            <path d="M 75 42 C 86 20 82 12 80 10" stroke="url(#mochiGinger)" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* ============================================================== */}
        {/* POSTURE 4: SITTING / PURRING / GROOMING                        */}
        {/* ============================================================== */}
        {(state === 'SITTING' || state === 'PURRING' || state === 'GROOMING') && (
          <g
            id="cat-sitting"
            className={state === 'PURRING' && !reducedMotion ? 'animate-[cat-purr-vibe_0.4s_ease-in-out_infinite]' : ''}
            style={{ transformOrigin: '55px 40px' }}
          >
            {/* Haunches */}
            <ellipse cx="62" cy="45" rx="24" ry="18" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 52 30 C 72 26 78 40 72 44 C 62 46 50 42 52 30 Z" fill="url(#mochiGinger)" />
            <ellipse cx="76" cy="44" rx="8" ry="6" fill="url(#mochiDark)" />

            {/* Upright Front Legs */}
            <rect x="36" y="36" width="6.5" height="22" rx="3.2" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="0.8" />
            <rect x="44" y="36" width="6.5" height="22" rx="3.2" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="0.8" />
            <ellipse cx="39" cy="58" rx="4" ry="2" fill="#fff" />
            <ellipse cx="47" cy="58" rx="4" ry="2" fill="#fff" />

            {/* Upright Head */}
            <ellipse cx="44" cy="24" rx="16" ry="14" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 36 12 C 46 10 50 18 46 20 C 40 20 34 18 36 12 Z" fill="url(#mochiGinger)" />

            {/* Alert Perked Ears */}
            <polygon points="34,14 28,2 40,8" fill="url(#mochiGinger)" />
            <polygon points="34,13 29,4 38,9" fill="url(#innerEarPink)" />
            <polygon points="48,11 56,1 55,14" fill="url(#mochiDark)" />

            {/* Eyes based on state */}
            {state === 'PURRING' ? (
              /* Blissful purring arches */
              <>
                <path d="M 36 24 Q 39 27 42 24" stroke="#4a3b34" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                <path d="M 46 24 Q 49 27 52 24" stroke="#4a3b34" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </>
            ) : state === 'GROOMING' ? (
              /* Paw raised washing ear */
              <>
                <path d="M 36 24 Q 39 26 42 24" stroke="#4a3b34" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                <ellipse cx="48" cy="24" rx="2.5" ry="3" fill="#f59e0b" />
                <ellipse cx="32" cy="18" rx="4.5" ry="8" transform="rotate(-30 32 18)" fill="#fdfbf9" stroke="#cfc0b0" strokeWidth="1" />
              </>
            ) : (
              /* Inquisitive Amber Eyes */
              <>
                <ellipse cx="38" cy="23" rx="3.2" ry="3.6" fill="#f59e0b" />
                <ellipse cx="38" cy="23" rx="1.6" ry="3.2" fill="#1e1b18" />
                <circle cx="37" cy="21.5" r="1.1" fill="#fff" />
                <ellipse cx="48" cy="23" rx="3.2" ry="3.6" fill="#f59e0b" />
                <ellipse cx="48" cy="23" rx="1.6" ry="3.2" fill="#1e1b18" />
                <circle cx="47" cy="21.5" r="1.1" fill="#fff" />
              </>
            )}

            {/* Cute Pink Nose, Muzzle & Whiskers */}
            <polygon points="42,28 44,28 43,30" fill="#f472b6" />
            <path d="M 42 30 Q 43 32 44 30" stroke="#4a3b34" strokeWidth="0.8" fill="none" />
            <line x1="26" y1="28" x2="38" y2="29" stroke="#b0a294" strokeWidth="0.8" />
            <line x1="26" y1="31" x2="38" y2="30.5" stroke="#b0a294" strokeWidth="0.8" />
            <line x1="48" y1="29.5" x2="60" y2="28" stroke="#b0a294" strokeWidth="0.8" />
            <line x1="48" y1="30.5" x2="60" y2="31.5" stroke="#b0a294" strokeWidth="0.8" />

            {/* Accurate Tail Animation (Swishing gracefully) */}
            <g
              style={{ transformOrigin: '78px 48px' }}
              className={reducedMotion ? '' : 'animate-[cat-tail-swish_2.8s_ease-in-out_infinite]'}
            >
              <path
                d="M 80 48 C 96 46 95 34 88 26"
                stroke="url(#mochiGinger)"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="88" cy="26" r="2.8" fill="#fdfbf9" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* POSTURE 5: WATCHING WINDOW (3/4 Back View Perched on Sill)     */}
        {/* ============================================================== */}
        {state === 'WATCHING_WINDOW' && (
          <g id="cat-watching-window">
            {/* Seated Rear Haunches */}
            <ellipse cx="58" cy="46" rx="22" ry="17" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 48 34 C 64 28 72 40 68 46 C 58 48 48 44 48 34 Z" fill="url(#mochiGinger)" />
            <ellipse cx="68" cy="46" rx="9" ry="7" fill="url(#mochiDark)" />

            {/* Back of Head looking forward/upward at the window */}
            <ellipse cx="44" cy="25" rx="15" ry="13" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 38 15 C 48 13 52 20 48 24 C 42 24 38 20 38 15 Z" fill="url(#mochiGinger)" />
            <ellipse cx="36" cy="26" rx="5" ry="6" fill="url(#mochiDark)" />

            {/* Perked Alert Ears listening to rain */}
            <polygon points="34,14 26,4 37,10" fill="url(#mochiGinger)" />
            <polygon points="46,12 55,2 54,14" fill="url(#mochiDark)" />

            {/* Whiskers peeking out the sides */}
            <line x1="26" y1="26" x2="35" y2="26" stroke="#b0a294" strokeWidth="0.8" />
            <line x1="53" y1="25" x2="62" y2="25" stroke="#b0a294" strokeWidth="0.8" />

            {/* Front Paws resting on window sill ledge */}
            <ellipse cx="38" cy="54" rx="4" ry="2.5" fill="#fdfbf9" stroke="#cfc0b0" strokeWidth="0.6" />
            <ellipse cx="46" cy="54" rx="4" ry="2.5" fill="#fdfbf9" stroke="#cfc0b0" strokeWidth="0.6" />

            {/* Dynamic Swishing Tail draped over the sill */}
            <g
              style={{ transformOrigin: '76px 48px' }}
              className={reducedMotion ? '' : 'animate-[cat-tail-swish_2.4s_ease-in-out_infinite]'}
            >
              <path
                d="M 76 48 C 92 48 94 36 90 24 C 88 18 82 18 80 22"
                stroke="url(#mochiGinger)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="80" cy="22" r="2.6" fill="#fdfbf9" />
            </g>
          </g>
        )}

        {/* ============================================================== */}
        {/* POSTURE 6: JUMPING UP (Athletic outstretched leaping arc)       */}
        {/* ============================================================== */}
        {state === 'JUMPING_UP' && (
          <g id="cat-jumping-up" transform="rotate(-15 55 35)">
            {/* Extended Front Legs reaching for landing */}
            <path d="M 24 32 L 10 22" stroke="url(#mochiCream)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="9" cy="21" rx="3.5" ry="2.5" fill="#fff" />
            <path d="M 28 34 L 14 26" stroke="url(#mochiCream)" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="13" cy="25" rx="3.5" ry="2.5" fill="#fff" />

            {/* Streamlined Elongated Body mid-leap */}
            <path d="M 22 36 C 45 22 75 28 82 42 C 72 48 45 46 22 36 Z" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 38 25 C 56 22 64 32 58 36 C 48 38 38 34 38 25 Z" fill="url(#mochiGinger)" />
            <ellipse cx="70" cy="38" rx="8" ry="6" fill="url(#mochiDark)" />

            {/* Forward-facing Alert Head */}
            <ellipse cx="22" cy="26" rx="14" ry="12" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <polygon points="16,18 10,8 20,14" fill="url(#mochiGinger)" />
            <polygon points="24,16 28,6 30,18" fill="url(#mochiDark)" />
            {/* Focused amber eye */}
            <ellipse cx="16" cy="24" rx="2.8" ry="3.2" fill="#f59e0b" />
            <circle cx="15" cy="23" r="0.9" fill="#fff" />

            {/* Trailing Hind Legs */}
            <path d="M 78 40 L 92 50" stroke="url(#mochiCream)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 72 42 L 86 54" stroke="url(#mochiCream)" strokeWidth="5" strokeLinecap="round" />

            {/* Aerodynamic Stabilizing Tail trailing behind */}
            <path d="M 82 40 C 96 36 106 28 108 20" stroke="url(#mochiGinger)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="108" cy="20" r="2.5" fill="#fdfbf9" />
          </g>
        )}

        {/* ============================================================== */}
        {/* POSTURE 7: JUMPING DOWN (Graceful downward landing arc)         */}
        {/* ============================================================== */}
        {state === 'JUMPING_DOWN' && (
          <g id="cat-jumping-down" transform="rotate(18 55 35)">
            {/* Front Legs preparing to absorb landing impact */}
            <path d="M 28 36 L 16 48" stroke="url(#mochiCream)" strokeWidth="6" strokeLinecap="round" />
            <ellipse cx="15" cy="49" rx="3.5" ry="2.5" fill="#fff" />
            <path d="M 34 38 L 22 52" stroke="url(#mochiCream)" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="21" cy="53" rx="3.5" ry="2.5" fill="#fff" />

            {/* Arched Descending Body */}
            <path d="M 26 34 C 48 24 78 30 84 44 C 74 50 48 46 26 34 Z" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 42 26 C 60 24 68 34 60 38 C 50 40 42 36 42 26 Z" fill="url(#mochiGinger)" />
            <ellipse cx="72" cy="40" rx="8" ry="6" fill="url(#mochiDark)" />

            {/* Downward Angled Head */}
            <ellipse cx="24" cy="30" rx="14" ry="12" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <polygon points="18,22 14,12 22,18" fill="url(#mochiGinger)" />
            <polygon points="26,20 32,10 32,22" fill="url(#mochiDark)" />
            <ellipse cx="20" cy="28" rx="2.8" ry="3.2" fill="#f59e0b" />
            <circle cx="19" cy="27" r="0.9" fill="#fff" />

            {/* Trailing Hind Legs */}
            <path d="M 80 40 L 92 34" stroke="url(#mochiCream)" strokeWidth="5.5" strokeLinecap="round" />

            {/* Equilibrium Tail arched high in the air */}
            <path d="M 84 42 C 94 30 96 14 90 8" stroke="url(#mochiGinger)" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="90" cy="8" r="2.5" fill="#fdfbf9" />
          </g>
        )}
        {/* ============================================================== */}
        {/* POSTURE 8: WALKING (Four paws stepping naturally in sequence) */}
        {/* ============================================================== */}
        {state === 'WALKING' && (
          <g
            id="cat-walking"
            className={reducedMotion ? '' : 'animate-[cat-walk-step_0.45s_ease-in-out_infinite]'}
            style={{ transformOrigin: '55px 40px' }}
          >
            {/* Rear Hind Left Leg (Backwards step) */}
            <path d="M 72 40 L 80 56" stroke="url(#mochiCream)" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="80" cy="57" rx="3.5" ry="2" fill="#fff" />

            {/* Front Left Leg (Backwards step) */}
            <path d="M 40 38 L 44 56" stroke="url(#mochiCream)" strokeWidth="5" strokeLinecap="round" />
            <ellipse cx="44" cy="57" rx="3.5" ry="2" fill="#fff" />

            {/* Walking Body Torso */}
            <ellipse cx="56" cy="38" rx="26" ry="16" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <path d="M 44 24 C 62 20 70 32 66 38 C 56 42 42 38 44 24 Z" fill="url(#mochiGinger)" />
            <ellipse cx="68" cy="38" rx="8" ry="6" fill="url(#mochiDark)" />

            {/* Rear Hind Right Leg (Forward step) */}
            <path d="M 66 40 L 60 56" stroke="url(#mochiCream)" strokeWidth="5.5" strokeLinecap="round" />
            <ellipse cx="60" cy="57" rx="3.5" ry="2" fill="#fff" />

            {/* Front Right Leg (Forward step) */}
            <path d="M 32 38 L 24 56" stroke="url(#mochiCream)" strokeWidth="5.5" strokeLinecap="round" />
            <ellipse cx="23" cy="57" rx="3.5" ry="2" fill="#fff" />

            {/* Alert Head Looking Forward */}
            <ellipse cx="28" cy="28" rx="14" ry="13" fill="url(#mochiCream)" stroke="#cfc0b0" strokeWidth="1" />
            <polygon points="22,18 16,8 26,14" fill="url(#mochiGinger)" />
            <polygon points="30,16 36,6 38,18" fill="url(#mochiDark)" />
            {/* Inquisitive Amber Eye */}
            <ellipse cx="22" cy="26" rx="2.8" ry="3.2" fill="#f59e0b" />
            <ellipse cx="22" cy="26" rx="1.4" ry="2.8" fill="#1e1b18" />
            <circle cx="21" cy="25" r="0.9" fill="#fff" />
            {/* Pink Nose & Whiskers */}
            <polygon points="16,30 18,30 17,32" fill="#f472b6" />
            <line x1="8" y1="30" x2="16" y2="30.5" stroke="#b0a294" strokeWidth="0.8" />
            <line x1="8" y1="33" x2="16" y2="32" stroke="#b0a294" strokeWidth="0.8" />

            {/* Graceful Walking Tail waving high */}
            <g
              style={{ transformOrigin: '80px 38px' }}
              className={reducedMotion ? '' : 'animate-[cat-tail-swish_2.2s_ease-in-out_infinite]'}
            >
              <path
                d="M 80 38 C 94 34 98 22 92 12"
                stroke="url(#mochiGinger)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="92" cy="12" r="2.5" fill="#fdfbf9" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
