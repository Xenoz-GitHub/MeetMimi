'use client';

import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { DeskFigurine } from '@/components/room/DeskFigurine';

interface DecorModalProps {
  isOpen: boolean;
  onClose: () => void;
  decor: {
    deskMat: string;
    figurine: string;
    lampShade: string;
    plantType: string;
  };
  onUpdateDecor: (category: 'deskMat' | 'figurine' | 'lampShade' | 'plantType', val: string) => void;
}

const FIGURINES = [
  { id: 'cat', name: 'Ceramic Calico Kitten', desc: 'Hand-painted glazed kitten with a tiny golden bell.' },
  { id: 'bunny', name: 'Porcelain Meadow Bunny', desc: 'Soft pearly glaze holding a pressed four-leaf clover.' },
  { id: 'bear', name: 'Carved Walnut Honey Bear', desc: 'Warm carved wood with a miniature honey cup.' },
  { id: 'duck', name: 'Raincoat Little Duckling', desc: 'Bright yellow raincoat with tiny umbrella insignia.' },
];

const DESK_MATS = [
  { id: 'linen', name: 'Natural Oatmeal Linen', color: 'bg-[#d8cfc4]', desc: 'Soft woven texture that cushions your wrists.' },
  { id: 'moss', name: 'Deep Moss Green Felt', color: 'bg-[#5b6e59]', desc: 'Earthy forest tones reminiscent of rain-soaked woods.' },
  { id: 'terracotta', name: 'Warm Terracotta Clay', color: 'bg-[#b86b53]', desc: 'Gentle clay tone bringing cozy sunset warmth.' },
  { id: 'navy', name: 'Midnight Rain Wool', color: 'bg-[#3b4c5a]', desc: 'Moody deep indigo felt matching night showers.' },
];

const LAMP_SHADES = [
  { id: 'brass', name: 'Vintage Warm Brass', desc: 'Antique golden finish casting a rich amber cone of light.' },
  { id: 'cream', name: 'Ceramic Cream', desc: 'Gentle earthenware finish with a cozy soft diffuser.' },
  { id: 'sage', name: 'Sage Green Enamel', desc: 'Calming muted green tone matching Mimi\'s sweater.' },
];

export const DecorModal: React.FC<DecorModalProps> = ({
  isOpen,
  onClose,
  decor,
  onUpdateDecor,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#fdfaf5] text-[#3d2716] rounded-[28px] p-5 sm:p-6 border-4 border-[#c5a887] shadow-[0_16px_50px_rgba(0,0,0,0.6),0_6px_0_#9a7b56] overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Subtle Decorative Paper Background Grid */}
        <div className="absolute inset-0 rounded-[24px] opacity-20 pointer-events-none bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-3 border-b-2 border-[#e6d8c3] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#f3e8ff] border-2 border-[#a855f7] flex items-center justify-center text-[#9333ea] shadow-xs">
              <Palette className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black font-serif text-[#5c3a21]">Room Decorations</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f3e9db] hover:bg-[#e8dcce] active:translate-y-0.5 border-2 border-[#c5a887] text-[#5c3a21] flex items-center justify-center font-bold shadow-[0_2px_0_#b59a7a] transition-all"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable list with Cartoon Scrollbar */}
        <div className="relative flex-1 overflow-y-auto space-y-4 py-3 pr-1.5 [scrollbar-width:thin] [scrollbar-color:#c5a887_#f3e9db]">
          {/* Desk Figurine */}
          <div>
            <h4 className="text-xs font-black font-serif text-[#8c6b4b] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Desk Companion Miniature</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {FIGURINES.map((fig) => {
                const isSelected = decor.figurine === fig.id;
                return (
                  <button
                    key={fig.id}
                    onClick={() => onUpdateDecor('figurine', fig.id)}
                    className={`p-2.5 rounded-2xl border-2 text-left flex items-start gap-2.5 transition-all active:translate-y-0.5 ${
                      isSelected
                        ? 'bg-[#f5f3ff] border-[#9333ea] shadow-[0_3px_0_#7e22ce] text-[#581c87]'
                        : 'bg-[#fcf8f2] border-[#e6d8c3] hover:border-[#bfa382] hover:bg-white shadow-[0_2px_0_#d5c3ab] text-[#5c3a21]'
                    }`}
                  >
                    <div className="w-8 h-10 shrink-0 flex items-center justify-center pointer-events-none">
                      <DeskFigurine styleId={fig.id as 'cat' | 'bunny' | 'bear' | 'duck'} onTap={() => {}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black font-serif truncate">{fig.name}</p>
                      <p className="text-[10px] font-serif text-[#8c6b4b] line-clamp-2 mt-0.5 leading-snug">{fig.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desk Mat */}
          <div>
            <h4 className="text-xs font-black font-serif text-[#8c6b4b] uppercase tracking-wider mb-2">Desk Felt Mat</h4>
            <div className="grid grid-cols-2 gap-2">
              {DESK_MATS.map((mat) => {
                const isSelected = decor.deskMat === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => onUpdateDecor('deskMat', mat.id)}
                    className={`p-2.5 rounded-2xl border-2 text-left flex items-center gap-2.5 transition-all active:translate-y-0.5 ${
                      isSelected
                        ? 'bg-[#f5f3ff] border-[#9333ea] shadow-[0_3px_0_#7e22ce] text-[#581c87]'
                        : 'bg-[#fcf8f2] border-[#e6d8c3] hover:border-[#bfa382] hover:bg-white shadow-[0_2px_0_#d5c3ab] text-[#5c3a21]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border border-black/15 shadow-xs ${mat.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black font-serif truncate">{mat.name}</p>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#9333ea] stroke-[3] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lamp Finish */}
          <div>
            <h4 className="text-xs font-black font-serif text-[#8c6b4b] uppercase tracking-wider mb-2">Desk Lamp Finish</h4>
            <div className="space-y-2">
              {LAMP_SHADES.map((shade) => {
                const isSelected = decor.lampShade === shade.id;
                return (
                  <button
                    key={shade.id}
                    onClick={() => onUpdateDecor('lampShade', shade.id)}
                    className={`w-full p-2.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all active:translate-y-0.5 ${
                      isSelected
                        ? 'bg-[#f5f3ff] border-[#9333ea] shadow-[0_3px_0_#7e22ce] text-[#581c87]'
                        : 'bg-[#fcf8f2] border-[#e6d8c3] hover:border-[#bfa382] hover:bg-white shadow-[0_2px_0_#d5c3ab] text-[#5c3a21]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-black font-serif">{shade.name}</p>
                      <p className="text-[10px] font-serif text-[#8c6b4b] mt-0.5">{shade.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#9333ea] stroke-[3] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative pt-3 border-t-2 border-[#e6d8c3] shrink-0 flex items-center justify-between text-xs font-serif text-[#8c6b4b]">
          <span className="italic">Updates room instantly</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#9333ea] hover:bg-[#7e22ce] active:translate-y-1 text-white rounded-2xl font-black font-serif border-b-4 border-[#6b21a8] active:border-b-0 shadow-md transition-all text-xs sm:text-sm"
          >
            Done ✦
          </button>
        </div>
      </div>
    </div>
  );
};
