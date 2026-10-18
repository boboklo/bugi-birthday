import React, { useState } from 'react';
import { X, Check, Share2, Copy } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine.ts';
import type { AppConfig } from '../types.ts';

interface CustomizationModalProps {
  isOpen: boolean;
  config: AppConfig;
  onClose: () => void;
  onSave: (newConfig: AppConfig) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  config,
  onClose,
  onSave,
}) => {
  const [recipient, setRecipient] = useState(config.recipientName);
  const [sender, setSender] = useState(config.senderName);
  const [whatsapp, setWhatsapp] = useState(config.whatsapp || '');
  const [telegram, setTelegram] = useState(config.telegram || '');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSfx('ding');
    onSave({
      ...config,
      recipientName: recipient.trim() || 'رفیق',
      senderName: sender.trim() || 'رفیقت',
      giftTag: `برای: ${recipient.trim() || 'رفیق'}`,
      letterGreeting: `${recipient.trim() || 'رفیق'} جان،`,
      letterSignoff: sender.trim() || 'رفیقت',
      whatsapp: whatsapp.trim(),
      telegram: telegram.trim(),
    });
    onClose();
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('setup');
    url.searchParams.set('to', recipient.trim() || 'رفیق');
    url.searchParams.set('from', sender.trim() || 'رفیقت');
    if (whatsapp.trim()) url.searchParams.set('wa', whatsapp.trim());
    if (telegram.trim()) url.searchParams.set('tg', telegram.trim());

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      soundEngine.playSfx('ding');
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-modal-title"
        className="relative w-full max-w-sm bg-white border-3 border-[#2a1a4a] rounded-3xl p-6 shadow-[5px_7px_0_#2a1a4a] text-right"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-4 left-4 p-1 rounded-full border-2 border-[#2a1a4a] text-[#2a1a4a] hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 id="custom-modal-title" className="font-['Lalezar',sans-serif] text-2xl text-[#2a1a4a] mb-4">
          ✨ تنظیمات (فقط برای فرستنده)
        </h3>

        <form onSubmit={handleSave} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-black text-[#2a1a4a] mb-1">
              اسم شخص متولد (گیرنده):
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="مثلاً: سارا، رضا، عزیزم..."
              className="w-full bg-[#fff6e2] text-[#2a1a4a] font-bold text-sm border-2 border-[#2a1a4a] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#2a1a4a] mb-1">
              اسم شما (فرستنده):
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="مثلاً: علی، رفیقت..."
              className="w-full bg-[#fff6e2] text-[#2a1a4a] font-bold text-sm border-2 border-[#2a1a4a] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#2a1a4a] mb-1">
              شماره واتس‌اپ برای پاسخ (اختیاری):
            </label>
            <input
              type="text"
              dir="ltr"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="مثال: 989123456789"
              className="w-full bg-[#fff6e2] text-[#2a1a4a] font-medium text-sm border-2 border-[#2a1a4a] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#2a1a4a] mb-1">
              آیدی تلگرام برای پاسخ (اختیاری):
            </label>
            <input
              type="text"
              dir="ltr"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder="مثال: myusername"
              className="w-full bg-[#fff6e2] text-[#2a1a4a] font-medium text-sm border-2 border-[#2a1a4a] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Shareable Link Button */}
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="mt-1 w-full py-2 px-3 border-2 border-dashed border-[#2a1a4a] bg-purple-50 text-purple-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-100 transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? 'لینک اختصاصی کپی شد!' : 'کپی لینک این هدیه برای فرستادن'}</span>
          </button>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="flex-1 font-['Lalezar',sans-serif] text-xl text-[#2a1a4a] bg-[#ffd84a] hover:bg-yellow-300 border-3 border-[#2a1a4a] rounded-full py-2 shadow-[0_3px_0_#2a1a4a] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              ذخیره و اعمال
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-sm bg-gray-100 hover:bg-gray-200 text-[#2a1a4a] border-2 border-[#2a1a4a] rounded-full px-4 py-2 transition-colors cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
