import assert from 'node:assert/strict';
import test from 'node:test';
import { generateReport } from '../src/operations.js';

test('genera un resumen', async (context) => {
  const startedAt = new Date().toISOString();
  const report = await generateReport([10, 20, 30]);
  assert.deepEqual(report, { total: 60, items: 3 });
  context.diagnostic('inicio=' + startedAt + ' pid=' + process.pid);
  context.diagnostic('fin=' + new Date().toISOString() + ' pid=' + process.pid);
});
