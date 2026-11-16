const buttons = document.querySelectorAll('button[data-modes]');
const status = document.querySelector('#status');
const results = document.querySelector('#results');
const template = document.querySelector('#result');
const modeName = { 3: 'Paralelo', 1: 'Secuencial' };
const seconds = new Intl.NumberFormat('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function count(output, key) {
  return Number(output.match(new RegExp('^# ' + key + ' (\\d+)$', 'm'))?.[1] ?? 0);
}

function showResult(result) {
  const card = template.content.cloneNode(true);
  card.querySelector('h3').textContent = modeName[result.concurrency];
  card.querySelector('strong').textContent = seconds.format(result.duration / 1000) + ' s';
  const passed = count(result.output, 'pass');
  const failed = count(result.output, 'fail');
  card.querySelector('.counts').textContent =
    passed + ' aprobadas · ' + failed + ' fallidas · Node.js ' + result.version
    + (result.exitCode ? ' · Ejecución con errores' : '');
  card.querySelector('.command').textContent = result.command;
  card.querySelector('pre').textContent = result.output;
  const timeline = card.querySelector('.timeline');
  const matches = result.output.matchAll(/^# Subtest: (.+)\r?\n(?:(?!^# Subtest:)[\s\S])*?^# inicio=(\S+) pid=(\d+)\r?\n# fin=(\S+) pid=\d+/gm);
  for (const [, name, start, pid, end] of matches) {
    const item = document.createElement('li');
    const title = document.createElement('b');
    const track = document.createElement('div');
    const bar = document.createElement('span');
    const times = document.createElement('small');
    title.textContent = name + ' · PID ' + pid;
    track.className = 'track';
    track.setAttribute('aria-hidden', 'true');
    bar.style.marginLeft = 100 * (Date.parse(start) - Date.parse(result.startedAt)) / result.duration + '%';
    bar.style.width = 100 * (Date.parse(end) - Date.parse(start)) / result.duration + '%';
    times.textContent = start.slice(11, 23) + ' – ' + end.slice(11, 23) + ' UTC';
    track.append(bar);
    item.append(title, track, times);
    timeline.append(item);
  }
  results.append(card);
}

for (const button of buttons) {
  button.addEventListener('click', async () => {
    buttons.forEach((control) => { control.disabled = true; });
    results.replaceChildren();
    const runs = [];
    try {
      for (const mode of button.dataset.modes.split(',')) {
        status.textContent = 'Ejecutando en modo ' + modeName[mode].toLowerCase() + '…';
        const response = await fetch('/api/run/' + mode, { method: 'POST' });
        if (!response.ok) throw new Error(await response.text());
        const result = await response.json();
        runs.push(result);
        showResult(result);
      }
      status.textContent = runs.some((run) => run.exitCode)
        ? 'Ejecución finalizada con errores. Revisa la salida de Node.js.'
        : 'Ejecución finalizada · Las barras muestran cuándo se ejecutó cada prueba.';
    } catch (error) {
      status.textContent = error.message;
    } finally {
      buttons.forEach((control) => { control.disabled = false; });
    }
  });
}
