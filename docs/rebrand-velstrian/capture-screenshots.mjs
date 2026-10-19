import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const ASTRO_DIR = path.join(ROOT, 'astro');
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

const PORT = 8094;
const BASE_URL = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) {
        return true;
      }
    } catch (e) {
      // wait and retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond within ${timeoutMs}ms at ${url}`);
}

async function main() {
  console.log('Starting preview server on port', PORT, '...');
  const server = spawn('npm.cmd', ['run', 'preview', '--', '--force'], {
    cwd: ASTRO_DIR,
    shell: true,
    stdio: 'pipe',
  });

  server.stdout.on('data', (d) => console.log(`[preview] ${d.toString().trim()}`));
  server.stderr.on('data', (d) => console.error(`[preview err] ${d.toString().trim()}`));

  try {
    await waitForServer(BASE_URL);
    console.log('Preview server ready at', BASE_URL);

    const browser = await chromium.launch();

    const viewports = [
      { name: 'desktop', width: 1280, height: 800 },
      { name: 'mobile', width: 390, height: 844 },
    ];

    const pages = [
      { name: 'home', path: '/' },
      { name: 'about', path: '/about/' },
      { name: 'contact', path: '/contact/' },
      { name: 'pricing', path: '/pricing/' },
      { name: 'legal-terms', path: '/terms/' },
    ];

    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      for (const p of pages) {
        const url = `${BASE_URL}${p.path}`;
        console.log(`Capturing ${p.name} on ${vp.name} (${url})...`);
        await page.goto(url, { waitUntil: 'networkidle' });
        await page.waitForTimeout(500);

        const screenshotPath = path.join(SCREENSHOTS_DIR, `${p.name}-${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`Saved ${screenshotPath}`);

        if (p.name === 'home') {
          // Also capture footer
          const footer = await page.$('footer');
          if (footer) {
            const footerPath = path.join(SCREENSHOTS_DIR, `footer-${vp.name}.png`);
            await footer.screenshot({ path: footerPath });
            console.log(`Saved ${footerPath}`);
          }
        }
      }

      await context.close();
    }

    await browser.close();
    console.log('All screenshots captured successfully.');
  } finally {
    console.log('Stopping preview server...');
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
