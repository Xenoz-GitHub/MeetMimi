'use client';

import React from 'react';
import { X, Mail, Heart, Sparkles, Coffee } from 'lucide-react';
import { sound } from '@/lib/audio';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sound.playPaperTurn();
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#fefbf6] text-[#3d2716] rounded-[24px] sm:rounded-[28px] p-4 sm:p-7 border-3 sm:border-4 border-[#c5a887] shadow-[0_20px_60px_rgba(0,0,0,0.65),0_6px_0_#9a7b56] overflow-hidden animate-in zoom-in-95"
      >
        {/* Subtle Decorative Paper Background Grid & Texture */}
        <div className="absolute inset-0 rounded-[24px] opacity-25 pointer-events-none bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* Vintage Postmark & Stamp in Top-Right (Hidden on ultra-narrow screens to prevent header overlap) */}
        <div className="hidden sm:flex absolute top-3 sm:top-4 right-12 sm:right-14 items-center gap-1.5 sm:gap-2 pointer-events-none opacity-85">
          <div className="w-10 sm:w-12 h-12 sm:h-14 rounded bg-[#fff7ed] border-2 border-dashed border-[#ea580c] flex flex-col items-center justify-center rotate-3 shadow-xs">
            <span className="text-[8px] sm:text-[9px] font-mono font-bold text-[#c2410c]">RAIN</span>
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ea580c]" fill="none">
              <path d="M 8 2 C 12 3 14 7 13 11 C 11 14 7 14 4 12 C 2 9 4 4 8 2 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
              <line x1="8" y1="2" x2="6" y2="13" stroke="#ea580c" strokeWidth="1" />
            </svg>
            <span className="text-[7px] sm:text-[8px] font-mono text-[#9a3412]">POST</span>
          </div>
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border border-[#9a3412]/50 flex flex-col items-center justify-center text-[6px] sm:text-[7px] font-mono text-[#9a3412]/70 -rotate-12">
            <span>OCT 10</span>
            <span>AIR MAIL</span>
          </div>
        </div>

        {/* Header */}
        <div className="relative flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-[#e6d8c3] shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 pr-8">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ffedd5] border-2 border-[#ea580c] flex items-center justify-center text-[#c2410c] shadow-xs shrink-0">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black font-serif text-[#5c3a21] leading-tight truncate">A Letter from a Dear Friend</h2>
              <p className="text-[10px] sm:text-[11px] font-serif text-[#8c6b4b] truncate">Tucked inside the wax-sealed envelope</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#f3e9db] hover:bg-[#e8dcce] active:translate-y-0.5 border-2 border-[#c5a887] text-[#5c3a21] flex items-center justify-center font-bold shadow-[0_2px_0_#b59a7a] transition-all shrink-0"
            title="Fold Letter"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Parchment Letter Body with Mobile Smooth Scroll */}
        <div className="relative mt-3 sm:mt-4 p-4 sm:p-6 rounded-2xl bg-[#fffdfa] border-2 border-[#e2d0ba] shadow-[inset_0_2px_6px_rgba(0,0,0,0.03)] font-serif overflow-y-auto max-h-[55vh] sm:max-h-[60vh] overscroll-contain">
          {/* Crimson Wax Seal Watermark */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3 text-[11px] sm:text-xs font-bold text-[#9a3412] tracking-wider uppercase">
            <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#dc2626] border border-[#991b1b] inline-block shadow-xs" />
            <span>Rainy Afternoon Reflections</span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-[#5c3a21] mb-2 sm:mb-3 leading-relaxed">
            Dearest Friend,
          </p>

          <p className="text-xs sm:text-sm text-[#54351d] mb-2.5 sm:mb-3.5 leading-relaxed">
            If you are reading this note while listening to the raindrops tap quietly on the glass, I hope you can feel how peaceful the room is today.
          </p>

          <p className="text-xs sm:text-sm text-[#54351d] mb-2.5 sm:mb-3.5 leading-relaxed">
            The world outside can be so hurried, but here inside this cozy sanctuary with Mimi, time is allowed to drift softly like mist. The tea will always stay warm, the study desk is yours to arrange just the way you like, and every quiet hour is a gentle gift.
          </p>

          <p className="text-xs sm:text-sm text-[#54351d] mb-3 sm:mb-4 leading-relaxed">
            Take a deep breath. Savor the warm cup in your hands. You are safe, you are cherished, and you are always welcome here.
          </p>

          {/* Sweet Closing & Sign-off */}
          <div className="pt-2.5 sm:pt-3 border-t border-[#ebdcc9] flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[11px] sm:text-xs text-[#8c6b4b] italic">With fondest warmth & quiet wishes,</p>
              <p className="text-xs sm:text-sm font-bold text-[#5c3a21] mt-0.5 font-serif">Your Pen Pal & Companion</p>
            </div>
            {/* Authentic SVG miniature sketches */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#b45309]">
              <svg viewBox="0 0 20 16" className="w-3.5 sm:w-4 h-3 sm:h-3.5">
                <title>Warm tea</title>
                <rect x="2" y="3" width="13" height="11" rx="3" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
                <path d="M 15 5 C 19 5 19 11 15 11" stroke="#ea580c" strokeWidth="1.5" fill="none" />
              </svg>
              <svg viewBox="0 0 20 16" className="w-3.5 sm:w-4 h-3 sm:h-3.5">
                <title>Gentle rain</title>
                <path d="M 4 9 C 2 9 2 6 5 6 C 5 3 9 2 12 4 C 15 3 17 5 16 8 C 18 8 18 11 15 11 L 5 11 Z" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
                <line x1="6" y1="12" x2="5" y2="15" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="10" y1="12" x2="9" y2="15" stroke="#0284c7" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 18 16" className="w-3.5 sm:w-4 h-3 sm:h-3.5">
                <title>Cat companion</title>
                <ellipse cx="9" cy="11" rx="4.5" ry="3.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
                <circle cx="5" cy="5.5" r="1.8" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
                <circle cx="8" cy="4" r="1.8" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
                <circle cx="11.5" cy="4.5" r="1.8" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
              </svg>
              <Heart className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#e11d48] fill-[#f43f5e]" />
            </div>
          </div>
        </div>

        {/* Footer with fold button & desk hint */}
        <div className="relative mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t-2 border-[#e6d8c3] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <p className="text-[10px] sm:text-[11px] font-serif text-[#8c6b4b] text-center sm:text-left flex items-center gap-1.5">
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-600 shrink-0 inline" />
            <span><strong className="text-[#6c4322]">Tip:</strong> Drag envelope, journal, and books into either desk drawer!</span>
          </p>
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-[#d97706] hover:bg-[#b45309] active:translate-y-0.5 text-white font-black font-serif text-xs rounded-xl sm:rounded-2xl border-b-3 sm:border-b-4 border-[#92400e] active:border-b-0 shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Fold & Return to Envelope</span>
          </button>
        </div>
      </div>
    </div>
  );
};
