'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MimiExpression,
  MimiPosture,
  GameEventType,
  TimeOfDay,
  WeatherType,
  Season,
  CurtainColorId,
  JournalThemeId,
  JournalEntry,
  CollectibleItem,
  Milestone,
  GameSettings,
  EXPRESSION_METAS,
} from '@/types/game';
import { MimiRenderer } from '@/components/character/MimiRenderer';
import { MimiSpeechBubble } from '@/components/character/MimiSpeechBubble';
import { RainWindow } from '@/components/room/RainWindow';
import { CozyDesk } from '@/components/room/CozyDesk';
import { CozyCat } from '@/components/room/CozyCat';
import { TeaModal } from '@/components/modals/TeaModal';
import { JournalModal } from '@/components/modals/JournalModal';
import { DecorModal } from '@/components/modals/DecorModal';
import { CollectionModal } from '@/components/modals/CollectionModal';
import { MimiGalleryModal } from '@/components/modals/MimiGalleryModal';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { CurtainColorModal } from '@/components/modals/CurtainColorModal';
import { LetterModal } from '@/components/modals/LetterModal';
import { KeepsakeAsset } from '@/components/art/GameAssets';
import { getDialogueForEvent } from '@/lib/mimiDialogue';
import { sound } from '@/lib/audio';
import {
  getTimeOfDay,
  getSeason,
  getNextWeather,
  getAtmosphere,
} from '@/lib/worldSimulation';
import {
  Point2D,
  INTERACTION_ANCHORS,
  calculateWalkPath,
  findNearestWalkablePoint,
  InteractableObjectId,
} from '@/lib/roomNavigation';
import {
  Coffee,
  BookOpen,
  Palette,
  Compass,
  Sliders,
  Volume2,
  VolumeX,
  Smile,
} from 'lucide-react';

const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-1',
    title: 'Rain on the Skylight',
    content:
      'The raindrops have been tapping on the glass since early afternoon. Mimi made a fresh cup of tea, and we sat watching the mist roll over the distant pine trees. There is nothing outside to rush to.',
    date: 'Oct 09 · Rainy Evening',
    tag: 'Cozy Solitude',
    illustrationType: 'RAIN',
  },
  {
    id: 'entry-2',
    title: 'Warm Wool & Soft Socks',
    content:
      'Put on the heavy wool sweater today. Outside the street is wet and reflective like a dark mirror, but in here the lamp paints everything in gentle amber.',
    date: 'Oct 08 · Twilight',
    tag: 'Comfort',
    illustrationType: 'TEA',
  },
  {
    id: 'entry-3',
    title: 'Mochi Dozing Off',
    content:
      'The cat curled into a tight circle on the velvet pillow. Every time thunder rumbles far off, his ears twitch once, then settle right back down.',
    date: 'Oct 06 · Late Rain',
    tag: 'Quiet Moments',
    illustrationType: 'CAT',
  },
];

const INITIAL_COLLECTIBLES: CollectibleItem[] = [
  {
    id: 'pressed_clover',
    name: 'Pressed Four-Leaf Clover',
    location: 'beside the cat cushion',
    storyNote: 'A four-leaf clover found between the pages of an old poetry book on a rainy morning.',
    discovered: false,
    assetKey: 'clover',
  },
  {
    id: 'lucky_pebble',
    name: 'Smooth Rain Pebble',
    location: 'the wooden window sill',
    storyNote: 'A river stone polished smooth by hundreds of spring showers.',
    discovered: false,
    assetKey: 'pebble',
  },
  {
    id: 'origami_crane',
    name: 'Tiny Origami Crane',
    location: 'beside the desk pencils',
    storyNote: 'Folded from tea-stained paper, watching quietly over the desk.',
    discovered: false,
    assetKey: 'crane',
  },
  {
    id: 'vintage_stamp',
    name: 'Vintage Lighthouse Stamp',
    location: 'under the desk blotter',
    storyNote: 'Shows a miniature lighthouse standing steadfast against sea rain.',
    discovered: false,
    assetKey: 'stamp',
  },
  {
    id: 'brass_key',
    name: 'Brass Music Box Key',
    location: 'behind the desk lamp stem',
    storyNote: 'Winds a little chime that plays a lullaby about April showers.',
    discovered: false,
    assetKey: 'key',
  },
  {
    id: 'warm_acorn',
    name: 'Polished Oak Acorn',
    location: 'next to the succulent pot',
    storyNote: 'Collected on a walk just as the first drops began to fall.',
    discovered: false,
    assetKey: 'acorn',
  },
];

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: 'ms_first_tea',
    title: 'Cozy Brewmaster',
    desc: 'Steeped your first warm cup of tea with Mimi.',
    unlocked: false,
    badgeKey: 'tea',
  },
  {
    id: 'ms_pet_cat',
    title: 'Mochi’s Favorite Human',
    desc: 'Petted the sleeping cat 3 times.',
    unlocked: false,
    badgeKey: 'cat',
  },
  {
    id: 'ms_rain_watcher',
    title: 'Rain Watcher',
    desc: 'Tapped the window pane or gazed outside 5 times.',
    unlocked: false,
    badgeKey: 'rain',
  },
  {
    id: 'ms_mimi_companion',
    title: 'Quiet Companionship',
    desc: 'Shared warm moments and interacted with Mimi 5 times.',
    unlocked: false,
    badgeKey: 'companion',
  },
  {
    id: 'ms_trinket_collector',
    title: 'Secret Seeker',
    desc: 'Discovered at least 3 hidden room keepsakes.',
    unlocked: false,
    badgeKey: 'seeker',
  },
];

const subscribeWorldClock = (callback: () => void) => {
  const interval = setInterval(callback, 30000);
  return () => clearInterval(interval);
};

const getClientTimeOfDay = (): TimeOfDay => getTimeOfDay(new Date());
const getServerTimeOfDay = (): TimeOfDay => 'EVENING';

const getClientSeason = (): Season => getSeason(new Date());
const getServerSeason = (): Season => 'AUTUMN';

export const CozyRoom: React.FC = () => {
  const roomRef = useRef<HTMLDivElement | null>(null);

  // 1. AUTONOMOUS WORLD & ENVIRONMENT STATE
  // Hydration-safe synchronization with user's local time & season
  const timeOfDay = React.useSyncExternalStore(subscribeWorldClock, getClientTimeOfDay, getServerTimeOfDay);
  const season = React.useSyncExternalStore(subscribeWorldClock, getClientSeason, getServerSeason);
  const [weather, setWeather] = useState<WeatherType>('GENTLE_RAIN');

  // 2. MIMI LIVING COMPANION MOVEMENT & POSTURE STATE
  // Mimi starts peacefully standing on the floor in front of her study desk
  const [mimiPos, setMimiPos] = useState<Point2D>({ x: 52, y: 83 });
  const [mimiFacing, setMimiFacing] = useState<'LEFT' | 'RIGHT'>('RIGHT');
  const [mimiPosture, setMimiPosture] = useState<MimiPosture>('STANDING');
  const [mimiExpression, setMimiExpression] = useState<MimiExpression>('CONTENT');
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [walkFrame, setWalkFrame] = useState<number>(0);

  // Cancellation and animation ref for path locomotion
  const walkCancelRef = useRef<(() => void) | null>(null);

  // Context-aware speech bubble
  const [activeDialogue, setActiveDialogue] = useState<{
    id: string;
    text: string;
    expression: MimiExpression;
  } | null>({
    id: 'welcome',
    text: 'Listen to the quiet rain... Make yourself at home.',
    expression: 'CONTENT',
  });

  // 3. OBJECT STATES
  const [lampOn, setLampOn] = useState<boolean>(true);
  const [curtainsOpen, setCurtainsOpen] = useState<boolean>(true);
  const [curtainColor, setCurtainColor] = useState<CurtainColorId>('warm_beige');
  const [journalTheme, setJournalTheme] = useState<JournalThemeId>('navy');
  const [currentTea, setCurrentTea] = useState<string | null>('Chamomile & Wild Honey');
  const [teaCount, setTeaCount] = useState<number>(1);
  const [petCount, setPetCount] = useState<number>(0);
  const [windowTapCount, setWindowTapCount] = useState<number>(0);
  const [mimiTapCount, setMimiTapCount] = useState<number>(0);
  const [isMimiTapped, setIsMimiTapped] = useState<boolean>(false);
  const [plantBloomed, setPlantBloomed] = useState<boolean>(false);

  const [decor, setDecor] = useState({
    deskMat: 'moss',
    figurine: 'cat',
    lampShade: 'brass',
    plantType: 'succulent',
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>(INITIAL_COLLECTIBLES);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  const [settings, setSettings] = useState<GameSettings>({
    reducedMotion: false,
    soundEnabled: true,
    soundVolume: 0.65,
  });

  // Modals state
  const [isTeaModalOpen, setIsTeaModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isDecorModalOpen, setIsDecorModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCurtainModalOpen, setIsCurtainModalOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);

  // Computed modal status to protect layering and prevent dialogue clipping
  const isAnyModalOpen =
    isTeaModalOpen ||
    isJournalModalOpen ||
    isDecorModalOpen ||
    isCollectionModalOpen ||
    isGalleryModalOpen ||
    isSettingsModalOpen ||
    isCurtainModalOpen ||
    isLetterModalOpen;

  // Immediately cancel locomotion before presenting modal
  const openModalSafely = useCallback((setter: (open: boolean) => void) => {
    if (walkCancelRef.current) {
      walkCancelRef.current();
      walkCancelRef.current = null;
    }
    setIsWalking(false);
    setMimiPosture('STANDING');
    setter(true);
  }, []);

  // 4. AUTONOMOUS WEATHER CLOCK
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      setWeather((prev) => getNextWeather(prev, season));
    }, 180000);

    return () => {
      clearInterval(weatherInterval);
    };
  }, [season]);

  // 5. PERSISTENCE (Safe localStorage loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem('little_after_rain_state');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.collectibles) setCollectibles(parsed.collectibles);
          if (parsed.journalEntries) setJournalEntries(parsed.journalEntries);
          if (parsed.milestones) setMilestones(parsed.milestones);
          if (parsed.teaCount) setTeaCount(parsed.teaCount);
          if (parsed.petCount) setPetCount(parsed.petCount);
          if (parsed.decor) setDecor(parsed.decor);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.curtainsOpen !== undefined) setCurtainsOpen(parsed.curtainsOpen);
          if (parsed.curtainColor) setCurtainColor(parsed.curtainColor);
        }
      } catch {}
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const saveState = useCallback(() => {
    try {
      localStorage.setItem(
        'little_after_rain_state',
        JSON.stringify({
          collectibles,
          journalEntries,
          milestones,
          teaCount,
          petCount,
          decor,
          settings,
          curtainsOpen,
          curtainColor,
        })
      );
    } catch {}
  }, [collectibles, journalEntries, milestones, teaCount, petCount, decor, settings, curtainsOpen, curtainColor]);

  useEffect(() => {
    saveState();
  }, [saveState]);

  // 6. AMBIENT RAIN SOUND
  const atmosphere = getAtmosphere(timeOfDay, weather, season);

  useEffect(() => {
    if (settings.soundEnabled && atmosphere.rainDropsActive) {
      sound.startRainAmbience(
        atmosphere.rainIntensityName === 'DOWNPOUR'
          ? 'DOWNPOUR'
          : atmosphere.rainIntensityName === 'GENTLE'
          ? 'GENTLE'
          : 'MIST'
      );
      sound.setVolume(settings.soundVolume);
    } else {
      sound.stopRainAmbience();
    }

    return () => {
      sound.stopRainAmbience();
    };
  }, [settings.soundEnabled, atmosphere.rainDropsActive, atmosphere.rainIntensityName, settings.soundVolume]);

  // Milestone checker
  const checkMilestones = useCallback(
    (
      newTeaCount: number,
      newPetCount: number,
      newWindowCount: number,
      newMimiCount: number,
      newCollectibles: CollectibleItem[]
    ) => {
      setMilestones((prev) => {
        let changed = false;
        const updated = prev.map((m) => {
          if (m.unlocked) return m;

          let shouldUnlock = false;
          if (m.id === 'ms_first_tea' && newTeaCount >= 1) shouldUnlock = true;
          if (m.id === 'ms_pet_cat' && newPetCount >= 3) shouldUnlock = true;
          if (m.id === 'ms_rain_watcher' && newWindowCount >= 5) shouldUnlock = true;
          if (m.id === 'ms_mimi_companion' && newMimiCount >= 5) shouldUnlock = true;
          if (
            m.id === 'ms_trinket_collector' &&
            newCollectibles.filter((c) => c.discovered).length >= 3
          )
            shouldUnlock = true;

          if (shouldUnlock) {
            changed = true;
            sound.playSoftChime();
            setMimiExpression('DELIGHTED');
            const dlg = getDialogueForEvent('UNLOCK_MILESTONE');
            if (dlg) {
              setActiveDialogue({
                id: dlg.id,
                text: `${m.title} unlocked! ✨`,
                expression: 'DELIGHTED',
              });
            }
            return { ...m, unlocked: true };
          }
          return m;
        });
        return changed ? updated : prev;
      });
    },
    []
  );

  // Trigger Dialogue & Reaction
  const handleGameEvent = useCallback(
    (event: GameEventType, customExpression?: MimiExpression) => {
      const dialogueResult = getDialogueForEvent(event, customExpression);
      if (dialogueResult) {
        setMimiExpression(dialogueResult.expression);
        setActiveDialogue({
          id: `${dialogueResult.id}-${Date.now()}`,
          text: dialogueResult.line,
          expression: dialogueResult.expression,
        });
      }
    },
    []
  );

  // =========================================================================
  // STAGE A: SEAMLESS COLLISION-FREE MOVEMENT & INTERACTION SYSTEM
  // =========================================================================
  const walkToDestination = useCallback(
    (
      targetRaw: Point2D,
      desiredFacing?: 'LEFT' | 'RIGHT',
      onArrival?: () => void
    ) => {
      // Cancel previous path animation if currently running
      if (walkCancelRef.current) {
        walkCancelRef.current();
        walkCancelRef.current = null;
      }

      const waypoints = calculateWalkPath(mimiPos, targetRaw);
      if (waypoints.length === 0) {
        if (desiredFacing) setMimiFacing(desiredFacing);
        onArrival?.();
        return;
      }

      const finalTarget = waypoints[waypoints.length - 1];

      // If user enabled reduced motion, teleport smoothly without leg cycling
      if (settings.reducedMotion) {
        setMimiPos(finalTarget);
        setIsWalking(false);
        setWalkFrame(0);
        if (desiredFacing) setMimiFacing(desiredFacing);
        onArrival?.();
        return;
      }

      let isCancelled = false;
      walkCancelRef.current = () => {
        isCancelled = true;
      };

      setIsWalking(true);
      setMimiPosture('STANDING');

      // Sequential waypoint walker
      let currentIdx = 0;
      let startPoint = { ...mimiPos };

      const runNextSegment = () => {
        if (isCancelled) return;

        if (currentIdx >= waypoints.length) {
          // Finished all waypoints in path
          setIsWalking(false);
          setWalkFrame(0);
          if (desiredFacing) setMimiFacing(desiredFacing);
          walkCancelRef.current = null;
          onArrival?.();
          return;
        }

        const nextPoint = waypoints[currentIdx];
        const dx = nextPoint.x - startPoint.x;
        const dy = nextPoint.y - startPoint.y;
        const dist = Math.hypot(dx, dy);

        // Turn to face movement direction
        if (Math.abs(dx) > 0.8) {
          setMimiFacing(dx < 0 ? 'LEFT' : 'RIGHT');
        }

        // Duration proportional to distance (cozy indie pace: ~28ms per percent unit)
        const duration = Math.max(550, Math.min(1800, dist * 28));
        const startTime = performance.now();
        let lastStepSoundTime = 0;

        const step = (now: number) => {
          if (isCancelled) return;

          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);

          // Ease-in-out curve
          const t = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

          const currentX = startPoint.x + dx * t;
          const currentY = startPoint.y + dy * t;
          setMimiPos({ x: currentX, y: currentY });

          // Leg articulation frame cycle (0, 1, 2, 3) every 140ms
          const frame = Math.floor((elapsed / 140) % 4);
          setWalkFrame(frame);

          // Soft wooden floor footstep on alternating step frames
          if (settings.soundEnabled && (frame === 1 || frame === 3) && elapsed - lastStepSoundTime > 260) {
            sound.playFootstep();
            lastStepSoundTime = elapsed;
          }

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            // Segment finished, proceed to next
            startPoint = { ...nextPoint };
            currentIdx++;
            runNextSegment();
          }
        };

        requestAnimationFrame(step);
      };

      runNextSegment();
    },
    [mimiPos, settings.reducedMotion, settings.soundEnabled]
  );

  // Navigate to an object's predefined interaction anchor
  const interactWithObject = useCallback(
    (objectId: InteractableObjectId, onAction: () => void) => {
      const anchor = INTERACTION_ANCHORS[objectId];
      if (!anchor) {
        onAction();
        return;
      }

      walkToDestination(anchor.targetPoint, anchor.facing, () => {
        onAction();
      });
    },
    [walkToDestination]
  );

  // =========================================================================
  // CONTEXTUAL OBJECT INTERACTIONS (BUILDING ON MOVEMENT)
  // =========================================================================

  // 1. TEA MUG INTERACTION (Walking -> Sipping Animation -> Warm dialogue & milestones)
  const handleDrinkTeaAction = useCallback(() => {
    interactWithObject('MUG', () => {
      setMimiPosture('DRINKING');
      setMimiExpression('CONTENT');
      sound.playTeaSip();
      handleGameEvent('SIP_TEA', 'CONTENT');

      const nextCount = teaCount + 1;
      setTeaCount(nextCount);
      checkMilestones(nextCount, petCount, windowTapCount, mimiTapCount, collectibles);

      // Gracefully lower cup back after savoring
      setTimeout(() => {
        setMimiPosture('STANDING');
      }, 4200);
    });
  }, [interactWithObject, handleGameEvent, checkMilestones, teaCount, petCount, windowTapCount, mimiTapCount, collectibles]);

  // Open tea modal: if player taps "Tea" in footer, Mimi walks to desk then opens brewing modal
  const handleOpenTeaRitual = useCallback(() => {
    interactWithObject('MUG', () => {
      openModalSafely(setIsTeaModalOpen);
    });
  }, [interactWithObject, openModalSafely]);

  const handleBrewTea = (teaName: string) => {
    setCurrentTea(teaName);
    const newCount = teaCount + 1;
    setTeaCount(newCount);
    sound.playCuteInteraction();
    setMimiPosture('DRINKING');
    setMimiExpression('CONTENT');
    handleGameEvent('BREW_TEA', 'CONTENT');
    checkMilestones(newCount, petCount, windowTapCount, mimiTapCount, collectibles);

    setTimeout(() => {
      setMimiPosture('STANDING');
    }, 4000);
  };

  // 2. SLEEPING CAT MOCHI INTERACTION (Walking -> Crouching -> Purring hearts)
  const handlePetCatAction = useCallback(() => {
    interactWithObject('CAT', () => {
      setMimiPosture('CROUCHING');
      setMimiExpression('CONTENT');
      sound.playCatPurr();

      const newCount = petCount + 1;
      setPetCount(newCount);
      handleGameEvent('PET_CAT', 'DELIGHTED');
      checkMilestones(teaCount, newCount, windowTapCount, mimiTapCount, collectibles);

      setTimeout(() => {
        setMimiPosture('STANDING');
        setMimiExpression('DELIGHTED');
      }, 3500);
    });
  }, [interactWithObject, petCount, teaCount, windowTapCount, mimiTapCount, collectibles, checkMilestones, handleGameEvent]);

  // 3. RAINY WINDOW INTERACTION (Walking -> Leaning Forward -> Rain tapping)
  const handleLookWindowAction = useCallback(() => {
    interactWithObject('WINDOW', () => {
      setMimiPosture('LEAN_FORWARD');
      setMimiExpression('CURIOUS');
      sound.playWindowTap();

      const newCount = windowTapCount + 1;
      setWindowTapCount(newCount);
      handleGameEvent('TAP_WINDOW', 'CURIOUS');
      checkMilestones(teaCount, petCount, newCount, mimiTapCount, collectibles);

      setTimeout(() => {
        setMimiPosture('STANDING');
      }, 3800);
    });
  }, [interactWithObject, windowTapCount, teaCount, petCount, mimiTapCount, collectibles, checkMilestones, handleGameEvent]);

  const handleFogTrace = () => {
    handleGameEvent('TRACE_WINDOW_FOG', 'HAPPY');
  };

  // 4. WINDOW CURTAINS INTERACTION (Walking -> Reaching -> Pull cord)
  const handlePullCurtainsAction = useCallback(() => {
    interactWithObject('CURTAINS', () => {
      setMimiPosture('REACHING');
      sound.playWindowTap();
      const next = !curtainsOpen;
      setCurtainsOpen(next);

      if (next) {
        setMimiExpression('HAPPY');
        setActiveDialogue({
          id: `curtain-${Date.now()}`,
          text: 'Opening the curtains to let in the soft grey light.',
          expression: 'HAPPY',
        });
      } else {
        setMimiExpression('CONTENT');
        setActiveDialogue({
          id: `curtain-${Date.now()}`,
          text: 'Closing the curtains keeps all the cozy warmth inside.',
          expression: 'CONTENT',
        });
      }

      setTimeout(() => {
        setMimiPosture('STANDING');
      }, 2500);
    });
  }, [interactWithObject, curtainsOpen]);

  // 5. DESK LAMP INTERACTION (Walking -> Reaching -> Toggle warm glow)
  const handleToggleLampAction = useCallback(() => {
    interactWithObject('LAMP', () => {
      setMimiPosture('REACHING');
      sound.playLampClick();
      const next = !lampOn;
      setLampOn(next);

      if (next) {
        setMimiExpression('CONTENT');
        handleGameEvent('TOGGLE_LAMP', 'CONTENT');
      } else {
        setMimiExpression('SLEEPY');
        setActiveDialogue({
          id: `lamp-off-${Date.now()}`,
          text: 'The room is soft in twilight... cozy and quiet.',
          expression: 'SLEEPY',
        });
      }

      setTimeout(() => {
        setMimiPosture('STANDING');
      }, 2400);
    });
  }, [interactWithObject, lampOn, handleGameEvent]);

  // 6. RAIN JOURNAL INTERACTION (Walking -> Leaning -> Reading memories)
  const handleOpenJournalAction = useCallback(() => {
    interactWithObject('JOURNAL', () => {
      setMimiPosture('LEAN_FORWARD');
      setMimiExpression('TOUCHED');
      sound.playPaperTurn();
      handleGameEvent('OPEN_JOURNAL', 'TOUCHED');

      // Open modal after graceful arrival
      setTimeout(() => {
        openModalSafely(setIsJournalModalOpen);
        setMimiPosture('STANDING');
      }, 900);
    });
  }, [interactWithObject, handleGameEvent, openModalSafely]);

  const handleAddJournalEntry = (title: string, content: string) => {
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      title,
      content,
      date: 'Just now · Rainy Moment',
      tag: 'Heartfelt',
      illustrationType: 'RAIN',
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    setMimiExpression('TOUCHED');
    handleGameEvent('WRITE_MEMORY', 'TOUCHED');
  };

  // 7. DESK SUCCULENT PLANT INTERACTION
  const handleWaterPlantAction = useCallback(() => {
    interactWithObject('PLANT', () => {
      setMimiPosture('WATERING');
      sound.playWaterSprinkle();
      setPlantBloomed(true);
      setMimiExpression('CONTENT');
      handleGameEvent('WATER_PLANT', 'CONTENT');

      setTimeout(() => {
        setMimiPosture('STANDING');
      }, 3500);
    });
  }, [interactWithObject, handleGameEvent]);

  // 8. DESK FIGURINE INTERACTION
  const handleTapFigurineAction = useCallback(() => {
    interactWithObject('FIGURINE', () => {
      setMimiPosture('REACHING');
      sound.playSoftChime();
      setMimiExpression('CURIOUS');
      handleGameEvent('TAP_FIGURINE', 'CURIOUS');

      setTimeout(() => {
        setMimiPosture('STANDING');
      }, 2200);
    });
  }, [interactWithObject, handleGameEvent]);

  // 9. DIRECT TOUCH TO WALK (Tapping anywhere in room floor)
  const handleFloorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAnyModalOpen || !roomRef.current) return;
    const rect = roomRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked in floor area (y >= 40%)
    if (yPct >= 38) {
      const safePoint = findNearestWalkablePoint({ x: xPct, y: yPct });
      walkToDestination(safePoint, undefined, () => {
        setMimiPosture('STANDING');
        setMimiExpression('CONTENT');
      });
    }
  };

  // 10. TAPPING MIMI DIRECTLY
  const handleTapMimi = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playCuteInteraction();
    setIsMimiTapped(true);
    setTimeout(() => {
      setIsMimiTapped(false);
    }, 1200);

    const newCount = mimiTapCount + 1;
    setMimiTapCount(newCount);
    const chosenExp: MimiExpression = newCount % 2 === 0 ? 'SHY' : 'HAPPY';
    setMimiPosture(newCount % 2 === 0 ? 'SHY_TWIST' : 'BOUNCE');
    handleGameEvent('TAP_MIMI', chosenExp);
    checkMilestones(teaCount, petCount, windowTapCount, newCount, collectibles);

    setTimeout(() => {
      setMimiPosture('STANDING');
    }, 2000);
  };

  // 11. AUTONOMOUS IDLE WANDERING (NO CLIPPING)
  useEffect(() => {
    if (settings.reducedMotion) return;

    const wanderInterval = setInterval(() => {
      if (isWalking) return;

      // Pick one of the safe room spots to wander to (strictly on the floor)
      const destinations: Point2D[] = [
        INTERACTION_ANCHORS.WINDOW.targetPoint,
        INTERACTION_ANCHORS.MUG.targetPoint,
        INTERACTION_ANCHORS.CAT.targetPoint,
        INTERACTION_ANCHORS.JOURNAL.targetPoint,
        INTERACTION_ANCHORS.LAMP.targetPoint,
        { x: 44, y: 80 }, // center floor area
        { x: 62, y: 82 }, // right wooden floor
      ];

      const chosen = destinations[Math.floor(Math.random() * destinations.length)];
      walkToDestination(chosen, undefined, () => {
        setMimiPosture('STANDING');
        if (Math.random() < 0.35) {
          const dlg = getDialogueForEvent('MIMI_IDLE_WANDER');
          if (dlg) {
            setActiveDialogue({
              id: `wander-${Date.now()}`,
              text: dlg.line,
              expression: dlg.expression,
            });
            setMimiExpression(dlg.expression);
          }
        }
      });
    }, 38000 + Math.random() * 22000);

    return () => clearInterval(wanderInterval);
  }, [isWalking, settings.reducedMotion, walkToDestination]);

  // Keepsake Discovery
  const handleDiscoverHiddenItem = (itemId: string) => {
    sound.playSoftChime();
    setCollectibles((prev) => {
      const next = prev.map((item) => (item.id === itemId ? { ...item, discovered: true } : item));
      checkMilestones(teaCount, petCount, windowTapCount, mimiTapCount, next);
      return next;
    });
    setMimiExpression('SURPRISED');
    handleGameEvent('DISCOVER_HIDDEN_ITEM', 'SURPRISED');
  };

  // Decor & settings handlers
  const handleUpdateDecor = (
    category: 'deskMat' | 'figurine' | 'lampShade' | 'plantType',
    val: string
  ) => {
    sound.playLampClick();
    setDecor((prev) => ({ ...prev, [category]: val }));
    handleGameEvent('SELECT_DECORATION', 'THINKING');
  };

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('little_after_rain_state');
      setCollectibles(INITIAL_COLLECTIBLES);
      setJournalEntries(INITIAL_JOURNAL_ENTRIES);
      setMilestones(INITIAL_MILESTONES);
      setTeaCount(0);
      setPetCount(0);
      setCurrentTea(null);
      setMimiTapCount(0);
      setWindowTapCount(0);
      setPlantBloomed(false);
      setCurtainsOpen(true);
      setCurtainColor('warm_beige');
      setMimiPos({ x: 52, y: 83 });
      setMimiPosture('STANDING');
      setMimiExpression('CONTENT');
      setActiveDialogue({
        id: 'reset',
        text: 'A clean slate... the room feels fresh and new.',
        expression: 'CONTENT',
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#1c1613] flex items-center justify-center p-0 sm:p-4 text-stone-100 font-sans select-none">
      {/* 2D IMMERSIVE GAME VIEWPORT (Portrait Mode) */}
      <div className="relative w-full max-w-[430px] h-[100dvh] sm:h-[890px] sm:rounded-3xl overflow-hidden shadow-2xl border sm:border-[#3d2c22] bg-[#2d221b] flex flex-col justify-between">
        
        {/* ========================================================== */}
        {/* UNOBTRUSIVE COZY GAME HUD (Atmospheric indicator & Audio) */}
        {/* ========================================================== */}
        <header className="relative z-40 px-3.5 py-2.5 flex items-center justify-between shrink-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none">
          {/* Atmospheric Seal */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="px-2.5 py-1 rounded-full bg-[#3d281a]/85 border border-[#6b472e]/80 shadow-md backdrop-blur-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-serif tracking-wide text-amber-200">
                {atmosphere.description}
              </span>
            </div>
          </div>

          {/* Quick Audio & Settings */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() =>
                setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
              }
              className={`p-1.5 rounded-full transition-colors backdrop-blur-sm ${
                settings.soundEnabled
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                  : 'bg-stone-900/60 text-stone-500 border border-stone-800'
              }`}
              title={settings.soundEnabled ? 'Mute ambient sound' : 'Unmute ambient sound'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => openModalSafely(setIsSettingsModalOpen)}
              className="p-1.5 rounded-full bg-stone-900/70 hover:bg-stone-800 text-stone-300 border border-stone-800/80 shadow-sm transition-colors"
              title="Settings & Accessibility"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ========================================================== */}
        {/* 2D UNIFIED ROOM STAGE (Walkable Floor & Interactive World) */}
        {/* ========================================================== */}
        <main
          ref={roomRef}
          onClick={handleFloorClick}
          className="relative flex-1 overflow-hidden select-none cursor-pointer"
        >
          {/* Room Wallpaper Texture */}
          <div className="absolute inset-0 bg-[#34271f] pointer-events-none z-0">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#854d0e_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>

          {/* Atmospheric Lighting Tint */}
          <div
            className={`absolute inset-0 ${atmosphere.roomTint} transition-colors duration-1000 pointer-events-none z-0`}
          />

          {/* Natural Sunbeams during clear daytime */}
          {atmosphere.sunbeamOpacity > 0 && (
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                opacity: atmosphere.sunbeamOpacity,
                background:
                  'linear-gradient(135deg, rgba(254, 240, 138, 0.25) 0%, rgba(253, 224, 71, 0.08) 50%, transparent 80%)',
              }}
            />
          )}

          {/* Warm Desk Lamp Ambient Glow */}
          {lampOn && (
            <div
              className="absolute top-[36%] right-[20%] w-80 h-80 rounded-full pointer-events-none z-0 transition-opacity duration-700"
              style={{
                background:
                  'radial-gradient(circle, rgba(254, 215, 114, 0.28) 0%, rgba(245, 158, 11, 0.09) 55%, transparent 75%)',
                filter: 'blur(32px)',
              }}
            />
          )}

          {/* Perspective Wooden Floor (Baseline for Walkable Area) */}
          <div className="absolute inset-x-0 bottom-0 top-[40%] bg-gradient-to-b from-[#241710] to-[#1c120c] pointer-events-none z-1">
            {/* Floorboard lines */}
            <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(0deg,#000,#000_2px,transparent_2px,transparent_32px)]" />
          </div>

          {/* 1. TOP ROOM: RAINY WINDOW & INTERACTIVE CURTAINS */}
          <section className="absolute top-2 inset-x-3 h-[34%] z-10">
            <RainWindow
              timeOfDay={timeOfDay}
              weather={weather}
              season={season}
              curtainsOpen={curtainsOpen}
              curtainColorId={curtainColor}
              onToggleCurtains={handlePullCurtainsAction}
              onOpenCurtainColor={() => openModalSafely(setIsCurtainModalOpen)}
              onWindowTap={handleLookWindowAction}
              onFogTrace={handleFogTrace}
            />

            {/* Hidden Pebble on window sill */}
            {!collectibles.find((c) => c.id === 'lucky_pebble')?.discovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDiscoverHiddenItem('lucky_pebble');
                }}
                className="absolute bottom-1 right-12 opacity-75 hover:opacity-100 transition-opacity animate-bounce z-30"
                title="A smooth keepsake pebble resting on the sill..."
              >
                <KeepsakeAsset assetKey="pebble" size={16} />
              </button>
            )}
          </section>

          {/* 2. MID ROOM: THE ARTISAN STUDY DESK */}
          <section
            className="absolute top-[35%] inset-x-2 sm:inset-x-4 z-30 flex justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CozyDesk
              lampOn={lampOn}
              onToggleLamp={handleToggleLampAction}
              currentTea={currentTea}
              onSipTea={handleDrinkTeaAction}
              onOpenJournal={handleOpenJournalAction}
              onOpenLetter={() => openModalSafely(setIsLetterModalOpen)}
              onWaterPlant={handleWaterPlantAction}
              onTapFigurine={handleTapFigurineAction}
              onDiscoverHiddenItem={handleDiscoverHiddenItem}
              discoveredItemIds={collectibles.filter((c) => c.discovered).map((c) => c.id)}
              plantBloomed={plantBloomed}
              isMimiHoldingMug={mimiPosture === 'DRINKING'}
              decor={decor}
            />
          </section>

          {/* 3. CAT MOCHI & BED (Floor bed, mid-room desk leap & window sill hangout) */}
          <section className="absolute inset-0 z-25 pointer-events-none">
            <CozyCat
              curtainsOpen={curtainsOpen}
              onPet={handlePetCatAction}
              petCount={petCount}
              reducedMotion={settings.reducedMotion}
              onCatDialogue={(text) => {
                setActiveDialogue({
                  id: `mochi-${Date.now()}`,
                  text,
                  expression: 'CONTENT',
                });
              }}
            />

            {/* Hidden Four-Leaf Clover by cat cushion */}
            {!collectibles.find((c) => c.id === 'pressed_clover')?.discovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDiscoverHiddenItem('pressed_clover');
                }}
                className="absolute bottom-2 left-40 opacity-80 hover:opacity-100 transition-opacity animate-bounce z-30 pointer-events-auto"
                title="Something green beside the cushion..."
              >
                <KeepsakeAsset assetKey="clover" size={18} />
              </button>
            )}
          </section>

          {/* 4. STORYBOOK CONTEXTUAL SPEECH BUBBLE WITH SCREEN COLLISION & FACE-CLEARING PLACEMENT */}
          {!isAnyModalOpen && activeDialogue && (() => {
            // Clamped horizontally so bubble never overflows left or right screen borders
            const bubbleCenterX = Math.max(34, Math.min(66, mimiPos.x));
            // Positioned safely ABOVE Mimi's head so Mimi's entire face, eyes, and expressions remain 100% visible!
            // Mimi's head is between mimiPos.y - 25% and mimiPos.y; face is at mimiPos.y - 18%.
            // Clamping bubbleBottomY to at most 48% (and mimiPos.y - 32%) guarantees a generous clearance zone.
            const bubbleBottomY = Math.max(32, Math.min(48, mimiPos.y - 32));
            // Tail points directly toward Mimi's horizontal coordinate without touching her face
            const offsetFromCenter = mimiPos.x - bubbleCenterX;
            const tailPercent = 50 + (offsetFromCenter * 1.8);
            const clampedTail = Math.max(16, Math.min(84, tailPercent));

            return (
              <div
                className="absolute z-35 pointer-events-auto transition-all duration-200 w-auto max-w-[215px] sm:max-w-[235px]"
                style={{
                  left: `${bubbleCenterX}%`,
                  top: `${bubbleBottomY}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <MimiSpeechBubble
                  key={activeDialogue.id}
                  text={activeDialogue.text}
                  expression={activeDialogue.expression}
                  tailOffsetPercent={clampedTail}
                  onDismiss={() => setActiveDialogue(null)}
                />
              </div>
            );
          })()}

          {/* 5. MIMI CHARACTER COMPANION (COLLISION-FREE WALKING & POSITIONING) */}
          <div
            className="absolute pointer-events-auto transition-transform duration-75 select-none"
            style={{
              left: `${mimiPos.x}%`,
              top: `${mimiPos.y}%`,
              transform: 'translate(-50%, -90%)',
              zIndex: isAnyModalOpen ? 0 : 30,
            }}
          >
            {/* Mimi Interactive Character Rig with Body Outline on Tap/Hover */}
            <div
              onClick={handleTapMimi}
              className="cursor-pointer group relative transition-transform active:scale-95 hover:[&_svg]:[filter:drop-shadow(0_0_2px_rgba(251,191,36,0.9))_drop-shadow(0_0_5px_rgba(251,191,36,0.5))]"
              title="Tap Mimi to share a gentle moment"
            >
              <MimiRenderer
                expression={mimiExpression}
                posture={mimiPosture}
                isWalking={isWalking}
                walkFrame={walkFrame}
                facing={mimiFacing}
                reducedMotion={settings.reducedMotion}
                size={148}
                isHighlighted={isMimiTapped}
              />
            </div>
          </div>
        </main>

        {/* ========================================================== */}
        {/* BOTTOM DIEGETIC GAME ACTION TOOLBAR (Cartoonish Cozy Buttons) */}
        {/* ========================================================== */}
        <footer className="relative z-40 px-2.5 sm:px-3 py-2 bg-[#221711]/95 backdrop-blur-md border-t-2 border-[#3b281d] flex items-center justify-between gap-1.5 sm:gap-2 shrink-0">
          {/* Mimi 10 Expressions Compendium */}
          <button
            onClick={() => openModalSafely(setIsGalleryModalOpen)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl bg-gradient-to-b from-[#3a271c] to-[#26180f] hover:from-[#442e22] hover:to-[#2d1c12] border-2 border-[#5e3b28] shadow-[0_3px_0_#180d06] active:shadow-none active:translate-y-0.5 transition-all group"
          >
            <span className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smile className="w-4 h-4 text-emerald-300" />
            </span>
            <span className="text-[10px] font-serif font-black text-emerald-300 mt-1">Mimi (10)</span>
          </button>

          {/* Tea Ritual */}
          <button
            onClick={handleOpenTeaRitual}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl bg-gradient-to-b from-[#3a271c] to-[#26180f] hover:from-[#442e22] hover:to-[#2d1c12] border-2 border-[#5e3b28] shadow-[0_3px_0_#180d06] active:shadow-none active:translate-y-0.5 transition-all group"
          >
            <span className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coffee className="w-4 h-4 text-amber-300" />
            </span>
            <span className="text-[10px] font-serif font-black text-amber-300 mt-1">Tea</span>
          </button>

          {/* Rain Journal */}
          <button
            onClick={handleOpenJournalAction}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl bg-gradient-to-b from-[#3a271c] to-[#26180f] hover:from-[#442e22] hover:to-[#2d1c12] border-2 border-[#5e3b28] shadow-[0_3px_0_#180d06] active:shadow-none active:translate-y-0.5 transition-all group"
          >
            <span className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 text-rose-300" />
            </span>
            <span className="text-[10px] font-serif font-black text-rose-300 mt-1">Journal</span>
          </button>

          {/* Room Decor */}
          <button
            onClick={() => openModalSafely(setIsDecorModalOpen)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl bg-gradient-to-b from-[#3a271c] to-[#26180f] hover:from-[#442e22] hover:to-[#2d1c12] border-2 border-[#5e3b28] shadow-[0_3px_0_#180d06] active:shadow-none active:translate-y-0.5 transition-all group"
          >
            <span className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palette className="w-4 h-4 text-purple-300" />
            </span>
            <span className="text-[10px] font-serif font-black text-purple-300 mt-1">Decor</span>
          </button>

          {/* Keepsakes & Milestones */}
          <button
            onClick={() => openModalSafely(setIsCollectionModalOpen)}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl bg-gradient-to-b from-[#3a271c] to-[#26180f] hover:from-[#442e22] hover:to-[#2d1c12] border-2 border-[#5e3b28] shadow-[0_3px_0_#180d06] active:shadow-none active:translate-y-0.5 transition-all group relative"
          >
            <span className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4 text-amber-300" />
            </span>
            <span className="text-[10px] font-serif font-black text-amber-200 mt-1">Keepsakes</span>
            {collectibles.some((c) => c.discovered) && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-400 border border-[#221711] animate-pulse" />
            )}
          </button>
        </footer>

        {/* ========================================================== */}
        {/* MODALS & DRAWERS */}
        {/* ========================================================== */}
        <TeaModal
          isOpen={isTeaModalOpen}
          onClose={() => {
            setIsTeaModalOpen(false);
            setMimiPosture('STANDING');
          }}
          onBrew={handleBrewTea}
          currentTea={currentTea}
          teaCount={teaCount}
        />

        <LetterModal
          isOpen={isLetterModalOpen}
          onClose={() => setIsLetterModalOpen(false)}
        />

        <JournalModal
          isOpen={isJournalModalOpen}
          onClose={() => {
            setIsJournalModalOpen(false);
            setMimiPosture('STANDING');
          }}
          entries={journalEntries}
          themeId={journalTheme}
          onSelectTheme={setJournalTheme}
          onAddEntry={handleAddJournalEntry}
        />

        <DecorModal
          isOpen={isDecorModalOpen}
          onClose={() => setIsDecorModalOpen(false)}
          decor={decor}
          onUpdateDecor={handleUpdateDecor}
        />

        <CollectionModal
          isOpen={isCollectionModalOpen}
          onClose={() => setIsCollectionModalOpen(false)}
          items={collectibles}
          milestones={milestones}
          onInspectItem={() => {
            handleGameEvent('DISCOVER_HIDDEN_ITEM', 'SURPRISED');
          }}
        />

        <MimiGalleryModal
          isOpen={isGalleryModalOpen}
          onClose={() => setIsGalleryModalOpen(false)}
          currentExpression={mimiExpression}
          onSelectExpression={(exp) => {
            setMimiExpression(exp);
            const meta = EXPRESSION_METAS[exp];
            setActiveDialogue({
              id: `preview-${exp}`,
              text: `[${meta.name}] ${meta.triggerDescription}`,
              expression: exp,
            });
          }}
          reducedMotion={settings.reducedMotion}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          settings={settings}
          onUpdateSettings={(newSettings) =>
            setSettings((prev) => ({ ...prev, ...newSettings }))
          }
          onResetProgress={handleResetProgress}
        />

        <CurtainColorModal
          isOpen={isCurtainModalOpen}
          onClose={() => setIsCurtainModalOpen(false)}
          selectedColorId={curtainColor}
          onSelectColor={(colorId) => {
            setCurtainColor(colorId);
            sound.playCuteInteraction();
            setActiveDialogue({
              id: `curtain-color-${colorId}`,
              text: `These new drape tones bring such a cozy feeling to the room.`,
              expression: 'CONTENT',
            });
          }}
        />
      </div>
    </div>
  );
};
