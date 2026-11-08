import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchUser } from '../src/operations.js';

test('obtiene un usuario', async (context) => {
  const startedAt = new Date().toISOString();
  const user = await fetchUser(7);
  assert.deepEqual(user, { id: 7, name: 'Ana' });
  context.diagnostic('inicio=' + startedAt + ' pid=' + process.pid);
  context.diagnostic('fin=' + new Date().toISOString() + ' pid=' + process.pid);
});
