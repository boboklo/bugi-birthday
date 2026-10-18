import type { AppConfig, DatePlan } from '../types.ts';

export type SendStatus = 'idle' | 'sending' | 'sent' | 'failed' | 'disabled';

const env = import.meta.env as Record<string, string | undefined> | undefined;

// Optional: Web3Forms access key (if set, it takes priority).
const W3F_KEY: string = env?.VITE_W3F_KEY?.trim() || '';

// Email that receives the chosen plan. Can be overridden with VITE_NOTIFY_EMAIL on Render.
const NOTIFY_EMAIL: string = env?.VITE_NOTIFY_EMAIL?.trim() || 'aminha3tam@gmail.com';

export const isAutoSendEnabled = (): boolean => W3F_KEY.length > 0 || NOTIFY_EMAIL.length > 0;

function buildMessage(plan: DatePlan, config: AppConfig): string {
  const lines = [
    `${config.recipientName} هدیه رو باز کرد و قرار رو قبول کرد! 🎉`,
    '',
    `📅 روز: ${plan.day}`,
    `⏰ ساعت: ${plan.time}`,
    `✨ فعالیت‌ها: ${plan.activities.join('، ')}`,
  ];
  if (plan.note) lines.push(`💬 یادداشت: ${plan.note}`);
  return lines.join('\n');
}

async function sendViaWeb3Forms(subject: string, message: string): Promise<boolean> {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: W3F_KEY, subject, from_name: 'باگی', message }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok && data.success !== false;
}

// FormSubmit.co: no key needed. The very first submission triggers an activation email
// to NOTIFY_EMAIL; after clicking "Activate", all later submissions arrive normally.
async function sendViaFormSubmit(subject: string, message: string): Promise<boolean> {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_EMAIL)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _subject: subject, name: 'باگی', message, _template: 'box', _captcha: 'false' }),
  });
  const data = await res.json().catch(() => ({}));
  return res.ok && data.success !== 'false' && data.success !== false;
}

/**
 * Emails the chosen plan to the sender. Resolves true on success, false on any failure.
 */
export async function sendPlanToSender(plan: DatePlan, config: AppConfig, isUpdate: boolean): Promise<boolean> {
  const subject = `${isUpdate ? '🔄 تغییر قرار' : '🎉 قرار'} ${config.recipientName} رو انتخاب کرد`;
  const message = buildMessage(plan, config);
  try {
    if (W3F_KEY) return await sendViaWeb3Forms(subject, message);
    if (NOTIFY_EMAIL) return await sendViaFormSubmit(subject, message);
    return false;
  } catch {
    return false;
  }
}
