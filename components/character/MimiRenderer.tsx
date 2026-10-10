'use client';

import React, { useState, useEffect } from 'react';
import { MimiExpression, MimiPosture } from '@/types/game';

interface MimiRendererProps {
  expression: MimiExpression;
  posture?: MimiPosture;
  isSelected?: boolean;
  isHighlighted?: boolean;
  isWalking?: boolean;
  walkFrame?: number; // 0, 1, 2, 3
  facing?: 'LEFT' | 'RIGHT';
  reducedMotion?: boolean;
  className?: string;
  size?: number; // base width in px
}

export const MimiRenderer: React.FC<MimiRendererProps> = ({
  expression,
  posture = 'STANDING',
  isSelected = false,
  isHighlighted = false,
  isWalking = false,
  walkFrame = 0,
  facing = 'RIGHT',
  reducedMotion = false,
  className = '',
  size = 200,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);

  const isEyeClosedExpression =
    expression === 'CONTENT' || expression === 'SLEEPY' || posture === 'DRINKING' || posture === 'WATERING';

  // Natural blinking effect every 3.8 to 5.5 seconds (skip for closed-eye expressions)
  useEffect(() => {
    if (reducedMotion || isEyeClosedExpression) {
      return;
    }

    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
      }, 160);
    }, 4200 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, [reducedMotion, isEyeClosedExpression]);

  const shouldRenderBlink = !reducedMotion && !isEyeClosedExpression && isBlinking;

  // Posture translation & rotation based on expression & active posture:
  const bodyTransform =
    posture === 'CROUCHING'
      ? 'translateY(16px) scale(0.95)'
      : posture === 'DRINKING'
      ? 'translateY(2px)'
      : posture === 'WATERING'
      ? 'translateY(2px) rotate(1.5deg)'
      : posture === 'REACHING'
      ? 'translateY(-2px) rotate(2deg)'
      : posture === 'LEAN_FORWARD'
      ? 'translateY(4px) rotate(2.5deg)'
      : expression === 'HAPPY' || expression === 'DELIGHTED'
      ? 'translateY(-2px)'
      : expression === 'TOUCHED'
      ? 'rotate(-1.5deg)'
      : expression === 'CURIOUS'
      ? 'rotate(2.5deg) translateX(2px)'
      : expression === 'SURPRISED'
      ? 'translateY(-3px) scale(1.02)'
      : expression === 'SLEEPY'
      ? 'rotate(1deg) translateY(2px)'
      : expression === 'SHY'
      ? 'rotate(-2deg) translateX(-1px)'
      : expression === 'THINKING'
      ? 'rotate(-2deg)'
      : expression === 'MELANCHOLY'
      ? 'translateY(1.5deg) rotate(1deg)'
      : 'none';

  // Natural harmonic walking oscillation (Phase phi = walkFrame * (PI / 2))
  // Smooth sine-wave forward/backward leg sweep with subtle flexion
  const walkPhase = (walkFrame % 4) * (Math.PI / 2);
  const leftLegAngle = isWalking ? Math.round(15 * Math.sin(walkPhase)) : 0;
  const rightLegAngle = isWalking ? Math.round(-15 * Math.sin(walkPhase)) : 0;
  const leftLegLift = isWalking && walkFrame === 1 ? -2 : 0;
  const rightLegLift = isWalking && walkFrame === 3 ? -2 : 0;
  // Vertical body bobbing: organic smooth sine stride
  const bodyBobY = isWalking ? Math.round(-3.5 * Math.abs(Math.sin(walkPhase))) : 0;

  return (
    <div
      className={`relative inline-block select-none pointer-events-none transition-transform duration-300 ${className}`}
      style={{
        width: size,
        height: size * 1.35,
        transform: `${facing === 'LEFT' ? 'scaleX(-1)' : 'scaleX(1)'}`,
      }}
    >
      {/* Ground Contact Shadow */}
      <div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full pointer-events-none transition-all duration-300"
        style={{
          width: size * 0.65,
          height: size * 0.14,
          background:
            'radial-gradient(ellipse at center, rgba(30, 20, 15, 0.45) 0%, rgba(30, 20, 15, 0.15) 55%, transparent 75%)',
          filter: 'blur(3px)',
        }}
      />

      {/* Main SVG Character with Articulated Limbs & Full Body Gestures */}
      <svg
        viewBox="0 0 320 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible transition-all duration-200 ${
          reducedMotion || isWalking ? '' : 'animate-[mimi-breathe_4.2s_ease-in-out_infinite]'
        }`}
        style={{
          transform: bodyTransform,
          filter:
            isHighlighted || isSelected
              ? 'drop-shadow(0 0 3px #f59e0b) drop-shadow(0 0 6px #fbbf24) drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))'
              : undefined,
        }}
      >
        <defs>
          {/* Glowing character body outline filter for tap feedback */}
          <filter id="mimiBodyOutline" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.9" />
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fbbf24" floodOpacity="0.6" />
          </filter>

          <linearGradient id="hairGrad" x1="160" y1="40" x2="160" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7a6256" />
            <stop offset="60%" stopColor="#5d493f" />
            <stop offset="100%" stopColor="#46362e" />
          </linearGradient>
          <linearGradient id="hairShine" x1="160" y1="60" x2="160" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9b8275" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7a6256" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="skin" x1="160" y1="60" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff9f5" />
            <stop offset="100%" stopColor="#faece3" />
          </linearGradient>
          <radialGradient id="blushSoft" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7b92" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#ff9eaa" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffb3be" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blushDeep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d72" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#ff859c" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#ffabbb" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweaterGrad" x1="160" y1="160" x2="160" y2="330" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a3c4ab" />
            <stop offset="50%" stopColor="#90b499" />
            <stop offset="100%" stopColor="#7a9e83" />
          </linearGradient>
          <linearGradient id="sweaterCollarGrad" x1="160" y1="150" x2="160" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#b4d4bc" />
            <stop offset="100%" stopColor="#8fae97" />
          </linearGradient>
          <linearGradient id="irisTeal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#325052" />
            <stop offset="45%" stopColor="#416b6c" />
            <stop offset="85%" stopColor="#67a6a4" />
            <stop offset="100%" stopColor="#90c7c3" />
          </linearGradient>
        </defs>

        {/* 1. BACK HAIR */}
        <g id="hair-back">
          <path
            d="M 95 100 C 80 140 82 200 105 235 C 120 230 135 220 145 200 C 130 180 120 150 120 120 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M 225 100 C 240 140 238 200 215 235 C 200 230 185 220 175 200 C 190 180 200 150 200 120 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M 110 80 C 100 160 110 230 160 238 C 210 230 220 160 210 80 Z"
            fill="#524036"
          />
        </g>

        {/* 2. LEGS & ADORABLE MARY-JANE SHOES (Organic Chibi Anatomy & Soft Curve Kinematics) */}
        <g id="legs-and-feet">
          {/* Left Leg */}
          <g
            id="left-leg"
            style={{
              transformOrigin: '136px 315px',
              transform: `rotate(${leftLegAngle}deg) translateY(${leftLegLift}px)`,
              transition: isWalking ? 'transform 0.15s ease-out' : 'transform 0.3s ease',
            }}
          >
            {/* Soft Organic Chibi Leg (Natural calf curvature tapering to slender ankle) */}
            <path
              d="M 124 312 C 122 328 123 342 125 354 C 126 360 128 368 128 372 C 134 374 144 374 146 372 C 147 368 147 360 148 354 C 150 342 149 328 148 312 Z"
              fill="#faece3"
            />
            {/* Soft inner shadow line */}
            <path d="M 126 318 C 125 332 126 348 127 362" stroke="#ebd0bf" strokeWidth="1.2" strokeLinecap="round" />

            {/* Cozy Warm Cream Ribbed Slouch Sock (Soft folds around ankle) */}
            {/* Soft ribbed folded cuff */}
            <path
              d="M 122 356 C 130 358 142 358 149 356 C 151 361 150 367 149 371 C 141 373 130 373 122 371 C 121 366 121 361 122 356 Z"
              fill="#fffdfa"
              stroke="#d8cab8"
              strokeWidth="1.2"
            />
            {/* Slouchy sock body over instep */}
            <path
              d="M 122 370 C 122 378 123 384 123 388 C 131 390 141 390 149 388 C 149 384 149 378 149 370 Z"
              fill="#fffdfa"
              stroke="#d8cab8"
              strokeWidth="1"
            />
            {/* Delicate warm knit ribbing lines */}
            <path d="M 128 359 L 128 385 M 136 360 L 136 386 M 143 359 L 143 385" stroke="#ece2d5" strokeWidth="1" strokeLinecap="round" />

            {/* Classic Doll Mary-Jane Shoe (Natural curved toe spring, arched strap & polished heel) */}
            {/* Shoe Sole & Outer Edge */}
            <path
              d="M 116 394 C 116 387 122 382 136 382 C 149 382 154 387 154 394 C 153 399 146 401 136 401 C 125 401 117 399 116 394 Z"
              fill="#5d351e"
              stroke="#3a1e0f"
              strokeWidth="1.4"
            />
            {/* Shoe Collar Opening showing sock */}
            <ellipse cx="136" cy="385" rx="9.5" ry="3.2" fill="#381d0f" opacity="0.35" />
            {/* Polished Rubber Outsole Line */}
            <path d="M 117 397 C 122 400.5 148 400.5 153 397" stroke="#eedfcb" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Arched Instep Strap */}
            <path d="M 120 388 Q 136 392 150 388" stroke="#3a1e0f" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Golden Buckle Rivet */}
            <circle cx="136" cy="390" r="1.6" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
            {/* Glossy Rounded Toe Box Highlight */}
            <ellipse cx="132" cy="395" rx="3.5" ry="1.8" fill="#ffffff" opacity="0.42" />
          </g>

          {/* Right Leg */}
          <g
            id="right-leg"
            style={{
              transformOrigin: '184px 315px',
              transform: `rotate(${rightLegAngle}deg) translateY(${rightLegLift}px)`,
              transition: isWalking ? 'transform 0.15s ease-out' : 'transform 0.3s ease',
            }}
          >
            {/* Soft Organic Chibi Leg (Natural calf curvature tapering to slender ankle) */}
            <path
              d="M 172 312 C 170 328 171 342 173 354 C 174 360 176 368 176 372 C 182 374 192 374 194 372 C 195 368 195 360 196 354 C 198 342 197 328 196 312 Z"
              fill="#faece3"
            />
            {/* Soft inner shadow line */}
            <path d="M 194 318 C 195 332 194 348 193 362" stroke="#ebd0bf" strokeWidth="1.2" strokeLinecap="round" />

            {/* Cozy Warm Cream Ribbed Slouch Sock (Soft folds around ankle) */}
            {/* Soft ribbed folded cuff */}
            <path
              d="M 170 356 C 178 358 190 358 197 356 C 199 361 198 367 197 371 C 189 373 178 373 170 371 C 169 366 169 361 170 356 Z"
              fill="#fffdfa"
              stroke="#d8cab8"
              strokeWidth="1.2"
            />
            {/* Slouchy sock body over instep */}
            <path
              d="M 170 370 C 170 378 171 384 171 388 C 179 390 189 390 197 388 C 197 384 197 378 197 370 Z"
              fill="#fffdfa"
              stroke="#d8cab8"
              strokeWidth="1"
            />
            {/* Delicate warm knit ribbing lines */}
            <path d="M 176 359 L 176 385 M 184 360 L 184 386 M 191 359 L 191 385" stroke="#ece2d5" strokeWidth="1" strokeLinecap="round" />

            {/* Classic Doll Mary-Jane Shoe (Natural curved toe spring, arched strap & polished heel) */}
            {/* Shoe Sole & Outer Edge */}
            <path
              d="M 164 394 C 164 387 170 382 184 382 C 197 382 202 387 202 394 C 201 399 194 401 184 401 C 173 401 165 399 164 394 Z"
              fill="#5d351e"
              stroke="#3a1e0f"
              strokeWidth="1.4"
            />
            {/* Shoe Collar Opening showing sock */}
            <ellipse cx="184" cy="385" rx="9.5" ry="3.2" fill="#381d0f" opacity="0.35" />
            {/* Polished Rubber Outsole Line */}
            <path d="M 165 397 C 170 400.5 196 400.5 201 397" stroke="#eedfcb" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Arched Instep Strap */}
            <path d="M 168 388 Q 184 392 198 388" stroke="#3a1e0f" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Golden Buckle Rivet */}
            <circle cx="184" cy="390" r="1.6" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
            {/* Glossy Rounded Toe Box Highlight */}
            <ellipse cx="180" cy="395" rx="3.5" ry="1.8" fill="#ffffff" opacity="0.42" />
          </g>
        </g>

        {/* 3. SWEATER & FULL-BODY GESTURES */}
        <g id="torso-and-sweater" style={{ transform: `translateY(${bodyBobY}px)` }}>
          <path
            d="M 120 180 C 95 200 90 240 100 270 C 104 285 106 300 115 310 C 130 320 185 320 205 308 C 215 298 218 280 220 260 C 225 220 215 195 200 180 Z"
            fill="url(#sweaterGrad)"
          />
          <path
            d="M 115 306 C 130 320 190 320 205 304 C 208 314 195 328 160 328 C 125 328 112 316 115 306 Z"
            fill="#7e9f85"
            stroke="#6c8c73"
            strokeWidth="1.5"
          />
          <path d="M 132 312 L 132 324 M 148 316 L 148 326 M 164 317 L 164 327 M 180 315 L 180 325 M 194 310 L 194 320" stroke="#68876e" strokeWidth="1.2" strokeLinecap="round" />

          {/* ARMS: SPECIFIC INTERACTION POSES */}
          {posture === 'WATERING' ? (
            /* WATERING PLANT: Mimi holding a cute vintage pastel watering can, pouring water droplets */
            <g id="arms-watering">
              {/* Left arm: bent gently across chest in support */}
              <path d="M 115 185 C 98 205 105 238 128 245 C 140 248 152 235 146 215 C 140 195 130 185 115 185 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <ellipse cx="144" cy="225" rx="6" ry="5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />

              {/* Right arm: extended forward holding watering can handle */}
              <path d="M 198 185 C 220 180 242 178 258 182 C 266 185 266 198 254 204 C 235 210 215 205 198 195 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              {/* Hand gripping handle */}
              <ellipse cx="258" cy="188" rx="6.5" ry="5.5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />

              {/* === VINTAGE WATERING CAN (Cute cottagecore brass/cream design) === */}
              {/* Arched Top Carry Handle */}
              <path d="M 248 192 C 248 168 280 166 288 184" stroke="#92400e" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              {/* Rear loop handle */}
              <path d="M 246 195 C 236 198 234 218 248 222" stroke="#92400e" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              
              {/* Watering Can Body (Slightly tilted forward to pour) */}
              <g transform="rotate(16 270 205)">
                {/* Main cylinder body */}
                <rect x="250" y="186" width="34" height="30" rx="6" fill="#fef3c7" stroke="#b45309" strokeWidth="1.6" />
                {/* Vintage accent decorative stripe */}
                <path d="M 250 200 L 284 200" stroke="#f59e0b" strokeWidth="2" opacity="0.75" />
                {/* Bottom rim */}
                <ellipse cx="267" cy="216" rx="17" ry="3.5" fill="#d97706" opacity="0.6" />
                {/* Top rim opening */}
                <ellipse cx="267" cy="186" rx="14" ry="3.5" fill="#78350f" stroke="#b45309" strokeWidth="1" />
                
                {/* Long Angled Watering Spout */}
                <path d="M 284 208 L 316 182 L 318 188 L 284 214 Z" fill="#fef3c7" stroke="#b45309" strokeWidth="1.4" />
                {/* Rose / Sprinkler Head at tip */}
                <ellipse cx="318" cy="183" rx="4.5" ry="7" transform="rotate(-30 318 183)" fill="#b45309" />
              </g>

              {/* Sparkling Water Droplets Spraying from Spout Tip */}
              <g id="water-droplets" className="animate-pulse">
                {/* Stream arcs */}
                <path d="M 312 178 Q 328 188 335 212" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="3 2.5" strokeLinecap="round" opacity="0.85" />
                <path d="M 314 182 Q 324 195 328 224" stroke="#93c5fd" strokeWidth="1.2" strokeDasharray="2 3" strokeLinecap="round" opacity="0.75" />
                {/* Droplets */}
                <circle cx="324" cy="192" r="2.4" fill="#60a5fa" opacity="0.9" />
                <circle cx="332" cy="206" r="2.8" fill="#38bdf8" opacity="0.95" />
                <circle cx="336" cy="222" r="2.2" fill="#93c5fd" opacity="0.85" />
                <circle cx="328" cy="232" r="1.8" fill="#bae6fd" opacity="0.8" />
                {/* Tiny glistening sparkles */}
                <path d="M 330 190 L 333 193 L 330 196 L 327 193 Z" fill="#ffffff" opacity="0.9" />
                <path d="M 338 214 L 340 216 L 338 218 L 336 216 Z" fill="#ffffff" opacity="0.9" />
              </g>
            </g>
          ) : posture === 'DRINKING' ? (
            /* DRINKING TEA: Both hands lifting glazed ceramic mug to mouth */
            <g id="arms-drinking">
              {/* Left & Right arms bent upward holding mug */}
              <path d="M 115 185 C 100 210 110 240 135 225 C 145 220 150 195 140 180 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 215 210 205 240 180 225 C 170 220 165 195 175 180 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              {/* Lifted Tea Mug in Mimi's hands */}
              <rect x="145" y="160" width="26" height="24" rx="4" fill="#faf5ee" stroke="#d5c8b5" strokeWidth="1.2" />
              <ellipse cx="158" cy="160" rx="13" ry="4" fill="#a16207" stroke="#d5c8b5" strokeWidth="1" />
              <path d="M 171 166 C 177 166 177 176 171 176" stroke="#d5c8b5" strokeWidth="2" fill="none" />
              {/* Steam wisps */}
              <path d="M 155 152 Q 153 144 156 138" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
              <path d="M 162 154 Q 164 146 161 140" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            </g>
          ) : posture === 'REACHING' ? (
            /* REACHING: Right arm extended toward lamp switch or curtain cord */
            <g id="arms-reaching">
              <path d="M 115 185 C 92 205 85 240 92 275 C 95 285 110 285 120 265 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 220 175 250 165 265 160 C 275 160 270 175 245 185 C 225 195 205 205 195 210 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              <ellipse cx="268" cy="160" rx="6" ry="5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />
            </g>
          ) : posture === 'CROUCHING' ? (
            /* CROUCHING / PETTING: Both hands gently reaching toward cat */
            <g id="arms-crouching">
              <path d="M 115 185 C 90 205 80 240 90 265 C 100 275 120 265 130 245 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 185 215 170 255 150 270 C 140 275 135 265 145 250 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              <ellipse cx="140" cy="270" rx="7" ry="5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />
            </g>
          ) : posture === 'LEAN_FORWARD' ? (
            /* LEAN FORWARD: Hands resting forward on sill or desk edge */
            <g id="arms-leaning">
              <path d="M 115 185 C 96 200 90 230 110 248 C 120 255 140 245 142 230 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 215 200 220 230 200 248 C 190 255 170 245 168 230 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              <ellipse cx="145" cy="245" rx="6" ry="5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />
              <ellipse cx="165" cy="245" rx="6" ry="5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />
            </g>
          ) : expression === 'TOUCHED' ? (
            <g id="arms-touched">
              <path d="M 115 185 C 92 205 92 245 110 270 C 125 280 150 250 148 230 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 220 205 225 245 205 270 C 185 285 160 250 162 230 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              <ellipse cx="155" cy="235" rx="7" ry="5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />
            </g>
          ) : expression === 'SURPRISED' ? (
            <g id="arms-surprised">
              <path d="M 115 185 C 80 195 72 235 90 260 C 105 265 118 245 125 220 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 235 195 242 235 224 260 C 210 265 198 245 190 220 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
            </g>
          ) : expression === 'DELIGHTED' || expression === 'HAPPY' ? (
            <g id="arms-cheerful">
              <path d="M 115 185 C 88 198 80 235 95 268 C 105 275 118 265 125 245 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 228 198 234 235 220 268 C 210 275 198 265 190 245 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
            </g>
          ) : expression === 'THINKING' ? (
            <g id="arms-thinking">
              <path d="M 115 185 C 92 205 85 240 92 275 C 95 285 110 285 120 265 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 198 185 C 220 195 225 215 205 230 C 190 220 180 200 185 185 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              <ellipse cx="185" cy="192" rx="6" ry="5" fill="#faece3" stroke="#dbbeab" strokeWidth="1" />
            </g>
          ) : (
            <g id="arms-neutral">
              <path d="M 115 185 C 92 205 85 240 92 275 C 95 285 104 292 114 290 C 122 288 126 278 126 265 C 126 240 130 205 136 190 Z" fill="#8eb096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 94 278 C 96 288 108 290 115 284 C 114 276 100 270 94 278 Z" fill="#7a9b81" />
              <path d="M 198 185 C 220 205 235 245 226 280 C 220 292 210 292 202 284 C 196 272 195 250 192 225 C 190 205 192 195 198 185 Z" fill="#8db096" stroke="#75987d" strokeWidth="1.5" />
              <path d="M 204 278 C 210 286 222 284 224 274 C 218 268 208 270 204 278 Z" fill="#7a9b81" />
            </g>
          )}

          {/* Fold-over Cozy Sweater Collar */}
          <path
            d="M 130 162 C 122 172 135 192 160 194 C 185 192 198 172 190 162 C 180 152 140 152 130 162 Z"
            fill="url(#sweaterCollarGrad)"
            stroke="#7b9d83"
            strokeWidth="1.8"
          />
          <path d="M 145 168 C 155 178 165 178 175 168" stroke="#6f8f76" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* 4. HEAD & FACE BASE */}
        <g id="head-base" style={{ transform: `translateY(${bodyBobY}px)` }}>
          <path
            d="M 104 115 C 98 145 106 172 130 182 C 145 188 175 188 190 182 C 214 172 222 145 216 115 C 210 75 110 75 104 115 Z"
            fill="url(#skin)"
            stroke="#eed8cc"
            strokeWidth="1.2"
          />
          <ellipse cx="103" cy="138" rx="8" ry="10" transform="rotate(-10 103 138)" fill="#fcece3" stroke="#e8d0c2" strokeWidth="1" />
          <ellipse cx="217" cy="138" rx="8" ry="10" transform="rotate(10 217 138)" fill="#fcece3" stroke="#e8d0c2" strokeWidth="1" />
          <circle cx="222" cy="144" r="2.2" stroke="#484848" strokeWidth="1.2" fill="none" />
        </g>

        {/* 5. CHEEKS */}
        <g id="cheeks" style={{ transform: `translateY(${bodyBobY}px)` }}>
          {expression === 'SHY' ? (
            <>
              <ellipse cx="126" cy="150" rx="18" ry="11" fill="url(#blushDeep)" />
              <ellipse cx="194" cy="150" rx="18" ry="11" fill="url(#blushDeep)" />
              <path d="M 120 148 L 124 153 M 126 148 L 130 153 M 188 148 L 192 153 M 194 148 L 198 153" stroke="#e64c6a" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
            </>
          ) : expression === 'TOUCHED' || expression === 'DELIGHTED' ? (
            <>
              <ellipse cx="126" cy="150" rx="16" ry="9" fill="url(#blushDeep)" />
              <ellipse cx="194" cy="150" rx="16" ry="9" fill="url(#blushDeep)" />
            </>
          ) : (
            <>
              <ellipse cx="126" cy="150" rx="14" ry="7" fill="url(#blushSoft)" />
              <ellipse cx="194" cy="150" rx="14" ry="7" fill="url(#blushSoft)" />
            </>
          )}
        </g>

        {/* 6. MOUTH */}
        <g id="mouth" style={{ transform: `translateY(${bodyBobY}px)` }}>
          <ellipse cx="160" cy="144" rx="1.2" ry="0.9" fill="#c49b8a" />

          {posture === 'DRINKING' ? (
            /* Adorable soft drinking "o" mouth */
            <ellipse cx="160" cy="152" rx="3.5" ry="4" fill="#c96660" stroke="#7a3f3a" strokeWidth="1.5" />
          ) : posture === 'WATERING' ? (
            /* Gentle focused smile while watering flowers */
            <path d="M 153 153 Q 160 160 167 153" stroke="#8a4f48" strokeWidth="2.2" strokeLinecap="round" fill="#d97c77" />
          ) : expression === 'HAPPY' ? (
            <path d="M 152 152 Q 160 162 168 152" stroke="#8a4f48" strokeWidth="2.4" strokeLinecap="round" fill="#d97c77" />
          ) : expression === 'CONTENT' ? (
            <path d="M 154 153 Q 160 158 166 153" stroke="#8a4f48" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : expression === 'TOUCHED' ? (
            <path d="M 153 153 C 156 158 164 158 167 153" stroke="#8a4f48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          ) : expression === 'CURIOUS' ? (
            <path d="M 156 153 Q 161 157 165 154" stroke="#8a4f48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          ) : expression === 'SURPRISED' ? (
            <ellipse cx="160" cy="154" rx="4.5" ry="5.5" fill="#c96660" stroke="#7a3f3a" strokeWidth="1.8" />
          ) : expression === 'SLEEPY' ? (
            <path d="M 156 154 Q 160 156 164 154" stroke="#9c635d" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          ) : expression === 'SHY' ? (
            <path d="M 155 152 C 158 153 164 157 167 153" stroke="#8a4f48" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          ) : expression === 'THINKING' ? (
            <path d="M 157 154 Q 162 153 165 154" stroke="#8a4f48" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : expression === 'MELANCHOLY' ? (
            <path d="M 154 154 Q 160 153 166 154" stroke="#8a4f48" strokeWidth="2" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M 151 150 Q 160 166 169 150 Z" fill="#cf5b65" stroke="#7a383f" strokeWidth="2" strokeLinejoin="round" />
          )}
        </g>

        {/* 7. EYES & BROWS */}
        <g id="eyes" style={{ transform: `translateY(${bodyBobY}px)` }}>
          {expression === 'CURIOUS' ? (
            <>
              <path d="M 124 116 Q 133 114 141 117" stroke="#684f44" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M 179 114 Q 187 110 196 114" stroke="#684f44" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </>
          ) : expression === 'SURPRISED' ? (
            <>
              <path d="M 124 113 Q 133 109 141 113" stroke="#684f44" strokeWidth="2.4" strokeLinecap="round" fill="none" />
              <path d="M 179 113 Q 187 109 196 113" stroke="#684f44" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d="M 125 116 Q 133 114 141 117" stroke="#684f44" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 179 117 Q 187 114 195 116" stroke="#684f44" strokeWidth="2" strokeLinecap="round" fill="none" />
            </>
          )}

          {shouldRenderBlink || expression === 'CONTENT' || posture === 'DRINKING' || posture === 'WATERING' ? (
            <g id="eyes-closed">
              <path d="M 120 134 Q 132 142 143 133" stroke="#3f2e27" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 119 135 L 115 137" stroke="#3f2e27" strokeWidth="2" strokeLinecap="round" />
              <path d="M 177 133 Q 188 142 200 134" stroke="#3f2e27" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 200 135 L 204 137" stroke="#3f2e27" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : expression === 'SLEEPY' ? (
            <g id="eyes-sleepy">
              <ellipse cx="132" cy="134" rx="13" ry="8" fill="#fff" />
              <ellipse cx="132" cy="136" rx="9" ry="6" fill="url(#irisTeal)" />
              <path d="M 118 133 Q 132 136 145 131" stroke="#3f2e27" strokeWidth="3.4" strokeLinecap="round" fill="none" />
              <ellipse cx="188" cy="134" rx="13" ry="8" fill="#fff" />
              <ellipse cx="188" cy="136" rx="9" ry="6" fill="url(#irisTeal)" />
              <path d="M 175 131 Q 188 136 202 133" stroke="#3f2e27" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            </g>
          ) : expression === 'DELIGHTED' ? (
            <g id="eyes-delighted">
              <ellipse cx="132" cy="132" rx="13.5" ry="14" fill="#fff" />
              <ellipse cx="132" cy="132" rx="11" ry="12" fill="url(#irisTeal)" />
              <polygon points="132,125 134,130 139,132 134,134 132,139 130,134 125,132 130,130" fill="#ffffff" />
              <ellipse cx="188" cy="132" rx="13.5" ry="14" fill="#fff" />
              <ellipse cx="188" cy="132" rx="11" ry="12" fill="url(#irisTeal)" />
              <polygon points="188,125 190,130 195,132 190,134 188,139 186,134 181,132 186,130" fill="#ffffff" />
              <path d="M 118 128 Q 132 119 146 127" stroke="#34241d" strokeWidth="3.6" strokeLinecap="round" fill="none" />
              <path d="M 174 127 Q 188 119 202 128" stroke="#34241d" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            <g id="eyes-open">
              <ellipse cx="132" cy="132" rx="13.5" ry="13.5" fill="#fff" />
              <ellipse cx="132" cy="132" rx="10.5" ry="11.5" fill="url(#irisTeal)" />
              <circle cx="129" cy="128" r="3.6" fill="#ffffff" />
              <circle cx="136" cy="136" r="2" fill="#ffffff" />
              <ellipse cx="188" cy="132" rx="13.5" ry="13.5" fill="#fff" />
              <ellipse cx="188" cy="132" rx="10.5" ry="11.5" fill="url(#irisTeal)" />
              <circle cx="185" cy="128" r="3.6" fill="#ffffff" />
              <circle cx="192" cy="136" r="2" fill="#ffffff" />
              <path d="M 118 127 Q 132 120 146 127" stroke="#34241d" strokeWidth="3.4" strokeLinecap="round" fill="none" />
              <path d="M 174 127 Q 188 120 202 127" stroke="#34241d" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            </g>
          )}
        </g>

        {/* 8. FRONT BANGS */}
        <g id="hair-front" style={{ transform: `translateY(${bodyBobY}px)` }}>
          <path
            d="M 104 110 C 105 75 140 60 160 60 C 180 60 215 75 216 110 C 218 135 224 165 220 185 C 212 170 206 145 204 135 C 196 145 186 148 180 136 C 172 144 160 144 154 136 C 146 148 134 146 126 135 C 122 148 112 170 100 185 C 98 165 102 135 104 110 Z"
            fill="url(#hairGrad)"
            stroke="#4d3b32"
            strokeWidth="1.2"
          />
          <path d="M 132 80 C 138 100 136 125 128 136" stroke="#4d3b32" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 160 76 C 162 98 160 120 156 136" stroke="#4d3b32" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 184 80 C 182 100 185 125 192 134" stroke="#4d3b32" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 122 96 C 142 90 178 90 198 96 C 194 102 146 100 122 96 Z" fill="url(#hairShine)" />
        </g>
      </svg>
    </div>
  );
};
