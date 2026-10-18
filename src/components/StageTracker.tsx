import React from 'react';
import { Volume2, VolumeX, Check, Heart } from 'lucide-react';
import { toPersianDigits } from '../utils/persianDate.ts';
import type { StageId } from '../types.ts';

interface StageTrackerProps {
  currentStage: StageId;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const StageTracker: React.FC<StageTrackerProps> = ({
  currentStage,
  isMuted,
  onToggleMute,
}) => {
  const getStageIndex = (stage: StageId): number => {
    switch (stage) {
      case 'q0': return 0;
      case 'q1': return 1;
      case 'q2': return 2;
      case 'voice': return 3;
      case 'party':
      case 'riddle':
      case 'letter':
      case 'plan':
      case 'sent': return 4;
      default: return -1;
    }
  };

  const activeIdx = getStageIndex(currentStage);
  if (activeIdx < 0) return null;

  const balloons = [
    { color: '#ff6fa5', label: '۱' },
    { color: '#ffd84a', label: '۲' },
    { color: '#6fe3c1', label: '۳' },
    { color: '#5cc8ff', label: '۴' },
    { color: '#b79cff', label: '۵' },
  ];

  return (
    <nav className="flex items-end justify-between gap-3 pt-2 w-full max-w-md mx-auto" aria-label="پیشرفت مرحله‌ها">
      <ol className="flex flex-1 justify-between items-end list-none m-0 p-0">
        {balloons.map((b, i) => {
          const isDone = i < activeIdx;
          const isCurrent = i === activeIdx;

          return (
            <li
              key={i}
              className={`relative w-11 h-14 flex flex-col items-center justify-start origin-bottom transition-all duration-300 ${
                isCurrent ? 'scale-125 -translate-y-1 animate-pulse' : ''
              }`}
            >
              {/* Balloon Graphic */}
              <svg viewBox="0 0 46 60" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
                {/* Balloon Body */}
                <path
                  d="M23 3C12 3 5 11 5 21c0 10 8 18 18 20 10-2 18-10 18-20C41 11 34 3 23 3z"
                  fill={b.color}
                  stroke="#2a1a4a"
                  strokeWidth="3"
                  className={isDone || isCurrent ? 'opacity-100' : 'opacity-40'}
                />
                <path
                  d="M23 41l-4 5h8z"
                  fill={b.color}
                  stroke="#2a1a4a"
                  strokeWidth="3"
                  className={isDone || isCurrent ? 'opacity-100' : 'opacity-40'}
                />
                <path
                  d="M23 46c-4 4 4 6 0 12"
                  fill="none"
                  stroke="#2a1a4a"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className={isDone || isCurrent ? 'opacity-100' : 'opacity-40'}
                />
                <ellipse cx="14" cy="14" rx="3.4" ry="5.6" transform="rotate(28 14 14)" fill="#fff" opacity=".7" />
              </svg>

              {/* Number / Icon */}
              <span className="relative z-10 w-9 h-9 mt-0.5 flex items-center justify-center font-['Lalezar',sans-serif] text-lg text-[#2a1a4a]">
                {isDone ? (
                  <Check className="w-5 h-5 stroke-[3.5]" />
                ) : i === 4 ? (
                  <Heart className="w-4 h-4 fill-[#2a1a4a]" />
                ) : (
                  toPersianDigits(i + 1)
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Sound Mute/Unmute Toggle */}
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? 'فعال کردن صدا' : 'قطع صدا'}
        aria-pressed={isMuted}
        className="shrink-0 w-11 h-11 rounded-full border-3 border-[#2a1a4a] bg-white text-[#2a1a4a] flex items-center justify-center cursor-pointer shadow-[0_4px_0_#2a1a4a] active:translate-y-1 active:shadow-[0_1px_0_#2a1a4a] transition-all"
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-purple-900" />}
      </button>
    </nav>
  );
};
