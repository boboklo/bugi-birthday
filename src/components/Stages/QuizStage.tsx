import React, { useState } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { toPersianDigits } from '../../utils/persianDate.ts';
import { ArrowLeft } from 'lucide-react';
import type { QuizQuestion, QuizOption, MascotMood } from '../../types.ts';

interface QuizStageProps {
  questionNumber: number;
  totalQuestions: number;
  data: QuizQuestion;
  onNext: () => void;
  onConfetti: (x: number, y: number) => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({
  questionNumber,
  totalQuestions,
  data,
  onNext,
  onConfetti,
}) => {
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [currentMood, setCurrentMood] = useState<MascotMood>('hi');
  const [reactionText, setReactionText] = useState<string>(
    'هر کدوم رو با دلت جواب بده، جواب درست و غلط نداریم! 😄'
  );

  const colors = ['#ff6fa5', '#ffd84a', '#6fe3c1', '#5cc8ff'];

  const handleSelectOption = (option: QuizOption, index: number, e: React.MouseEvent) => {
    if (selectedOption) return; // already chosen
    setSelectedOption(option);
    setCurrentMood(option.mood);
    setReactionText(option.reaction);

    soundEngine.playSfx(option.mood === 'sad' ? 'sad' : option.mood === 'joy' ? 'ding' : 'pop');

    const rect = e.currentTarget.getBoundingClientRect();
    onConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  return (
    <div className="flex flex-col gap-4.5 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-400">
      {/* Eyebrow badge */}
      <div className="self-start inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border-3 border-[#2a1a4a] bg-[#ffd84a] text-xs font-black text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] -rotate-1">
        <span>سؤال {toPersianDigits(questionNumber)} از {toPersianDigits(totalQuestions)}</span>
      </div>

      {/* Question Card */}
      <div className="relative bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-3xl p-5 shadow-[4px_6px_0_#2a1a4a] pt-7">
        {/* Tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 -rotate-2 bg-[repeating-linear-gradient(45deg,#ffd84a_0_8px,#ffffff_8px_16px)] border-2 border-[#2a1a4a] rounded-sm opacity-95 pointer-events-none" />
        <h2 className="font-['Lalezar',sans-serif] text-2xl sm:text-3xl leading-snug text-center">
          {data.question}
        </h2>
      </div>

      {/* Mascot & Reaction Speech */}
      <div className="flex items-end gap-3">
        <BugiMascot mood={currentMood} />
        <div className="relative flex-1 bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-3 shadow-[3px_5px_0_#2a1a4a] font-bold text-sm leading-relaxed text-right min-h-14 flex items-center">
          <p>{reactionText}</p>
          <div className="absolute -right-2 bottom-4 w-3.5 h-3.5 bg-white border-t-3 border-r-3 border-[#2a1a4a] rounded-tr-md rotate-45" />
        </div>
      </div>

      {/* Options List */}
      <div className="flex flex-col gap-3">
        {data.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          const isFaded = selectedOption && !isSelected;

          return (
            <button
              key={idx}
              type="button"
              disabled={!!selectedOption}
              onClick={(e) => handleSelectOption(opt, idx, e)}
              className={`flex items-center gap-3 p-3.5 min-h-16 text-right font-bold text-base rounded-2xl border-3 border-[#2a1a4a] shadow-[0_4px_0_#2a1a4a] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#ffd84a] scale-[1.02] shadow-[0_2px_0_#2a1a4a]'
                  : isFaded
                  ? 'bg-white/60 opacity-60'
                  : 'bg-white hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#2a1a4a]'
              }`}
            >
              <span
                style={{ backgroundColor: colors[idx % colors.length] }}
                className="shrink-0 w-9 h-9 rounded-full border-3 border-[#2a1a4a] flex items-center justify-center font-['Lalezar',sans-serif] text-lg leading-none"
              >
                {toPersianDigits(idx + 1)}
              </span>
              <span className="flex-1 break-words">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Next Step Button */}
      {selectedOption && (
        <div className="flex justify-center mt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <button
            type="button"
            onClick={onNext}
            className="w-full max-w-xs font-['Lalezar',sans-serif] text-xl text-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 border-3 border-[#2a1a4a] rounded-full py-2.5 px-6 shadow-[0_4px_0_#2a1a4a] active:translate-y-1 active:shadow-[0_1px_0_#2a1a4a] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>مرحله بعد</span>
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
