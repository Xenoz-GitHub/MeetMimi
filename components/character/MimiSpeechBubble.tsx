'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MimiExpression, EXPRESSION_METAS } from '@/types/game';

interface MimiSpeechBubbleProps {
  text: string;
  expression: MimiExpression;
  onDismiss: () => void;
  tailOffsetPercent?: number; // 10% to 90% along the bottom of the bubble
  tailDirection?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  autoDismissDelay?: number;
  className?: string;
}

export const MimiSpeechBubble: React.FC<MimiSpeechBubbleProps> = ({
  text,
  expression,
  onDismiss,
  tailOffsetPercent,
  tailDirection = 'bottom-center',
  autoDismissDelay,
  className = '',
}) => {
  const [revealedCount, setRevealedCount] = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const meta = EXPRESSION_METAS[expression];

  // Dynamic reading duration: strictly 2.0s to 2.5s (max 3.0s) so it disappears quickly as requested
  const displayDuration = autoDismissDelay ?? (text.length < 24 ? 2000 : 2500);

  // Snappy typewriter reveal effect so text is immediately readable
  useEffect(() => {
    const interval = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 2;
      });
    }, 12);

    return () => clearInterval(interval);
  }, [text]);

  // Auto-dismiss timer: disappears quickly in 2 to 3 seconds
  useEffect(() => {
    dismissTimerRef.current = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onDismiss();
      }, 250);
    }, displayDuration);

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [text, onDismiss, displayDuration]);

  // Tap to instantly reveal full text or dismiss early
  const handleBubbleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (revealedCount < text.length) {
      setRevealedCount(text.length);
    } else {
      setIsFadingOut(true);
      setTimeout(() => {
        onDismiss();
      }, 200);
    }
  };

  // Compute tail position: either explicit percentage or directional fallback
  const tailStyle: React.CSSProperties =
    tailOffsetPercent !== undefined
      ? { left: `${Math.max(14, Math.min(86, tailOffsetPercent))}%` }
      : {};

  const tailFallbackClass =
    tailOffsetPercent !== undefined
      ? ''
      : tailDirection === 'bottom-left'
      ? 'left-6'
      : tailDirection === 'bottom-center'
      ? 'left-1/2 -translate-x-1/2'
      : 'right-8';

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={handleBubbleClick}
      className={`relative z-40 cursor-pointer select-none transition-all duration-200 transform-gpu ${
        isFadingOut
          ? 'opacity-0 scale-95 translate-y-1 pointer-events-none'
          : 'opacity-100 scale-100 translate-y-0'
      } ${className}`}
      title="Tap to finish reading or dismiss"
    >
      {/* 2D Story Game Compact Parchment Speech Bubble */}
      <div className="relative w-auto max-w-full bg-[#fbf5eb] text-[#3d2716] px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl shadow-lg border border-[#d5be9f] hover:border-[#b48f68] transition-colors">
        {/* Subtle Paper Texture Background */}
        <div className="absolute inset-0 rounded-xl opacity-15 pointer-events-none bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:12px_12px]" />

        {/* Compact Story Header Tag */}
        <div className="relative flex items-center gap-1.5 mb-1 text-[10px] font-serif text-[#78593a]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#15803d]" />
          <span className="font-bold tracking-wide text-[#5c3a21]">Mimi</span>
          <span className="text-[#a89078]">·</span>
          <span className="italic text-[#8c6b4b]">{meta?.name || expression}</span>
        </div>

        {/* Compact Narrative Dialogue Text */}
        <p className="relative font-serif text-[12px] sm:text-[13px] leading-snug text-[#3d2716] font-normal tracking-normal select-none">
          {text.slice(0, revealedCount)}
          {revealedCount < text.length && (
            <span className="inline-block w-1.5 h-2.5 bg-[#881337] ml-0.5 animate-pulse align-middle" />
          )}
        </p>

        {/* Directional Tail Pointing at Mimi */}
        <div
          style={tailStyle}
          className={`absolute -bottom-1.5 ${tailFallbackClass} -translate-x-1/2 w-3 h-3 bg-[#fbf5eb] border-r border-b border-[#d5be9f] rotate-45 pointer-events-none`}
        />
      </div>
    </div>
  );
};
