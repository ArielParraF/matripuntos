import assert from 'node:assert/strict';
import { totalFor, scoreboard, makeCode, isValidDate } from '../src/lib/stats.js';
import { gatoResult } from '../src/games/gatoLogic.js';

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

const _ = null;
assert.equal(gatoResult(Array(9).fill(null)), null);
assert.deepEqual(gatoResult(['X', 'X', 'X', 'O', 'O', _, _, _, _]), { mark: 'X', line: [0, 1, 2] });
assert.deepEqual(gatoResult(['O', 'X', 'X', _, 'O', 'X', _, _, 'O']), { mark: 'O', line: [0, 4, 8] });
assert.deepEqual(gatoResult(['X', 'O', 'O', _, 'O', 'X', 'O', 'X', 'X']), { mark: 'O', line: [2, 4, 6] });
assert.equal(gatoResult(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']), 'empate');
// a win on the last move is a win, not a tie
assert.deepEqual(gatoResult(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'X']), { mark: 'X', line: [0, 4, 8] });

console.log('ok');
