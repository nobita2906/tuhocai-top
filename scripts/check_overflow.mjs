import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9555;

async function checkOverflowElement() {
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    'about:blank',
  ]);

  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) break;
    } catch (_) {}
  }

  const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((resolve) => (ws.onopen = resolve));

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const onMsg = (event) => {
        const d = JSON.parse(event.data);
        if (d.id === id) {
          ws.removeEventListener('message', onMsg);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:8899/san-pham' });
  await new Promise((r) => setTimeout(r, 2000));

  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const docWidth = document.documentElement.clientWidth;
      const elements = Array.from(document.querySelectorAll('*'));
      const overflowing = [];

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 2) {
          overflowing.push({
            tag: el.tagName,
            class: (el.className || '').toString().slice(0, 100),
            id: el.id,
            right: rect.right,
            width: rect.width,
            overflowAmount: rect.right - docWidth
          });
        }
      }
      return { docWidth, overflowing: overflowing.slice(0, 10) };
    })()`,
    returnByValue: true,
  });

  console.log('Phần tử tràn trang tại 1024px:', JSON.stringify(res.result?.value, null, 2));

  ws.close();
  edge.kill();
}

checkOverflowElement().catch(console.error);
