import React, { useEffect, useRef, useState } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { Cake } from 'lucide-react';
import type { AppConfig } from '../../types.ts';

interface RevealStageProps {
  config: AppConfig;
  onNext: () => void;
  onConfetti: () => void;
}

type Phase = 'analyzing' | 'glitch' | 'reveal';

const analyzingLines = [
  'در حال تحلیل جواب‌ها...',
  'اندازه‌گیری میزان شب‌زنده‌داری 🌙',
  'شمارش فنجون‌های چایی ☕',
  'ردیابی باگ‌های مخفی 🪲',
  'آماده‌سازی نتیجه‌ی نهایی...',
];

/**
 * The twist: the "test" turns out to be a birthday surprise.
 * analyzing (fake results) -> glitch (fake error) -> reveal.
 */
export const RevealStage: React.FC<RevealStageProps> = ({ config, onNext, onConfetti }) => {
  const [phase, setPhase] = useState<Phase>('analyzing');
  const [progress, setProgress] = useState(0);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    const duration = 3600;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // The progress reaches 100%... and then something "breaks".
        later(() => {
          setPhase('glitch');
          soundEngine.playSfx('sad');
        }, 250);
        later(() => {
          setPhase('reveal');
          soundEngine.playSfx('boing');
          later(() => {
            soundEngine.playSfx('tada');
            onConfetti();
          }, 250);
        }, 2000);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lineIdx = Math.min(analyzingLines.length - 1, Math.floor(progress * analyzingLines.length));
  const pct = Math.round(progress * 100);

  if (phase === 'analyzing') {
    return (
      <div className="flex flex-col items-center gap-5 w-full max-w-md mx-auto text-center animate-in fade-in zoom-in-95 duration-400">
        <BugiMascot mood="silly" className="w-32 h-32" />
        <h2 className="font-['Lalezar',sans-serif] text-3xl text-[#2a1a4a]">{analyzingLines[lineIdx]}</h2>
        <div className="w-full h-7 bg-white border-3 border-[#2a1a4a] rounded-full overflow-hidden shadow-[0_3px_0_#2a1a4a]" dir="ltr">
          <div
            className="h-full bg-[repeating-linear-gradient(45deg,#ff6fa5_0_12px,#ff8fb9_12px_24px)] border-r-3 border-[#2a1a4a]"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="font-['Lalezar',sans-serif] text-xl text-purple-900">٪{pct.toLocaleString('fa-IR')}</p>
      </div>
    );
  }

  if (phase === 'glitch') {
    return (
      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto text-center animate-[shake_0.45s_ease-in-out_2]">
        <BugiMascot mood="wow" className="w-32 h-32" />
        <div className="w-full bg-[#2a1a4a] text-[#6fe3c1] border-3 border-[#2a1a4a] rounded-2xl p-4 font-mono text-sm leading-relaxed shadow-[3px_5px_0_#ff6fa5]" dir="ltr">
          <p>&gt; calculating_result()...</p>
          <p className="text-[#ff6fa5]">&gt; ERROR: test_not_found 🪲</p>
          <p className="text-[#ffd84a]">&gt; hmm... something else is here...</p>
        </div>
        <p className="font-['Lalezar',sans-serif] text-2xl text-[#2a1a4a]">یه لحظه... این چیه؟! 👀</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4.5 w-full max-w-md mx-auto text-center animate-in fade-in zoom-in-90 duration-500">
      <h2 className="text-pop text-5xl sm:text-6xl -rotate-2 tracking-wide leading-tight">
        <span className="text-[#ffd84a]">تولدت</span> مبارک
        <br />
        {config.recipientName} جان! 🎉
      </h2>

      <BugiMascot mood="love" isJumping className="w-36 h-36" />

      <div className="relative w-full bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-4 shadow-[3px_5px_0_#2a1a4a] font-bold text-base leading-relaxed">
        <p>
          خبری از تست نبود، همه‌ش بهونه بود! 😆
          <br />
          {config.senderName} منو فرستاده که غافلگیرت کنم. یه کیک، یه نامه و یه پیشنهاد قرار منتظرته!
        </p>
      </div>

      <div className="w-full max-w-xs mt-1">
        <button
          type="button"
          onClick={onNext}
          className="w-full font-['Lalezar',sans-serif] text-2xl text-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 border-3 border-[#2a1a4a] rounded-full py-2.5 px-6 shadow-[0_5px_0_#2a1a4a] active:translate-y-1 active:shadow-[0_1px_0_#2a1a4a] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Cake className="w-6 h-6" />
          <span>بریم سراغ کیک!</span>
        </button>
      </div>
    </div>
  );
};
