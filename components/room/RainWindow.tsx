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
  const [fogPoints, setFogPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [isTracing, setIsTracing] = useState(false);

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

  // Mountain layer colors based on time & season
  const mountainFar =
    timeOfDay === 'NIGHT'
      ? '#0c1322'
      : timeOfDay === 'EVENING' || timeOfDay === 'SUNSET'
      ? '#4c2e3d'
      : season === 'SPRING'
      ? '#6b7d8d'
      : season === 'AUTUMN'
      ? '#7a5a48'
      : '#526978';

  const mountainMid =
    timeOfDay === 'NIGHT'
      ? '#131e33'
      : timeOfDay === 'EVENING' || timeOfDay === 'SUNSET'
      ? '#5c394c'
      : season === 'SPRING'
      ? '#576c7c'
      : season === 'AUTUMN'
      ? '#8c5a3b'
      : '#3f5968';

  const mountainNear =
    timeOfDay === 'NIGHT'
      ? '#1c2942'
      : timeOfDay === 'EVENING'
      ? '#3b2533'
      : season === 'SPRING'
      ? '#466b56'
      : season === 'SUMMER'
      ? '#2e6b36'
      : season === 'AUTUMN'
      ? '#733e1c'
      : '#2f4239';

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

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsTracing(true);
    sound.playWindowTap();
    onWindowTap();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFogPoints((prev) => [...prev.slice(-30), { x, y }]);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isTracing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFogPoints((prev) => [...prev.slice(-35), { x, y }]);
    if (fogPoints.length > 8) {
      onFogTrace();
    }
  };

  const handlePointerUp = () => {
    setIsTracing(false);
  };

  return (
    <div
      className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-[#4a362a] bg-[#1a1412] select-none cursor-pointer group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      title="Tap the window pane or trace the glass"
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

      {/* OUTSIDE LAYERED MOUNTAIN LANDSCAPE & SKY */}
      <div className={`absolute inset-0 bg-gradient-to-b ${skyBackground} transition-colors duration-1000`}>
        {/* Layer 1: Distant Misty Mountains */}
        <div className="absolute bottom-6 inset-x-0 h-28 opacity-75">
          <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M 0 120 L 0 50 Q 60 20 120 45 Q 180 15 240 40 Q 320 10 400 45 L 400 120 Z"
              fill={mountainFar}
            />
          </svg>
        </div>

        {/* Layer 2: Mid-ground Slopes & Ridge */}
        <div className="absolute bottom-2 inset-x-0 h-24 opacity-85">
          <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M 0 120 L 0 60 Q 70 30 140 65 Q 210 25 280 55 Q 350 35 400 60 L 400 120 Z"
              fill={mountainMid}
            />
          </svg>
        </div>

        {/* Layer 3: Foreground Pine Trees & Seasonal Foliage */}
        <div className="absolute bottom-0 inset-x-0 h-20 opacity-95">
          <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M 0 100 Q 30 40 70 85 Q 120 30 160 80 Q 210 45 260 85 Q 310 35 360 80 Q 380 50 400 70 L 400 100 Z"
              fill={mountainNear}
            />
          </svg>
        </div>

        {/* Summer Sunflowers on the hillside outside */}
        {season === 'SUMMER' && !isRain && (
          <div className="absolute bottom-1 left-24 flex items-center gap-4 opacity-90 pointer-events-none">
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600 shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 shadow-sm" />
            <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-600 shadow-sm" />
          </div>
        )}

        {/* Spring Sakura branches framing top of window */}
        {season === 'SPRING' && (
          <div className="absolute top-0 left-0 w-36 h-16 pointer-events-none opacity-85">
            <svg viewBox="0 0 120 50" className="w-full h-full">
              <path d="M 0 0 Q 40 15 80 10 Q 110 5 120 18" stroke="#4a3528" strokeWidth="2.5" fill="none" />
              <circle cx="45" cy="12" r="3" fill="#f472b6" />
              <circle cx="50" cy="15" r="2.5" fill="#fbcfe8" />
              <circle cx="75" cy="11" r="3" fill="#f472b6" />
              <circle cx="82" cy="8" r="2.5" fill="#fbcfe8" />
              <circle cx="110" cy="12" r="3" fill="#f472b6" />
            </svg>
          </div>
        )}

        {/* Night streetlamp glow outside */}
        {timeOfDay === 'NIGHT' && (
          <div className="absolute top-8 left-16 pointer-events-none">
            <div className="w-4 h-4 rounded-full bg-amber-200/90 shadow-[0_0_35px_18px_rgba(251,191,36,0.55)]" />
            <div className="w-1 h-14 bg-stone-700/80 mx-auto" />
          </div>
        )}

        {/* Warm Sunlight Shafts */}
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

      {/* Traced fog points */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        {fogPoints.map((p, idx) => (
          <circle key={idx} cx={p.x} cy={p.y} r="8" fill="rgba(255,255,255,0.3)" />
        ))}
      </svg>

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
