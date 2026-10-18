import React, { useState } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { generateNextDays } from '../../utils/persianDate.ts';
import { Calendar, Clock, Sparkles, Coffee } from 'lucide-react';
import type { DatePlan } from '../../types.ts';

interface PlanStageProps {
  initialPlan: DatePlan;
  onSubmitPlan: (plan: DatePlan) => void;
}

export const PlanStage: React.FC<PlanStageProps> = ({ initialPlan, onSubmitPlan }) => {
  const [day, setDay] = useState(initialPlan.day);
  const [time, setTime] = useState(initialPlan.time);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(initialPlan.activities);
  const [note, setNote] = useState(initialPlan.note);

  const daysList = generateNextDays(8);

  const timeSlots = [
    { label: 'صبح', sub: '۱۰:۰۰', value: 'صبح (۱۰:۰۰)' },
    { label: 'ظهر', sub: '۱۳:۰۰', value: 'ظهر (۱۳:۰۰)' },
    { label: 'عصر', sub: '۱۶:۰۰', value: 'عصر (۱۶:۰۰)' },
    { label: 'غروب', sub: '۱۸:۳۰', value: 'غروب (۱۸:۳۰)' },
    { label: 'شب', sub: '۲۱:۰۰', value: 'شب (۲۱:۰۰)' },
    { label: 'هر وقت تو بگی', sub: '', value: 'هر وقت تو بگی' },
  ];

  const activities = [
    'کافه و گپ طولانی ☕',
    'پیاده‌روی دونفره 🚶',
    'شام و رستوران 🍕',
    'سینما 🎬',
    'بستنی 🍦',
    'موتورسواری بی‌مقصد 🏍️',
    'گیم‌نت و بازی با هم 🎮',
    'بیلیارد 🎱',
    'با هم یه چیز باحال بسازیم 💻',
    'غافلگیرم کن! ✨',
  ];

  const toggleActivity = (act: string) => {
    soundEngine.playSfx('pop');
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleSelectDay = (val: string) => {
    soundEngine.playSfx('pop');
    setDay(val);
  };

  const handleSelectTime = (val: string) => {
    soundEngine.playSfx('pop');
    setTime(val);
  };

  const isComplete = day && time && selectedActivities.length > 0;

  const handleSubmit = () => {
    if (!isComplete) return;
    soundEngine.playSfx('ding');
    onSubmitPlan({
      day,
      time,
      activities: selectedActivities,
      note: note.trim(),
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-400">
      <h2 className="text-pop text-3xl sm:text-4xl -rotate-1 text-center">
        قرارمون رو <span className="text-[#ffd84a]">بچین!</span>
      </h2>

      {/* Mascot Speech */}
      <div className="flex items-end gap-3">
        <BugiMascot mood="joy" />
        <div className="relative flex-1 bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-3 shadow-[3px_5px_0_#2a1a4a] font-bold text-sm leading-relaxed text-right min-h-14 flex items-center">
          <p>
            می‌دونستم قبول می‌کنی! حالا روز و ساعتی که راحت‌تری به همراه برنامه‌ای که دوست داری رو انتخاب کن.
          </p>
          <div className="absolute -right-2 bottom-4 w-3.5 h-3.5 bg-white border-t-3 border-r-3 border-[#2a1a4a] rounded-tr-md rotate-45" />
        </div>
      </div>

      {/* Planner Card Form */}
      <div className="bg-white border-3 border-[#2a1a4a] rounded-3xl p-5 shadow-[4px_6px_0_#2a1a4a] flex flex-col gap-6">
        {/* 1. Day Selector */}
        <section aria-labelledby="day-heading" className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 self-start px-3 py-1 rounded-full border-2 border-[#2a1a4a] bg-[#ffd84a] text-xs font-black text-[#2a1a4a]">
            <Calendar className="w-3.5 h-3.5" />
            <span id="day-heading">کدوم روز خوبه؟</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {daysList.map((d, i) => {
              const isSelected = day === d.fullValue;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDay(d.fullValue)}
                  className={`px-3 py-1.5 rounded-2xl border-2 border-[#2a1a4a] text-sm font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#6fe3c1] shadow-[0_2px_0_#2a1a4a] translate-y-0.5'
                      : 'bg-white shadow-[0_3px_0_#2a1a4a] hover:-translate-y-0.5'
                  }`}
                >
                  <span>{d.lead}</span>
                  {d.sub && <small className="text-xs font-medium text-purple-900/70">{d.sub}</small>}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => handleSelectDay('هر روزی که تو بگی')}
              className={`px-3 py-1.5 rounded-2xl border-2 border-[#2a1a4a] text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                day === 'هر روزی که تو بگی'
                  ? 'bg-[#6fe3c1] shadow-[0_2px_0_#2a1a4a] translate-y-0.5'
                  : 'bg-white shadow-[0_3px_0_#2a1a4a] hover:-translate-y-0.5'
              }`}
            >
              هر روزی که تو بگی
            </button>
          </div>
        </section>

        {/* 2. Time Selector */}
        <section aria-labelledby="time-heading" className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 self-start px-3 py-1 rounded-full border-2 border-[#2a1a4a] bg-[#ffd84a] text-xs font-black text-[#2a1a4a]">
            <Clock className="w-3.5 h-3.5" />
            <span id="time-heading">چه ساعتی؟</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {timeSlots.map((t, i) => {
              const isSelected = time === t.value;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectTime(t.value)}
                  className={`px-3.5 py-1.5 rounded-2xl border-2 border-[#2a1a4a] text-sm font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#5cc8ff] shadow-[0_2px_0_#2a1a4a] translate-y-0.5'
                      : 'bg-white shadow-[0_3px_0_#2a1a4a] hover:-translate-y-0.5'
                  }`}
                >
                  <span>{t.label}</span>
                  {t.sub && <small className="text-xs font-medium text-purple-900/70">{t.sub}</small>}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Activity Selector */}
        <section aria-labelledby="act-heading" className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 self-start px-3 py-1 rounded-full border-2 border-[#2a1a4a] bg-[#ffd84a] text-xs font-black text-[#2a1a4a]">
            <Coffee className="w-3.5 h-3.5" />
            <span id="act-heading">دوست داری چیکار کنیم؟ (چندتا هم می‌شه)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activities.map((act, i) => {
              const isSelected = selectedActivities.includes(act);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleActivity(act)}
                  className={`px-3.5 py-2 rounded-2xl border-2 border-[#2a1a4a] text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ff6fa5] text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] translate-y-0.5'
                      : 'bg-white shadow-[0_3px_0_#2a1a4a] hover:-translate-y-0.5'
                  }`}
                >
                  {act}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Notes textarea */}
        <div className="flex flex-col gap-2">
          <label htmlFor="plan-note" className="text-xs font-black text-[#2a1a4a] text-right">
            یه چیز دیگه؟ (اختیاری)
          </label>
          <textarea
            id="plan-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="مثلاً کجا بریم، یا هر ترجیح خاصی که داری..."
            className="w-full bg-[#fff6e2] text-[#2a1a4a] font-medium text-sm border-2 border-[#2a1a4a] rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Validation Prompt */}
      <p className="text-xs font-bold text-center text-purple-900">
        {isComplete
          ? 'عالیه! همه‌چیز آماده‌ست. روی دکمه زیر بزن تا پیام قرار ساخته بشه.'
          : '⚠️ لطفاً روز، ساعت و حداقل یک برنامه را انتخاب کن.'}
      </p>

      {/* Submit Button */}
      <div className="w-full max-w-xs mx-auto">
        <button
          type="button"
          disabled={!isComplete}
          onClick={handleSubmit}
          className="w-full font-['Lalezar',sans-serif] text-2xl text-[#2a1a4a] bg-[#ff6fa5] hover:bg-pink-400 border-3 border-[#2a1a4a] rounded-full py-2.5 px-6 shadow-[0_4px_0_#2a1a4a] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-6 h-6 fill-white" />
          <span>پیام قرار رو بساز!</span>
        </button>
      </div>
    </div>
  );
};
