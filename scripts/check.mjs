import assert from 'node:assert/strict';
import { totalFor, scoreboard, makeCode, isValidDate } from '../src/lib/stats.js';

const points = [
  { toId: 'a', amount: 5 },
  { toId: 'a', amount: -2 },
  { toId: 'b', amount: 3 },
];
assert.equal(totalFor(points, 'a'), 3);
assert.equal(totalFor(points, 'b'), 3);
assert.equal(totalFor([], 'a'), 0);

const s = scoreboard(
  [
    { mode: 'rival', winnerId: 'a' },
    { mode: 'rival', winnerId: 'a' },
    { mode: 'rival', winnerId: 'b' },
    { mode: 'rival', winnerId: null },
    { mode: 'equipo', teamWon: true },
    { mode: 'equipo', teamWon: false },
  ],
  'a',
  'b'
);
assert.deepEqual(s, { yo: 2, pareja: 1, empates: 1, equipoGanadas: 1, equipoPerdidas: 1 });

assert.match(makeCode(), /^[A-Z2-9]{6}$/);
assert.ok(isValidDate('29/02/2024'));
assert.ok(!isValidDate('29/02/2023'));
assert.ok(!isValidDate('31/04/2020'));
assert.ok(!isValidDate('1/1/2020'));

console.log('ok');
