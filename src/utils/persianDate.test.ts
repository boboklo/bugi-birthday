import test from 'node:test';
import assert from 'node:assert/strict';
import { toPersianDigits, generateNextDays } from './persianDate.ts';

test('toPersianDigits converts western digits to Persian numbers correctly', () => {
  assert.equal(toPersianDigits(12345), '۱۲۳۴۵');
  assert.equal(toPersianDigits('2026/10/18'), '۲۰۲۶/۱۰/۱۸');
  assert.equal(toPersianDigits('فایل 4 از 5'), 'فایل ۴ از ۵');
  assert.equal(toPersianDigits(''), '');
});

test('generateNextDays produces specified count of days with today and tomorrow', () => {
  const fixedDate = new Date(2026, 9, 18); // Oct 18, 2026
  const days = generateNextDays(8, fixedDate);
  assert.equal(days.length, 8);
  assert.equal(days[0].lead, 'امروز');
  assert.equal(days[1].lead, 'فردا');
  assert.ok(days[0].sub.length > 0);
  assert.ok(days[0].fullValue.includes('امروز'));
});
