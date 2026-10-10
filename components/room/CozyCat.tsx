'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CatState, CatLocation } from '@/types/game';
import { sound } from '@/lib/audio';
import { Heart, Sparkles } from 'lucide-react';
import { MochiCatSprite } from '@/components/room/MochiCatSprite';

interface CozyCatProps {
  onPet: () => void;
  petCount: number;
  curtainsOpen?: boolean;
  reducedMotion?: boolean;
  onCatDialogue?: (text: string) => void;
}

interface CatCoordinates {
  left: string;
  top: string;
  zIndex: number;
  transition: string;
}

// Key physical positions in room coordinates:
const POS_BED: CatCoordinates = {
  left: '42px',
  top: '675px',
  zIndex: 25,
  transition: 'left 2.0s linear, top 2.0s linear',
};

const POS_FLOOR_DESK_BASE: CatCoordinates = {
  left: '165px',
  top: '675px',
  zIndex: 25,
  transition: 'left 2.2s linear, top 2.2s linear',
};

const POS_DESK_LEFT: CatCoordinates = {
  left: '205px',
  top: '355px',
  zIndex: 35,
  transition: 'left 1.2s cubic-bezier(0.22, 1, 0.36, 1), top 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
};

const POS_DESK_RIGHT: CatCoordinates = {
  left: '260px',
  top: '355px',
  zIndex: 35,
  transition: 'left 1.8s linear, top 1.8s linear',
};

// Window sill: firmly perched on the window sill ledge, 100% visible above desk
const POS_WINDOW_SILL: CatCoordinates = {
  left: '235px',
  top: '190px',
  zIndex: 35,
  transition: 'left 1.2s cubic-bezier(0.22, 1, 0.36, 1), top 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
};

export const CozyCat: React.FC<CozyCatProps> = ({
  onPet,
  petCount,
  curtainsOpen = true,
  reducedMotion = false,
  onCatDialogue,
}) => {
  const [catState, setCatState] = useState<CatState>('SLEEPING');
  const [catLocation, setCatLocation] = useState<CatLocation>('BED');
  const [facing, setFacing] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [coords, setCoords] = useState<CatCoordinates>(POS_BED);
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isBusy, setIsBusy] = useState(false);

  const prevCurtainsOpenRef = useRef(curtainsOpen);
  const isBusyRef = useRef(isBusy);

  useEffect(() => {
    isBusyRef.current = isBusy;
  }, [isBusy]);

  // =========================================================================
  // JOURNEY: BED -> WALK -> JUMP TO DESK -> WALK ACROSS DESK -> JUMP TO WINDOW
  // =========================================================================
  const travelToWindow = useCallback(() => {
    if (isBusyRef.current || !curtainsOpen) return;
    setIsBusy(true);

    // Step 1: Wake up & stretch in bed
    setCatState('WAKING_UP');
    setFacing('RIGHT');
    sound.playCatMeow();

    setTimeout(() => {
      setCatState('STRETCHING');

      // Step 2: Step out of bed and walk across the floor to the desk base
      setTimeout(() => {
        setCatState('WALKING');
        setCatLocation('BED');
        setCoords({ ...POS_FLOOR_DESK_BASE, transition: 'left 2.2s linear, top 2.2s linear' });

        // Step 3: Arrive at desk base, pause and crouch to wind up leap
        setTimeout(() => {
          setCatState('STRETCHING'); // low crouch posture

          // Step 4: Spring up onto desk in a graceful leap arc
          setTimeout(() => {
            setCatState('JUMPING_UP');
            setCatLocation('DESK');
            setCoords({
              ...POS_DESK_LEFT,
              transition: 'left 1.2s cubic-bezier(0.22, 1, 0.36, 1), top 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
            });

            // Step 5: Land softly on desk
            setTimeout(() => {
              sound.playCatJump();
              setCatState('SITTING');

              // Step 6: Walk across desk tabletop towards window ledge
              setTimeout(() => {
                setCatState('WALKING');
                setCoords({ ...POS_DESK_RIGHT, transition: 'left 1.8s linear, top 1.8s linear' });

                // Step 7: Reach desk edge, crouch and prepare window leap
                setTimeout(() => {
                  setCatState('STRETCHING');

                  // Step 8: Spring up onto the wooden window sill!
                  setTimeout(() => {
                    setCatState('JUMPING_UP');
                    setCatLocation('WINDOW_SILL');
                    setCoords({
                      ...POS_WINDOW_SILL,
                      transition: 'left 1.2s cubic-bezier(0.22, 1, 0.36, 1), top 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
                    });

                    // Step 9: Land safely on window sill, turn toward glass, watch rain
                    setTimeout(() => {
                      sound.playCatJump();
                      sound.playCatPurr();
                      setCatState('WATCHING_WINDOW');
                      setFacing('RIGHT');
                      setIsBusy(false);
                      onCatDialogue?.('Mochi walked across the room, hopped on the desk, and nestled by the rainy window.');
                    }, 1200);
                  }, 600);
                }, 1800);
              }, 800);
            }, 1200);
          }, 600);
        }, 2200);
      }, 900);
    }, 800);
  }, [curtainsOpen, onCatDialogue]);

  // =========================================================================
  // JOURNEY: WINDOW SILL -> JUMP DOWN TO DESK -> WALK -> JUMP DOWN TO BED
  // =========================================================================
  const returnToBed = useCallback(() => {
    if (isBusyRef.current) return;
    setIsBusy(true);

    sound.playCatMeow();
    // Step 1: Turn around on window sill
    setCatState('SITTING');
    setFacing('LEFT');

    setTimeout(() => {
      // Step 2: Jump down to desk surface
      setCatState('JUMPING_DOWN');
      setCatLocation('DESK');
      setCoords({
        ...POS_DESK_RIGHT,
        transition: 'left 1.1s cubic-bezier(0.25, 1, 0.5, 1), top 1.1s cubic-bezier(0.25, 1, 0.5, 1)',
      });

      setTimeout(() => {
        sound.playCatJump();
        setCatState('SITTING');

        // Step 3: Walk across desk to the left edge
        setTimeout(() => {
          setCatState('WALKING');
          setFacing('LEFT');
          setCoords({ ...POS_DESK_LEFT, transition: 'left 1.8s linear, top 1.8s linear' });

          // Step 4: Leap down to floor
          setTimeout(() => {
            setCatState('JUMPING_DOWN');
            setCoords({
              ...POS_FLOOR_DESK_BASE,
              transition: 'left 1.1s cubic-bezier(0.25, 1, 0.5, 1), top 1.1s cubic-bezier(0.25, 1, 0.5, 1)',
            });

            setTimeout(() => {
              sound.playCatJump();
              // Step 5: Walk back into plush bed
              setCatState('WALKING');
              setFacing('LEFT');
              setCoords({ ...POS_BED, transition: 'left 2.0s linear, top 2.0s linear' });

              setTimeout(() => {
                // Step 6: Step in, turn, curl up and sleep
                setCatLocation('BED');
                setFacing('RIGHT');
                setCatState('SITTING');
                sound.playCatPurr();

                setTimeout(() => {
                  setCatState('SLEEPING');
                  setIsBusy(false);
                  onCatDialogue?.('Mochi hopped down to the desk, strolled across the floor, and curled back in his bed.');
                }, 1200);
              }, 2000);
            }, 1100);
          }, 1800);
        }, 800);
      }, 1100);
    }, 700);
  }, [onCatDialogue]);

  // AUTOMATIC RETURN ON CURTAIN CLOSE: If curtains close while Mochi is out, he returns down!
  useEffect(() => {
    if (prevCurtainsOpenRef.current && !curtainsOpen) {
      if (catLocation === 'WINDOW_SILL' || catLocation === 'DESK') {
        returnToBed();
      }
    }
    prevCurtainsOpenRef.current = curtainsOpen;
  }, [curtainsOpen, catLocation, returnToBed]);

  // Autonomous schedule: Mochi explores window periodically when curtains are open
  useEffect(() => {
    if (reducedMotion || isBusy) return;

    const interval = setInterval(() => {
      if (catLocation === 'WINDOW_SILL') {
        const rand = Math.random();
        if (rand < 0.4) {
          setCatState('WATCHING_WINDOW');
        } else if (rand < 0.7) {
          setCatState('SITTING');
        } else if (rand < 0.88) {
          setCatState('SLEEPING');
        } else {
          returnToBed();
        }
        return;
      }

      if (catLocation === 'BED') {
        const rand = Math.random();
        if (catState === 'SLEEPING') {
          if (rand < 0.4) setCatState('WAKING_UP');
        } else if (catState === 'WAKING_UP') {
          setCatState('STRETCHING');
        } else if (catState === 'STRETCHING') {
          setCatState('SITTING');
        } else if (catState === 'SITTING') {
          if (rand < 0.45 && curtainsOpen) {
            travelToWindow();
          } else if (rand < 0.7) {
            setCatState('GROOMING');
          } else {
            setCatState('SLEEPING');
          }
        } else if (catState === 'GROOMING') {
          setCatState(rand < 0.5 ? 'SITTING' : 'SLEEPING');
        }
      }
    }, 28000 + Math.random() * 15000);

    return () => clearInterval(interval);
  }, [catLocation, catState, curtainsOpen, isBusy, reducedMotion, returnToBed, travelToWindow]);

  // Petting handler
  const handlePet = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCatPurr();
    setCatState('PURRING');
    onPet();

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left - 8,
      y: e.clientY - rect.top - 20,
    };
    setHearts((prev) => [...prev, newHeart]);

    setTimeout(() => {
      if (catLocation === 'WINDOW_SILL') {
        setCatState('WATCHING_WINDOW');
      } else {
        setCatState('SITTING');
      }
    }, 3200);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 1400);
  };

  return (
    <>
      {/* ================================================================ */}
      {/* 1. PERMANENT LUXURY CAT BED (Anchored at floor lower-left)       */}
      {/* ================================================================ */}
      <div
        className="absolute bottom-3 left-3 pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          if (catLocation === 'BED' && !isBusy) {
            handlePet(e);
          } else {
            onCatDialogue?.('Mochi is exploring the room right now.');
          }
        }}
      >
        <div
          className="relative w-36 h-20 rounded-[44px] bg-gradient-to-b from-[#6b4238] via-[#59332a] to-[#42221b] shadow-xl border-2 border-[#825449] flex items-center justify-center p-2 cursor-pointer transition-transform active:scale-95 group"
          title="Mochi's luxury plush cat bed"
        >
          {/* Soft quilted rim folds */}
          <div className="absolute inset-1 rounded-[38px] border border-[#966356]/40 pointer-events-none" />

          {/* Inner plush cushion */}
          <div className="w-28 h-14 rounded-[30px] bg-gradient-to-b from-[#4a2720] to-[#361a15] shadow-inner flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#2d1511]/60 rounded-full" />
            <div className="absolute left-1/3 top-1/3 w-1 h-1 rounded-full bg-[#59332a]/50" />
            <div className="absolute right-1/3 top-1/3 w-1 h-1 rounded-full bg-[#59332a]/50" />

            {/* When Mochi is away: Soft sleeping indentation & paw dent */}
            {(catLocation !== 'BED' || isBusy) && (
              <div className="flex flex-col items-center justify-center opacity-40">
                <div className="w-14 h-7 rounded-full border border-dashed border-[#8d5b4e]/60 bg-[#3a1b15]/40" />
                <span className="text-[8px] font-serif text-[#b88c7d] mt-0.5">warm bed</span>
              </div>
            )}
          </div>
        </div>

        {/* Cat Nameplate & Interactive Action Prompt */}
        <div className="flex flex-col items-center mt-1">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-300 font-medium">
            <span>Mochi</span>
            <span className="text-stone-500">·</span>
            <span className="text-[10px] text-amber-300 capitalize">
              {isBusy
                ? 'Walking...'
                : catLocation === 'WINDOW_SILL'
                ? 'At window'
                : catLocation === 'DESK'
                ? 'On desk'
                : catState === 'PURRING'
                ? 'Purring happily'
                : catState === 'SLEEPING'
                ? 'Napping'
                : catState === 'WAKING_UP'
                ? 'Waking up'
                : catState === 'STRETCHING'
                ? 'Stretching'
                : catState === 'GROOMING'
                ? 'Grooming'
                : 'Resting in bed'}
            </span>
          </div>

          {/* Button to invite Mochi to walk & jump to window */}
          {catLocation === 'BED' && !isBusy && curtainsOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                travelToWindow();
              }}
              className="mt-1 px-2.5 py-0.5 rounded-full bg-[#4a2e25]/90 hover:bg-[#603b30] border border-[#8a5d4e] text-[10px] font-serif text-amber-200 shadow-xs flex items-center gap-1 active:scale-95 transition-all"
              title="Encourage Mochi to walk and jump to the window"
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Go to window</span>
            </button>
          )}

          {catLocation === 'BED' && !isBusy && !curtainsOpen && (
            <span className="text-[9px] font-serif text-stone-400 mt-0.5">
              (Curtains closed)
            </span>
          )}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. CONTINUOUS VISIBLE MOCHI ENTITY (Animates smoothly across room) */}
      {/* ================================================================ */}
      <div
        className="absolute pointer-events-auto cursor-pointer"
        style={{
          left: coords.left,
          top: coords.top,
          zIndex: coords.zIndex,
          transition: coords.transition,
        }}
        onClick={handlePet}
        title={
          catLocation === 'WINDOW_SILL'
            ? 'Pet Mochi on the window sill'
            : catLocation === 'DESK'
            ? 'Pet Mochi on the study desk'
            : 'Pet Mochi'
        }
      >
        {/* Floating Hearts */}
        {hearts.map((h) => (
          <div
            key={h.id}
            className="absolute pointer-events-none text-rose-400 animate-[float-up_1.4s_ease-out_forwards] z-50"
            style={{ left: `${h.x}px`, top: `${h.y}px` }}
          >
            <Heart className="w-4 h-4 fill-rose-400/80 drop-shadow" />
          </div>
        ))}

        {/* The Animated Mochi Cat Sprite */}
        <div className="relative group">
          <MochiCatSprite
            state={catState}
            facing={facing}
            reducedMotion={reducedMotion}
          />

          {/* Window Sill Badge with Option to Send Back Down */}
          {catLocation === 'WINDOW_SILL' && !isBusy && (
            <div className="flex items-center gap-1.5 absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="px-2 py-0.5 rounded-full bg-[#1e293b]/90 border border-sky-400/40 text-[9px] text-sky-200 font-serif shadow-md">
                Watching city rain
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  returnToBed();
                }}
                className="px-2 py-0.5 rounded-full bg-[#45271e]/90 hover:bg-[#60372b] border border-[#945f4e] text-[9px] text-amber-200 font-serif shadow-md active:scale-95 transition-all"
                title="Send Mochi back down to bed"
              >
                Back to bed
              </button>
            </div>
          )}

          {/* Desk Badge */}
          {catLocation === 'DESK' && !isBusy && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#2a1d17]/85 border border-[#8a5e4b] text-[9px] text-amber-200 font-serif shadow-xs whitespace-nowrap">
              Mochi on desk
            </div>
          )}
        </div>
      </div>
    </>
  );
};
