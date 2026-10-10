'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Feather, Sparkles, Palette, Check } from 'lucide-react';
import { JournalEntry, JournalThemeId } from '@/types/game';
import { sound } from '@/lib/audio';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  themeId: JournalThemeId;
  onSelectTheme: (themeId: JournalThemeId) => void;
  onAddEntry: (title: string, content: string) => void;
}

export const JOURNAL_THEMES: Record<
  JournalThemeId,
  { name: string; coverHex: string; spineHex: string; ribbonHex: string; paperBg: string }
> = {
  navy: {
    name: 'Navy Blue',
    coverHex: '#1e293b',
    spineHex: '#0f172a',
    ribbonHex: '#38bdf8',
    paperBg: '#f8fafc',
  },
  cyan: {
    name: 'Misty Cyan',
    coverHex: '#164e63',
    spineHex: '#083344',
    ribbonHex: '#22d3ee',
    paperBg: '#f0fdfa',
  },
  pale_blue: {
    name: 'Pale Blue',
    coverHex: '#334155',
    spineHex: '#1e293b',
    ribbonHex: '#60a5fa',
    paperBg: '#f8fafc',
  },
  sky_blue: {
    name: 'Sky Blue',
    coverHex: '#0369a1',
    spineHex: '#0c4a6e',
    ribbonHex: '#38bdf8',
    paperBg: '#f0f9ff',
  },
  blush_pink: {
    name: 'Blush Pink',
    coverHex: '#831843',
    spineHex: '#500724',
    ribbonHex: '#f472b6',
    paperBg: '#fdf2f8',
  },
  dusty_rose: {
    name: 'Dusty Rose',
    coverHex: '#6b3644',
    spineHex: '#4a242f',
    ribbonHex: '#fb7185',
    paperBg: '#fff1f2',
  },
  purple: {
    name: 'Deep Purple',
    coverHex: '#581c87',
    spineHex: '#3b0764',
    ribbonHex: '#c084fc',
    paperBg: '#faf5ff',
  },
  pale_purple: {
    name: 'Pale Purple',
    coverHex: '#5b4c6e',
    spineHex: '#3d324c',
    ribbonHex: '#a855f7',
    paperBg: '#fbf8ff',
  },
  sage_green: {
    name: 'Sage Green',
    coverHex: '#2e4533',
    spineHex: '#1b2c1f',
    ribbonHex: '#86efac',
    paperBg: '#f4f7f4',
  },
  warm_cream: {
    name: 'Warm Leather',
    coverHex: '#582b18',
    spineHex: '#3d1b0c',
    ribbonHex: '#b91c1c',
    paperBg: '#fdf8f0',
  },
};

// Natural word-preserving pagination algorithm
function paginateContent(text: string, charsPerPage = 320): string[] {
  if (!text.trim()) return [''];
  const words = text.split(' ');
  const pages: string[] = [];
  let currentPage = '';

  for (const word of words) {
    if ((currentPage + ' ' + word).trim().length > charsPerPage) {
      if (currentPage.trim()) {
        pages.push(currentPage.trim());
      }
      currentPage = word;
    } else {
      currentPage = currentPage ? `${currentPage} ${word}` : word;
    }
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [''];
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  entries,
  themeId,
  onSelectTheme,
  onAddEntry,
}) => {
  const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
  const [currentPageWithinEntry, setCurrentPageWithinEntry] = useState(0);
  const [isWritingMode, setIsWritingMode] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (!isOpen) return null;

  const currentTheme = JOURNAL_THEMES[themeId] || JOURNAL_THEMES.warm_cream;
  const currentEntry = entries[currentEntryIndex] || entries[0];
  const pages = paginateContent(currentEntry?.content || '', 300);
  const totalEntryPages = pages.length;

  const handleNextPage = () => {
    sound.playWindowTap();
    if (currentPageWithinEntry < totalEntryPages - 1) {
      setCurrentPageWithinEntry((p) => p + 1);
    } else if (currentEntryIndex < entries.length - 1) {
      setCurrentEntryIndex((e) => e + 1);
      setCurrentPageWithinEntry(0);
    }
  };

  const handlePrevPage = () => {
    sound.playWindowTap();
    if (currentPageWithinEntry > 0) {
      setCurrentPageWithinEntry((p) => p - 1);
    } else if (currentEntryIndex > 0) {
      const prevEntryIndex = currentEntryIndex - 1;
      const prevPages = paginateContent(entries[prevEntryIndex].content, 300);
      setCurrentEntryIndex(prevEntryIndex);
      setCurrentPageWithinEntry(prevPages.length - 1);
    }
  };

  const handleSaveMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    sound.playSoftChime();
    onAddEntry(newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
    setIsWritingMode(false);
    setCurrentEntryIndex(0);
    setCurrentPageWithinEntry(0);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl flex flex-col items-center"
      >
        {/* Top Control Bar (Theme Swatch button & Close) */}
        <div className="w-full flex items-center justify-between mb-2">
          {/* Theme Palette Toggle */}
          <button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 text-xs font-serif border border-stone-700/80 shadow-md transition-colors"
            title="Customize journal cover theme"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Journal Color: {currentTheme.name}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 shadow-md transition-colors"
            title="Close Journal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Palette Popover when open */}
        {isPaletteOpen && (
          <div className="w-full mb-3 p-3 rounded-2xl bg-stone-900/95 border border-stone-700 shadow-xl grid grid-cols-5 gap-2 z-40 animate-in fade-in">
            {(Object.keys(JOURNAL_THEMES) as JournalThemeId[]).map((tId) => {
              const th = JOURNAL_THEMES[tId];
              const isSelected = tId === themeId;
              return (
                <button
                  key={tId}
                  onClick={() => {
                    onSelectTheme(tId);
                    setIsPaletteOpen(false);
                  }}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-stone-800 shadow-sm'
                      : 'border-stone-700 hover:border-stone-500'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-black/40 shadow-sm"
                    style={{ backgroundColor: th.coverHex }}
                  />
                  <span className="text-[9px] font-serif text-stone-300 truncate w-full text-center">
                    {th.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2D PHYSICAL OPEN BOOK WITH CUSTOMIZABLE COVER & RIBBON */}
        <div
          className="relative w-full rounded-2xl p-2.5 sm:p-4 shadow-2xl border-4 border-black/40 flex flex-col transition-colors duration-500"
          style={{ backgroundColor: currentTheme.coverHex }}
        >
          {/* Book Spine */}
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 shadow-inner border-x border-black/30 hidden sm:block z-20 pointer-events-none"
            style={{ backgroundColor: currentTheme.spineHex }}
          />

          {/* Book Ribbon Bookmark */}
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-14 rounded-b-md shadow-md z-30 pointer-events-none transition-colors duration-500"
            style={{ backgroundColor: currentTheme.ribbonHex }}
          />

          {/* Facing Open Parchment Pages */}
          <div
            className="relative w-full min-h-[380px] sm:min-h-[420px] rounded-xl border border-stone-300 shadow-inner flex flex-col sm:flex-row overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: currentTheme.paperBg }}
          >
            {/* Lined Paper Texture */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:16px_16px]" />

            {!isWritingMode ? (
              /* ================= READ MODE: PAGE-BY-PAGE EXPERIENCE ================= */
              <>
                {/* LEFT FACING PAGE */}
                <div className="w-full sm:w-1/2 p-5 border-b sm:border-b-0 sm:border-r border-stone-300/80 flex flex-col justify-between relative">
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-stone-300/80 pb-2 text-[11px] font-serif text-stone-600">
                      <span className="uppercase tracking-widest">
                        Entry {currentEntryIndex + 1} of {entries.length}
                      </span>
                      <span>{currentEntry.date}</span>
                    </div>

                    {/* Left Page Display: Title (if present) & First part of text */}
                    <div className="mt-3">
                      {currentEntry.title && currentPageWithinEntry === 0 && (
                        <h3 className="text-base font-serif font-bold text-stone-900 tracking-tight border-b border-stone-300/60 pb-2 mb-3">
                          {currentEntry.title}
                        </h3>
                      )}

                      <p className="font-serif text-[13px] leading-relaxed text-stone-800 whitespace-pre-line italic">
                        {pages[currentPageWithinEntry]}
                      </p>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="pt-3 border-t border-stone-300/80 flex items-center justify-between text-xs text-stone-600 font-serif">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentEntryIndex === 0 && currentPageWithinEntry === 0}
                      className="flex items-center gap-1 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <span className="italic text-[11px]">
                      Page {currentPageWithinEntry + 1} of {totalEntryPages}
                    </span>
                  </div>
                </div>

                {/* RIGHT FACING PAGE: Continuation or Reflection Action */}
                <div className="w-full sm:w-1/2 p-5 flex flex-col justify-between relative bg-black/[0.02]">
                  <div>
                    {/* Next page content if available, else decorative quotation/tag */}
                    {currentPageWithinEntry + 1 < totalEntryPages ? (
                      <div>
                        <div className="border-b border-stone-300/80 pb-2 text-[11px] font-serif text-stone-500 text-right">
                          (Continued)
                        </div>
                        <p className="mt-3 font-serif text-[13px] leading-relaxed text-stone-800 whitespace-pre-line italic">
                          {pages[currentPageWithinEntry + 1]}
                        </p>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col justify-center items-center text-center p-4">
                        <div className="w-16 h-16 rounded-full bg-amber-900/10 border border-amber-800/20 flex items-center justify-center mb-3">
                          <Feather className="w-7 h-7 text-amber-900/60" />
                        </div>
                        <p className="text-xs font-serif italic text-stone-600 max-w-xs leading-relaxed">
                          &ldquo;Some moments are meant to be kept gently, like rain on a quiet evening.&rdquo;
                        </p>
                        <span className="text-[10px] font-serif text-stone-400 mt-2">
                          Tag: {currentEntry.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="pt-3 border-t border-stone-300/80 flex items-center justify-between">
                    <button
                      onClick={() => setIsWritingMode(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-100 text-xs font-serif font-medium shadow-sm transition-all"
                    >
                      <Feather className="w-3.5 h-3.5" />
                      <span>Write New</span>
                    </button>

                    <button
                      onClick={handleNextPage}
                      disabled={
                        currentEntryIndex >= entries.length - 1 &&
                        currentPageWithinEntry >= totalEntryPages - 1
                      }
                      className="flex items-center gap-1 font-serif text-xs text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <span>Next Page</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* ================= WRITE MODE: PAGE-BY-PAGE NATURAL WRITING ================= */
              <div className="w-full p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-stone-300 pb-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Feather className="w-4 h-4 text-rose-900" />
                      <h3 className="text-sm font-serif font-bold text-stone-900">
                        Write in the Journal
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsWritingMode(false)}
                      className="text-xs font-serif text-stone-600 hover:text-stone-900 underline"
                    >
                      Cancel & Return to Reading
                    </button>
                  </div>

                  <form onSubmit={handleSaveMemory} className="space-y-4">
                    {/* OPTIONAL TITLE (Per prompt: Title must be optional!) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-serif font-semibold text-stone-700">
                          Title (Optional)
                        </label>
                        <span className="text-[10px] font-serif text-stone-400 italic">
                          Leave blank to begin writing directly
                        </span>
                      </div>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. April rain at dusk (or leave empty)"
                        className="w-full px-3 py-2 rounded-lg bg-black/[0.04] border border-stone-300 font-serif text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-600"
                      />
                    </div>

                    {/* NATURAL CONTINUOUS WRITING (Flows onto pages automatically) */}
                    <div>
                      <label className="block text-xs font-serif font-semibold text-stone-700 mb-1">
                        Reflections & Thoughts
                      </label>
                      <textarea
                        rows={7}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Pour your thoughts onto the page. Longer passages will naturally flow across facing pages when saved..."
                        className="w-full px-3 py-2.5 rounded-lg bg-black/[0.04] border border-stone-300 font-serif text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-600 resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-rose-950 hover:bg-rose-900 active:scale-95 text-rose-100 rounded-xl text-xs font-serif font-medium shadow-md transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Preserve Memory in Journal</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
