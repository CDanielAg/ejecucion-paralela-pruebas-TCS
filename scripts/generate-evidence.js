import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

function execute(label, concurrency) {
  const startedAt = performance.now();
  const result = spawnSync(process.execPath, ['--test', '--test-concurrency=' + concurrency], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
  const durationMs = Math.round(performance.now() - startedAt);
  if (result.status !== 0) {
    const details = result.error?.message || (result.stdout || '') + (result.stderr || '');
    process.stderr.write(details + '\n');
    process.exit(result.status ?? 1);
  }
  return { label, concurrency, durationMs, output: result.stdout.trim() };
}

const sequential = execute('Ejecución secuencial', 1);
const parallel = execute('Ejecución paralela', 3);
const improvement = Math.round((1 - parallel.durationMs / sequential.durationMs) * 100);
const evidence = [
  '# Evidencia de ejecución', '',
  'Fecha: ' + new Date().toISOString(),
  'Node.js: ' + process.version, '',
  '## Comparación', '',
  '| Modo | Concurrencia | Duración medida |',
  '|---|---:|---:|',
  '| Secuencial | 1 | ' + sequential.durationMs + ' ms |',
  '| Paralelo | 3 | ' + parallel.durationMs + ' ms |', '',
  'Reducción aproximada del tiempo: ' + improvement + ' %.', '',
  '## Salida secuencial', '', '~~~text', sequential.output, '~~~', '',
  '## Salida paralela', '', '~~~text', parallel.output, '~~~', '',
].join('\n');

const outputDirectory = resolve(process.cwd(), '..', 'docs');
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(resolve(outputDirectory, 'evidencia-ejecucion.md'), evidence, 'utf8');
console.log('Secuencial: ' + sequential.durationMs + ' ms');
console.log('Paralelo:   ' + parallel.durationMs + ' ms');
console.log('Reducción:  ' + improvement + ' %');
console.log('Evidencia guardada en ../docs/evidencia-ejecucion.md');
