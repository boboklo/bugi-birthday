import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRiddleAnswer, normalizePersianText } from './riddleValidator.ts';

test('normalizePersianText strips zero-width chars and unifies arabic yeh/kaf', () => {
  assert.equal(normalizePersianText('كتاب'), 'کتاب');
  assert.equal(normalizePersianText('باگ‌‌ها'), 'باگها');
  assert.equal(normalizePersianText('  باگی  '), 'باگی');
});

test('validateRiddleAnswer accepts direct and punctuation-wrapped valid answers', () => {
  assert.equal(validateRiddleAnswer('باگ'), true);
  assert.equal(validateRiddleAnswer('فکر کنم جوابت باگه!'), true);
  assert.equal(validateRiddleAnswer('Bug'), true);
  assert.equal(validateRiddleAnswer('یک error در خط ۵'), true);
  assert.equal(validateRiddleAnswer('خرچنگ'), false);
  assert.equal(validateRiddleAnswer(''), false);
});
