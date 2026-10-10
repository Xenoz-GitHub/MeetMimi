'use client';

import React from 'react';
import { X, Volume2, VolumeX, Eye, Sparkles, RefreshCw, Sliders } from 'lucide-react';
import { GameSettings } from '@/types/game';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-stone-900/95 text-stone-100 rounded-2xl border border-stone-700/80 shadow-2xl p-5 overflow-hidden flex flex-col space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-stone-300" />
            <h2 className="text-base font-semibold text-stone-100">Cozy Settings & Comfort</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500" />
              )}
              <div>
                <p className="text-xs font-medium text-stone-200">Ambient Rain & Foley Sound</p>
                <p className="text-[11px] text-stone-400">Pure offline synthesized soothing audio</p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-emerald-600' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.soundEnabled && (
            <div className="pl-6 space-y-1">
              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Sound Volume</span>
                <span>{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => onUpdateSettings({ soundVolume: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Reduced Motion Accessibility */}
        <div className="pt-2 border-t border-stone-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-medium text-stone-200">Reduced Motion</p>
                <p className="text-[11px] text-stone-400">
                  Disables Mimi&apos;s breathing motion and auto-blinks
                </p>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.reducedMotion ? 'bg-amber-600' : 'bg-stone-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reset Progress */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-rose-300">Reset Room Progress</p>
            <p className="text-[10px] text-stone-500">Clear saved tea cups, keepsakes, and journal</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset cozy room progress and discoveries?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
