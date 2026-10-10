'use client';

import React from 'react';
import { X, Compass, CheckCircle2 } from 'lucide-react';
import { CollectibleItem, Milestone } from '@/types/game';
import { KeepsakeAsset, MilestoneBadgeAsset } from '@/components/art/GameAssets';

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CollectibleItem[];
  milestones: Milestone[];
  onInspectItem: (item: CollectibleItem) => void;
}

export const CollectionModal: React.FC<CollectionModalProps> = ({
  isOpen,
  onClose,
  items,
  milestones,
  onInspectItem,
}) => {
  const [activeTab, setActiveTab] = React.useState<'keepsakes' | 'milestones'>('keepsakes');

  if (!isOpen) return null;

  const discoveredCount = items.filter((i) => i.discovered).length;
  const milestoneCount = milestones.filter((m) => m.unlocked).length;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-stone-900/95 text-stone-100 rounded-2xl border border-stone-700/80 shadow-2xl p-5 overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-stone-100">Cozy Keepsakes & Milestones</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 p-1 shrink-0 mt-3 rounded-lg">
          <button
            onClick={() => setActiveTab('keepsakes')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'keepsakes'
                ? 'bg-stone-800 text-stone-100 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Room Keepsakes ({discoveredCount}/{items.length})
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
              activeTab === 'milestones'
                ? 'bg-stone-800 text-stone-100 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Milestones ({milestoneCount}/{milestones.length})
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {activeTab === 'keepsakes' ? (
            <div className="space-y-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => item.discovered && onInspectItem(item)}
                  className={`p-3 rounded-xl border transition-all ${
                    item.discovered
                      ? 'bg-stone-800/60 border-amber-500/40 cursor-pointer hover:border-amber-400/70'
                      : 'bg-stone-900/50 border-stone-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-center shrink-0">
                      {item.discovered ? (
                        <KeepsakeAsset assetKey={item.assetKey} size={32} />
                      ) : (
                        <span className="text-xs text-stone-600 font-mono">?</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-stone-200">
                          {item.discovered ? item.name : 'Undiscovered Keepsake'}
                        </h4>
                        {item.discovered && (
                          <span className="text-[10px] text-amber-300 font-medium bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/60">
                            Found
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 leading-relaxed">
                        {item.discovered ? item.storyNote : `Hint: Look around ${item.location}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className={`p-3 rounded-xl border transition-all ${
                    ms.unlocked
                      ? 'bg-amber-950/20 border-amber-500/40 text-stone-200'
                      : 'bg-stone-900/40 border-stone-800 text-stone-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0">
                      <MilestoneBadgeAsset badgeKey={ms.badgeKey} size={36} unlocked={ms.unlocked} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-semibold ${ms.unlocked ? 'text-stone-200' : 'text-stone-400'}`}>
                          {ms.title}
                        </h4>
                        {ms.unlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">{ms.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 shrink-0 flex items-center justify-between text-xs text-stone-400">
          <span>Find hidden objects by tapping cozy room corners</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
