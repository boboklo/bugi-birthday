import React, { useState, useRef, useEffect } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { toPersianDigits } from '../../utils/persianDate.ts';
import { Heart, Sparkles } from 'lucide-react';
import type { AppConfig, MascotMood } from '../../types.ts';

interface LetterStageProps {
  config: AppConfig;
  onAcceptInvite: () => void;
  onHearts: () => void;
}

export const LetterStage: React.FC<LetterStageProps> = ({ config, onAcceptInvite, onHearts }) => {
  const [showInvite, setShowInvite] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [bugiMood, setBugiMood] = useState<MascotMood>('love');
  const [reactionText, setReactionText] = useState('من فقط قاصدم! این سؤال از طرف کسیه که منو فرستاده.');

  const noBtnRef = useRef<HTMLButtonElement | null>(null);
  const yesBtnRef = useRef<HTMLButtonElement | null>(null);

  const noPhrases = [
    'اوه! دکمه‌ی «نه» خجالت کشید و در رفت!',
    'خطای ۴۰۴: چنین انتخابی پیدا نشد!',
    'هر چی دنبالش بری، یه جای دیگه می‌ره. مثل باگ!',
    'من قاصدم، ولی کلمه «نه» رو بلد نیستم برسونم!',
    'دکمه‌ی «آره» داره گنده‌تر می‌شه، نگاش کن!',
    'اگه «نه» بگی، گریه‌م می‌گیره! باگ گریون دیدی تا حالا؟',
    'بیخیال دیگه! «آره» همین‌جا منتظرته!',
  ];

  useEffect(() => {
    // Show the invitation after reading letter for a short moment
    const timer = window.setTimeout(() => {
      setShowInvite(true);
      soundEngine.playSfx('ding');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleDodge = (e?: React.MouseEvent | React.TouchEvent | React.FocusEvent) => {
    if (e) {
      e.preventDefault();
    }
    soundEngine.playSfx('boing');

    setDodgeCount((prev) => {
      const nextCount = prev + 1;
      setReactionText(`تلاش ${toPersianDigits(nextCount)}: ${noPhrases[(nextCount - 1) % noPhrases.length]}`);
      setBugiMood(nextCount % 2 === 0 ? 'silly' : 'sad');
      return nextCount;
    });

    // Calculate safe screen coordinates for dodging
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 24;
    const btnW = 90;
    const btnH = 50;

    const minX = pad;
    const maxX = Math.max(pad, vw - btnW - pad);
    const minY = pad + 60;
    const maxY = Math.max(minY, vh - btnH - pad);

    const randomX = minX + Math.random() * (maxX - minX);
    const randomY = minY + Math.random() * (maxY - minY);

    setNoPosition({ x: randomX, y: randomY });
  };

  const handleYes = () => {
    soundEngine.playSfx('tada');
    onHearts();
    onAcceptInvite();
  };

  const yesScale = Math.min(1.4, 1 + dodgeCount * 0.05);

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
      {/* The Styled Stationery Letter */}
      <article className="relative bg-[#fff6e2] text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-6 sm:p-7 shadow-[5px_7px_0_#2a1a4a] -rotate-1 flex flex-col gap-4">
        {/* Washi Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 rotate-2 bg-[repeating-linear-gradient(45deg,#ff6fa5_0_8px,#ffffff_8px_16px)] border-2 border-[#2a1a4a] rounded-sm opacity-90 pointer-events-none" />

        {/* Vintage Postal Stamp */}
        <div className="absolute top-3 left-3 w-12 h-12 rotate-12 pointer-events-none">
          <div className="w-full h-full border-2 border-dashed border-[#2a1a4a] bg-yellow-200 rounded p-1 flex items-center justify-center">
            <Heart className="w-6 h-6 fill-pink-500 text-[#2a1a4a]" />
          </div>
        </div>

        {/* Greeting Header */}
        <h2 className="font-['Lalezar',sans-serif] text-3xl sm:text-4xl text-[#ff6fa5] [text-shadow:2px_2px_0_#2a1a4a] pr-2">
          {config.recipientName} جان،
        </h2>

        {/* Lined Notebook Sheet */}
        <div className="flex flex-col gap-3 font-medium text-base sm:text-lg leading-relaxed text-purple-950 bg-[repeating-linear-gradient(transparent_0_36px,rgba(93,77,130,0.18)_36px_38px)] bg-local">
          {config.letterParagraphs.map((para, i) => (
            <p key={i} className="m-0 leading-[38px]">
              {para}
            </p>
          ))}
        </div>

        {/* Signoff */}
        <div className="self-end mt-2 font-['Lalezar',sans-serif] text-2xl text-[#2a1a4a]">
          {config.letterSignoff}
        </div>
      </article>

      {/* Date Invitation Section */}
      {showInvite && (
        <section
          aria-label="پیشنهاد قرار"
          className="flex flex-col items-center gap-4 text-center mt-2 animate-in fade-in slide-in-from-bottom-5 duration-500"
        >
          <h2 className="text-pop text-3xl sm:text-4xl -rotate-1">
            دلت می‌خواد باهام بیای بیرون؟ ☕
          </h2>

          {/* Mascot Speech */}
          <div className="flex items-end gap-3 w-full">
            <BugiMascot mood={bugiMood} />
            <div className="relative flex-1 bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-3 shadow-[3px_5px_0_#2a1a4a] font-bold text-sm leading-relaxed text-right min-h-14 flex items-center">
              <p>{reactionText}</p>
              <div className="absolute -right-2 bottom-4 w-3.5 h-3.5 bg-white border-t-3 border-r-3 border-[#2a1a4a] rounded-tr-md rotate-45" />
            </div>
          </div>

          {/* Yes and Dodging No Buttons */}
          <div className="flex items-center justify-center gap-6 my-2 min-h-20 w-full relative">
            {/* Yes Button */}
            <button
              ref={yesBtnRef}
              type="button"
              onClick={handleYes}
              style={{ transform: `scale(${yesScale})` }}
              className="font-['Lalezar',sans-serif] text-3xl text-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 border-3 border-[#2a1a4a] rounded-full py-3 px-10 shadow-[0_5px_0_#2a1a4a] active:translate-y-1 active:shadow-none transition-transform cursor-pointer animate-[pulse_1.5s_infinite] flex items-center gap-2 z-10"
            >
              <Heart className="w-6 h-6 fill-[#2a1a4a]" />
              <span>آره!</span>
            </button>

            {/* Runaway No Button */}
            <button
              ref={noBtnRef}
              type="button"
              onMouseEnter={handleDodge}
              onClick={handleDodge}
              onTouchStart={handleDodge}
              onFocus={handleDodge}
              style={
                noPosition
                  ? {
                      position: 'fixed',
                      left: `${noPosition.x}px`,
                      top: `${noPosition.y}px`,
                      zIndex: 50,
                    }
                  : {}
              }
              className="font-['Lalezar',sans-serif] text-xl text-[#2a1a4a] bg-white border-3 border-[#2a1a4a] rounded-full py-2.5 px-6 shadow-[0_4px_0_#2a1a4a] transition-all cursor-pointer select-none"
            >
              <span>نه</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
