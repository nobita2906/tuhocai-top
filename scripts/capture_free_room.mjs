import { spawn } from 'child_process';
import fs from 'fs';
import { SignJWT } from 'jose';

async function main() {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key');
  const adminToken = await new SignJWT({ id: '93f17bf0-79f7-499e-98fb-d64e3cab3d5d', role: 'ADMIN' })
    .setProtectedHeader({ alg: 'HS256' }).sign(secretKey);

  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const port = 9569;
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
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
  const ws = new WebSocket(targets[0].webSocketDebuggerUrl);

  await new Promise((r) => (ws.onopen = r));
  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const reqId = id++;
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.id === reqId) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: reqId, method, params }));
    });

  await send('Page.enable');
  await send('Network.enable');
  await send('Network.setCookie', {
    name: 'tuhocai_session',
    value: adminToken,
    domain: 'localhost',
    path: '/',
  });

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  const url = 'http://localhost:8899/dashboard/hoc/app-flow-google-auto-bao-cao-sheets';
  await send('Page.navigate', { url });
  await new Promise((r) => setTimeout(r, 2500));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(
    'C:/Users/nvdan/.gemini/antigravity/brain/29726e24-60fa-429a-8839-5619b392b496/student_classroom_free_room.png',
    Buffer.from(shot.data, 'base64')
  );
  console.log('📸 Đã chụp màn hình phòng học miễn phí thành công!');

  ws.close();
  edge.kill();
}

main().catch(console.error);

