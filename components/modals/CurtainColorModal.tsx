'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { CurtainColorId } from '@/types/game';
import { CURTAIN_PALETTES } from '@/components/room/InteractiveCurtains';

interface CurtainColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColorId: CurtainColorId;
  onSelectColor: (colorId: CurtainColorId) => void;
}

export const CurtainColorModal: React.FC<CurtainColorModalProps> = ({
  isOpen,
  onClose,
  selectedColorId,
  onSelectColor,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-[#2b201a] text-stone-100 rounded-2xl border-2 border-[#543b2a] shadow-2xl p-4 sm:p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#473022]">
          <div>
            <h3 className="text-sm font-serif font-bold text-amber-100">Curtain Fabric Colors</h3>
            <p className="text-[11px] text-stone-400 font-serif">Select soft woven linen drape tones</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-2 gap-2.5 py-4">
          {(Object.keys(CURTAIN_PALETTES) as CurtainColorId[]).map((key) => {
            const pal = CURTAIN_PALETTES[key];
            const isSelected = selectedColorId === key;

            return (
              <button
                key={key}
                onClick={() => {
                  onSelectColor(key);
                  onClose();
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-[#4a3224] border-amber-400/90 shadow-md ring-1 ring-amber-400/50'
                    : 'bg-[#221712] border-[#442c1e] hover:bg-[#38261b]'
                }`}
              >
                {/* Fabric Swatch preview with folds */}
                <div
                  className="w-7 h-7 rounded-lg border border-black/30 shadow-inner shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: pal.hex }}
                >
                  <div
                    className="absolute inset-y-0 left-1 w-1.5 opacity-40"
                    style={{ backgroundColor: pal.darkHex }}
                  />
                  <div
                    className="absolute inset-y-0 right-1 w-1.5 opacity-40"
                    style={{ backgroundColor: pal.lightHex }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-serif font-medium text-stone-200 truncate">{pal.name}</p>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#473022] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#4a3224] hover:bg-[#5e402e] text-amber-200 text-xs font-serif rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
