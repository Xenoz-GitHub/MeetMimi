'use client';

import React, { useRef, useEffect, useState } from 'react';
import { TimeOfDay, WeatherType, Season, CurtainColorId } from '@/types/game';
import { InteractiveCurtains } from '@/components/room/InteractiveCurtains';
import { sound } from '@/lib/audio';

interface RainWindowProps {
  timeOfDay: TimeOfDay;
  weather: WeatherType;
  season: Season;
  clockTime?: string;
  curtainsOpen?: boolean;
  curtainColorId?: CurtainColorId;
  onToggleCurtains?: () => void;
  onOpenCurtainColor?: () => void;
  onWindowTap: () => void;
  onFogTrace: () => void;
}

const subscribeClock = (callback: () => void) => {
  const interval = setInterval(callback, 15000);
  return () => clearInterval(interval);
};

const getClientClock = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const getServerClock = () => '--:--';

export const RainWindow: React.FC<RainWindowProps> = ({
  timeOfDay,
  weather,
  season,
  clockTime,
  curtainsOpen = true,
  curtainColorId = 'warm_beige',
  onToggleCurtains,
  onOpenCurtainColor,
  onWindowTap,
  onFogTrace,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const systemTime = React.useSyncExternalStore(subscribeClock, getClientClock, getServerClock);
  const activeDisplayTime = clockTime || systemTime;

  const isRain =
    weather === 'GENTLE_RAIN' || weather === 'COZY_DOWNPOUR' || weather === 'PASSING_SHOWER';
  const isSunny = weather === 'CLEAR_SUNNY' || weather === 'AFTER_RAIN_CLEAR';

  // Sky tone
  const skyBackground =
    timeOfDay === 'MORNING'
      ? isRain
        ? 'from-[#54687a] via-[#6f8393] to-[#8a9ca9]'
        : 'from-[#ffbe76] via-[#f6e58d] to-[#7ed6df]'
      : timeOfDay === 'DAYTIME'
      ? isRain
        ? 'from-[#4e6170] via-[#637989] to-[#7d92a1]'
        : 'from-[#5ba4cf] via-[#9ad0ec] to-[#e6f3f8]'
      : timeOfDay === 'SUNSET'
      ? isRain
        ? 'from-[#4a3430] via-[#6e4e48] to-[#8d6760]'
        : 'from-[#d946ef] via-[#f43f5e] to-[#fbbf24]'
      : timeOfDay === 'EVENING'
      ? 'from-[#192a56] via-[#273c75] to-[#3b6790]'
      : 'from-[#070b16] via-[#0d172b] to-[#18233c]';

  // City skyline architectural tones based on time of day
  const isNight = timeOfDay === 'NIGHT';
  const isEvening = timeOfDay === 'EVENING';
  const isSunset = timeOfDay === 'SUNSET';
  const isMorning = timeOfDay === 'MORNING';

  const citySkylineFar =
    isNight ? '#0a101d' : isEvening ? '#17223b' : isSunset ? '#3d1c2d' : isMorning ? '#5a6b7b' : '#455663';
  const cityBuildingMid =
    isNight ? '#0f172a' : isEvening ? '#1e293b' : isSunset ? '#4a2335' : isMorning ? '#64748b' : '#526270';
  const cityBuildingNear =
    isNight ? '#162033' : isEvening ? '#26334d' : isSunset ? '#5a2b3d' : isMorning ? '#718096' : '#5e6d7a';

  const windowGlowColor =
    isNight ? 'rgba(254, 240, 138, 0.95)' : isEvening ? 'rgba(253, 224, 71, 0.9)' : isSunset ? 'rgba(251, 146, 60, 0.85)' : 'rgba(254, 249, 195, 0.55)';
  const windowCoolColor =
    isNight ? 'rgba(125, 211, 252, 0.85)' : isEvening ? 'rgba(56, 189, 248, 0.8)' : 'rgba(186, 230, 253, 0.4)';

  // Rain, Birds, Petals animation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 340);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 220);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // 1. Rain streaks
    const dropCount =
      weather === 'COZY_DOWNPOUR'
        ? 130
        : weather === 'GENTLE_RAIN'
        ? 75
        : weather === 'PASSING_SHOWER'
        ? 30
        : 0;

    const drops = Array.from({ length: dropCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 10 + Math.random() * 16,
      speed: 5 + Math.random() * (weather === 'COZY_DOWNPOUR' ? 9 : 5),
      opacity: 0.3 + Math.random() * 0.45,
      thickness: Math.random() * 1.5 + 0.8,
    }));

    // 2. Birds (flying during non-rain daylight)
    const canBirdsFly = !isRain && timeOfDay !== 'NIGHT';
    const birds = Array.from({ length: canBirdsFly ? 3 : 0 }, (_, i) => ({
      x: 30 + i * 80 + Math.random() * 40,
      y: 35 + Math.random() * 45,
      speedX: 0.8 + Math.random() * 0.4,
      wingPhase: Math.random() * Math.PI * 2,
    }));

    // 3. Drifting sakura petals (Spring) or autumn leaves (Autumn)
    const petalCount = season === 'SPRING' ? 14 : season === 'AUTUMN' ? 12 : 0;
    const petals = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: season === 'SPRING' ? 3.5 : 4.5,
      speedX: 0.6 + Math.random() * 0.8,
      speedY: 0.5 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      color: season === 'SPRING' ? '#f472b6' : '#d97706',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw birds
      if (canBirdsFly && birds.length > 0) {
        birds.forEach((b) => {
          b.x += b.speedX;
          b.wingPhase += 0.12;
          if (b.x > width + 20) b.x = -20;

          const wingY = Math.sin(b.wingPhase) * 3;
          ctx.beginPath();
          // Silhouette bird v-wing shape
          ctx.moveTo(b.x - 7, b.y + wingY);
          ctx.quadraticCurveTo(b.x - 3, b.y - 1, b.x, b.y);
          ctx.quadraticCurveTo(b.x + 3, b.y - 1, b.x + 7, b.y + wingY);
          ctx.strokeStyle = timeOfDay === 'SUNSET' ? '#4a1525' : '#273444';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        });
      }

      // Draw drifting petals / leaves
      if (petals.length > 0) {
        petals.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          p.rotation += p.rotSpeed;
          if (p.x > width) p.x = 0;
          if (p.y > height) p.y = 0;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      }

      // Draw falling rain
      if (dropCount > 0) {
        drops.forEach((d) => {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 2, d.y + d.length);
          ctx.strokeStyle = `rgba(220, 235, 250, ${d.opacity})`;
          ctx.lineWidth = d.thickness;
          ctx.lineCap = 'round';
          ctx.stroke();

          d.y += d.speed;
          d.x -= 0.6;
          if (d.y > height) {
            d.y = -d.length;
            d.x = Math.random() * width;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [weather, season, isRain, timeOfDay]);

  const handlePointerDown = () => {
    sound.playWindowTap();
    onWindowTap();
  };

  return (
    <div
      className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#4a362a] bg-[#1a1412] select-none cursor-pointer group"
      onPointerDown={handlePointerDown}
      title="Tap the window pane to listen to the rain"
    >
      {/* REAL-TIME DEVICE CLOCK MOUNTED AT WINDOW HEADER */}
      <div className="absolute top-2 right-3 z-30 pointer-events-none">
        <div className="px-2 py-0.5 rounded-md bg-stone-900/80 border border-stone-700/80 backdrop-blur-sm flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span
            className="text-[10px] font-mono font-bold tracking-wider text-amber-100"
            suppressHydrationWarning
          >
            {activeDisplayTime}
          </span>
        </div>
      </div>

      {/* OUTSIDE DETAILED BUSY CITY SKYLINE & HIGH-RISE BUILDINGS */}
      <div className={`absolute inset-0 bg-gradient-to-b ${skyBackground} transition-colors duration-1000 overflow-hidden`}>
        {/* Layer 1: Distant City Skyscrapers, Spire Towers & Harbor Suspension Bridge */}
        <div className="absolute bottom-6 inset-x-0 h-40 opacity-80">
          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
            {/* Distant skyline silhouettes */}
            {/* Left cluster */}
            <rect x="0" y="65" width="26" height="85" fill={citySkylineFar} />
            <rect x="22" y="42" width="32" height="108" fill={citySkylineFar} />
            {/* Needle Tower with Aircraft Warning Beacon */}
            <rect x="37" y="14" width="2" height="28" fill={citySkylineFar} />
            <circle cx="38" cy="14" r="2.2" fill="#ef4444" className="animate-pulse" />

            <rect x="52" y="68" width="24" height="82" fill={citySkylineFar} />
            <polygon points="74,52 82,36 90,52" fill={citySkylineFar} />
            <rect x="74" y="52" width="16" height="98" fill={citySkylineFar} />
            <rect x="81" y="22" width="2" height="14" fill={citySkylineFar} />
            <circle cx="82" cy="22" r="2" fill="#ef4444" className="animate-pulse" />

            {/* Distant Suspension Bridge spanning across the river bay */}
            <g opacity="0.6">
              {/* Bridge Tower 1 */}
              <rect x="104" y="60" width="3" height="70" fill={citySkylineFar} />
              <rect x="111" y="60" width="3" height="70" fill={citySkylineFar} />
              <rect x="102" y="74" width="14" height="2" fill={citySkylineFar} />
              <circle cx="109" cy="59" r="1.5" fill="#ef4444" className="animate-pulse" />
              {/* Bridge Tower 2 */}
              <rect x="144" y="60" width="3" height="70" fill={citySkylineFar} />
              <rect x="151" y="60" width="3" height="70" fill={citySkylineFar} />
              <rect x="142" y="74" width="14" height="2" fill={citySkylineFar} />
              <circle cx="149" cy="59" r="1.5" fill="#ef4444" className="animate-pulse" />
              {/* Main suspension cable curve */}
              <path d="M 94 92 Q 124 106 148 76 Q 170 106 190 92" stroke={citySkylineFar} strokeWidth="1" fill="none" />
              {/* Deck */}
              <line x1="90" y1="92" x2="195" y2="92" stroke={citySkylineFar} strokeWidth="2" />
            </g>

            {/* Center Supertall Skyscraper cluster */}
            <rect x="162" y="28" width="38" height="122" fill={citySkylineFar} />
            <rect x="180" y="10" width="2.5" height="18" fill={citySkylineFar} />
            <circle cx="181" cy="10" r="2.2" fill="#ef4444" className="animate-pulse" />
            
            {/* Stepped art-deco tower with illuminated tiered crowns */}
            <rect x="198" y="55" width="28" height="95" fill={citySkylineFar} />
            <rect x="203" y="42" width="18" height="13" fill={citySkylineFar} />
            <rect x="208" y="32" width="8" height="10" fill={citySkylineFar} />
            <rect x="211.5" y="18" width="1.5" height="14" fill={citySkylineFar} />
            <circle cx="212" cy="18" r="2" fill="#ef4444" className="animate-pulse" />

            {/* Center-Right Tower with Crown Spire */}
            <rect x="230" y="52" width="36" height="98" fill={citySkylineFar} />
            <polygon points="230,52 248,32 266,52" fill={citySkylineFar} />
            <rect x="247" y="16" width="2" height="16" fill={citySkylineFar} />
            <circle cx="248" cy="16" r="2.2" fill="#ef4444" className="animate-pulse" />

            {/* Distant Construction Crane on rooftop */}
            <g stroke={citySkylineFar} strokeWidth="1" fill="none" opacity="0.8">
              <line x1="282" y1="52" x2="282" y2="28" />
              <line x1="268" y1="30" x2="300" y2="30" />
              <line x1="282" y1="24" x2="295" y2="30" />
              <circle cx="298" cy="30" r="1.5" fill="#f59e0b" className="animate-ping" />
            </g>
            <rect x="274" y="52" width="28" height="98" fill={citySkylineFar} />

            {/* Right cluster */}
            <rect x="306" y="38" width="40" height="112" fill={citySkylineFar} />
            {/* Diagonal sloped top modern architectural tower */}
            <polygon points="346,48 376,28 376,150 346,150" fill={citySkylineFar} />
            <rect x="375" y="14" width="2" height="14" fill={citySkylineFar} />
            <circle cx="376" cy="14" r="2" fill="#ef4444" className="animate-pulse" />

            <rect x="376" y="56" width="34" height="94" fill={citySkylineFar} />
            <rect x="408" y="32" width="36" height="118" fill={citySkylineFar} />
            <rect x="425" y="14" width="2" height="18" fill={citySkylineFar} />
            <circle cx="426" cy="14" r="2" fill="#ef4444" className="animate-pulse" />

            <rect x="442" y="48" width="32" height="102" fill={citySkylineFar} />
            <rect x="472" y="60" width="28" height="90" fill={citySkylineFar} />

            {/* Distant window specks (sparkling in evening/night and overcast) */}
            <g fill={windowGlowColor} opacity="0.7">
              <rect x="26" y="52" width="2" height="2" />
              <rect x="32" y="62" width="2" height="2" />
              <rect x="28" y="72" width="2" height="2" />
              <rect x="168" y="40" width="2" height="2" />
              <rect x="176" y="50" width="2" height="2" />
              <rect x="184" y="40" width="2" height="2" />
              <rect x="170" y="64" width="2" height="2" />
              <rect x="178" y="74" width="2" height="2" />
              <rect x="236" y="60" width="2" height="2" />
              <rect x="244" y="70" width="2" height="2" />
              <rect x="252" y="60" width="2" height="2" />
              <rect x="314" y="48" width="2" height="2" />
              <rect x="322" y="58" width="2" height="2" />
              <rect x="330" y="68" width="2" height="2" />
              <rect x="414" y="44" width="2" height="2" />
              <rect x="424" y="54" width="2" height="2" />
              <rect x="432" y="64" width="2" height="2" />
            </g>
          </svg>
        </div>

        {/* Layer 2: Mid-ground Dense City Buildings & Glowing Windows */}
        <div className="absolute bottom-2 inset-x-0 h-34 opacity-95">
          <svg viewBox="0 0 500 125" preserveAspectRatio="none" className="w-full h-full">
            {/* Building 1: Left Commercial Office Tower with Glass Grid */}
            <rect x="8" y="32" width="46" height="93" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            {/* Rooftop Water Tank on Stilts */}
            <line x1="18" y1="32" x2="18" y2="24" stroke={cityBuildingMid} strokeWidth="1.5" />
            <line x1="28" y1="32" x2="28" y2="24" stroke={cityBuildingMid} strokeWidth="1.5" />
            <ellipse cx="23" cy="22" rx="7" ry="3.5" fill="#64748b" />
            <rect x="16" y="19" width="14" height="5" fill="#475569" />
            <ellipse cx="23" cy="19" rx="7" ry="3" fill="#94a3b8" />

            {/* Building 2: Slender High-rise */}
            <rect x="52" y="20" width="38" height="105" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            <rect x="68" y="8" width="2" height="12" fill="#94a3b8" />
            <circle cx="69" cy="8" r="1.8" fill="#ef4444" className="animate-pulse" />

            {/* Building 3: Broad Commercial Highrise with Stepped Roof */}
            <rect x="86" y="38" width="54" height="87" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            <rect x="94" y="30" width="38" height="8" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />

            {/* Building 4: Central Modern Prism Skyscraper */}
            <rect x="138" y="14" width="48" height="111" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            <polygon points="138,14 162,2 186,14" fill={cityBuildingMid} />
            <line x1="162" y1="2" x2="162" y2="-2" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="162" cy="-2" r="2" fill="#ef4444" className="animate-pulse" />

            {/* Building 5: Stepped Residential Complex with Brick Texture & Water Tower */}
            <rect x="182" y="28" width="54" height="97" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            <rect x="214" y="18" width="14" height="10" rx="1" fill="#78350f" />

            {/* Building 6: Corporate Tower with Spire */}
            <rect x="232" y="18" width="44" height="107" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            <rect x="252" y="6" width="2" height="12" fill="#94a3b8" />
            <circle cx="253" cy="6" r="1.8" fill="#ef4444" className="animate-pulse" />

            {/* Building 7: Apartment Complex with Fire Escapes */}
            <rect x="272" y="34" width="48" height="91" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />

            {/* Building 8: Modern High-rise */}
            <rect x="316" y="24" width="42" height="101" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />

            {/* Building 9: Broad Complex with Rooftop Sat-dish */}
            <rect x="354" y="32" width="56" height="93" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            <path d="M 388 26 Q 396 30 394 20" stroke="#94a3b8" strokeWidth="2" fill="none" />

            {/* Building 10: Right Metropolitan Tower */}
            <rect x="406" y="16" width="46" height="109" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />
            <rect x="448" y="38" width="46" height="87" fill={cityBuildingMid} stroke="#1e293b" strokeWidth="0.8" />

            {/* DETAILED GLOWING WINDOW GRIDS ACROSS THE MID BUILDINGS */}
            {/* Left Tower Windows */}
            <g fill={windowGlowColor}>
              <rect x="58" y="28" width="4.5" height="3.5" rx="0.5" />
              <rect x="67" y="28" width="4.5" height="3.5" rx="0.5" />
              <rect x="76" y="28" width="4.5" height="3.5" rx="0.5" />
              <rect x="58" y="38" width="4.5" height="3.5" rx="0.5" />
              <rect x="67" y="38" width="4.5" height="3.5" rx="0.5" />
              <rect x="76" y="38" width="4.5" height="3.5" rx="0.5" />
              <rect x="58" y="48" width="4.5" height="3.5" rx="0.5" />
              <rect x="76" y="48" width="4.5" height="3.5" rx="0.5" />
              <rect x="67" y="58" width="4.5" height="3.5" rx="0.5" />
              <rect x="76" y="58" width="4.5" height="3.5" rx="0.5" />
              <rect x="58" y="68" width="4.5" height="3.5" rx="0.5" />
              <rect x="67" y="68" width="4.5" height="3.5" rx="0.5" />
            </g>

            {/* Central Glass Skyscraper Windows */}
            <g fill={windowCoolColor}>
              <rect x="144" y="22" width="5" height="3.5" rx="0.5" />
              <rect x="154" y="22" width="5" height="3.5" rx="0.5" />
              <rect x="164" y="22" width="5" height="3.5" rx="0.5" />
              <rect x="174" y="22" width="5" height="3.5" rx="0.5" />
              <rect x="144" y="32" width="5" height="3.5" rx="0.5" />
              <rect x="154" y="32" width="5" height="3.5" rx="0.5" />
              <rect x="174" y="32" width="5" height="3.5" rx="0.5" />
              <rect x="144" y="42" width="5" height="3.5" rx="0.5" />
              <rect x="164" y="42" width="5" height="3.5" rx="0.5" />
              <rect x="174" y="42" width="5" height="3.5" rx="0.5" />
              <rect x="144" y="52" width="5" height="3.5" rx="0.5" />
              <rect x="154" y="52" width="5" height="3.5" rx="0.5" />
              <rect x="164" y="52" width="5" height="3.5" rx="0.5" />
              <rect x="144" y="62" width="5" height="3.5" rx="0.5" />
              <rect x="174" y="62" width="5" height="3.5" rx="0.5" />
              <rect x="154" y="72" width="5" height="3.5" rx="0.5" />
              <rect x="164" y="72" width="5" height="3.5" rx="0.5" />
            </g>

            {/* Right Tower Windows */}
            <g fill={windowGlowColor}>
              <rect x="238" y="26" width="4.5" height="3.5" rx="0.5" />
              <rect x="247" y="26" width="4.5" height="3.5" rx="0.5" />
              <rect x="256" y="26" width="4.5" height="3.5" rx="0.5" />
              <rect x="265" y="26" width="4.5" height="3.5" rx="0.5" />
              <rect x="238" y="36" width="4.5" height="3.5" rx="0.5" />
              <rect x="256" y="36" width="4.5" height="3.5" rx="0.5" />
              <rect x="265" y="36" width="4.5" height="3.5" rx="0.5" />
              <rect x="247" y="46" width="4.5" height="3.5" rx="0.5" />
              <rect x="256" y="46" width="4.5" height="3.5" rx="0.5" />
              <rect x="238" y="56" width="4.5" height="3.5" rx="0.5" />
              <rect x="247" y="56" width="4.5" height="3.5" rx="0.5" />
              <rect x="265" y="56" width="4.5" height="3.5" rx="0.5" />

              <rect x="324" y="32" width="4" height="3" rx="0.5" />
              <rect x="332" y="32" width="4" height="3" rx="0.5" />
              <rect x="340" y="32" width="4" height="3" rx="0.5" />
              <rect x="324" y="42" width="4" height="3" rx="0.5" />
              <rect x="340" y="42" width="4" height="3" rx="0.5" />
              <rect x="332" y="52" width="4" height="3" rx="0.5" />
              <rect x="340" y="52" width="4" height="3" rx="0.5" />

              <rect x="414" y="24" width="4" height="3" rx="0.5" />
              <rect x="424" y="24" width="4" height="3" rx="0.5" />
              <rect x="434" y="24" width="4" height="3" rx="0.5" />
              <rect x="414" y="34" width="4" height="3" rx="0.5" />
              <rect x="434" y="34" width="4" height="3" rx="0.5" />
              <rect x="424" y="44" width="4" height="3" rx="0.5" />
              <rect x="434" y="44" width="4" height="3" rx="0.5" />
            </g>
          </svg>
        </div>

        {/* Layer 3: Foreground City Apartments, Balconies, Neon Signage & Elevated Expressway with Continuous Flowing Traffic */}
        <div className="absolute bottom-0 inset-x-0 h-28 opacity-98">
          <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Near Apartment Blocks with Solid Foundations */}
            <rect x="0" y="22" width="62" height="78" fill={cityBuildingNear} stroke="#0f172a" strokeWidth="1" />
            <rect x="56" y="12" width="68" height="88" fill={cityBuildingNear} stroke="#0f172a" strokeWidth="1" />
            <rect x="120" y="28" width="75" height="72" fill={cityBuildingNear} stroke="#0f172a" strokeWidth="1" />
            <rect x="188" y="16" width="85" height="84" fill={cityBuildingNear} stroke="#0f172a" strokeWidth="1" />
            <rect x="268" y="10" width="65" height="90" fill={cityBuildingNear} stroke="#0f172a" strokeWidth="1" />
            <rect x="328" y="24" width="80" height="76" fill={cityBuildingNear} stroke="#0f172a" strokeWidth="1" />
            <rect x="404" y="14" width="96" height="86" fill={cityBuildingNear} stroke="#0f172a" strokeWidth="1" />

            {/* Balcony railings on near apartments */}
            <g stroke="#334155" strokeWidth="1">
              <line x1="62" y1="24" x2="86" y2="24" />
              <line x1="92" y1="24" x2="116" y2="24" />
              <line x1="62" y1="40" x2="86" y2="40" />
              <line x1="92" y1="40" x2="116" y2="40" />
              <line x1="278" y1="22" x2="308" y2="22" />
              <line x1="278" y1="38" x2="308" y2="38" />
            </g>

            {/* Glowing Neon Sign on Rooftop */}
            <g transform="translate(136, 15)" style={{ animation: 'neon-shimmer 3s ease-in-out infinite' }}>
              <rect x="0" y="0" width="40" height="13" rx="2.5" fill="#0f172a" stroke="#ec4899" strokeWidth="1.2" />
              <text x="6" y="9.5" fill="#f472b6" fontSize="7.5" fontFamily="sans-serif" fontWeight="900" letterSpacing="0.8">CAFE</text>
              <circle cx="34" cy="6.5" r="2.5" fill="#38bdf8" />
            </g>

            {/* Near Glowing Apartment Windows */}
            <g fill={windowGlowColor}>
              <rect x="8" y="28" width="6" height="5" rx="0.5" />
              <rect x="20" y="28" width="6" height="5" rx="0.5" />
              <rect x="32" y="28" width="6" height="5" rx="0.5" />
              <rect x="8" y="40" width="6" height="5" rx="0.5" />
              <rect x="32" y="40" width="6" height="5" rx="0.5" />

              <rect x="66" y="16" width="7" height="6" rx="0.5" />
              <rect x="96" y="16" width="7" height="6" rx="0.5" />
              <rect x="66" y="32" width="7" height="6" rx="0.5" />
              <rect x="82" y="32" width="7" height="6" rx="0.5" />

              <rect x="198" y="24" width="6" height="5" rx="0.5" />
              <rect x="212" y="24" width="6" height="5" rx="0.5" />
              <rect x="226" y="24" width="6" height="5" rx="0.5" />
              <rect x="198" y="38" width="6" height="5" rx="0.5" />
              <rect x="226" y="38" width="6" height="5" rx="0.5" />

              <rect x="342" y="32" width="6" height="5" rx="0.5" />
              <rect x="356" y="32" width="6" height="5" rx="0.5" />
              <rect x="370" y="32" width="6" height="5" rx="0.5" />
              <rect x="342" y="46" width="6" height="5" rx="0.5" />
              <rect x="370" y="46" width="6" height="5" rx="0.5" />

              <rect x="418" y="24" width="7" height="6" rx="0.5" />
              <rect x="434" y="24" width="7" height="6" rx="0.5" />
              <rect x="450" y="24" width="7" height="6" rx="0.5" />
              <rect x="418" y="38" width="7" height="6" rx="0.5" />
              <rect x="450" y="38" width="7" height="6" rx="0.5" />
            </g>

            {/* === ELEVATED CITY EXPRESSWAY WITH CONTINUOUS BUSY MOVING TRAFFIC === */}
            {/* Concrete highway deck with support piers */}
            <rect x="0" y="66" width="500" height="12" fill="#1e293b" stroke="#334155" strokeWidth="1" />
            <line x1="0" y1="72" x2="500" y2="72" stroke="#475569" strokeWidth="0.8" strokeDasharray="6 4" />
            {/* Highway support pillars */}
            <rect x="65" y="78" width="14" height="22" fill="#0f172a" />
            <rect x="175" y="78" width="14" height="22" fill="#0f172a" />
            <rect x="285" y="78" width="14" height="22" fill="#0f172a" />
            <rect x="395" y="78" width="14" height="22" fill="#0f172a" />

            {/* Traffic Stream 1: Eastbound Lane (Diverse Headlights & Vehicle Silhouettes) */}
            <g style={{ animation: 'traffic-east 8s linear infinite' }}>
              {/* Vehicle 1: Standard Sedan */}
              <g transform="translate(20, 68)">
                <rect x="0" y="0" width="14" height="3" rx="1" fill="#475569" />
                <rect x="3" y="-1.5" width="7" height="1.8" rx="0.5" fill="#334155" />
                <ellipse cx="14" cy="1" rx="2.5" ry="1.2" fill="#fef08a" />
                <ellipse cx="14" cy="2.5" rx="2.5" ry="1.2" fill="#fef08a" />
              </g>

              {/* Vehicle 2: Yellow City Taxi with Roof Light */}
              <g transform="translate(90, 68)">
                <rect x="0" y="0" width="13" height="3" rx="1" fill="#ca8a04" />
                <rect x="3" y="-1.5" width="6" height="1.8" rx="0.5" fill="#a16207" />
                <rect x="5.5" y="-2.5" width="2" height="1" rx="0.3" fill="#fde047" />
                <ellipse cx="13" cy="1" rx="2.2" ry="1.2" fill="#fef08a" />
                <ellipse cx="13" cy="2.5" rx="2.2" ry="1.2" fill="#fef08a" />
              </g>

              {/* Vehicle 3: Metro City Transit Bus */}
              <g transform="translate(180, 67)">
                <rect x="0" y="0" width="28" height="4.5" rx="1" fill="#1e3a5f" />
                <rect x="2" y="0.8" width="22" height="1.5" rx="0.5" fill="#93c5fd" opacity="0.8" />
                <ellipse cx="28" cy="1.2" rx="3" ry="1.4" fill="#fef08a" />
                <ellipse cx="28" cy="3.5" rx="3" ry="1.4" fill="#fef08a" />
              </g>

              {/* Vehicle 4: Delivery Box Van */}
              <g transform="translate(280, 67.5)">
                <rect x="0" y="-1" width="12" height="4.5" rx="0.8" fill="#e2e8f0" />
                <rect x="12" y="0.5" width="6" height="3" rx="0.8" fill="#94a3b8" />
                <ellipse cx="18" cy="1.2" rx="2.5" ry="1.2" fill="#fef08a" />
                <ellipse cx="18" cy="2.8" rx="2.5" ry="1.2" fill="#fef08a" />
              </g>

              {/* Vehicle 5: Compact Hatchback */}
              <g transform="translate(380, 68)">
                <rect x="0" y="0" width="10" height="3" rx="1" fill="#64748b" />
                <rect x="2" y="-1.5" width="5" height="1.8" rx="0.5" fill="#475569" />
                <ellipse cx="10" cy="1" rx="2" ry="1.2" fill="#fef08a" />
                <ellipse cx="10" cy="2.5" rx="2" ry="1.2" fill="#fef08a" />
              </g>
            </g>

            {/* Traffic Stream 1 (Staggered Second Wave) */}
            <g style={{ animation: 'traffic-east 8s linear infinite 4s' }}>
              <g transform="translate(50, 68)">
                <rect x="0" y="0" width="15" height="3" rx="1" fill="#334155" />
                <ellipse cx="15" cy="1" rx="2.2" ry="1.2" fill="#fef08a" />
                <ellipse cx="15" cy="2.5" rx="2.2" ry="1.2" fill="#fef08a" />
              </g>
              <g transform="translate(140, 67.5)">
                <rect x="0" y="-0.5" width="18" height="4" rx="0.8" fill="#475569" />
                <ellipse cx="18" cy="1" rx="2.5" ry="1.3" fill="#fef08a" />
                <ellipse cx="18" cy="2.8" rx="2.5" ry="1.3" fill="#fef08a" />
              </g>
              <g transform="translate(240, 68)">
                <rect x="0" y="0" width="12" height="3" rx="1" fill="#ca8a04" />
                <ellipse cx="12" cy="1" rx="2.2" ry="1.2" fill="#fef08a" />
                <ellipse cx="12" cy="2.5" rx="2.2" ry="1.2" fill="#fef08a" />
              </g>
              <g transform="translate(340, 67)">
                <rect x="0" y="0" width="26" height="4.5" rx="1" fill="#1e3a5f" />
                <rect x="2" y="0.8" width="20" height="1.5" rx="0.5" fill="#93c5fd" opacity="0.8" />
                <ellipse cx="26" cy="1.2" rx="3" ry="1.4" fill="#fef08a" />
                <ellipse cx="26" cy="3.5" rx="3" ry="1.4" fill="#fef08a" />
              </g>
            </g>

            {/* Traffic Stream 2: Westbound Lane (Diverse Taillights & Silhouettes) */}
            <g style={{ animation: 'traffic-west 7.5s linear infinite' }}>
              {/* Vehicle 1: Sedan with Dual Taillights */}
              <g transform="translate(450, 73.5)">
                <rect x="0" y="0" width="14" height="3" rx="1" fill="#334155" />
                <rect x="4" y="-1.5" width="7" height="1.8" rx="0.5" fill="#1e293b" />
                <ellipse cx="0" cy="1" rx="2" ry="1.2" fill="#f43f5e" />
                <ellipse cx="0" cy="2.5" rx="2" ry="1.2" fill="#f43f5e" />
              </g>

              {/* Vehicle 2: Metro Bus with Tall Rear Taillights */}
              <g transform="translate(360, 72.5)">
                <rect x="0" y="0" width="26" height="4.5" rx="1" fill="#1e293b" />
                <rect x="3" y="0.8" width="20" height="1.5" rx="0.5" fill="#fca5a5" opacity="0.6" />
                <ellipse cx="0" cy="1" rx="2.2" ry="1.4" fill="#f43f5e" />
                <ellipse cx="0" cy="3.5" rx="2.2" ry="1.4" fill="#f43f5e" />
              </g>

              {/* Vehicle 3: Delivery Van with High Brake Light */}
              <g transform="translate(260, 73)">
                <rect x="5" y="0" width="6" height="3" rx="0.8" fill="#64748b" />
                <rect x="0" y="-1" width="11" height="4.5" rx="0.8" fill="#475569" />
                <ellipse cx="0" cy="0.8" rx="2" ry="1.2" fill="#f43f5e" />
                <ellipse cx="0" cy="2.8" rx="2" ry="1.2" fill="#f43f5e" />
                <circle cx="0" cy="-0.5" r="0.8" fill="#ef4444" />
              </g>

              {/* Vehicle 4: SUV with Horizontal Light Bar */}
              <g transform="translate(160, 73.5)">
                <rect x="0" y="0" width="16" height="3.2" rx="1" fill="#1e293b" />
                <line x1="0" y1="1" x2="0" y2="2.5" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Vehicle 5: Taxi with Rear Glow */}
              <g transform="translate(60, 73.5)">
                <rect x="0" y="0" width="13" height="3" rx="1" fill="#854d0e" />
                <rect x="5.5" y="-2" width="2" height="0.8" rx="0.3" fill="#fef08a" opacity="0.8" />
                <ellipse cx="0" cy="1" rx="1.8" ry="1.1" fill="#f43f5e" />
                <ellipse cx="0" cy="2.5" rx="1.8" ry="1.1" fill="#f43f5e" />
              </g>
            </g>

            {/* Traffic Stream 2 (Staggered Second Wave) */}
            <g style={{ animation: 'traffic-west 7.5s linear infinite 3.75s' }}>
              <g transform="translate(410, 73.5)">
                <rect x="0" y="0" width="14" height="3" rx="1" fill="#1e293b" />
                <ellipse cx="0" cy="1" rx="2" ry="1.2" fill="#f43f5e" />
                <ellipse cx="0" cy="2.5" rx="2" ry="1.2" fill="#f43f5e" />
              </g>
              <g transform="translate(300, 72.5)">
                <rect x="0" y="0" width="26" height="4.5" rx="1" fill="#0f172a" />
                <ellipse cx="0" cy="1.2" rx="2.2" ry="1.3" fill="#f43f5e" />
                <ellipse cx="0" cy="3.5" rx="2.2" ry="1.3" fill="#f43f5e" />
              </g>
              <g transform="translate(200, 73.5)">
                <rect x="0" y="0" width="12" height="3" rx="1" fill="#475569" />
                <ellipse cx="0" cy="1" rx="1.8" ry="1.1" fill="#f43f5e" />
                <ellipse cx="0" cy="2.5" rx="1.8" ry="1.1" fill="#f43f5e" />
              </g>
              <g transform="translate(90, 73)">
                <rect x="0" y="-0.5" width="15" height="4" rx="0.8" fill="#334155" />
                <ellipse cx="0" cy="0.8" rx="2" ry="1.2" fill="#f43f5e" />
                <ellipse cx="0" cy="2.8" rx="2" ry="1.2" fill="#f43f5e" />
              </g>
            </g>

            {/* Wet road surface rain reflections */}
            <line x1="10" y1="76" x2="490" y2="76" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" opacity="0.7" />
          </svg>
        </div>

        {/* City Rainy Mist Haze Drifting across the Skyline */}
        {isRain && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(203, 213, 225, 0.22) 0%, rgba(148, 163, 184, 0.15) 60%, rgba(100, 116, 139, 0.28) 100%)',
            }}
          />
        )}

        {/* Warm Sunlight Shafts across City during sunny times */}
        {isSunny && timeOfDay !== 'NIGHT' && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(135deg, rgba(254, 240, 138, 0.35) 0%, rgba(253, 224, 71, 0.1) 40%, transparent 75%)',
            }}
          />
        )}
      </div>

      {/* Dynamic Animated Canvas (Rain, Birds, Petals) */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-10" />

      {/* Condensation / Fog overlay */}
      <div className="absolute inset-0 bg-sky-100/10 backdrop-blur-[1px] pointer-events-none z-10" />

      {/* Realistic Wooden Panes & Window Sill Frame */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-4 bg-[#3d2c22] shadow-lg border-x border-[#2d1f18]" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-4 bg-[#3d2c22] shadow-lg border-y border-[#2d1f18]" />
        <div className="absolute bottom-0 inset-x-0 h-4 bg-[#574032] border-t border-[#6d513f] shadow-md" />
      </div>

      {/* Interactive Window Curtains */}
      {onToggleCurtains && (
        <InteractiveCurtains
          isOpen={curtainsOpen}
          colorId={curtainColorId}
          onToggleOpen={onToggleCurtains}
          onOpenColorPalette={onOpenCurtainColor || (() => {})}
        />
      )}
    </div>
  );
};
