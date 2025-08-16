const test = require('node:test');
const assert = require('node:assert');
const geom = require('../src/geometry.js');

test('ptToEmu and inchToPt', () => {
  assert.strictEqual(geom.ptToEmu(1), 12700);
  assert.strictEqual(geom.inchToPt(2), 144);
});

test('snapToLines', () => {
  const lines = [0, 10, 20];
  assert.strictEqual(geom.snapToLines(9.6, lines, 1), 10);
  assert.strictEqual(geom.snapToLines(9.6, lines, 0.2), 9.5); // outside tol, round to step
});

test('bestFactorGrid prefers aspect ratio', () => {
  const [c, r] = geom.bestFactorGrid(6, 100, 50, 2, 2);
  assert.deepStrictEqual([c, r], [3, 2]);
});

test('balancedGrid approximates square', () => {
  assert.deepStrictEqual(geom.balancedGrid(5), [2, 3]);
});

test('distributeResidue deterministic sum', () => {
  const parts = geom.distributeResidue(10, 3, 0.5);
  const sum = parts.reduce((a, b) => a + b, 0);
  assert(Math.abs(sum - 10) < 1e-6);
  assert.strictEqual(parts.length, 3);
});
