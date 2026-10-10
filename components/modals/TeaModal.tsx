'use client';

import React, { useState } from 'react';
import { X, Coffee, Sparkles, Check } from 'lucide-react';
import { sound } from '@/lib/audio';

interface TeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrew: (teaName: string) => void;
  onSip: () => void;
  currentTea: string | null;
  teaCount: number;
}

const TEA_BLENDS = [
  {
    id: 'chamomile',
    name: 'Chamomile & Wild Honey',
    desc: 'Golden herbal infusion with sweet floral notes and soothing chamomile flowers.',
    steepTime: '3 min',
    color: 'from-amber-200 to-amber-400',
    aroma: 'Sweet floral & honeyed warmth',
  },
  {
    id: 'hojicha',
    name: 'Roasted Hojicha Tea',
    desc: 'Toasted green tea with warm caramel and nutty aromas. Gentle on the stomach.',
    steepTime: '2 min',
    color: 'from-amber-600 to-amber-800',
    aroma: 'Toasty caramel & autumn leaves',
  },
  {
    id: 'earlgrey',
    name: 'Earl Grey Lavender',
    desc: 'Classic black tea perfumed with fragrant bergamot citrus and dried lavender buds.',
    steepTime: '4 min',
    color: 'from-orange-700 to-rose-900',
    aroma: 'Bergamot citrus & fresh lavender',
  },
  {
    id: 'mint',
    name: 'Sweet Spearmint & Lemon',
    desc: 'Crisp spearmint leaves paired with a thin twist of fresh lemon zest.',
    steepTime: '3 min',
    color: 'from-emerald-300 to-emerald-600',
    aroma: 'Crisp mint & refreshing citrus',
  },
];

export const TeaModal: React.FC<TeaModalProps> = ({
  isOpen,
  onClose,
  onBrew,
  onSip,
  currentTea,
  teaCount,
}) => {
  const [selectedBlend, setSelectedBlend] = useState(TEA_BLENDS[0]);
  const [isBrewing, setIsBrewing] = useState(false);

  if (!isOpen) return null;

  const handleBrew = () => {
    setIsBrewing(true);
    sound.playTeaPour();
    setTimeout(() => {
      setIsBrewing(false);
      onBrew(selectedBlend.name);
    }, 900);
  };

  const handleSip = () => {
    sound.playTeaPour();
    onSip();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#fdfaf5] text-[#3d2716] rounded-[28px] p-5 sm:p-6 border-4 border-[#c5a887] shadow-[0_16px_50px_rgba(0,0,0,0.6),0_6px_0_#9a7b56] overflow-hidden"
      >
        {/* Subtle Decorative Paper Background Grid */}
        <div className="absolute inset-0 rounded-[24px] opacity-20 pointer-events-none bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:14px_14px]" />

        {/* Header */}
        <div className="relative flex items-center justify-between pb-3 border-b-2 border-[#e6d8c3]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#fef3c7] border-2 border-[#f59e0b] flex items-center justify-center text-[#d97706] shadow-xs">
              <Coffee className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black font-serif text-[#5c3a21]">The Tea Corner</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f3e9db] hover:bg-[#e8dcce] active:translate-y-0.5 border-2 border-[#c5a887] text-[#5c3a21] flex items-center justify-center font-bold shadow-[0_2px_0_#b59a7a] transition-all"
            title="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Current status */}
        <div className="relative mt-3.5 p-3.5 rounded-2xl bg-[#fffbeb] border-2 border-[#fcd34d] shadow-[0_3px_0_#fde68a] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black font-serif text-[#92400e] uppercase tracking-wider">Cup on the Desk</p>
            <p className="text-sm font-black font-serif text-[#5c3a21] mt-0.5">
              {currentTea ? currentTea : 'Empty cute mug, waiting to brew'}
            </p>
          </div>
          {currentTea && (
            <button
              onClick={handleSip}
              className="px-3.5 py-1.5 text-xs font-black font-serif bg-[#f59e0b] hover:bg-[#d97706] active:translate-y-0.5 text-white rounded-xl border-b-3 border-[#b45309] shadow-sm transition-all"
            >
              Take a Sip ☕
            </button>
          )}
        </div>

        {/* Tea Selection */}
        <div className="relative mt-3.5">
          <p className="text-xs font-black font-serif text-[#8c6b4b] uppercase tracking-wider mb-2">Select a Cozy Blend</p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1.5 [scrollbar-width:thin] [scrollbar-color:#c5a887_#f3e9db]">
            {TEA_BLENDS.map((blend) => {
              const isSelected = selectedBlend.id === blend.id;
              return (
                <div
                  key={blend.id}
                  onClick={() => setSelectedBlend(blend)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all active:translate-y-0.5 ${
                    isSelected
                      ? 'bg-[#ecfdf5] border-[#16a34a] shadow-[0_3px_0_#15803d]'
                      : 'bg-[#fcf8f2] border-[#e6d8c3] hover:border-[#bfa382] hover:bg-white shadow-[0_2px_0_#d5c3ab]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full border border-black/10 bg-gradient-to-br ${blend.color}`} />
                        <h4 className="text-sm font-black font-serif text-[#5c3a21]">{blend.name}</h4>
                      </div>
                      <p className="text-xs font-serif text-[#78593a] mt-1 leading-snug">{blend.desc}</p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] font-serif text-[#9c7d61]">
                        <span>Aroma: {blend.aroma}</span>
                        <span>·</span>
                        <span>Steep: {blend.steepTime}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#16a34a] stroke-[3] mt-1 shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brew action */}
        <div className="relative mt-4 pt-3 border-t-2 border-[#e6d8c3] flex items-center justify-between">
          <span className="text-xs font-serif text-[#8c6b4b]">
            Total cups steeped: <strong className="text-[#5c3a21] font-bold">{teaCount}</strong>
          </span>
          <button
            onClick={handleBrew}
            disabled={isBrewing}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] active:translate-y-1 text-white font-black font-serif text-xs sm:text-sm rounded-2xl border-b-4 border-[#92400e] active:border-b-0 shadow-md transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isBrewing ? 'Steeping tea...' : `Brew ${selectedBlend.name.split(' ')[0]}`}
          </button>
        </div>
      </div>
    </div>
  );
};
