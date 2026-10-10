export type MimiExpression =
  | 'HAPPY'
  | 'CONTENT'
  | 'TOUCHED'
  | 'CURIOUS'
  | 'SURPRISED'
  | 'SLEEPY'
  | 'SHY'
  | 'THINKING'
  | 'MELANCHOLY'
  | 'DELIGHTED';

export type MimiPosture =
  | 'STANDING'
  | 'BOUNCE'
  | 'CHEST_TOUCH'
  | 'LEAN_FORWARD'
  | 'RECOIL'
  | 'YAWN_STRETCH'
  | 'SHY_TWIST'
  | 'THINKING_CHIN'
  | 'DOWNWARD_GAZE'
  | 'EXCITED_BOUNCE'
  | 'DRINKING'
  | 'REACHING'
  | 'CROUCHING'
  | 'WATERING';

export type MimiActivity =
  | 'IDLE'
  | 'SELECTED'
  | 'WALKING'
  | 'APPROACHING'
  | 'INTERACTING';

export type JournalThemeId =
  | 'navy'
  | 'cyan'
  | 'pale_blue'
  | 'sky_blue'
  | 'blush_pink'
  | 'dusty_rose'
  | 'purple'
  | 'pale_purple'
  | 'sage_green'
  | 'warm_cream';

export type CurtainColorId =
  | 'pale_blue'
  | 'cyan'
  | 'soft_pink'
  | 'pale_purple'
  | 'dusty_lavender'
  | 'sage_green'
  | 'warm_beige'
  | 'muted_rose';

export type MimiWaypoint = 'DESK' | 'WINDOW' | 'CAT_CORNER' | 'BOOKSHELF';

export type CatState =
  | 'SLEEPING'
  | 'WAKING_UP'
  | 'STRETCHING'
  | 'SITTING'
  | 'GROOMING'
  | 'WALKING'
  | 'WATCHING_WINDOW'
  | 'PURRING';

export type CatLocation = 'BED' | 'RUG' | 'WINDOW_SILL';

export type TimeOfDay = 'MORNING' | 'DAYTIME' | 'SUNSET' | 'EVENING' | 'NIGHT';

export type WeatherType =
  | 'CLEAR_SUNNY'
  | 'SOFT_CLOUDY'
  | 'PASSING_SHOWER'
  | 'GENTLE_RAIN'
  | 'AFTER_RAIN_CLEAR'
  | 'COZY_DOWNPOUR';

export type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER';

export type GameEventType =
  | 'BREW_TEA'
  | 'SIP_TEA'
  | 'TOGGLE_LAMP'
  | 'PET_CAT'
  | 'TAP_WINDOW'
  | 'TRACE_WINDOW_FOG'
  | 'OPEN_JOURNAL'
  | 'WRITE_MEMORY'
  | 'SELECT_DECORATION'
  | 'DISCOVER_HIDDEN_ITEM'
  | 'WEATHER_CHANGE'
  | 'TIME_CHANGE'
  | 'TAP_MIMI'
  | 'UNLOCK_MILESTONE'
  | 'WATER_PLANT'
  | 'TAP_FIGURINE'
  | 'MIMI_IDLE_WANDER';

export interface ExpressionMeta {
  id: MimiExpression;
  num: string;
  name: string;
  triggerDescription: string;
  shortMood: string;
  badgeColor: string;
}

export const EXPRESSION_METAS: Record<MimiExpression, ExpressionMeta> = {
  HAPPY: {
    id: 'HAPPY',
    num: '01',
    name: 'Happy',
    triggerDescription: 'You brew fresh tea or enjoy a quiet activity.',
    shortMood: 'A warm smile with bright eyes',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  CONTENT: {
    id: 'CONTENT',
    num: '02',
    name: 'Content',
    triggerDescription: 'The room rests in calm warmth.',
    shortMood: 'Relaxed eyelids and a peaceful smile',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  TOUCHED: {
    id: 'TOUCHED',
    num: '03',
    name: 'Touched',
    triggerDescription: 'You revisit a sentimental memory in the journal.',
    shortMood: 'Soft dewy eyes and hands near chest',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
  },
  CURIOUS: {
    id: 'CURIOUS',
    num: '04',
    name: 'Curious',
    triggerDescription: 'Inspecting a room detail or outdoor weather change.',
    shortMood: 'Raised eyebrow, head tilted attentively',
    badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
  },
  SURPRISED: {
    id: 'SURPRISED',
    num: '05',
    name: 'Surprised',
    triggerDescription: 'Discovering a secret room keepsake.',
    shortMood: 'Wide eyes, small open mouth, slight recoil',
    badgeColor: 'text-orange-700 bg-orange-50 border-orange-200',
  },
  SLEEPY: {
    id: 'SLEEPY',
    num: '06',
    name: 'Sleepy',
    triggerDescription: 'Late evening hours arrive.',
    shortMood: 'Drowsy eyelids and a gentle cozy stretch',
    badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  SHY: {
    id: 'SHY',
    num: '07',
    name: 'Shy',
    triggerDescription: 'You share a gentle tap or compliment.',
    shortMood: 'Sideways smile and soft pink blush',
    badgeColor: 'text-pink-700 bg-pink-50 border-pink-200',
  },
  THINKING: {
    id: 'THINKING',
    num: '08',
    name: 'Thinking',
    triggerDescription: 'Pondering decorations or reading reflections.',
    shortMood: 'Thoughtful gaze, finger near chin',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  MELANCHOLY: {
    id: 'MELANCHOLY',
    num: '09',
    name: 'Melancholy',
    triggerDescription: 'A quiet rainy moment or sentimental thought.',
    shortMood: 'Gentle reflective gaze and quiet posture',
    badgeColor: 'text-stone-700 bg-stone-100 border-stone-200',
  },
  DELIGHTED: {
    id: 'DELIGHTED',
    num: '10',
    name: 'Delighted',
    triggerDescription: 'Unlocking a special milestone or petting Mochi.',
    shortMood: 'Sparkling eyes and joyful bounce',
    badgeColor: 'text-amber-800 bg-amber-100 border-amber-300',
  },
};

export interface DialogueItem {
  id: string;
  event: GameEventType;
  expression: MimiExpression;
  lines: string[];
  priority?: number;
  oneTime?: boolean;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: string;
  illustrationType: 'RAIN' | 'TEA' | 'CAT' | 'WINDOW' | 'PLANT' | 'CLOVER';
}

export interface CollectibleItem {
  id: string;
  name: string;
  location: string;
  storyNote: string;
  discovered: boolean;
  assetKey: 'clover' | 'pebble' | 'crane' | 'stamp' | 'key' | 'acorn';
}

export interface Milestone {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  badgeKey: 'tea' | 'cat' | 'rain' | 'companion' | 'seeker';
}

export interface GameSettings {
  reducedMotion: boolean;
  soundEnabled: boolean;
  soundVolume: number;
}
