import { GameEventType, MimiExpression, DialogueItem } from '@/types/game';

export const MIMI_DIALOGUES: DialogueItem[] = [
  {
    id: 'dlg_brew_tea',
    event: 'BREW_TEA',
    expression: 'CONTENT',
    lines: [
      'That smells wonderful.',
      'Warm tea makes everything better.',
      'A warm cup of comfort.',
      'So soothing and warm.',
    ],
    priority: 8,
  },
  {
    id: 'dlg_sip_tea',
    event: 'SIP_TEA',
    expression: 'HAPPY',
    lines: [
      'Mmm, warm down to the fingertips.',
      'Take your time. No rush today.',
      'Such a soothing blend.',
    ],
    priority: 6,
  },
  {
    id: 'dlg_toggle_lamp_on',
    event: 'TOGGLE_LAMP',
    expression: 'CONTENT',
    lines: [
      'There. Much cozier.',
      'A warm golden sanctuary.',
      'Golden light and quiet weather.',
    ],
    priority: 7,
  },
  {
    id: 'dlg_pet_cat',
    event: 'PET_CAT',
    expression: 'DELIGHTED',
    lines: [
      'Someone loves the attention!',
      'Listen to that gentle purr...',
      'Mochi is so happy right now.',
      'A soft little friend.',
    ],
    priority: 8,
  },
  {
    id: 'dlg_tap_window',
    event: 'TAP_WINDOW',
    expression: 'CURIOUS',
    lines: [
      'The rain washes the noise away.',
      'Look at the light on the droplets.',
      'The quiet outside is peaceful.',
    ],
    priority: 7,
  },
  {
    id: 'dlg_trace_fog',
    event: 'TRACE_WINDOW_FOG',
    expression: 'HAPPY',
    lines: [
      'A little doodle on the glass!',
      'Cool glass, warm room.',
      'A little star on the mist.',
    ],
    priority: 7,
  },
  {
    id: 'dlg_open_journal',
    event: 'OPEN_JOURNAL',
    expression: 'TOUCHED',
    lines: [
      'A quiet moment to remember.',
      'Putting thoughts into words.',
      'Our little memory book.',
    ],
    priority: 8,
  },
  {
    id: 'dlg_write_memory',
    event: 'WRITE_MEMORY',
    expression: 'TOUCHED',
    lines: [
      'A sweet thought to keep safe.',
      'A quiet scratch of the pen.',
      'A new page for today.',
    ],
    priority: 9,
  },
  {
    id: 'dlg_select_decor',
    event: 'SELECT_DECORATION',
    expression: 'THINKING',
    lines: [
      'That looks so charming!',
      'Such a cozy touch.',
      'It suits our room so well.',
    ],
    priority: 7,
  },
  {
    id: 'dlg_discover_item',
    event: 'DISCOVER_HIDDEN_ITEM',
    expression: 'SURPRISED',
    lines: [
      'A little treasure found!',
      'Hidden in plain sight... cute!',
      'A lucky little discovery.',
    ],
    priority: 10,
  },
  {
    id: 'dlg_tap_mimi',
    event: 'TAP_MIMI',
    expression: 'SHY',
    lines: [
      'Ehehe, hello there!',
      'You make me smile.',
      'Staying cozy together today?',
      'My sweater is nice and warm.',
    ],
    priority: 7,
  },
  {
    id: 'dlg_unlock_milestone',
    event: 'UNLOCK_MILESTONE',
    expression: 'DELIGHTED',
    lines: [
      'A lovely new milestone!',
      'We made a new memory!',
    ],
    priority: 10,
  },
  {
    id: 'dlg_water_plant',
    event: 'WATER_PLANT',
    expression: 'CONTENT',
    lines: [
      'A fresh drink for the blossoms!',
      'Leaves are drinking happily.',
      'Growing sweet and green.',
    ],
    priority: 6,
  },
  {
    id: 'dlg_tap_figurine',
    event: 'TAP_FIGURINE',
    expression: 'CURIOUS',
    lines: [
      'Such a cute little buddy.',
      'Watching over our desk.',
    ],
    priority: 6,
  },
  {
    id: 'dlg_weather_change',
    event: 'WEATHER_CHANGE',
    expression: 'CURIOUS',
    lines: [
      'The sky is shifting outside.',
      'Listen to the gentle weather.',
    ],
    priority: 5,
  },
  {
    id: 'dlg_time_change',
    event: 'TIME_CHANGE',
    expression: 'SLEEPY',
    lines: [
      'The hours drift softly by.',
      'Twilight settles in.',
    ],
    priority: 5,
  },
  {
    id: 'dlg_idle_wander',
    event: 'MIMI_IDLE_WANDER',
    expression: 'CONTENT',
    lines: [
      'Just stretching my legs a bit.',
      'Such a cozy corner.',
    ],
    priority: 4,
  },
];

// Helper to choose dialogue with variation tracking
const recentLinesTracker: Record<string, number> = {};

export function getDialogueForEvent(
  event: GameEventType,
  preferredExpression?: MimiExpression
): { line: string; expression: MimiExpression; id: string } | null {
  const matches = MIMI_DIALOGUES.filter((d) => d.event === event);
  if (matches.length === 0) return null;

  const item = matches[0];
  const lines = item.lines;
  const lastIndex = recentLinesTracker[item.id] ?? -1;

  let nextIndex = 0;
  if (lines.length > 1) {
    do {
      nextIndex = Math.floor(Math.random() * lines.length);
    } while (nextIndex === lastIndex);
  }
  recentLinesTracker[item.id] = nextIndex;

  return {
    id: item.id,
    line: lines[nextIndex],
    expression: preferredExpression || item.expression,
  };
}
