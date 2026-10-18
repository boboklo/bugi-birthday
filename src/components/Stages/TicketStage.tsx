import React, { useEffect, useRef, useState } from 'react';
import { BugiMascot } from '../BugiMascot.tsx';
import { soundEngine } from '../../audio/soundEngine.ts';
import { Copy, Check, RotateCcw, PartyPopper, Music, Send, ExternalLink } from 'lucide-react';
import { isAutoSendEnabled, sendPlanToSender, type SendStatus } from '../../utils/notify.ts';
import type { DatePlan, AppConfig } from '../../types.ts';

interface TicketStageProps {
  plan: DatePlan;
  config: AppConfig;
  onBackToPlan: () => void;
  onReplaySong: () => void;
  onCelebrate: () => void;
}

export const TicketStage: React.FC<TicketStageProps> = ({
  plan,
  config,
  onBackToPlan,
  onReplaySong,
  onCelebrate,
}) => {
  const [copied, setCopied] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>(isAutoSendEnabled() ? 'sending' : 'disabled');
  const sentOnce = useRef(false);

  // Send the plan to the sender automatically as soon as the ticket appears.
  const trySend = async (isUpdate: boolean) => {
    if (!isAutoSendEnabled()) return;
    setSendStatus('sending');
    const ok = await sendPlanToSender(plan, config, isUpdate);
    setSendStatus(ok ? 'sent' : 'failed');
    if (ok) soundEngine.playSfx('ding');
  };

  useEffect(() => {
    if (sentOnce.current) return;
    sentOnce.current = true;
    trySend(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedActivities = plan.activities.join('، ');

  const composeMessageText = (): string => {
    const lines = [
      `سلام ${config.senderName}! من هدیه تولدت رو باز کردم و خیلی خوشم اومد 😍`,
      '',
      'آره، دلم می‌خواد باهات بیام بیرون! ☕',
      '',
      '📌 پیشنهاد برنامه‌مون:',
      `• روز: ${plan.day}`,
      `• ساعت: ${plan.time}`,
      `• فعالیت‌ها: ${formattedActivities}`,
    ];

    if (plan.note) {
      lines.push(`• راستی: ${plan.note}`);
    }

    lines.push('', 'تو هم موافقی؟ کی هماهنگ کنیم؟ 🙂');
    return lines.join('\n');
  };

  const messageText = composeMessageText();

  const handleCopy = async () => {
    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(messageText);
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success) {
      // Fallback
      try {
        const ta = document.createElement('textarea');
        ta.value = messageText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        success = true;
      } catch {}
    }

    if (success) {
      setCopied(true);
      soundEngine.playSfx('ding');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const encodedMsg = encodeURIComponent(messageText);

  return (
    <div className="flex flex-col gap-5 w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-400">
      <h2 className="text-pop text-3xl sm:text-4xl -rotate-1 text-center">
        {sendStatus === 'disabled' || sendStatus === 'failed' ? (
          <>پیامت <span className="text-[#ffd84a]">آماده‌ست!</span></>
        ) : (
          <>قرارتون <span className="text-[#ffd84a]">ثبت شد!</span></>
        )}
      </h2>

      {/* Mascot Speech */}
      <div className="flex items-end gap-3">
        <BugiMascot mood="love" />
        <div className="relative flex-1 bg-white text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-3 shadow-[3px_5px_0_#2a1a4a] font-bold text-sm leading-relaxed text-right min-h-14 flex items-center">
          <p>
            {sendStatus === 'sending' && `دارم برنامه‌ت رو برای ${config.senderName} می‌فرستم...`}
            {sendStatus === 'sent' && `برنامه‌ت همین الان برای ${config.senderName} رسید! حدس می‌زنم از خوشحالی بال دربیاره 🥳`}
            {sendStatus === 'failed' && `اینترنت اذیت کرد و نتونستم بفرستم! پیام رو کپی کن و برای ${config.senderName} بفرست، یا دوباره امتحان کن.`}
            {sendStatus === 'disabled' && `همه‌چیز ثبت شد! پیام رو کپی کن و برای ${config.senderName} بفرست؛ حدس می‌زنم از خوشحالی بال دربیاره!`}
          </p>
          <div className="absolute -right-2 bottom-4 w-3.5 h-3.5 bg-white border-t-3 border-r-3 border-[#2a1a4a] rounded-tr-md rotate-45" />
        </div>
      </div>

      {/* Perforated Date Ticket Component */}
      <div className="relative bg-[#ffd84a] text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-2xl p-5 shadow-[4px_6px_0_#2a1a4a] -rotate-1 flex flex-col gap-2 overflow-hidden">
        {/* Ticket Notches */}
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-7 h-7 rounded-full bg-[#e6d9ff] border-3 border-[#2a1a4a]" />
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-7 h-7 rounded-full bg-[#e6d9ff] border-3 border-[#2a1a4a]" />

        <div className="font-['Lalezar',sans-serif] text-2xl tracking-wide flex items-center justify-between border-b-2 border-dashed border-[#2a1a4a]/40 pb-2">
          <span>🎫 بلیت اختصاصی قرار</span>
          <span className="text-sm font-bold bg-[#2a1a4a] text-white px-2.5 py-0.5 rounded-full">
            ورود برای ۲ نفر
          </span>
        </div>

        <div className="flex flex-col gap-1 text-sm font-bold pt-1">
          <p>📅 روز: {plan.day}</p>
          <p>⏰ ساعت: {plan.time}</p>
          <p>✨ برنامه: {formattedActivities}</p>
          {plan.note && <p>💬 یادداشت: {plan.note}</p>}
        </div>
      </div>

      {sendStatus === 'sent' && (
        <div className="text-center font-bold text-sm bg-emerald-100 border-3 border-[#2a1a4a] rounded-2xl py-2.5 px-3 shadow-[0_3px_0_#2a1a4a]">
          ✅ برنامه برای {config.senderName} فرستاده شد. لازم نیست پیامی بدی!
          <button type="button" onClick={onBackToPlan} className="block mx-auto mt-1.5 text-xs underline text-purple-900 cursor-pointer">
            نظرم عوض شد، تغییر برنامه
          </button>
        </div>
      )}
      {sendStatus === 'failed' && (
        <button
          type="button"
          onClick={() => trySend(true)}
          className="font-bold text-sm bg-amber-100 border-3 border-[#2a1a4a] rounded-2xl py-2.5 px-3 shadow-[0_3px_0_#2a1a4a] cursor-pointer"
        >
          🔄 ارسال نشد؛ دوباره تلاش کن
        </button>
      )}

      {/* Message Output Card (manual fallback, hidden once auto-sent) */}
      {sendStatus !== 'sent' && sendStatus !== 'sending' && (
      <div className="bg-white border-3 border-[#2a1a4a] rounded-3xl p-4 shadow-[4px_6px_0_#2a1a4a] flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-black text-purple-900 border-b border-gray-100 pb-2">
          <span>متن پیام آماده برای ارسال:</span>
          <span>برای: {config.senderName}</span>
        </div>
        <textarea
          readOnly
          rows={6}
          value={messageText}
          className="w-full bg-[#fff6e2] text-[#2a1a4a] font-medium text-sm border-2 border-[#2a1a4a] rounded-2xl p-3 focus:outline-none select-all"
        />

        {/* Copy and Edit Actions */}
        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-1 font-['Lalezar',sans-serif] text-xl rounded-full py-2.5 px-4 border-3 border-[#2a1a4a] shadow-[0_4px_0_#2a1a4a] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer ${
              copied ? 'bg-emerald-400 text-[#2a1a4a]' : 'bg-[#ff6fa5] hover:bg-pink-400 text-[#2a1a4a]'
            }`}
          >
            {copied ? <Check className="w-5 h-5 stroke-[3]" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'کپی شد! 🎉' : 'کپی پیام'}</span>
          </button>

          <button
            type="button"
            onClick={onBackToPlan}
            className="shrink-0 font-bold text-sm bg-white hover:bg-gray-50 text-[#2a1a4a] border-3 border-[#2a1a4a] rounded-full px-4 py-2.5 shadow-[0_4px_0_#2a1a4a] active:translate-y-1 active:shadow-none transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تغییر برنامه</span>
          </button>
        </div>
      </div>

      )}

      {/* Direct Messaging Shortcuts */}
      {sendStatus !== 'sent' && sendStatus !== 'sending' && (
      <div className="flex flex-wrap justify-center gap-2">
        {config.whatsapp && (
          <a
            href={`https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=${encodedMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#2a1a4a] bg-emerald-100 hover:bg-emerald-200 text-xs font-bold text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 transition-transform"
          >
            <Send className="w-3.5 h-3.5 text-emerald-700" />
            <span>ارسال با واتس‌اپ</span>
            <ExternalLink className="w-3 h-3 text-emerald-600" />
          </a>
        )}

        {config.telegram && (
          <a
            href={`https://t.me/${config.telegram.replace(/^@/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#2a1a4a] bg-sky-100 hover:bg-sky-200 text-xs font-bold text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 transition-transform"
          >
            <Send className="w-3.5 h-3.5 text-sky-700" />
            <span>ارسال در تلگرام</span>
            <ExternalLink className="w-3 h-3 text-sky-600" />
          </a>
        )}

        {config.instagram && (
          <a
            href={`https://ig.me/m/${config.instagram.replace(/^@/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[#2a1a4a] bg-pink-100 hover:bg-pink-200 text-xs font-bold text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 transition-transform"
          >
            <Send className="w-3.5 h-3.5 text-pink-700" />
            <span>دایرکت اینستاگرام</span>
            <ExternalLink className="w-3 h-3 text-pink-600" />
          </a>
        )}
      </div>
      )}

      {/* Replay Controls */}
      <div className="flex justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onReplaySong}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#2a1a4a] bg-white text-xs font-bold text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
        >
          <Music className="w-4 h-4 text-purple-700" />
          <span>پخش دوباره آهنگ</span>
        </button>

        <button
          type="button"
          onClick={onCelebrate}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-2 border-[#2a1a4a] bg-white text-xs font-bold text-[#2a1a4a] shadow-[0_2px_0_#2a1a4a] hover:-translate-y-0.5 active:translate-y-0.5 transition-transform cursor-pointer"
        >
          <PartyPopper className="w-4 h-4 text-pink-600" />
          <span>جشن دوباره</span>
        </button>
      </div>
    </div>
  );
};
