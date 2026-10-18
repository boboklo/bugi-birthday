import React, { useState } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { Play, Settings2 } from 'lucide-react';
import type { AppConfig } from '../../types.ts';

interface IntroStageProps {
  config: AppConfig;
  /** Only the sender should ever see the settings button (see App.tsx). */
  showSettings: boolean;
  onOpenSettings: () => void;
  onStart: () => void;
  onConfetti: (x: number, y: number) => void;
}

/**
 * The first screen must look like an innocent mini-quiz.
 * Nothing here may hint at a birthday, gift or surprise.
 */
export const IntroStage: React.FC<IntroStageProps> = ({
  config,
  showSettings,
  onOpenSettings,
  onStart,
  onConfetti,
}) => {
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = (e: React.MouseEvent) => {
    if (isStarting) return;
    setIsStarting(true);
    soundEngine.init();
    soundEngine.playSfx('pop');

    const rect = e.currentTarget.getBoundingClientRect();
    onConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

    setTimeout(onStart, 450);
  };

  return (
    <div className="flex flex-col items-center gap-5 text-center animate-in fade-in zoom-in-95 duration-500">
      {/* Sender-only settings (hidden for the recipient) */}
      {showSettings && (
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full border-2 border-[#2a1a4a] bg-white text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 transition-transform"
          >
            <Settings2 className="w-4 h-4 text-purple-700" />
            <span>تنظیمات (فقط فرستنده)</span>
          </button>
        </div>
      )}

      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-3 border-[#2a1a4a] bg-[#6fe3c1] text-xs font-black text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] rotate-1">
        <span>⏱️ فقط ۳۰ ثانیه · ۴ سؤال</span>
      </div>

      <h1 className="text-pop text-4xl sm:text-5xl -rotate-1 tracking-wide leading-tight">
        تست <span className="text-[#ffd84a]">برنامه‌نویس واقعی</span> بودن!
      </h1>

      {/* Mascot + speech bubble */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        <BugiMascot
          mood={isStarting ? 'joy' : 'hi'}
          isJumping={isStarting}
          className="w-36 h-36"
        />
        <div className="relative w-full bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-4 shadow-[3px_5px_0_#2a1a4a] font-bold text-base leading-relaxed text-center">
          <div className="absolute left-1/2 -top-2.5 -translate-x-1/2 w-4 h-4 bg-white border-t-3 border-l-3 border-[#2a1a4a] rounded-tl-md rotate-45" />
          <p>
            سلام {config.recipientName}! من <strong className="text-pink-600">باگی‌ام</strong>، همونی که هر شب ساعت ۳ صبح سراغت میاد 🪲
            <br />
            چهار تا سؤال دارم تا ببینم چقدر منو می‌شناسی!
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs mt-1">
        <button
          type="button"
          onClick={handleStart}
          disabled={isStarting}
          className="w-full relative font-['Lalezar',sans-serif] text-2xl text-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 border-3 border-[#2a1a4a] rounded-full py-2.5 px-8 shadow-[0_5px_0_#2a1a4a] active:translate-y-1 active:shadow-[0_1px_0_#2a1a4a] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <Play className="w-6 h-6 fill-[#2a1a4a]" />
          <span>{isStarting ? 'بزن بریم...' : 'شروع تست'}</span>
        </button>
      </div>

      <p className="text-sm font-medium text-purple-900/80">
        🔊 یکی از سؤال‌ها صوتیه؛ صدای گوشیت رو روشن کن
      </p>
    </div>
  );
};
