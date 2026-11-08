import { setTimeout as delay } from 'node:timers/promises';

export async function fetchUser(id) {
  await delay(1200);
  return { id, name: 'Ana' };
}

export async function saveOrder(order) {
  await delay(1200);
  return { ...order, saved: true };
}

export async function generateReport(values) {
  await delay(1200);
  return { total: values.reduce((sum, value) => sum + value, 0), items: values.length };
}
