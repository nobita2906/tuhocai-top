import { spawn } from 'child_process';
import http from 'http';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9333;

async function run() {
  console.log('Khởi chạy Edge CDP...');
  const edge = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  // Đợi port mở
  let connected = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) {
        connected = true;
        break;
      }
    } catch (_) {}
  }

  if (!connected) {
    console.error('Không thể kết nối Edge CDP');
    edge.kill();
    return;
  }

  console.log('Edge CDP sẵn sàng!');
  edge.kill();
}

run();

