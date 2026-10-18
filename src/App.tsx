import React, { useState, useEffect, useRef } from 'react';
import { StageTracker } from './components/StageTracker.tsx';
import { ConfettiCanvas, type ConfettiCanvasHandle } from './components/ConfettiCanvas.tsx';
import { IntroStage } from './components/Stages/IntroStage.tsx';
import { QuizStage } from './components/Stages/QuizStage.tsx';
import { VoiceStage } from './components/Stages/VoiceStage.tsx';
import { RevealStage } from './components/Stages/RevealStage.tsx';
import { PartyStage } from './components/Stages/PartyStage.tsx';
import { RiddleStage } from './components/Stages/RiddleStage.tsx';
import { LetterStage } from './components/Stages/LetterStage.tsx';
import { PlanStage } from './components/Stages/PlanStage.tsx';
import { TicketStage } from './components/Stages/TicketStage.tsx';
import { CustomizationModal } from './components/CustomizationModal.tsx';
import { soundEngine } from './audio/soundEngine.ts';
import type { StageId, AppConfig, DatePlan, QuizQuestion } from './types.ts';

export default function App() {
  const confettiRef = useRef<ConfettiCanvasHandle | null>(null);

  // URL query params or defaults
  const [config, setConfig] = useState<AppConfig>(() => {
    let to = 'سامیار';
    let from = 'امین';
    let wa = '';
    let tg = '';

    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get('to')) to = sp.get('to')!;
      if (sp.get('from')) from = sp.get('from')!;
      if (sp.get('wa')) wa = sp.get('wa')!;
      if (sp.get('tg')) tg = sp.get('tg')!;
    } catch {}

    return {
      recipientName: to,
      senderName: from,
      giftTag: `برای: ${to}`,
      letterGreeting: `${to} جان،`,
      letterParagraphs: [
        'نمی‌خوام واقعاً ادبی بنویسم. اونقدر نوشتم که وقتی ساده و خودمونی می‌نویسم، اتفاقاً ارزشمندتره. نمی‌خوام واقعاً کلیشه‌ای حرف بزنم ولی چاره‌ای ندارم. این یه سال و اندی که باهات آشنا شدم خیلی خوب بود، خیلی واقعاً. من بابت همه‌ی لحظه‌ها ازت تشکر می‌کنم.',
        'خیلی دوست داشتم این چیزی که الان داری می‌بینی بهتر بشه، اما واقعاً یکم دیر دست به کار شدم و نتیجه‌ش شد این. اگه زیاد به دلت ننشست ببخشید.',
        'اما برم سر بحث اصلی. امشب شب تولدته و واقعاً از صمیم قلب برات خوشحالم که داره ۱۸ سالت می‌شه. از الان دیگه واقعاً یه آدم مستقل و عاقلی و امیدوارم بهترین تصمیم‌های عمرت رو بگیری. می‌دونم قراره اوضاع سخت‌تر هم بشه برات، ولی از صمیم قلب برات آرزوی موفقیت می‌کنم و آینده برات ایشالا به خوبی پیش بره.',
        'دلم می‌خواست همین الان کنارت بودم ولی خب مثل اینکه نمی‌شه، و امیدوارم از این کادوی کوچیک هم خوشت اومده باشه و همین.',
        'واقعاً اهل اینکه غافلگیر کنم کسی رو نیستم، چون مگه کسی یادش می‌ره تولدش امشبه؟ اما می‌خواستم بگم به یادت بودم. بوس بوس.',
        'ایشالا بمونی پیشم و ۱۱۸ ساله بشی. مرسی که هستی و بودی، و شبت بخیر.',
      ],
      letterSignoff: from,
      riddleAnswer: 'باگ',
      whatsapp: wa,
      telegram: tg,
    };
  });

  // The settings button is for the sender only: shown only with ?setup=1.
  const [showSettings] = useState<boolean>(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      return sp.has('setup');
    } catch {
      return false;
    }
  });

  const [currentStage, setCurrentStage] = useState<StageId>('intro');
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [isCustomizing, setIsCustomizing] = useState(false);

  const [plan, setPlan] = useState<DatePlan>({
    day: '',
    time: '',
    activities: [],
    note: '',
  });

  const quizQuestions: QuizQuestion[] = [
    {
      question: 'ساعت ۲ شبه و یه باگ مرموز پیدا کردی. اولین کارت چیه؟ 🌙',
      options: [
        { text: 'همه‌جا console.log می‌ریزم', reaction: 'کلاسیکه! تا جنگل لاگ بسازی، باگ توش گم می‌شه 🌲', mood: 'silly' },
        { text: 'می‌دم کلود نگاه کنه', reaction: 'کلود: «باز تو؟!» 😂 ولی بالاخره پیداش می‌کنه!', mood: 'joy' },
        { text: 'یه چایی می‌ریزم و فکر می‌کنم', reaction: 'استراتژی بلندمدت! باگ از صبر تو می‌ترسه ☕', mood: 'wow' },
        { text: 'می‌خوابم، فردا خودش درست می‌شه', reaction: 'ذهن ناخودآگاه بهتر از هر دیباگریه! 😴', mood: 'joy' },
      ],
    },
    {
      question: 'اسم آخرین پوشه‌ای که برای پروژه‌ت ساختی چی بود؟ 📂',
      options: [
        { text: 'final', reaction: 'فقط «final»؟! چه آدم خوش‌بینی. می‌دونی چند تا نسخه‌ی بعدیش میاد؟', mood: 'silly' },
        { text: 'final_v2', reaction: 'و بعدش final_v3 و بعدش final_fixed... می‌شناسمت!', mood: 'joy' },
        { text: 'final_final_REAL_این‌دفعه‌واقعاً', reaction: 'همین اسم نشون می‌ده چند بار گفتی «این دیگه آخریشه»! 😅', mood: 'wow' },
        { text: 'New Folder (3)', reaction: 'نظم و انضباط یعنی همین! یا شاید تو یه آشوب خلاقانه زندگی می‌کنی 🌀', mood: 'silly' },
      ],
    },
    {
      question: 'کلود یه کد برات نوشت و اجرا نشد. چی می‌گی بهش؟ 🤖',
      options: [
        { text: 'ارور رو کپی می‌کنم و برمی‌گردونم', reaction: 'حلقه‌ی بی‌پایان کلود و تو! خیلی هم کارآمده 🔁', mood: 'joy' },
        { text: 'خودم دنبال مشکلش می‌گردم', reaction: 'ایول! تو از اون آدمای نادری هستی که ما باگ‌ها ازشون می‌ترسیم 💪', mood: 'wow' },
        { text: '«ولی خودت گفتی کار می‌کنه!»', reaction: 'همه‌مون یه بار این جمله رو گفتیم 😂 حتی با یه هوش مصنوعی!', mood: 'silly' },
        { text: 'یه نفس عمیق می‌کشم و دوباره می‌پرسم', reaction: 'آرامش داری! کلود هم به همین خاطر دوستت داره 🧘', mood: 'love' },
      ],
    },
  ];

  const handleToggleMute = () => {
    const nextMuted = soundEngine.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleConfettiBurst = (x?: number, y?: number) => {
    confettiRef.current?.burst(x, y);
  };

  const handleCelebrate = () => {
    confettiRef.current?.celebrate();
  };

  const handleHeartsShower = () => {
    confettiRef.current?.showerHearts();
  };

  const handleReplaySong = () => {
    soundEngine.playHappyBirthdaySong();
    handleCelebrate();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col justify-between p-4 sm:p-6 pb-16 selection:bg-pink-300 selection:text-purple-950 font-['Vazirmatn',sans-serif]">
      {/* Background Candy Sky Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-[#bfe8ff] via-[#e6d9ff] to-[#ffe0ee]" aria-hidden="true">
        {/* Floating Clouds */}
        <div className="absolute top-[8%] -left-20 w-36 h-16 bg-white/80 rounded-full blur-[1px] animate-[pulse_6s_infinite]" />
        <div className="absolute top-[32%] -right-16 w-44 h-20 bg-white/70 rounded-full blur-[1px] animate-[pulse_8s_infinite]" />
        <div className="absolute top-[65%] left-10 w-40 h-18 bg-white/60 rounded-full blur-[1px]" />
      </div>

      {/* Confetti Animation Canvas */}
      <ConfettiCanvas ref={confettiRef} />

      {/* Top Header / Progress Bar */}
      <header className="relative z-10 w-full mb-3">
        <StageTracker currentStage={currentStage} isMuted={isMuted} onToggleMute={handleToggleMute} />
      </header>

      {/* Main Interactive Stage Container */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-2">
        {currentStage === 'intro' && (
          <IntroStage
            config={config}
            showSettings={showSettings}
            onOpenSettings={() => setIsCustomizing(true)}
            onStart={() => setCurrentStage('q0')}
            onConfetti={handleConfettiBurst}
          />
        )}

        {currentStage === 'q0' && (
          <QuizStage
            questionNumber={1}
            totalQuestions={4}
            data={quizQuestions[0]}
            onNext={() => setCurrentStage('q1')}
            onConfetti={handleConfettiBurst}
          />
        )}

        {currentStage === 'q1' && (
          <QuizStage
            questionNumber={2}
            totalQuestions={4}
            data={quizQuestions[1]}
            onNext={() => setCurrentStage('q2')}
            onConfetti={handleConfettiBurst}
          />
        )}

        {currentStage === 'q2' && (
          <QuizStage
            questionNumber={3}
            totalQuestions={4}
            data={quizQuestions[2]}
            onNext={() => setCurrentStage('voice')}
            onConfetti={handleConfettiBurst}
          />
        )}

        {currentStage === 'voice' && (
          <VoiceStage onNext={() => setCurrentStage('reveal')} />
        )}

        {currentStage === 'reveal' && (
          <RevealStage
            config={config}
            onNext={() => setCurrentStage('party')}
            onConfetti={handleCelebrate}
          />
        )}

        {currentStage === 'party' && (
          <PartyStage
            config={config}
            onNext={() => setCurrentStage('riddle')}
            onConfetti={handleCelebrate}
          />
        )}

        {currentStage === 'riddle' && (
          <RiddleStage
            config={config}
            onNext={() => setCurrentStage('letter')}
            onConfetti={handleCelebrate}
          />
        )}

        {currentStage === 'letter' && (
          <LetterStage
            config={config}
            onAcceptInvite={() => setCurrentStage('plan')}
            onHearts={handleHeartsShower}
          />
        )}

        {currentStage === 'plan' && (
          <PlanStage
            initialPlan={plan}
            onSubmitPlan={(newPlan) => {
              setPlan(newPlan);
              setCurrentStage('sent');
              handleHeartsShower();
            }}
          />
        )}

        {currentStage === 'sent' && (
          <TicketStage
            plan={plan}
            config={config}
            onBackToPlan={() => setCurrentStage('plan')}
            onReplaySong={handleReplaySong}
            onCelebrate={handleCelebrate}
          />
        )}
      </main>

      {/* Settings / Customization Modal */}
      <CustomizationModal
        isOpen={isCustomizing}
        config={config}
        onClose={() => setIsCustomizing(false)}
        onSave={(newCfg) => setConfig(newCfg)}
      />
    </div>
  );
}
