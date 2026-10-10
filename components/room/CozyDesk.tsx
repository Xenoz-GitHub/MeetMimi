'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { sound } from '@/lib/audio';
import { Sparkles, Archive } from 'lucide-react';

export type DeskItemId =
  | 'stackOfTales'
  | 'envelope'
  | 'journal'
  | 'ink'
  | 'quill'
  | 'mug'
  | 'lamp';

export interface DeskItemPos {
  id: DeskItemId;
  x: number;
  y: number;
  inDrawer: 'left' | 'right' | false;
}

interface CozyDeskProps {
  lampOn: boolean;
  onToggleLamp: () => void;
  currentTea: string | null;
  onSipTea: () => void;
  onOpenJournal: () => void;
  onOpenLetter: () => void;
  onWaterPlant: () => void;
  onTapFigurine: () => void;
  onDiscoverHiddenItem: (itemId: string) => void;
  discoveredItemIds: string[];
  plantBloomed: boolean;
  isMimiHoldingMug?: boolean;
  decor?: {
    deskMat?: string;
    figurine?: string;
    lampShade?: string;
    plantType?: string;
  };
}

// Tabletop boundaries in SVG units:
const DESK_BOUNDS = {
  minX: 18,
  maxX: 312,
  minY: 18,
  maxY: 112,
};

// Left Drawer drop area in SVG units:
const LEFT_DRAWER_DROP_ZONE = {
  minX: 18,
  maxX: 184,
  minY: 136,
  maxY: 215,
};

// Right Drawer drop area in SVG units:
const RIGHT_DRAWER_DROP_ZONE = {
  minX: 188,
  maxX: 368,
  minY: 136,
  maxY: 215,
};

const INITIAL_DESK_ITEMS: Record<DeskItemId, DeskItemPos> = {
  stackOfTales: { id: 'stackOfTales', x: 68, y: 24, inDrawer: false },
  lamp: { id: 'lamp', x: 42, y: 30, inDrawer: false },
  journal: { id: 'journal', x: 144, y: 58, inDrawer: false },
  mug: { id: 'mug', x: 274, y: 20, inDrawer: false },
  envelope: { id: 'envelope', x: 320, y: 24, inDrawer: false },
  ink: { id: 'ink', x: 278, y: 70, inDrawer: false },
  quill: { id: 'quill', x: 310, y: 62, inDrawer: false },
};

function getReadableItemName(id: DeskItemId): string {
  switch (id) {
    case 'stackOfTales':
      return 'Stack of Tales';
    case 'envelope':
      return 'Wax-Sealed Letter';
    case 'journal':
      return 'Rain Journal';
    case 'ink':
      return 'Glass Inkwell';
    case 'quill':
      return 'Feather Pen';
    case 'mug':
      return 'Cute Tea Mug';
    case 'lamp':
      return 'Mushroom Lamp';
  }
}

// =========================================================================
// AUTHENTIC MINIATURE SVG ARTWORK THUMBNAILS (ZERO EMOJIS)
// =========================================================================
const ItemArtworkThumbnail: React.FC<{ id: DeskItemId }> = ({ id }) => {
  switch (id) {
    case 'stackOfTales':
      return (
        <svg viewBox="0 0 40 30" className="w-6 h-5 shrink-0 overflow-visible">
          {/* Bottom Navy Book */}
          <rect x="2" y="18" width="36" height="8" rx="1.5" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1" />
          <rect x="6" y="20" width="30" height="5" fill="#fef3c7" />
          {/* Middle Green Book */}
          <rect x="4" y="10" width="32" height="7" rx="1.5" fill="#166534" stroke="#14532d" strokeWidth="1" />
          <rect x="7" y="12" width="26" height="4" fill="#fef3c7" />
          {/* Top Red Book with Gold Inlay */}
          <rect x="8" y="2" width="26" height="8" rx="1.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
          <rect x="12" y="4" width="18" height="4" fill="none" stroke="#facc15" strokeWidth="1" />
        </svg>
      );

    case 'journal':
      return (
        <svg viewBox="0 0 40 28" className="w-6 h-5 shrink-0 overflow-visible">
          {/* Red Leather Cover */}
          <rect x="2" y="2" width="36" height="24" rx="2" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />
          {/* Open Pages */}
          <path d="M 4 4 C 10 3 19 4 20 5 L 20 23 C 19 22 10 22 4 23 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
          <path d="M 20 5 C 21 4 30 3 36 4 L 36 23 C 30 22 21 22 20 23 Z" fill="#fef9c3" stroke="#d97706" strokeWidth="0.8" />
          {/* Ruled lines */}
          <line x1="7" y1="8" x2="17" y2="8" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <line x1="7" y1="13" x2="17" y2="13" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <line x1="7" y1="18" x2="16" y2="18" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <line x1="23" y1="8" x2="33" y2="8" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          <line x1="23" y1="13" x2="33" y2="13" stroke="#78350f" strokeWidth="1" strokeLinecap="round" />
          {/* Ribbon */}
          <line x1="20" y1="1" x2="20" y2="25" stroke="#dc2626" strokeWidth="1.6" />
        </svg>
      );

    case 'envelope':
      return (
        <svg viewBox="0 0 36 26" className="w-6 h-5 shrink-0 overflow-visible">
          {/* Parchment Envelope */}
          <rect x="2" y="2" width="32" height="22" rx="2" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.2" />
          <line x1="2" y1="2" x2="18" y2="13" stroke="#ea580c" strokeWidth="1.2" />
          <line x1="34" y1="2" x2="18" y2="13" stroke="#ea580c" strokeWidth="1.2" />
          {/* Wax Seal */}
          <circle cx="18" cy="13" r="4.2" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
          <circle cx="18" cy="13" r="2.2" fill="#ef4444" />
        </svg>
      );

    case 'ink':
      return (
        <svg viewBox="0 0 28 30" className="w-5 h-5 shrink-0 overflow-visible">
          <ellipse cx="14" cy="25" rx="10" ry="3.5" fill="rgba(0,0,0,0.25)" />
          <path d="M 7 24 L 5 13 L 10 9 L 18 9 L 23 13 L 21 24 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
          <path d="M 8 15 L 10 22" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
          <rect x="11" y="6" width="6" height="3.5" fill="#b45309" rx="0.5" />
        </svg>
      );

    case 'quill':
      return (
        <svg viewBox="0 0 26 32" className="w-5 h-5 shrink-0 overflow-visible">
          <line x1="13" y1="3" x2="13" y2="28" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
          <polygon points="11,28 15,28 13,31" fill="#0f172a" />
          <path d="M 13 4 C 7 8 7 18 13 25 C 19 18 19 8 13 4 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="9" y1="12" x2="13" y2="14" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="17" y1="12" x2="13" y2="14" stroke="#cbd5e1" strokeWidth="0.8" />
        </svg>
      );

    case 'mug':
      return (
        <svg viewBox="0 0 32 30" className="w-6 h-5 shrink-0 overflow-visible">
          <rect x="4" y="6" width="22" height="20" rx="5" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
          <path d="M 26 9 C 32 9 32 21 26 21" stroke="#ea580c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="15" cy="6" rx="11" ry="3.5" fill="#78350f" stroke="#ea580c" strokeWidth="1" />
          <ellipse cx="15" cy="6" rx="9" ry="2.2" fill="#fef08a" />
          <circle cx="11" cy="16" r="1.5" fill="#fb7185" />
          <circle cx="19" cy="16" r="1.5" fill="#fb7185" />
          <path d="M 13 18 Q 15 19.5 17 18" stroke="#7c2d12" strokeWidth="1" fill="none" />
        </svg>
      );

    case 'lamp':
      return (
        <svg viewBox="0 0 30 32" className="w-5 h-5 shrink-0 overflow-visible">
          <ellipse cx="15" cy="27" rx="10" ry="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <rect x="14" y="10" width="2" height="17" fill="#ca8a04" />
          <path d="M 3 14 C 3 4 27 4 27 14 Z" fill="#fde047" stroke="#d97706" strokeWidth="1.2" />
        </svg>
      );
  }
};

export const CozyDesk: React.FC<CozyDeskProps> = ({
  lampOn,
  onToggleLamp,
  currentTea,
  onSipTea,
  onOpenJournal,
  onOpenLetter,
  onWaterPlant,
  onTapFigurine,
  onDiscoverHiddenItem,
  discoveredItemIds,
  plantBloomed,
  isMimiHoldingMug = false,
}) => {
  const isStampFound = discoveredItemIds.includes('vintage_stamp');
  const isCraneFound = discoveredItemIds.includes('origami_crane');

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Desk item positions and storage state:
  const [items, setItems] = useState<Record<DeskItemId, DeskItemPos>>(INITIAL_DESK_ITEMS);

  // BOTH Drawers interactive state:
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState<boolean>(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState<boolean>(false);

  const [leftDrawerHighlight, setLeftDrawerHighlight] = useState<boolean>(false);
  const [rightDrawerHighlight, setRightDrawerHighlight] = useState<boolean>(false);

  const [storedFeedback, setStoredFeedback] = useState<string | null>(null);

  // Tooltip state:
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [bloomSparkles, setBloomSparkles] = useState<boolean>(false);

  // Dragging state tracking:
  const [draggingId, setDraggingId] = useState<DeskItemId | null>(null);
  const dragInfoRef = useRef<{
    id: DeskItemId;
    startClientX: number;
    startClientY: number;
    startItemX: number;
    startItemY: number;
    hasMoved: boolean;
    wasLeftClosedAtStart: boolean;
    wasRightClosedAtStart: boolean;
    currentSvgPos: { x: number; y: number };
  } | null>(null);

  const leftAutoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rightAutoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to convert screen pointer coordinates to SVG coordinate space:
  const getSvgPoint = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgRef.current.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const transformed = pt.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }, []);

  // Handle pointer down on an interactive object:
  const handleItemPointerDown = (
    e: React.PointerEvent,
    id: DeskItemId
  ) => {
    e.stopPropagation();
    const item = items[id];
    if (item.inDrawer) return;

    if (leftAutoCloseTimerRef.current) {
      clearTimeout(leftAutoCloseTimerRef.current);
      leftAutoCloseTimerRef.current = null;
    }
    if (rightAutoCloseTimerRef.current) {
      clearTimeout(rightAutoCloseTimerRef.current);
      rightAutoCloseTimerRef.current = null;
    }

    dragInfoRef.current = {
      id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startItemX: item.x,
      startItemY: item.y,
      hasMoved: false,
      wasLeftClosedAtStart: !isLeftDrawerOpen,
      wasRightClosedAtStart: !isRightDrawerOpen,
      currentSvgPos: { x: item.x, y: item.y },
    };

    setDraggingId(id);
  };

  // Global pointer move & up handlers:
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const dragInfo = dragInfoRef.current;
      if (!dragInfo || !svgRef.current) return;

      const deltaScreenX = e.clientX - dragInfo.startClientX;
      const deltaScreenY = e.clientY - dragInfo.startClientY;

      if (!dragInfo.hasMoved && Math.hypot(deltaScreenX, deltaScreenY) > 5) {
        dragInfo.hasMoved = true;
      }

      if (!dragInfo.hasMoved) return;

      const currentSvg = getSvgPoint(e.clientX, e.clientY);
      const startSvg = getSvgPoint(dragInfo.startClientX, dragInfo.startClientY);
      const dx = currentSvg.x - startSvg.x;
      const dy = currentSvg.y - startSvg.y;

      const newX = dragInfo.startItemX + dx;
      const newY = dragInfo.startItemY + dy;

      dragInfo.currentSvgPos = { x: newX, y: newY };

      setItems((prev) => ({
        ...prev,
        [dragInfo.id]: {
          ...prev[dragInfo.id],
          x: newX,
          y: newY,
        },
      }));

      // Check hover over Left Drawer
      const isOverLeft =
        newX >= LEFT_DRAWER_DROP_ZONE.minX &&
        newX <= LEFT_DRAWER_DROP_ZONE.maxX &&
        newY >= LEFT_DRAWER_DROP_ZONE.minY &&
        newY <= LEFT_DRAWER_DROP_ZONE.maxY;

      // Check hover over Right Drawer
      const isOverRight =
        newX >= RIGHT_DRAWER_DROP_ZONE.minX &&
        newX <= RIGHT_DRAWER_DROP_ZONE.maxX &&
        newY >= RIGHT_DRAWER_DROP_ZONE.minY &&
        newY <= RIGHT_DRAWER_DROP_ZONE.maxY;

      setLeftDrawerHighlight(isOverLeft);
      setRightDrawerHighlight(isOverRight);

      // Auto-open Left Drawer on hover
      if (isOverLeft && !isLeftDrawerOpen) {
        setIsLeftDrawerOpen(true);
        sound.playDrawerOpen();
      }

      // Auto-open Right Drawer on hover
      if (isOverRight && !isRightDrawerOpen) {
        setIsRightDrawerOpen(true);
        sound.playDrawerOpen();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dragInfo = dragInfoRef.current;
      if (!dragInfo) return;

      const id = dragInfo.id;
      const hasMoved = dragInfo.hasMoved;
      const wasLeftClosed = dragInfo.wasLeftClosedAtStart;
      const wasRightClosed = dragInfo.wasRightClosedAtStart;

      dragInfoRef.current = null;
      setDraggingId(null);
      setLeftDrawerHighlight(false);
      setRightDrawerHighlight(false);

      if (!hasMoved) {
        // TAP / CLICK ACTION
        switch (id) {
          case 'mug':
            sound.playTeaSip();
            onSipTea();
            break;
          case 'envelope':
            sound.playPaperTurn();
            if (!isCraneFound) onDiscoverHiddenItem('origami_crane');
            onOpenLetter();
            break;
          case 'journal':
            sound.playPaperTurn();
            onOpenJournal();
            break;
          case 'lamp':
            sound.playLampClick();
            onToggleLamp();
            break;
          case 'stackOfTales':
            sound.playPaperTurn();
            onTapFigurine();
            break;
          case 'ink':
          case 'quill':
            sound.playCuteInteraction();
            onTapFigurine();
            break;
        }
        return;
      }

      // DRAG RELEASE ACTION
      const finalX = dragInfo.currentSvgPos.x;
      const finalY = dragInfo.currentSvgPos.y;

      const isOverLeft =
        finalX >= LEFT_DRAWER_DROP_ZONE.minX &&
        finalX <= LEFT_DRAWER_DROP_ZONE.maxX &&
        finalY >= LEFT_DRAWER_DROP_ZONE.minY &&
        finalY <= LEFT_DRAWER_DROP_ZONE.maxY;

      const isOverRight =
        finalX >= RIGHT_DRAWER_DROP_ZONE.minX &&
        finalX <= RIGHT_DRAWER_DROP_ZONE.maxX &&
        finalY >= RIGHT_DRAWER_DROP_ZONE.minY &&
        finalY <= RIGHT_DRAWER_DROP_ZONE.maxY;

      const isStorable =
        id === 'stackOfTales' ||
        id === 'envelope' ||
        id === 'journal' ||
        id === 'ink' ||
        id === 'quill';

      if (isOverLeft && isStorable) {
        // STORE INSIDE LEFT DRAWER!
        sound.playCuteInteraction();
        sound.playPaperTurn();

        setItems((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            inDrawer: 'left',
          },
        }));

        setStoredFeedback(`${getReadableItemName(id)} stored in left drawer ✦`);
        setTimeout(() => setStoredFeedback(null), 2500);

        if (wasLeftClosed) {
          leftAutoCloseTimerRef.current = setTimeout(() => {
            setIsLeftDrawerOpen(false);
            sound.playDrawerClose();
          }, 650);
        }
      } else if (isOverRight && isStorable) {
        // STORE INSIDE RIGHT DRAWER!
        sound.playCuteInteraction();
        sound.playPaperTurn();

        setItems((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            inDrawer: 'right',
          },
        }));

        setStoredFeedback(`${getReadableItemName(id)} stored in right drawer ✦`);
        setTimeout(() => setStoredFeedback(null), 2500);

        if (wasRightClosed) {
          rightAutoCloseTimerRef.current = setTimeout(() => {
            setIsRightDrawerOpen(false);
            sound.playDrawerClose();
          }, 650);
        }
      } else {
        // CLAMP TO DESK TABLETOP BOUNDS
        const clampedX = Math.max(DESK_BOUNDS.minX, Math.min(DESK_BOUNDS.maxX, finalX));
        const clampedY = Math.max(DESK_BOUNDS.minY, Math.min(DESK_BOUNDS.maxY, finalY));

        setItems((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            x: clampedX,
            y: clampedY,
          },
        }));

        sound.playCuteInteraction();

        // Close any auto-opened drawers if user dragged away
        if (wasLeftClosed && isLeftDrawerOpen) {
          leftAutoCloseTimerRef.current = setTimeout(() => {
            setIsLeftDrawerOpen(false);
            sound.playDrawerClose();
          }, 300);
        }
        if (wasRightClosed && isRightDrawerOpen) {
          rightAutoCloseTimerRef.current = setTimeout(() => {
            setIsRightDrawerOpen(false);
            sound.playDrawerClose();
          }, 300);
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    getSvgPoint,
    isLeftDrawerOpen,
    isRightDrawerOpen,
    isCraneFound,
    onDiscoverHiddenItem,
    onOpenJournal,
    onOpenLetter,
    onSipTea,
    onTapFigurine,
    onToggleLamp,
  ]);

  // Toggle Left Drawer:
  const handleToggleLeftDrawer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (draggingId) return;

    if (!isLeftDrawerOpen) {
      sound.playDrawerOpen();
      setIsLeftDrawerOpen(true);
    } else {
      sound.playDrawerClose();
      setIsLeftDrawerOpen(false);
    }
  };

  // Toggle Right Drawer:
  const handleToggleRightDrawer = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (draggingId) return;

    if (!isRightDrawerOpen) {
      sound.playDrawerOpen();
      setIsRightDrawerOpen(true);
      if (!isStampFound) {
        onDiscoverHiddenItem('vintage_stamp');
      }
    } else {
      sound.playDrawerClose();
      setIsRightDrawerOpen(false);
    }
  };

  // Return stored item to desk:
  const handleTakeOutItem = (id: DeskItemId, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playPaperTurn();
    sound.playCuteInteraction();

    const returnCoords: Record<DeskItemId, { x: number; y: number }> = {
      stackOfTales: { x: 70, y: 28 },
      envelope: { x: 315, y: 28 },
      journal: { x: 144, y: 58 },
      ink: { x: 276, y: 72 },
      quill: { x: 308, y: 64 },
      mug: { x: 274, y: 22 },
      lamp: { x: 42, y: 32 },
    };

    const targetPos = returnCoords[id];

    setItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: targetPos.x,
        y: targetPos.y,
        inDrawer: false,
      },
    }));

    setStoredFeedback(`${getReadableItemName(id)} placed on desk ✦`);
    setTimeout(() => setStoredFeedback(null), 2000);
  };

  const leftStoredItems = Object.values(items).filter((item) => item.inDrawer === 'left');
  const rightStoredItems = Object.values(items).filter((item) => item.inDrawer === 'right');

  const handleWaterVase = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCuteInteraction();
    setBloomSparkles(true);
    setTimeout(() => setBloomSparkles(false), 1800);
    onWaterPlant();
  };

  return (
    <div className="relative w-full select-none">
      {/* DESK CONTAINER WITH LEFT VASE AND MAIN TABLE */}
      <div className="relative flex items-end justify-center w-full max-w-[530px] mx-auto">
        {/* Action Feedback Banner */}
        {storedFeedback && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#271912]/95 border-2 border-[#d97706] text-[#fef08a] text-[11px] font-serif shadow-2xl z-50 animate-in fade-in zoom-in-95 flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="font-bold">{storedFeedback}</span>
          </div>
        )}

        {/* Diegetic Tooltip */}
        {activeTooltip && !draggingId && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-[#271912]/95 border border-[#855335] text-[#fde047] text-[11px] font-serif shadow-xl whitespace-nowrap pointer-events-none z-50 animate-in fade-in zoom-in-95 tracking-wide">
            <span className="text-amber-400 mr-1.5 font-bold">✦</span>
            {activeTooltip}
          </div>
        )}

        {/* ========================================================== */}
        {/* LEFT: TALL PLUM BLOSSOM CERAMIC VASE */}
        {/* ========================================================== */}
        <div
          onClick={handleWaterVase}
          onMouseEnter={() => setActiveTooltip('Plum Blossom Vase')}
          onMouseLeave={() => setActiveTooltip(null)}
          className="relative z-20 cursor-pointer group flex flex-col items-center mr-1 mb-2 shrink-0 transition-transform active:scale-95"
          title="Plum Blossom Vase"
        >
          {bloomSparkles && (
            <div className="absolute -top-4 inset-x-0 flex justify-center gap-1 pointer-events-none animate-bounce">
              <Sparkles className="w-4 h-4 text-pink-300" />
            </div>
          )}

          <svg viewBox="0 0 72 160" className="w-14 sm:w-16 h-36 sm:h-42 overflow-visible drop-shadow-md">
            <ellipse cx="36" cy="154" rx="20" ry="5" fill="rgba(0,0,0,0.45)" />
            <path d="M 36 90 L 36 30" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 36 60 L 22 48" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 36 72 L 50 62" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />

            <g transform="translate(36, 26)">
              <circle cx="0" cy="0" r="13" fill="#f43f5e" opacity="0.95" />
              <circle cx="-5" cy="-5" r="7.5" fill="#fda4af" />
              <circle cx="5" cy="-5" r="7.5" fill="#fda4af" />
              <circle cx="0" cy="5" r="7.5" fill="#fda4af" />
              <circle cx="0" cy="0" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            </g>

            <g transform="translate(20, 48)">
              <circle cx="0" cy="0" r="10" fill="#f43f5e" opacity="0.95" />
              <circle cx="0" cy="0" r="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            </g>

            <g transform="translate(52, 60)">
              <circle cx="0" cy="0" r="11" fill="#f43f5e" opacity="0.95" />
              <circle cx="0" cy="0" r="3" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            </g>

            {plantBloomed && (
              <g transform="translate(36, 68)">
                <circle cx="0" cy="0" r="9.5" fill="#f43f5e" />
                <circle cx="0" cy="0" r="2.8" fill="#fef08a" />
              </g>
            )}

            <path
              d="M 18 152 C 14 115 12 95 36 95 C 60 95 58 115 54 152 Z"
              fill="url(#vaseCeramicGrad)"
              stroke="#581c87"
              strokeWidth="2.5"
            />
            <ellipse cx="36" cy="95" rx="14" ry="4" fill="#a855f7" stroke="#581c87" strokeWidth="2" />
            <ellipse cx="36" cy="95" rx="11" ry="2.5" fill="#3b0764" />
            <ellipse cx="36" cy="151" rx="18" ry="4" fill="#6b21a8" opacity="0.6" />
            <path d="M 22 108 C 26 128 26 142 28 148" stroke="#e9d5ff" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
            <ellipse cx="36" cy="122" rx="4.5" ry="4.5" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
            <path d="M 36 117 L 36 127 M 31 122 L 41 122" stroke="#ca8a04" strokeWidth="1" />
          </svg>
        </div>

        {/* ========================================================== */}
        {/* MAIN ARTISAN STUDY DESK SVG STAGE */}
        {/* ========================================================== */}
        <div className="relative flex-1 max-w-[460px]">
          <svg
            ref={svgRef}
            viewBox="0 0 380 230"
            className="w-full h-auto overflow-visible drop-shadow-2xl"
          >
            <defs>
              <linearGradient id="tabletopWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c27d49" />
                <stop offset="25%" stopColor="#b46f3d" />
                <stop offset="70%" stopColor="#9c5b2e" />
                <stop offset="100%" stopColor="#7a421d" />
              </linearGradient>

              <linearGradient id="apronWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#723916" />
                <stop offset="100%" stopColor="#4a220b" />
              </linearGradient>

              <linearGradient id="drawerWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#964e21" />
                <stop offset="100%" stopColor="#673111" />
              </linearGradient>

              <linearGradient id="drawerInterior" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#291206" />
                <stop offset="100%" stopColor="#1a0b03" />
              </linearGradient>

              <linearGradient id="legWood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#542409" />
                <stop offset="100%" stopColor="#301404" />
              </linearGradient>

              <linearGradient id="vaseCeramicGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7e22ce" />
                <stop offset="40%" stopColor="#a855f7" />
                <stop offset="75%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#581c87" />
              </linearGradient>
            </defs>

            {/* 1. SOLID DESK LEGS */}
            <rect x="22" y="148" width="22" height="74" fill="url(#legWood)" stroke="#3a1806" strokeWidth="2" />
            <rect x="334" y="148" width="22" height="74" fill="url(#legWood)" stroke="#3a1806" strokeWidth="2" />
            <rect x="20" y="220" width="26" height="6" fill="#240c03" rx="1.5" />
            <rect x="332" y="220" width="26" height="6" fill="#240c03" rx="1.5" />
            <rect x="24" y="206" width="332" height="10" fill="#4a1f07" stroke="#240c03" strokeWidth="1" />

            {/* 2. TABLETOP (Warm wooden slab with planks) */}
            <rect
              x="8"
              y="14"
              width="364"
              height="128"
              rx="3"
              fill="url(#tabletopWood)"
              stroke="#542409"
              strokeWidth="2.5"
            />
            {/* Top Edge Bevel Highlight */}
            <path d="M 9 16 L 371 16" stroke="#e09459" strokeWidth="2.5" strokeLinecap="round" />

            {/* Planks lines */}
            <path d="M 8 48 L 372 48" stroke="#753811" strokeWidth="1.8" />
            <path d="M 8 50 L 372 50" stroke="#d48348" strokeWidth="0.8" opacity="0.6" />
            <path d="M 8 86 L 372 86" stroke="#753811" strokeWidth="1.8" />
            <path d="M 8 88 L 372 88" stroke="#d48348" strokeWidth="0.8" opacity="0.6" />
            <path d="M 8 122 L 372 122" stroke="#753811" strokeWidth="1.8" />
            <path d="M 8 124 L 372 124" stroke="#d48348" strokeWidth="0.8" opacity="0.6" />

            {/* Natural wood grain flecks */}
            <path d="M 40 32 H 80 M 160 38 H 210 M 290 30 H 330" stroke="#874316" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 70 70 H 120 M 240 66 H 310" stroke="#874316" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 30 106 H 90 M 210 102 H 260 M 320 110 H 350" stroke="#874316" strokeWidth="1.5" strokeLinecap="round" />

            {/* 3. DESK FRONT APRON */}
            <rect x="8" y="142" width="364" height="42" fill="url(#apronWood)" stroke="#4a1f07" strokeWidth="2" />

            {/* ========================================================== */}
            {/* LEFT DRAWER: INTERACTIVE OPEN/CLOSE & STORAGE TRAY */}
            {/* ========================================================== */}
            {/* Left Cavity */}
            <rect
              x="22"
              y="148"
              width="156"
              height="30"
              fill="url(#drawerInterior)"
              stroke="#4a1f07"
              strokeWidth="1.5"
            />
            {/* Left Dropzone Glow */}
            {leftDrawerHighlight && (
              <rect
                x="20"
                y="146"
                width="160"
                height={isLeftDrawerOpen ? 48 : 34}
                rx="3"
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className="animate-pulse"
              />
            )}
            {/* Left Interior Tray */}
            {isLeftDrawerOpen && (
              <g id="left-drawer-tray">
                <rect x="24" y="148" width="5" height="24" fill="#5c2c10" />
                <rect x="171" y="148" width="5" height="24" fill="#5c2c10" />
                <rect x="29" y="150" width="142" height="20" rx="1" fill="#fef3c7" opacity="0.9" />
              </g>
            )}
            {/* Left Drawer Face & Golden Pull (Interactive Tap) */}
            <g
              onClick={handleToggleLeftDrawer}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
              }}
              className="cursor-pointer group/left-drawer"
            >
              <title>{isLeftDrawerOpen ? 'Tap to close left drawer' : 'Tap to open left drawer'}</title>
              {/* Invisible touch/click hitbox covering the entire drawer zone */}
              <rect
                x="18"
                y={isLeftDrawerOpen ? 165 : 145}
                width="164"
                height="40"
                fill="transparent"
                pointerEvents="all"
              />
              <rect
                x="22"
                y={isLeftDrawerOpen ? 168 : 148}
                width="156"
                height="32"
                rx="1.5"
                fill="url(#drawerWood)"
                stroke="#542409"
                strokeWidth="1.5"
                className="transition-all duration-300"
              />
              <rect
                x="86"
                y={isLeftDrawerOpen ? 178 : 158}
                width="28"
                height="11"
                rx="2"
                fill="#facc15"
                stroke="#a16207"
                strokeWidth="1.2"
                className="transition-all duration-300"
              />
              <rect
                x="91"
                y={isLeftDrawerOpen ? 181 : 161}
                width="18"
                height="5"
                rx="1"
                fill="#ca8a04"
                className="transition-all duration-300"
              />
            </g>

            {/* ========================================================== */}
            {/* RIGHT DRAWER: INTERACTIVE OPEN/CLOSE & STORAGE TRAY */}
            {/* ========================================================== */}
            {/* Right Cavity */}
            <rect
              x="202"
              y="148"
              width="156"
              height="30"
              fill="url(#drawerInterior)"
              stroke="#4a1f07"
              strokeWidth="1.5"
            />
            {/* Right Dropzone Glow */}
            {rightDrawerHighlight && (
              <rect
                x="200"
                y="146"
                width="160"
                height={isRightDrawerOpen ? 48 : 34}
                rx="3"
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className="animate-pulse"
              />
            )}
            {/* Right Interior Tray */}
            {isRightDrawerOpen && (
              <g id="right-drawer-tray">
                <rect x="204" y="148" width="5" height="24" fill="#5c2c10" />
                <rect x="351" y="148" width="5" height="24" fill="#5c2c10" />
                <rect x="209" y="150" width="142" height="20" rx="1" fill="#fef3c7" opacity="0.9" />

                {/* Secret vintage stamp collectible gleam */}
                {!isStampFound && (
                  <g
                    onClick={(e) => {
                      e.stopPropagation();
                      onDiscoverHiddenItem('vintage_stamp');
                    }}
                    className="cursor-pointer group/stamp"
                  >
                    <rect x="334" y="153" width="14" height="14" rx="1" fill="#fee2e2" stroke="#ef4444" strokeWidth="0.8" />
                    <circle cx="341" cy="160" r="3" fill="#f87171" className="animate-pulse" />
                  </g>
                )}
              </g>
            )}
            {/* Right Drawer Face & Golden Pull (Interactive Tap) */}
            <g
              onClick={handleToggleRightDrawer}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
              }}
              className="cursor-pointer group/right-drawer"
            >
              <title>{isRightDrawerOpen ? 'Tap to close right drawer' : 'Tap to open right drawer'}</title>
              {/* Invisible touch/click hitbox covering the entire drawer zone */}
              <rect
                x="198"
                y={isRightDrawerOpen ? 165 : 145}
                width="164"
                height="40"
                fill="transparent"
                pointerEvents="all"
              />
              <rect
                x="202"
                y={isRightDrawerOpen ? 168 : 148}
                width="156"
                height="32"
                rx="1.5"
                fill="url(#drawerWood)"
                stroke="#542409"
                strokeWidth="1.5"
                className="transition-all duration-300"
              />
              <rect
                x="266"
                y={isRightDrawerOpen ? 178 : 158}
                width="28"
                height="11"
                rx="2"
                fill="#facc15"
                stroke="#a16207"
                strokeWidth="1.2"
                className="transition-all duration-300"
              />
              <rect
                x="271"
                y={isRightDrawerOpen ? 181 : 161}
                width="18"
                height="5"
                rx="1"
                fill="#ca8a04"
                className="transition-all duration-300"
              />
            </g>

            {/* ========================================================== */}
            {/* 4. TABLETOP FREELY POSITIONED DRAGGABLE OBJECTS */}
            {/* ========================================================== */}

            {/* OBJECT A: STACK OF TALES */}
            {!items.stackOfTales.inDrawer && (
              <g
                id="obj-stackOfTales"
                transform={`translate(${items.stackOfTales.x - 68}, ${items.stackOfTales.y - 24})`}
                onPointerDown={(e) => handleItemPointerDown(e, 'stackOfTales')}
                onMouseEnter={() => setActiveTooltip('Stack of Tales (Drag to move or store in drawer)')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`cursor-grab active:cursor-grabbing group/books ${
                  draggingId === 'stackOfTales' ? 'filter drop-shadow-xl' : 'hover:scale-[1.02]'
                } transition-transform duration-75`}
              >
                <rect x="68" y="58" width="76" height="18" rx="2" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.2" />
                <rect x="74" y="61" width="68" height="12" fill="#fef3c7" />
                <rect x="68" y="44" width="76" height="16" rx="2" fill="#166534" stroke="#14532d" strokeWidth="1.2" />
                <rect x="74" y="47" width="68" height="10" fill="#fef3c7" />
                <rect x="76" y="24" width="64" height="22" rx="2" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
                <rect x="85" y="28" width="46" height="14" fill="none" stroke="#facc15" strokeWidth="1.5" />
                <rect x="94" y="32" width="28" height="6" fill="#991b1b" stroke="#facc15" strokeWidth="1" />
              </g>
            )}

            {/* OBJECT B: MUSHROOM LAMP */}
            {!items.lamp.inDrawer && (
              <g
                id="obj-lamp"
                transform={`translate(${items.lamp.x - 42}, ${items.lamp.y - 30})`}
                onPointerDown={(e) => handleItemPointerDown(e, 'lamp')}
                onMouseEnter={() => setActiveTooltip('Mushroom Lamp (Tap to toggle, drag to move)')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`cursor-grab active:cursor-grabbing group/lamp ${
                  draggingId === 'lamp' ? 'filter drop-shadow-xl' : 'hover:scale-105'
                } transition-transform duration-75`}
              >
                <ellipse cx="66" cy="85" rx="20" ry="4.5" fill="rgba(0,0,0,0.32)" />

                {lampOn && (
                  <g className="pointer-events-none">
                    <polygon points="44,56 88,56 112,89 20,89" fill="rgba(254, 240, 138, 0.26)" />
                    <ellipse cx="66" cy="86" rx="42" ry="7" fill="rgba(254, 240, 138, 0.22)" />
                  </g>
                )}

                <path d="M 52 84 C 52 76 80 76 80 84 Z" fill="#fefce8" stroke="#ca8a04" strokeWidth="1.4" />
                <ellipse cx="66" cy="84" rx="14" ry="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                <circle cx="66" cy="79.5" r="2.2" fill={lampOn ? '#f59e0b' : '#a8a29e'} stroke="#78350f" strokeWidth="0.6" />
                {lampOn && <circle cx="66" cy="79.5" r="1" fill="#ffffff" />}

                <rect x="64.5" y="52" width="3" height="26" rx="1.5" fill="#ca8a04" stroke="#a16207" strokeWidth="0.8" />
                <path d="M 42 56 C 42 30 90 30 90 56 Z" fill={lampOn ? '#fef08a' : '#fffbeb'} stroke="#d97706" strokeWidth="1.6" />
                <ellipse cx="66" cy="56" rx="24" ry="4" fill={lampOn ? '#fde047' : '#fef3c7'} stroke="#d97706" strokeWidth="1.3" />

                {lampOn ? (
                  <g className="animate-pulse">
                    <ellipse cx="66" cy="57" rx="14" ry="4" fill="#ffffff" />
                    <circle cx="66" cy="57" r="3.5" fill="#ffffff" />
                  </g>
                ) : (
                  <ellipse cx="66" cy="57" rx="7" ry="2" fill="#d6d3d1" />
                )}
              </g>
            )}

            {/* OBJECT C: OPEN RAIN JOURNAL */}
            {!items.journal.inDrawer && (
              <g
                id="obj-journal"
                transform={`translate(${items.journal.x - 144}, ${items.journal.y - 58})`}
                onPointerDown={(e) => handleItemPointerDown(e, 'journal')}
                onMouseEnter={() => setActiveTooltip('Rain Journal (Tap to read, drag to move or store)')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`cursor-grab active:cursor-grabbing group/journal ${
                  draggingId === 'journal' ? 'filter drop-shadow-xl' : 'hover:scale-[1.03]'
                } transition-transform duration-75`}
              >
                <rect x="144" y="58" width="112" height="64" rx="3" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1.5" />
                <path d="M 148 62 C 168 60 196 61 200 64 L 200 118 C 196 116 168 116 148 118 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
                <path d="M 200 64 C 204 61 232 60 252 62 L 252 118 C 232 116 204 116 200 118 Z" fill="#fef9c3" stroke="#d97706" strokeWidth="0.8" />

                <line x1="156" y1="72" x2="192" y2="72" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="80" x2="192" y2="80" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="88" x2="190" y2="88" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="96" x2="186" y2="96" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="156" y1="104" x2="192" y2="104" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />

                <line x1="208" y1="72" x2="244" y2="72" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="80" x2="244" y2="80" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="88" x2="240" y2="88" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="96" x2="236" y2="96" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="208" y1="104" x2="244" y2="104" stroke="#451a03" strokeWidth="1.8" strokeLinecap="round" />

                <line x1="200" y1="58" x2="200" y2="124" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* OBJECT D: CUTE TEA MUG (Disappears from desk when Mimi picks it up to sip!) */}
            {!items.mug.inDrawer && (
              isMimiHoldingMug ? (
                /* Empty coaster spot on desk while Mimi is holding and sipping the mug */
                <g id="mug-saucer-spot" transform={`translate(${items.mug.x - 274}, ${items.mug.y - 20})`}>
                  <ellipse cx="290" cy="56" rx="16" ry="4" fill="rgba(0,0,0,0.18)" stroke="#ea580c" strokeWidth="1" strokeDasharray="3 2" />
                  <ellipse cx="290" cy="56" rx="9" ry="2.2" fill="none" stroke="#ea580c" strokeWidth="0.8" opacity="0.6" />
                </g>
              ) : (
                /* The Ceramic Mug on the Desk */
                <g
                  id="obj-mug"
                  transform={`translate(${items.mug.x - 274}, ${items.mug.y - 20})`}
                  onPointerDown={(e) => handleItemPointerDown(e, 'mug')}
                  onMouseEnter={() => setActiveTooltip('Cute Tea Mug (Tap for Mimi to pick up & sip!)')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className={`cursor-grab active:cursor-grabbing group/mug ${
                    draggingId === 'mug' ? 'filter drop-shadow-xl' : 'hover:scale-105'
                  } transition-transform duration-75`}
                >
                  <ellipse cx="290" cy="56" rx="18" ry="4" fill="rgba(0,0,0,0.3)" />
                  <rect x="274" y="24" width="32" height="31" rx="7" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.4" />
                  <path d="M 276 52 C 280 55 300 55 304 52" stroke="#ea580c" strokeWidth="1" fill="none" opacity="0.6" />

                  <path d="M 283 37 Q 286 34 289 37" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                  <path d="M 293 37 Q 296 34 299 37" stroke="#7c2d12" strokeWidth="1.4" strokeLinecap="round" fill="none" />
                  <path d="M 289.5 41 Q 291 43 292.5 41" stroke="#7c2d12" strokeWidth="1.3" strokeLinecap="round" fill="none" />
                  <circle cx="280.5" cy="39" r="1.8" fill="#fb7185" opacity="0.7" />
                  <circle cx="301.5" cy="39" r="1.8" fill="#fb7185" opacity="0.7" />

                  <path d="M 306 28 C 316 28 316 46 306 46" stroke="#ea580c" strokeWidth="3.2" fill="none" strokeLinecap="round" />

                  <ellipse cx="290" cy="24" rx="15" ry="4.5" fill="#78350f" stroke="#ea580c" strokeWidth="1.2" />
                  <ellipse cx="290" cy="24" rx="13" ry="3.2" fill="#fef08a" />
                  <path d="M 290 22.5 C 288 20 285.5 22.5 290 25.5 C 294.5 22.5 292 20 290 22.5 Z" fill="#c2410c" opacity="0.8" />

                  {currentTea && (
                    <g className="animate-pulse">
                      <path d="M 286 16 C 284 10 288 6 286 2" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.75" />
                      <path d="M 294 14 C 296 9 292 5 295 1" stroke="#ffffff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.65" />
                    </g>
                  )}
                </g>
              )
            )}

            {/* OBJECT E: WAX-SEALED ENVELOPE */}
            {!items.envelope.inDrawer && (
              <g
                id="obj-envelope"
                transform={`translate(${items.envelope.x - 320}, ${items.envelope.y - 24})`}
                onPointerDown={(e) => handleItemPointerDown(e, 'envelope')}
                onMouseEnter={() => setActiveTooltip('Wax-Sealed Letter (Tap to read, drag to move or store)')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`cursor-grab active:cursor-grabbing group/letter ${
                  draggingId === 'envelope' ? 'filter drop-shadow-xl' : 'hover:scale-105'
                } transition-transform duration-75`}
              >
                <rect x="320" y="24" width="50" height="34" rx="2" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.2" />
                <line x1="320" y1="24" x2="345" y2="40" stroke="#ea580c" strokeWidth="1.2" />
                <line x1="370" y1="24" x2="345" y2="40" stroke="#ea580c" strokeWidth="1.2" />
                <line x1="320" y1="58" x2="338" y2="42" stroke="#ea580c" strokeWidth="0.8" opacity="0.6" />
                <line x1="370" y1="58" x2="352" y2="42" stroke="#ea580c" strokeWidth="0.8" opacity="0.6" />

                <circle cx="345" cy="40" r="5.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
                <circle cx="345" cy="40" r="2.8" fill="#ef4444" />
              </g>
            )}

            {/* OBJECT F: GLASS INKWELL */}
            {!items.ink.inDrawer && (
              <g
                id="obj-ink"
                transform={`translate(${items.ink.x - 278}, ${items.ink.y - 70})`}
                onPointerDown={(e) => handleItemPointerDown(e, 'ink')}
                onMouseEnter={() => setActiveTooltip('Glass Inkwell (Drag to move or store in drawer)')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`cursor-grab active:cursor-grabbing group/ink ${
                  draggingId === 'ink' ? 'filter drop-shadow-xl' : 'hover:scale-105'
                } transition-transform duration-75`}
              >
                <ellipse cx="286" cy="88" rx="10" ry="3.5" fill="rgba(0,0,0,0.3)" />
                <path d="M 280 86 L 278 76 L 284 72 L 288 72 L 294 76 L 292 86 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
                <path d="M 281 78 L 283 84" stroke="#93c5fd" strokeWidth="1.2" strokeLinecap="round" />
                <rect x="283" y="70" width="6" height="3" fill="#b45309" rx="0.5" />
              </g>
            )}

            {/* OBJECT G: WHITE FEATHER QUILL PEN */}
            {!items.quill.inDrawer && (
              <g
                id="obj-quill"
                transform={`translate(${items.quill.x - 310}, ${items.quill.y - 62})`}
                onPointerDown={(e) => handleItemPointerDown(e, 'quill')}
                onMouseEnter={() => setActiveTooltip('Feather Pen (Drag to move or store in drawer)')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`cursor-grab active:cursor-grabbing group/quill ${
                  draggingId === 'quill' ? 'filter drop-shadow-xl' : 'hover:scale-105'
                } transition-transform duration-75`}
              >
                <line x1="316" y1="62" x2="316" y2="104" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                <polygon points="314,103 318,103 316,108" fill="#0f172a" />
                <path d="M 316 64 C 310 68 310 82 316 92 C 322 82 322 68 316 64 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="312" y1="72" x2="316" y2="74" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="312" y1="80" x2="316" y2="82" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="320" y1="72" x2="316" y2="74" stroke="#cbd5e1" strokeWidth="1" />
                <line x1="320" y1="80" x2="316" y2="82" stroke="#cbd5e1" strokeWidth="1" />
              </g>
            )}
          </svg>

          {/* ========================================================== */}
          {/* LEFT DRAWER KEEPSAKES STORAGE INVENTORY POPUP */}
          {/* ========================================================== */}
          {isLeftDrawerOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute -bottom-16 sm:-bottom-18 left-2 sm:left-4 z-40 bg-[#fdfaf5]/98 text-[#3d2716] rounded-2xl p-2.5 sm:p-3 border-2 border-[#b58c63] shadow-[0_8px_24px_rgba(0,0,0,0.5),0_3px_0_#8c6742] animate-in fade-in slide-in-from-top-2 w-[220px] sm:w-[250px]"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#e6d8c3]">
                <div className="flex items-center gap-1.5 text-xs font-serif font-black text-[#5c3a21]">
                  <Archive className="w-3.5 h-3.5 text-amber-700" />
                  <span>Left Drawer ({leftStoredItems.length})</span>
                </div>
                <button
                  onClick={() => {
                    setIsLeftDrawerOpen(false);
                    sound.playDrawerClose();
                  }}
                  className="text-[10px] font-serif font-bold text-[#92400e] hover:underline"
                >
                  Close ✕
                </button>
              </div>

              {leftStoredItems.length === 0 ? (
                <p className="text-[10px] font-serif text-[#8c6b4b] italic py-1 text-center leading-tight">
                  Left drawer is empty. Drag books, letter, journal, ink, or pen here to store!
                </p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {leftStoredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-1.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] shadow-xs text-xs font-serif"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {/* Authentic SVG miniature artwork - ZERO EMOJIS */}
                        <ItemArtworkThumbnail id={item.id} />
                        <span className="font-bold text-[#5c3a21] truncate text-[11px]">
                          {getReadableItemName(item.id)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.id === 'envelope' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLetter();
                            }}
                            className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-[#78350f] text-[9px] font-bold border border-amber-300"
                            title="Read Letter"
                          >
                            Read
                          </button>
                        )}
                        {item.id === 'journal' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenJournal();
                            }}
                            className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-[#78350f] text-[9px] font-bold border border-amber-300"
                            title="Open Journal"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={(e) => handleTakeOutItem(item.id, e)}
                          className="px-1.5 py-0.5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-white text-[9px] font-bold border-b border-[#b45309] shadow-xs"
                          title="Place back on desk"
                        >
                          Take Out
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================== */}
          {/* RIGHT DRAWER KEEPSAKES STORAGE INVENTORY POPUP */}
          {/* ========================================================== */}
          {isRightDrawerOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute -bottom-16 sm:-bottom-18 right-2 sm:right-4 z-40 bg-[#fdfaf5]/98 text-[#3d2716] rounded-2xl p-2.5 sm:p-3 border-2 border-[#b58c63] shadow-[0_8px_24px_rgba(0,0,0,0.5),0_3px_0_#8c6742] animate-in fade-in slide-in-from-top-2 w-[220px] sm:w-[250px]"
            >
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#e6d8c3]">
                <div className="flex items-center gap-1.5 text-xs font-serif font-black text-[#5c3a21]">
                  <Archive className="w-3.5 h-3.5 text-amber-700" />
                  <span>Right Drawer ({rightStoredItems.length})</span>
                </div>
                <button
                  onClick={() => {
                    setIsRightDrawerOpen(false);
                    sound.playDrawerClose();
                  }}
                  className="text-[10px] font-serif font-bold text-[#92400e] hover:underline"
                >
                  Close ✕
                </button>
              </div>

              {rightStoredItems.length === 0 ? (
                <p className="text-[10px] font-serif text-[#8c6b4b] italic py-1 text-center leading-tight">
                  Right drawer is empty. Drag books, letter, journal, ink, or pen here to store!
                </p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {rightStoredItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-1.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] shadow-xs text-xs font-serif"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {/* Authentic SVG miniature artwork - ZERO EMOJIS */}
                        <ItemArtworkThumbnail id={item.id} />
                        <span className="font-bold text-[#5c3a21] truncate text-[11px]">
                          {getReadableItemName(item.id)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {item.id === 'envelope' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenLetter();
                            }}
                            className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-[#78350f] text-[9px] font-bold border border-amber-300"
                            title="Read Letter"
                          >
                            Read
                          </button>
                        )}
                        {item.id === 'journal' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenJournal();
                            }}
                            className="px-1.5 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-[#78350f] text-[9px] font-bold border border-amber-300"
                            title="Open Journal"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={(e) => handleTakeOutItem(item.id, e)}
                          className="px-1.5 py-0.5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-white text-[9px] font-bold border-b border-[#b45309] shadow-xs"
                          title="Place back on desk"
                        >
                          Take Out
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
