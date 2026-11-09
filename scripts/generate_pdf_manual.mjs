import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9588;

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { resolve, reject } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  const tempDir = path.join(process.cwd(), '.temp_edge_pdf');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const edgeProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tempDir}`,
    '--headless',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const pages = await listRes.json();
    const target = pages.find(p => p.type === 'page') || pages[0];

    const cdp = new CDPClient(target.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');

    const htmlPath = path.resolve('scripts/document_source.html');
    const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;

    console.log('Navigating to:', fileUrl);
    await cdp.send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 2000));

    console.log('Printing to PDF...');
    const pdfRes = await cdp.send('Page.printToPDF', {
      printBackground: true,
      paperWidth: 8.27,
      paperHeight: 11.69,
      marginTop: 0.4,
      marginBottom: 0.4,
      marginLeft: 0.4,
      marginRight: 0.4
    });

    const targetPdf = path.resolve('public/uploads/classroom/Quy-Trinh-Video-AI-Trieu-View-Tu-1-Anh-Nguyen-Dang-AI-2026.pdf');
    fs.writeFileSync(targetPdf, Buffer.from(pdfRes.data, 'base64'));

    console.log('Saved PDF to:', targetPdf);
    console.log('PDF Size:', fs.statSync(targetPdf).size, 'bytes');

    cdp.close();
  } finally {
    edgeProc.kill();
  }
}

main().catch(console.error);

