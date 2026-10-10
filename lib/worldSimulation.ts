import { TimeOfDay, WeatherType, Season } from '@/types/game';

export function getTimeOfDay(now: Date = new Date()): TimeOfDay {
  const hour = now.getHours();
  if (hour >= 6 && hour < 10) return 'MORNING';
  if (hour >= 10 && hour < 17) return 'DAYTIME';
  if (hour >= 17 && hour < 19) return 'SUNSET';
  if (hour >= 19 && hour < 22) return 'EVENING';
  return 'NIGHT';
}

export function getSeason(now: Date = new Date()): Season {
  const month = now.getMonth(); // 0-indexed (0 = Jan, 9 = Oct)
  if (month >= 2 && month <= 4) return 'SPRING';
  if (month >= 5 && month <= 7) return 'SUMMER';
  if (month >= 8 && month <= 10) return 'AUTUMN';
  return 'WINTER';
}

// Next natural weather transition logic based on current weather and season
export function getNextWeather(current: WeatherType, season: Season): WeatherType {
  const rand = Math.random();

  switch (current) {
    case 'CLEAR_SUNNY':
      if (rand < 0.5) return 'SOFT_CLOUDY';
      if (rand < 0.8) return 'PASSING_SHOWER';
      return 'CLEAR_SUNNY';

    case 'SOFT_CLOUDY':
      if (rand < 0.4) return 'GENTLE_RAIN';
      if (rand < 0.75) return 'CLEAR_SUNNY';
      return 'PASSING_SHOWER';

    case 'PASSING_SHOWER':
      if (rand < 0.5) return 'AFTER_RAIN_CLEAR';
      if (rand < 0.8) return 'GENTLE_RAIN';
      return 'SOFT_CLOUDY';

    case 'GENTLE_RAIN':
      if (season === 'AUTUMN' || season === 'SPRING') {
        if (rand < 0.35) return 'COZY_DOWNPOUR';
        if (rand < 0.7) return 'AFTER_RAIN_CLEAR';
        return 'GENTLE_RAIN';
      } else {
        if (rand < 0.5) return 'AFTER_RAIN_CLEAR';
        if (rand < 0.75) return 'SOFT_CLOUDY';
        return 'GENTLE_RAIN';
      }

    case 'COZY_DOWNPOUR':
      return rand < 0.65 ? 'GENTLE_RAIN' : 'AFTER_RAIN_CLEAR';

    case 'AFTER_RAIN_CLEAR':
      return rand < 0.6 ? 'CLEAR_SUNNY' : 'SOFT_CLOUDY';

    default:
      return 'GENTLE_RAIN';
  }
}

export interface AmbientAtmosphere {
  skyGradient: string;
  roomTint: string;
  sunbeamOpacity: number;
  lampInfluence: number;
  rainDropsActive: boolean;
  rainIntensityName: 'NONE' | 'MIST' | 'GENTLE' | 'DOWNPOUR';
  description: string;
}

export function getAtmosphere(time: TimeOfDay, weather: WeatherType, season: Season): AmbientAtmosphere {
  const isRain =
    weather === 'GENTLE_RAIN' || weather === 'COZY_DOWNPOUR' || weather === 'PASSING_SHOWER';

  const rainIntensityName =
    weather === 'COZY_DOWNPOUR'
      ? 'DOWNPOUR'
      : weather === 'GENTLE_RAIN'
      ? 'GENTLE'
      : weather === 'PASSING_SHOWER'
      ? 'MIST'
      : 'NONE';

  // Base sky tone
  let sky = 'from-[#607d8b] to-[#b0bec5]';
  let room = 'bg-amber-950/20';
  let sunbeam = 0;
  let lampInfluence = 0.4;

  if (time === 'MORNING') {
    sky = isRain
      ? 'from-[#546e7a] via-[#78909c] to-[#90a4ae]'
      : 'from-[#ffcc80] via-[#ffe0b2] to-[#b3e5fc]';
    room = isRain ? 'bg-slate-900/40' : 'bg-amber-100/15';
    sunbeam = isRain ? 0 : 0.45;
    lampInfluence = 0.5;
  } else if (time === 'DAYTIME') {
    sky = isRain
      ? 'from-[#455a64] via-[#607d8b] to-[#90a4ae]'
      : 'from-[#81d4fa] via-[#b3e5fc] to-[#e1f5fe]';
    room = isRain ? 'bg-slate-900/45' : 'bg-amber-50/10';
    sunbeam = isRain ? 0 : 0.6;
    lampInfluence = 0.3;
  } else if (time === 'SUNSET') {
    sky = isRain
      ? 'from-[#3e2723] via-[#5d4037] to-[#8d6e63]'
      : 'from-[#bf360c] via-[#f57c00] to-[#ffb74d]';
    room = isRain ? 'bg-orange-950/40' : 'bg-amber-500/20';
    sunbeam = isRain ? 0 : 0.5;
    lampInfluence = 0.6;
  } else if (time === 'EVENING') {
    sky = isRain
      ? 'from-[#1a237e] via-[#283593] to-[#303f9f]'
      : 'from-[#0d47a1] via-[#1565c0] to-[#1e88e5]';
    room = 'bg-indigo-950/50';
    sunbeam = 0;
    lampInfluence = 0.85;
  } else {
    // NIGHT
    sky = 'from-[#0a0e17] via-[#0f172a] to-[#1e293b]';
    room = 'bg-stone-950/70';
    sunbeam = 0;
    lampInfluence = 1.0;
  }

  const weatherLabel =
    weather === 'CLEAR_SUNNY'
      ? 'Clear & Sunlit'
      : weather === 'SOFT_CLOUDY'
      ? 'Soft Cloud Cover'
      : weather === 'PASSING_SHOWER'
      ? 'Passing Shower'
      : weather === 'GENTLE_RAIN'
      ? 'Gentle Rain'
      : weather === 'AFTER_RAIN_CLEAR'
      ? 'Fresh After Rain'
      : 'Cozy Downpour';

  const timeLabel =
    time === 'MORNING'
      ? 'Morning Light'
      : time === 'DAYTIME'
      ? 'Afternoon'
      : time === 'SUNSET'
      ? 'Golden Twilight'
      : time === 'EVENING'
      ? 'Quiet Evening'
      : 'Midnight Hour';

  return {
    skyGradient: sky,
    roomTint: room,
    sunbeamOpacity: sunbeam,
    lampInfluence,
    rainDropsActive: isRain,
    rainIntensityName,
    description: `${timeLabel} · ${weatherLabel} (${season})`,
  };
}
