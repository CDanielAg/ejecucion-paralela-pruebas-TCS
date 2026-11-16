import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = new URL('./', import.meta.url);
const assets = new Map([
  ['/', ['index.html', 'text/html']],
  ['/style.css', ['style.css', 'text/css']],
  ['/app.js', ['app.js', 'text/javascript']],
]);

async function execute(concurrency) {
  const args = ['--test', '--test-reporter=tap', '--test-concurrency=' + concurrency];
  const options = { cwd: fileURLToPath(root), timeout: 15000 };
  const startedAt = new Date().toISOString();
  const start = performance.now();
  let result;
  let exitCode = 0;
  try {
    result = await run(process.execPath, args, options);
  } catch (error) {
    if (error.code !== 1) throw error;
    result = error;
    exitCode = error.code;
  }
  return {
    concurrency, startedAt, exitCode, version: process.version,
    duration: Math.round(performance.now() - start),
    command: ['node', ...args].join(' '),
    output: [result.stdout, result.stderr].filter(Boolean).join('\n').trim(),
  };
}

let running = false;
createServer(async (request, response) => {
  const asset = assets.get(request.url);
  if (request.method === 'POST' && /^\/api\/run\/[13]$/.test(request.url)) {
    if (running) {
      response.writeHead(409).end('Ya hay una ejecución en curso.');
      return;
    }
    running = true;
    try {
      const result = await execute(Number(request.url.at(-1)));
      response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(result));
    } catch (error) {
      console.error(error);
      response.writeHead(500).end('No se pudo ejecutar Node.js.');
    } finally {
      running = false;
    }
    return;
  }
  if (request.method !== 'GET' || !asset) {
    response.writeHead(404).end();
    return;
  }
  try {
    const body = await readFile(new URL('web/' + asset[0], root));
    response.writeHead(200, { 'Content-Type': asset[1] + '; charset=utf-8' }).end(body);
  } catch (error) {
    console.error(error);
    response.writeHead(500).end();
  }
}).listen(4175, '127.0.0.1', () => console.log('http://127.0.0.1:4175'));
