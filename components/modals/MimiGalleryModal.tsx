'use client';

import React, { useState } from 'react';
import { X, Sparkles, Heart, Check, Play } from 'lucide-react';
import { MimiExpression, EXPRESSION_METAS } from '@/types/game';
import { MimiRenderer } from '@/components/character/MimiRenderer';
import { sound } from '@/lib/audio';

interface MimiGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentExpression: MimiExpression;
  onSelectExpression: (exp: MimiExpression) => void;
  reducedMotion: boolean;
}

const ALL_EXPRESSIONS: MimiExpression[] = [
  'HAPPY',
  'CONTENT',
  'TOUCHED',
  'CURIOUS',
  'SURPRISED',
  'SLEEPY',
  'SHY',
  'THINKING',
  'MELANCHOLY',
  'DELIGHTED',
];

export const MimiGalleryModal: React.FC<MimiGalleryModalProps> = ({
  isOpen,
  onClose,
  currentExpression,
  onSelectExpression,
  reducedMotion,
}) => {
  const [previewExpression, setPreviewExpression] = useState<MimiExpression>(currentExpression);

  if (!isOpen) return null;

  const currentMeta = EXPRESSION_METAS[previewExpression];

  const handleTestExpression = (exp: MimiExpression) => {
    setPreviewExpression(exp);
    onSelectExpression(exp);
    sound.playCuteInteraction();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      {/* Cartoon Storybook Card Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#fdfaf5] text-[#3d2716] rounded-[28px] border-4 border-[#c5a887] shadow-[0_18px_50px_rgba(0,0,0,0.6),0_6px_0_#9a7b56] p-4 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Subtle Decorative Paper Background Grid */}
        <div className="absolute inset-0 rounded-[24px] opacity-20 pointer-events-none bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-3 mb-3 border-b-2 border-[#e6d8c3] shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black font-serif text-[#5c3a21] tracking-wide flex items-center gap-1.5">
                <span className="text-amber-500">✦</span>
                <span>Mimi’s Expressions</span>
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#dcfce7] border-2 border-[#86efac] text-[#166534] font-bold shadow-xs">
                Rainy-day Companion
              </span>
            </div>
            <p className="text-xs font-serif text-[#8c6b4b] mt-0.5">
              Interact with Mimi to witness all 10 contextual expressions and living postures.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f3e9db] hover:bg-[#e8dcce] active:translate-y-0.5 border-2 border-[#c5a887] text-[#5c3a21] flex items-center justify-center font-bold shadow-[0_2px_0_#b59a7a] transition-all"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Character Spotlight Card */}
        <div className="relative my-1 p-3.5 sm:p-4 rounded-2xl bg-[#fffbeb] border-2 border-[#fcd34d] shadow-[0_3px_0_#fde68a] flex flex-col sm:flex-row items-center gap-4 shrink-0">
          {/* Mimi Viewport Frame */}
          <div className="relative w-28 h-36 flex items-center justify-center bg-[#fef3c7] rounded-2xl border-2 border-[#f59e0b]/40 overflow-hidden shadow-inner shrink-0">
            <MimiRenderer
              expression={previewExpression}
              reducedMotion={reducedMotion}
              size={110}
              className="mt-1"
            />
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xs font-bold font-serif text-[#854d0e] bg-[#fef08a] border border-[#facc15] px-2 py-0.5 rounded-full">
                {currentMeta.num}
              </span>
              <h3 className="text-lg font-black font-serif text-[#5c3a21]">{currentMeta.name}</h3>
              <span className="text-xs font-serif text-[#a16207] italic bg-[#fef3c7] px-2 py-0.5 rounded-full border border-[#fde68a]">
                {currentMeta.shortMood}
              </span>
            </div>
            <p className="text-xs font-serif text-[#713f12] mt-2 leading-relaxed">
              <strong className="text-[#5c3a21]">Trigger:</strong> {currentMeta.triggerDescription}
            </p>
            <p className="text-[11px] font-serif text-[#92400e] mt-1.5 italic bg-[#fdfaf5] p-2 rounded-xl border border-[#e6d8c3] leading-snug">
              &ldquo;Mimi stays near your desk in the cozy room, reacting contextually with authentic emotion without ever breaking the calm atmosphere.&rdquo;
            </p>
          </div>
        </div>

        {/* The 10 Expressions Grid with Cartoon Scrollbar */}
        <div className="relative flex-1 overflow-y-auto pr-1.5 my-2 [scrollbar-width:thin] [scrollbar-color:#c5a887_#f3e9db]">
          <p className="text-[11px] font-black uppercase font-serif tracking-wider text-[#8c6b4b] mb-2 flex items-center gap-1.5">
            <span>Tap to Switch Expression</span>
            <span className="h-0.5 flex-1 bg-[#e6d8c3] rounded-full" />
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {ALL_EXPRESSIONS.map((exp) => {
              const meta = EXPRESSION_METAS[exp];
              const isCurrent = previewExpression === exp;

              return (
                <button
                  key={exp}
                  onClick={() => handleTestExpression(exp)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between group active:translate-y-0.5 ${
                    isCurrent
                      ? 'bg-[#ecfdf5] border-[#16a34a] shadow-[0_3px_0_#15803d]'
                      : 'bg-[#fcf8f2] border-[#e6d8c3] hover:border-[#bfa382] hover:bg-white shadow-[0_2.5px_0_#d5c3ab] active:shadow-none'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-black font-serif px-1.5 py-0.2 rounded-md ${
                        isCurrent ? 'bg-[#bbf7d0] text-[#166534]' : 'bg-[#f3e9db] text-[#8c6b4b]'
                      }`}>
                        {meta.num}
                      </span>
                      <span className="text-xs font-black font-serif text-[#5c3a21]">
                        {meta.name}
                      </span>
                    </div>
                    <p className="text-[11px] font-serif text-[#8c6b4b] mt-1 line-clamp-1 leading-snug">
                      {meta.triggerDescription}
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-1">
                    {isCurrent ? (
                      <span className="text-[10px] text-white font-bold px-2 py-0.5 rounded-full bg-[#16a34a] shadow-xs flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Active
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-[#f3e9db] group-hover:bg-[#e8dcce] border border-[#d5c3ab] flex items-center justify-center text-[#8c6b4b] transition-colors">
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with Cartoon Return Button */}
        <div className="relative pt-3 border-t-2 border-[#e6d8c3] shrink-0 flex items-center justify-between text-xs font-serif text-[#8c6b4b]">
          <span className="italic hidden sm:inline">Tap any mood card to preview</span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] active:translate-y-1 text-white font-black font-serif rounded-2xl border-b-4 border-[#14532d] active:border-b-0 shadow-md text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <span>Return to Room</span>
            <span>✦</span>
          </button>
        </div>
      </div>
    </div>
  );
};
