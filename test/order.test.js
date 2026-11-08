import assert from 'node:assert/strict';
import test from 'node:test';
import { saveOrder } from '../src/operations.js';

test('guarda una orden', async (context) => {
  const startedAt = new Date().toISOString();
  const order = await saveOrder({ id: 42, total: 150 });
  assert.deepEqual(order, { id: 42, total: 150, saved: true });
  context.diagnostic('inicio=' + startedAt + ' pid=' + process.pid);
  context.diagnostic('fin=' + new Date().toISOString() + ' pid=' + process.pid);
});
