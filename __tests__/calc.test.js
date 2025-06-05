const { evaluate } = require('../calc');

test('basic operations', () => {
  expect(evaluate('2+3*4')).toBe(14);
  expect(evaluate('2^3')).toBe(8);
  expect(evaluate('1/(2+3)')).toBeCloseTo(0.2);
});
