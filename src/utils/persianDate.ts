export const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[parseInt(d, 10)]);
}

export interface DayChipData {
  lead: string;
  sub: string;
  fullValue: string;
}

export function generateNextDays(count = 8, baseDate = new Date()): DayChipData[] {
  const result: DayChipData[] = [];
  
  let fw: Intl.DateTimeFormat | null = null;
  let fd: Intl.DateTimeFormat | null = null;
  try {
    fw = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { weekday: 'long' });
    fd = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long' });
  } catch {
    fw = null;
    fd = null;
  }

  for (let i = 0; i < count; i++) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
    let wd = '';
    let dm = '';

    if (fw && fd) {
      try {
        wd = fw.format(d);
        dm = fd.format(d);
      } catch {
        wd = d.toLocaleDateString('fa-IR', { weekday: 'long' });
        dm = d.toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' });
      }
    } else {
      wd = d.toLocaleDateString('fa-IR', { weekday: 'long' });
      dm = d.toLocaleDateString('fa-IR', { day: 'numeric', month: 'short' });
    }

    const lead = i === 0 ? 'امروز' : i === 1 ? 'فردا' : wd;
    const fullValue = i < 2 ? `${lead} (${wd} ${dm})` : `${wd} ${dm}`;

    result.push({
      lead,
      sub: dm,
      fullValue,
    });
  }

  return result;
}
