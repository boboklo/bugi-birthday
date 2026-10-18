export const DEFAULT_RIDDLE_ANSWERS = [
  'باگ',
  'بگ',
  'باگه',
  'بگه',
  'باگی',
  'باگها',
  'باگ‌ها',
  'bug',
  'bugs',
  'ارور',
  'error',
  'خطا',
  'اشکال',
  'ایراد',
];

export function normalizePersianText(str: string): string {
  return String(str)
    .toLowerCase()
    .replace(/[‌‍‎‏]/g, '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .trim();
}

export function extractTokens(str: string): string[] {
  const norm = normalizePersianText(str);
  return norm.split(/[\s.,!?؟،'"«»()\-_:؛;]+/).filter(Boolean);
}

export function validateRiddleAnswer(input: string, customAnswers: string[] = DEFAULT_RIDDLE_ANSWERS): boolean {
  const tokens = extractTokens(input);
  if (tokens.length === 0) return false;

  const validSet = new Set(customAnswers.map((a) => normalizePersianText(a)));
  return tokens.some((token) => validSet.has(token));
}
