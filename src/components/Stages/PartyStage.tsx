import React, { useState, useEffect } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { ArrowLeft, Sparkles, Wind } from 'lucide-react';
import type { AppConfig } from '../../types.ts';

interface PartyStageProps {
  config: AppConfig;
  onNext: () => void;
  onConfetti: () => void;
}

export const PartyStage: React.FC<PartyStageProps> = ({ config, onNext, onConfetti }) => {
  // 5 candles
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [activeLyricLine, setActiveLyricLine] = useState<number>(0);
  const [isCakeCelebrated, setIsCakeCelebrated] = useState(false);

  const candleColors = ['#ff6fa5', '#6fe3c1', '#5cc8ff', '#b79cff', '#ff9d5c'];

  useEffect(() => {
    // Start birthday song with synchronized lyrics
    const stopSong = soundEngine.playHappyBirthdaySong((lineIdx) => {
      setActiveLyricLine(lineIdx);
    });

    return () => {
      stopSong();
    };
  }, []);

  const handleBlowCandle = (index: number) => {
    if (!candles[index]) return; // already blown out

    const next = [...candles];
    next[index] = false;
    setCandles(next);

    soundEngine.playSfx('blow');

    const remaining = next.filter(Boolean).length;
    if (remaining === 0 && !isCakeCelebrated) {
      setIsCakeCelebrated(true);
      soundEngine.playSfx('tada');
      onConfetti();
    }
  };

  const handleBlowAll = () => {
    setCandles([false, false, false, false, false]);
    setIsCakeCelebrated(true);
    soundEngine.playSfx('tada');
    onConfetti();
  };

  const remainingCandles = candles.filter(Boolean).length;

  return (
    <div className="flex flex-col items-center gap-4.5 w-full max-w-md mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-pop text-4xl sm:text-5xl -rotate-1 tracking-wide">
        <span className="text-[#ffd84a]">تولدت</span> مبارک!
      </h2>

      {/* Birthday Cake SVG with 5 interactive candles */}
      <div className="relative w-full max-w-xs my-1 select-none">
        <svg
          viewBox="0 0 320 270"
          className={`w-full overflow-visible transition-transform duration-500 ${
            isCakeCelebrated ? 'animate-[bounce_1.5s_ease-in-out_infinite]' : ''
          }`}
          aria-label="کیک تولد با ۵ شمع تعاملی"
        >
          {/* Plate */}
          <ellipse cx="160" cy="252" rx="150" ry="15" fill="#5cc8ff" stroke="#2a1a4a" strokeWidth="4" />

          {/* Bottom Tier */}
          <rect x="40" y="166" width="240" height="84" rx="18" fill="#ff6fa5" stroke="#2a1a4a" strokeWidth="4" />

          {/* Bottom Frosting Drops */}
          <rect x="62" y="176" width="18" height="30" rx="9" fill="#fff" stroke="#2a1a4a" strokeWidth="3" />
          <rect x="112" y="176" width="18" height="20" rx="9" fill="#fff" stroke="#2a1a4a" strokeWidth="3" />
          <rect x="172" y="176" width="18" height="32" rx="9" fill="#fff" stroke="#2a1a4a" strokeWidth="3" />
          <rect x="232" y="176" width="18" height="24" rx="9" fill="#fff" stroke="#2a1a4a" strokeWidth="3" />
          <rect x="36" y="158" width="248" height="30" rx="15" fill="#fff" stroke="#2a1a4a" strokeWidth="4" />

          {/* Cake Face */}
          <ellipse cx="116" cy="222" rx="7" ry="9.5" fill="#2a1a4a" />
          <circle cx="113.5" cy="218" r="2.6" fill="#fff" />
          <ellipse cx="204" cy="222" rx="7" ry="9.5" fill="#2a1a4a" />
          <circle cx="201.5" cy="218" r="2.6" fill="#fff" />
          <ellipse cx="90" cy="234" rx="12" ry="7" fill="#ff6fa5" opacity=".8" />
          <ellipse cx="230" cy="234" rx="12" ry="7" fill="#ff6fa5" opacity=".8" />

          {/* Smile or Big Joyous Mouth */}
          {!isCakeCelebrated ? (
            <path d="M143 228Q160 244 177 228" fill="none" stroke="#2a1a4a" strokeWidth="4" strokeLinecap="round" />
          ) : (
            <g>
              <path d="M139 225Q160 258 181 225Z" fill="#2a1a4a" stroke="#2a1a4a" strokeWidth="4" strokeLinejoin="round" />
              <ellipse cx="160" cy="241" rx="10" ry="6" fill="#ff6fa5" />
            </g>
          )}

          {/* Top Tier */}
          <rect x="72" y="104" width="176" height="62" rx="16" fill="#ffd84a" stroke="#2a1a4a" strokeWidth="4" />

          {/* Top Frosting */}
          <rect x="92" y="114" width="16" height="28" rx="8" fill="#fff" stroke="#2a1a4a" strokeWidth="3" />
          <rect x="150" y="114" width="16" height="18" rx="8" fill="#fff" stroke="#2a1a4a" strokeWidth="3" />
          <rect x="206" y="114" width="16" height="30" rx="8" fill="#fff" stroke="#2a1a4a" strokeWidth="3" />
          <rect x="66" y="96" width="188" height="26" rx="13" fill="#fff" stroke="#2a1a4a" strokeWidth="4" />

          {/* Sprinkles */}
          <g strokeWidth="5" strokeLinecap="round" fill="none">
            <path d="M96 152l8-4" stroke="#ff6fa5" />
            <path d="M128 150l7 5" stroke="#6fe3c1" />
            <path d="M164 148l8-3" stroke="#5cc8ff" />
            <path d="M198 154l8-5" stroke="#b79cff" />
            <path d="M226 148l5 6" stroke="#ff6fa5" />
          </g>

          {/* 5 Candles */}
          {[106, 133, 160, 187, 214].map((candleX, i) => {
            const isLit = candles[i];
            const color = candleColors[i];

            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`شمع ${i + 1} از ۵ ${isLit ? '(روشن، برای فوت کلیک کن)' : '(خاموش)'}`}
                onClick={() => handleBlowCandle(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleBlowCandle(i);
                  }
                }}
                transform={`translate(${candleX} 0)`}
                className="cursor-pointer group/candle"
              >
                {/* Generous touch target */}
                <rect x="-18" y="18" width="36" height="88" fill="transparent" />

                {/* Candle body */}
                <rect x="-6" y="62" width="12" height="38" rx="4" fill={color} stroke="#2a1a4a" strokeWidth="3" />
                <path d="M-6 74l12-5M-6 86l12-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
                <path d="M0 62v-6" fill="none" stroke="#2a1a4a" strokeWidth="3" strokeLinecap="round" />

                {/* Animated Flame */}
                {isLit && (
                  <g className="origin-bottom animate-[flick_0.35s_ease-in-out_infinite_alternate]">
                    <path
                      d="M0 20C10 32 11 46 0 54C-11 46-10 32 0 20Z"
                      fill="#ff9d5c"
                      stroke="#2a1a4a"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    <path d="M0 34C4.5 39 4.5 46 0 50C-4.5 46-4.5 39 0 34Z" fill="#fff6b0" />
                  </g>
                )}

                {/* Smoke Puff when blown */}
                {!isLit && (
                  <circle
                    cx="0"
                    cy="44"
                    r="8"
                    fill="#ffffff"
                    stroke="#2a1a4a"
                    strokeWidth="2"
                    className="animate-[puff_1s_ease-out_forwards] opacity-0"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Synchronized Karaoke Lyrics */}
      <div className="font-['Lalezar',sans-serif] text-2xl text-white [text-shadow:2px_2px_0_#2a1a4a] leading-relaxed">
        <span className={activeLyricLine === 0 ? 'text-[#ffd84a] scale-110 inline-block transition-transform' : 'opacity-85'}>
          تولدت مبارک،{' '}
        </span>
        <span className={activeLyricLine === 1 ? 'text-[#ffd84a] scale-110 inline-block transition-transform' : 'opacity-85'}>
          تولدت مبارک،{' '}
        </span>
        <br />
        <span className={activeLyricLine === 2 ? 'text-[#ffd84a] scale-110 inline-block transition-transform' : 'opacity-85'}>
          تولدت مبارک {config.recipientName} جان،{' '}
        </span>
        <span className={activeLyricLine === 3 ? 'text-[#ffd84a] scale-110 inline-block transition-transform' : 'opacity-85'}>
          تولدت مبارک!
        </span>
      </div>

      {/* Mascot Reaction & Candle Status */}
      <div className="flex items-end gap-3 w-full max-w-md">
        <BugiMascot mood={isCakeCelebrated ? 'love' : 'joy'} />
        <div className="relative flex-1 bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-3 shadow-[3px_5px_0_#2a1a4a] font-bold text-sm leading-relaxed text-right min-h-14 flex items-center">
          <p>
            {isCakeCelebrated ? (
              <span>
                🎉 همه‌ی شمع‌ها خاموش شدن! حالا یه <strong className="text-pink-600">آرزوی قشنگ</strong> بکن...
              </span>
            ) : (
              <span>
                روی شمع‌ها بزن تا خاموش بشن! ({remainingCandles} شمع هنوز روشنه)
              </span>
            )}
          </p>
          <div className="absolute -right-2 bottom-4 w-3.5 h-3.5 bg-white border-t-3 border-r-3 border-[#2a1a4a] rounded-tr-md rotate-45" />
        </div>
      </div>

      {/* Blow all button helper */}
      {!isCakeCelebrated && (
        <button
          type="button"
          onClick={handleBlowAll}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-white text-purple-900 border-2 border-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 active:translate-y-0.5"
        >
          <Wind className="w-4 h-4 text-sky-500" />
          <span>فوت کردن همه‌ی شمع‌ها با هم</span>
        </button>
      )}

      {/* Next Button */}
      <div className="w-full max-w-xs mt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full font-['Lalezar',sans-serif] text-2xl text-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 border-3 border-[#2a1a4a] rounded-full py-2.5 px-6 shadow-[0_5px_0_#2a1a4a] active:translate-y-1 active:shadow-[0_1px_0_#2a1a4a] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-6 h-6 fill-white" />
          <span>ادامه به مرحله بعد</span>
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
