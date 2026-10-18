import React, { useState, useEffect, useRef } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { Play, Pause } from 'lucide-react';
import { toPersianDigits } from '../../utils/persianDate.ts';

interface VoiceStageProps {
  onNext: () => void;
}

export const VoiceStage: React.FC<VoiceStageProps> = ({ onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedCount, setPlayedCount] = useState(0);
  const [hasUnlocked, setHasUnlocked] = useState(false);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);

  const animRef = useRef<number>(0);
  const timerRef = useRef<number>(0);

  const voiceQuestionFa =
    'هیس... آروم می‌گم که کسی نشنوه. تا حالا شده یه کدی رو کپی کنی، اجرا بشه، و اصلاً ندونی چرا کار می‌کنه؟';

  const options = [
    'آره، تقریباً همیشه! 😅',
    'آره، و به روی خودم نمی‌آرم',
    'نه، همیشه دقیقاً می‌دونم چی نوشتم',
    'کار می‌کنه؟ پس بهش دست نزن!',
  ];

  const colors = ['#ff6fa5', '#ffd84a', '#6fe3c1', '#5cc8ff'];
  const barCount = 32;

  const handleTogglePlay = () => {
    soundEngine.init();
    if (isPlaying) {
      stopPlaying();
    } else {
      startPlaying();
    }
  };

  const startPlaying = () => {
    setIsPlaying(true);
    setSpeechProgress(0);

    const startTime = performance.now();
    const duration = 7500; // 7.5 seconds simulation

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setSpeechProgress(progress);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        finishPlayback();
      }
    };
    animRef.current = requestAnimationFrame(tick);

    // Speak or play audio if possible
    try {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(voiceQuestionFa);
        u.lang = 'fa-IR';
        u.rate = 0.92;
        u.onend = () => finishPlayback();
        u.onerror = () => finishPlayback();
        window.speechSynthesis.speak(u);
      }
    } catch {
      // fallback handled by timer
    }

    timerRef.current = window.setTimeout(() => {
      finishPlayback();
    }, duration + 1000);
  };

  const finishPlayback = () => {
    setIsPlaying(false);
    setSpeechProgress(1);
    setHasUnlocked(true);
    setPlayedCount((prev) => prev + 1);

    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const stopPlaying = () => {
    setIsPlaying(false);
    setSpeechProgress(0);
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    if (animRef.current) cancelAnimationFrame(animRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    return () => {
      stopPlaying();
    };
  }, []);

  const handleSelectOption = (index: number) => {
    soundEngine.playSfx('ding');
    onNext();
  };

  return (
    <div className="flex flex-col gap-4.5 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-400">
      {/* Eyebrow badge */}
      <div className="self-start inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-3 border-[#2a1a4a] bg-[#ffd84a] text-xs font-black text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] -rotate-1">
        <span>سؤال ۴ از ۴ · صوتی 🎧</span>
      </div>

      {/* Mascot Speech */}
      <div className="flex items-end gap-3">
        <BugiMascot mood={isPlaying ? 'shh' : hasUnlocked ? 'joy' : 'hi'} />
        <div className="relative flex-1 bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-3 shadow-[3px_5px_0_#2a1a4a] font-bold text-sm leading-relaxed text-right min-h-14 flex items-center">
          <p>
            {hasUnlocked
              ? 'شنیدی؟ حالا یکی از گزینه‌ها رو انتخاب کن!'
              : 'سؤال آخر رو باید آروم بپرسم که کسی نشنوه! دکمه رو بزن و خوب گوش بده 🎧'}
          </p>
          <div className="absolute -right-2 bottom-4 w-3.5 h-3.5 bg-white border-t-3 border-r-3 border-[#2a1a4a] rounded-tr-md rotate-45" />
        </div>
      </div>

      {/* Audio Player Bar */}
      <div className="bg-white border-3 border-[#2a1a4a] rounded-full p-2 pl-4 flex items-center gap-3 shadow-[3px_5px_0_#2a1a4a] ltr">
        <button
          type="button"
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'توقف صوت' : 'پخش سؤال صوتی'}
          className="shrink-0 w-12 h-12 rounded-full border-3 border-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 text-[#2a1a4a] flex items-center justify-center shadow-[0_3px_0_#2a1a4a] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Dancing Waveform Bars */}
        <div className="flex-1 flex items-center gap-0.5 h-9 overflow-hidden" aria-hidden="true">
          {Array.from({ length: barCount }).map((_, i) => {
            const h = Math.round(18 + 44 * Math.abs(Math.sin(i * 1.8) * Math.cos(i * 0.6)));
            const activeThreshold = Math.round(speechProgress * barCount);
            const isBarActive = i < activeThreshold;

            return (
              <span
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 min-w-[2px] max-w-[5px] rounded-full transition-all duration-150 ${
                  isBarActive ? 'bg-[#ff6fa5]' : 'bg-[#b79cff] opacity-45'
                }`}
              />
            );
          })}
        </div>

        <span className="font-['Lalezar',sans-serif] text-base text-purple-900 pr-1 shrink-0">
          ۰:۰۸
        </span>
      </div>

      {/* Fallback Text Toggle if user can't hear or audio fails */}
      {(!hasUnlocked || playedCount >= 1) && !showTextFallback && (
        <button
          type="button"
          onClick={() => {
            setShowTextFallback(true);
            setHasUnlocked(true);
          }}
          className="self-center text-sm font-bold text-purple-950 underline decoration-pink-400 hover:text-pink-600 transition-colors"
        >
          نمی‌شنوم؛ متن سؤال رو نشون بده
        </button>
      )}

      {/* Text of voice question shown when requested */}
      {showTextFallback && (
        <div className="bg-amber-50 border-3 border-[#2a1a4a] rounded-2xl p-3 text-center font-bold text-base text-[#2a1a4a] shadow-[0_3px_0_#2a1a4a] animate-in fade-in duration-300">
          «{voiceQuestionFa}»
        </div>
      )}

      {/* Options List */}
      <div className={`flex flex-col gap-3 transition-opacity duration-300 ${hasUnlocked ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={!hasUnlocked}
            onClick={() => handleSelectOption(idx)}
            className="flex items-center gap-3 p-3.5 min-h-16 text-right font-bold text-base rounded-2xl border-3 border-[#2a1a4a] bg-white hover:bg-yellow-100 shadow-[0_4px_0_#2a1a4a] hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#2a1a4a] transition-all cursor-pointer"
          >
            <span
              style={{ backgroundColor: colors[idx % colors.length] }}
              className="shrink-0 w-9 h-9 rounded-full border-3 border-[#2a1a4a] flex items-center justify-center font-['Lalezar',sans-serif] text-lg leading-none"
            >
              {toPersianDigits(idx + 1)}
            </span>
            <span className="flex-1 break-words">{opt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
