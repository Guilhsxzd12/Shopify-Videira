import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const artifactDirectory = new URL('./artifacts/', import.meta.url);
await mkdir(artifactDirectory, { recursive: true });
const scenarios = [
  { count: 0, metadata: false },
  { count: 1, metadata: false },
  { count: 6, metadata: false },
  { count: 6, metadata: true }
];
try {
  for (const scenario of scenarios) {
    const server = spawn(process.execPath, [new URL('./fixture-server.mjs', import.meta.url).pathname], {
      env: { ...process.env, PORT: '4174', PRODUCT_COUNT: String(scenario.count), PRODUCT_METADATA: String(scenario.metadata) },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    try {
      await new Promise((resolve, reject) => {
        server.stdout.once('data', resolve);
        server.once('error', reject);
        server.once('exit', code => reject(new Error('Fixture server exited: ' + code)));
      });
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => localStorage.setItem('videira-age-ok', '1'));
        await page.goto('http://127.0.0.1:4174/');
        await page.evaluate(() => document.fonts.ready);
        assert.equal(await page.locator('#selecao').count(), scenario.count ? 1 : 0);
        assert.equal(await page.locator('main .wc-section').count(), scenario.count > 1 ? 3 : scenario.count);
        assert.equal(await page.locator('#paises').count(), scenario.metadata ? 1 : 0);
        assert.equal(await page.locator('#uvas').count(), scenario.metadata ? 1 : 0);
        assert.equal(await page.locator('#bodegas').count(), scenario.count ? 1 : 0);
        assert.equal(await page.locator('main').evaluate(el => /[↗➡↘]/u.test(el.innerText)), false);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        for (const shelf of await page.locator('main .wc-section').all()) {
          const row = shelf.locator('.wc-viewport');
          const overflow = await row.evaluate(el => el.scrollWidth > el.clientWidth + 1);
          assert.equal(await shelf.locator('[data-carousel-step="1"]').isVisible(), overflow);
          if (overflow) {
            await shelf.locator('[data-carousel-step="1"]').click();
            await page.waitForFunction(el => el.scrollLeft > 0, await row.elementHandle());
          }
        }
        if (scenario.count === 1) await page.screenshot({ path: new URL(`single-home-${width}.png`, artifactDirectory).pathname, fullPage: true });
        if (scenario.count > 0) {
          await page.goto('http://127.0.0.1:4174/products/origem');
          const data = await page.locator('script[type="application/ld+json"]').allTextContents();
          assert.equal(data.length, 1);
          assert.equal(JSON.parse(data[0])['@type'], 'Product');
          assert.equal(JSON.parse(data[0]).name, 'Origem Cabernet Sauvignon');
          assert.equal(await page.locator('body').evaluate(el => el.innerText.includes('@context')), false);
          assert.equal(await page.locator('.wc-section').count(), scenario.count > 1 ? 1 : 0);
          assert.equal(await page.locator('.wc-group .sf-wine-card').count(), Math.max(0, scenario.count - 1));
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          await page.locator('#variant-select').selectOption('13');
          assert.equal(await page.locator('[data-product-submit]').isDisabled(), true);
          await page.locator('#variant-select').selectOption('12');
          await page.locator('#product-quantity').fill('2');
          await page.locator('[data-product-submit]').click();
          await page.locator('[data-cart-dialog][open]').waitFor();
          assert.match(await page.locator('[data-cart-dialog]').innerText(), /240,00/);
          assert.equal(await page.locator('[data-cart-dialog] button[name="checkout"]').count(), 1);
          await page.keyboard.press('Escape');
          if (scenario.count === 1) {
            await page.evaluate(() => scrollTo(0, 0));
            await page.screenshot({ path: new URL(`single-product-${width}.png`, artifactDirectory).pathname, fullPage: true });
          }
        }
        assert.deepEqual(errors, []);
        console.log(`PASS products=${scenario.count} metadata=${scenario.metadata} width=${width}`);
        await page.close();
      }
    } finally {
      server.kill();
      await new Promise(resolve => server.once('exit', resolve));
    }
  }
} finally {
  await browser.close();
}
