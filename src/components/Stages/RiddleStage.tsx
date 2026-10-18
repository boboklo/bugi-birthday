import React, { useState } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { validateRiddleAnswer } from '../../utils/riddleValidator.ts';
import { toPersianDigits } from '../../utils/persianDate.ts';
import { HelpCircle, KeyRound, Sparkles } from 'lucide-react';
import type { AppConfig, MascotMood } from '../../types.ts';

interface RiddleStageProps {
  config: AppConfig;
  onNext: () => void;
  onConfetti: () => void;
}

export const RiddleStage: React.FC<RiddleStageProps> = ({ config, onNext, onConfetti }) => {
  const [inputVal, setInputVal] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [mood, setMood] = useState<MascotMood>('hi');
  const [feedback, setFeedback] = useState<string>('');
  const [wrongTries, setWrongTries] = useState(0);
  const [hintsGiven, setHintsGiven] = useState(0);

  const riddleLines = [
    'هیچ‌کس عمداً منو نمی‌نویسه،',
    'ولی تو هر کدی یه گوشه قایم شدم.',
    'پیدام نکنی، ساعت می‌شه سه صبح؛',
    'پیدام کنی، می‌گی «آهان، همین بود!»',
    'من کی‌ام؟',
  ];

  const hints = ['اسمم شبیه اسم یک حشره‌ست 🪲', 'سه حرفه و با «ب» شروع می‌شه!'];

  const wrongResponses = [
    'نه، ولی ایده‌ی جالبی بود! یه بار دیگه فکر کن.',
    'هنوز قفله! اگه دوست داشتی راهنمایی بگیر.',
    'اسم منو یادت رفته؟! یه نگاه به خود من بنداز!',
  ];

  const handleUnlock = (msg: string) => {
    setIsUnlocked(true);
    setFeedback(msg);
    setMood('love');
    soundEngine.playSfx('ding');

    setTimeout(() => {
      soundEngine.playSfx('tada');
      onConfetti();
    }, 450);

    setTimeout(() => {
      onNext();
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocked) return;

    if (!inputVal.trim()) {
      setFeedback('اول جواب معما رو بنویس!');
      return;
    }

    const isCorrect = validateRiddleAnswer(inputVal, [config.riddleAnswer]);
    if (isCorrect) {
      handleUnlock('درسته! منم، باگ! 🪲 قفل پاکت باز شد.');
    } else {
      setWrongTries((prev) => prev + 1);
      setFeedback(wrongResponses[wrongTries % wrongResponses.length]);
      setMood('sad');
      soundEngine.playSfx('sad');

      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleGetHint = () => {
    if (hintsGiven < hints.length) {
      setHintsGiven((prev) => prev + 1);
      setMood('silly');
      soundEngine.playSfx('pop');
    }
  };

  return (
    <div className="flex flex-col gap-4.5 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-400">
      {/* Eyebrow badge */}
      <div className="self-start inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-3 border-[#2a1a4a] bg-[#ffd84a] text-xs font-black text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] -rotate-1">
        <span>مرحله‌ی آخر · معمای رمز پاکت</span>
      </div>

      {/* Mascot Speech */}
      <div className="flex items-end gap-3">
        <BugiMascot mood={mood} />
        <div className="relative flex-1 bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-3 shadow-[3px_5px_0_#2a1a4a] font-bold text-sm leading-relaxed text-right min-h-14 flex items-center">
          <p>
            یه نامه‌ی اختصاصی برات آوردم، اما پاکتش قفله! رمزش جواب این معماست:
          </p>
          <div className="absolute -right-2 bottom-4 w-3.5 h-3.5 bg-white border-t-3 border-r-3 border-[#2a1a4a] rounded-tr-md rotate-45" />
        </div>
      </div>

      {/* 3D Envelope Container */}
      <div className="flex justify-center my-2">
        <div
          className={`relative w-64 aspect-[3/2] [perspective:900px] transition-transform ${
            isShaking ? 'animate-[shake_0.45s_ease-in-out]' : ''
          }`}
        >
          {/* Back Paper */}
          <div className="absolute inset-0 z-0">
            <svg viewBox="0 0 300 200" className="w-full h-full">
              <rect x="3" y="3" width="294" height="194" rx="16" fill="#e8528a" stroke="#2a1a4a" strokeWidth="5" />
            </svg>
          </div>

          {/* Hidden Letter Paper Sliding Up */}
          <div
            className={`absolute left-[8%] right-[8%] top-[12%] h-[82%] z-10 bg-white border-3 border-[#2a1a4a] rounded-lg p-3 flex flex-col gap-2 transition-transform duration-700 ease-out shadow-md ${
              isUnlocked ? '-translate-y-24 scale-105' : 'translate-y-0'
            }`}
          >
            <div className="h-2 rounded-full bg-purple-300 w-3/4" />
            <div className="h-2 rounded-full bg-purple-200 w-full" />
            <div className="h-2 rounded-full bg-purple-200 w-5/6" />
            <div className="h-2 rounded-full bg-purple-200 w-1/2" />
          </div>

          {/* Front Envelope Body */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <svg viewBox="0 0 300 200" className="w-full h-full overflow-visible">
              <path
                d="M3 3L150 112L297 3V181Q297 197 281 197H19Q3 197 3 181Z"
                fill="#ff6fa5"
                stroke="#2a1a4a"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <path d="M14 189L116 124M286 189L184 124" fill="none" stroke="#2a1a4a" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Top Flap Rotating Open */}
          <div
            className={`absolute left-0 right-0 top-0 h-[56%] z-30 origin-top transition-transform duration-700 ease-out ${
              isUnlocked ? '-rotate-x-180 z-0 opacity-40' : 'rotate-x-0'
            }`}
          >
            <svg viewBox="0 0 300 112" className="w-full h-full overflow-visible">
              <path d="M3 3H297L150 109Z" fill="#ffa3c6" stroke="#2a1a4a" strokeWidth="5" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Heart Wax Seal */}
          <div
            className={`absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 z-40 w-14 h-14 transition-all duration-400 ${
              isUnlocked ? 'scale-0 opacity-0 rotate-45' : 'scale-100 opacity-100 animate-pulse'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_2px_0_#2a1a4a]">
              <path
                d="M12 21.4S3.6 16 3.6 9.6C3.6 6.5 5.9 4.6 8.4 4.6c1.6 0 2.9.8 3.6 2.1.7-1.3 2-2.1 3.6-2.1 2.5 0 4.8 1.9 4.8 5C20.4 16 12 21.4 12 21.4z"
                fill="#ff4d63"
                stroke="#2a1a4a"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <rect x="8.8" y="10.6" width="6.4" height="5.2" rx="1.3" fill="#fff" stroke="#2a1a4a" strokeWidth="1" />
              <path d="M10.3 10.6V9.4a1.7 1.7 0 0 1 3.4 0v1.2" fill="none" stroke="#2a1a4a" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Riddle Card */}
      <div className="relative bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-3xl p-5 shadow-[4px_6px_0_#2a1a4a] text-center pt-7">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 -rotate-1 bg-[repeating-linear-gradient(45deg,#ffd84a_0_8px,#ffffff_8px_16px)] border-2 border-[#2a1a4a] rounded-sm opacity-95 pointer-events-none" />
        <div className="text-lg sm:text-xl font-bold leading-loose text-purple-950">
          {riddleLines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Answer Form */}
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <input
          type="text"
          value={inputVal}
          disabled={isUnlocked}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="جوابت رو بنویس..."
          className="flex-1 bg-white text-[#2a1a4a] font-bold text-base border-3 border-[#2a1a4a] rounded-full px-5 py-3 shadow-[0_4px_0_#2a1a4a] focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isUnlocked}
          className="shrink-0 font-['Lalezar',sans-serif] text-xl text-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 border-3 border-[#2a1a4a] rounded-full px-6 py-3 shadow-[0_4px_0_#2a1a4a] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
        >
          <KeyRound className="w-5 h-5 stroke-[2.5]" />
          <span>بازش کن</span>
        </button>
      </form>

      {/* Feedback line */}
      {feedback && (
        <p className="text-center font-bold text-base text-purple-950 min-h-6 animate-in fade-in duration-200">
          {feedback}
        </p>
      )}

      {/* Hints List */}
      {hintsGiven > 0 && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: hintsGiven }).map((_, i) => (
            <div
              key={i}
              className="bg-[#fff6e2] text-[#2a1a4a] border-3 border-dashed border-[#2a1a4a] rounded-2xl px-4 py-2 font-bold text-sm animate-in fade-in slide-in-from-top-2 duration-300"
            >
              💡 راهنمایی {toPersianDigits(i + 1)}: {hints[i]}
            </div>
          ))}
        </div>
      )}

      {/* Hint Actions */}
      <div className="flex justify-center gap-3">
        {hintsGiven < hints.length && (
          <button
            type="button"
            disabled={isUnlocked}
            onClick={handleGetHint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#2a1a4a] bg-white text-sm font-bold text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
          >
            <HelpCircle className="w-4 h-4 text-purple-700" />
            <span>راهنمایی می‌خوام</span>
          </button>
        )}

        {wrongTries >= 2 && !isUnlocked && (
          <button
            type="button"
            onClick={() => handleUnlock('جوابش «باگ» بود! یعنی خودِ من! ولی عیب نداره، پاکت رو باز کردم.')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#2a1a4a] bg-amber-200 text-sm font-bold text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>بیخیال، رمزش رو بگو!</span>
          </button>
        )}
      </div>
    </div>
  );
};
