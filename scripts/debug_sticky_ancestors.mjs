import { spawn } from 'child_process';
import { SignJWT } from 'jose';
import { query } from '../src/lib/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'tuhocai-super-secret-jwt-token-2026-secure-key';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9599;

async function check() {
  const adminRows = await query("SELECT id, name, email, role FROM users WHERE role = 'ADMIN' LIMIT 1");
  const adminUser = adminRows[0];
  const adminToken = await new SignJWT({
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: 'ADMIN',
  }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('7d').sign(secretKey);

  const edge = spawn(edgePath, [`--remote-debugging-port=${port}`, '--headless=new', 'about:blank']);
  await new Promise(r => setTimeout(r, 1500));

  const targetsRes = await fetch(`http://127.0.0.1:${port}/json/list`);
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Network.enable');
  await send('Network.setCookie', { name: 'tuhocai_session', value: adminToken, domain: 'localhost', path: '/' });
  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:8899/dashboard/hoc/video-ai-tu-1-anh' });
  await new Promise(r => setTimeout(r, 3500));

  const debugInfo = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const sidebar = document.querySelector('.lg\\\\:col-span-4');
        const allStickies = Array.from(document.querySelectorAll('.sticky'));
        
        function getOverflowAncestors(el) {
          const list = [];
          let cur = el?.parentElement;
          while (cur && cur !== document.body) {
            const cs = window.getComputedStyle(cur);
            if (cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
              list.push({ tag: cur.tagName, className: cur.className.slice(0, 50), overflow: cs.overflow, overflowX: cs.overflowX, overflowY: cs.overflowY });
            }
            cur = cur.parentElement;
          }
          return list;
        }

        return {
          allStickies: allStickies.map(s => ({
            tag: s.tagName,
            class: s.className.slice(0, 60),
            position: window.getComputedStyle(s).position,
            top: window.getComputedStyle(s).top,
            rect: s.getBoundingClientRect(),
            parentHeight: s.parentElement ? s.parentElement.getBoundingClientRect().height : null,
            overflowAncestors: getOverflowAncestors(s),
          })),
        };
      })()
    `,
    returnByValue: true
  });

  console.log('DEBUG INFO:', JSON.stringify(debugInfo.result.value, null, 2));

  ws.close();
  edge.kill();
}

check().catch(console.error);

