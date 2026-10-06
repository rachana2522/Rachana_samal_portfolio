const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { PDFParse } = require('pdf-parse');

const root = path.resolve(__dirname, '..');
const siteUrl = pathToFileURL(path.join(root, 'index.html')).href;
const screenshots = path.join(os.tmpdir(), 'rachana-portfolio-screenshots');

async function checkResume() {
    const parser = new PDFParse({ data: await fs.readFile(path.join(root, 'assets/RPS.pdf')) });
    try {
        const result = await parser.getText();
        assert.equal(result.total, 2, 'Resume must fit two pages');
        for (const term of ['PRIYADARSANI', '3.5+', 'Patronus', '10,000', '2026', '9.1']) {
            assert.ok(result.text.includes(term), `PDF missing ${term}`);
        }
        console.log('PASS: two-page downloadable PDF contains latest resume facts');
    } finally {
        await parser.destroy();
    }
}

async function run() {
    const browser = await chromium.launch({ headless: true });
    try {
        const context = await browser.newContext({ acceptDownloads: true });
        const page = await context.newPage();
        if (process.argv.includes('--generate-resume')) {
            await page.goto(pathToFileURL(path.join(root, 'assets/resume.html')).href);
            await page.pdf({ path: path.join(root, 'assets/RPS.pdf'), preferCSSPageSize: true, printBackground: true });
            await checkResume();
            return;
        }
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await fs.mkdir(screenshots, { recursive: true });
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.goto(siteUrl);
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.locator('.home__data').waitFor({ state: 'visible' });
        assert.equal(await page.locator('body').getAttribute('data-theme'), 'midnight');
        assert.equal(await page.locator('.work__card').count(), 3);
        assert.ok((await page.locator('body').innerText()).includes('Google Cloud'));
        assert.equal(await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).length), 0);
        const localPaths = await page.locator('[src], link[rel="stylesheet"], a[download]').evaluateAll(elements => elements.map(element => element.getAttribute('src') || element.getAttribute('href')).filter(value => value && !/^(https?:|data:)/.test(value)));
        await Promise.all(localPaths.map(localPath => fs.access(path.join(root, localPath))));
        console.log('PASS: resume content, project cards, local assets, and portrait images');

        await page.getByRole('button', { name: 'Choose theme', exact: true }).click();
        const themes = ['slate', 'midnight', 'glassy', 'indigo', 'ember', 'evergreen', 'rosewood', 'champagne'];
        const colors = new Set();
        await themes.reduce(async (previous, theme) => {
            await previous;
            await page.locator(`[data-palette="${theme}"]`).click();
            assert.equal(await page.locator('body').getAttribute('data-theme'), theme);
            assert.equal(await page.locator(`[data-palette="${theme}"]`).getAttribute('aria-pressed'), 'true');
            colors.add(await page.locator('body').evaluate(element => getComputedStyle(element).getPropertyValue('--body-color').trim()));
            await page.getByRole('button', { name: 'Switch to light mode' }).click();
            assert.ok(await page.locator('body').evaluate(element => element.classList.contains('light-theme')));
            await page.getByRole('button', { name: 'Switch to dark mode' }).click();
            await page.getByRole('button', { name: 'Choose theme', exact: true }).click();
        }, Promise.resolve());
        assert.equal(colors.size, 8);
        await page.locator('[data-palette="midnight"]').click();
        await page.reload();
        assert.equal(await page.locator('body').getAttribute('data-theme'), 'midnight');
        await page.getByRole('button', { name: 'Switch to light mode' }).click();
        await page.reload();
        assert.ok(await page.locator('body').evaluate(element => element.classList.contains('light-theme')));
        await page.getByRole('button', { name: 'Switch to dark mode' }).click();
        await page.getByRole('button', { name: 'Choose theme', exact: true }).click();
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#theme-panel').isVisible(), false);
        assert.equal(await page.getByRole('button', { name: 'Choose theme', exact: true }).getAttribute('aria-expanded'), 'false');
        console.log('PASS: all eight themes, light/dark modes, saved preferences, and keyboard dismissal');

        await page.locator('.nav__link[href="#skills"]').click();
        assert.ok(page.url().endsWith('#skills'));
        await page.locator('#credentials').scrollIntoViewIfNeeded();
        await page.getByRole('button', { name: 'AI', exact: true }).click();
        await page.waitForFunction(() => [...document.querySelectorAll('.work__card')].filter(element => getComputedStyle(element).display !== 'none').length === 2);
        await page.getByRole('button', { name: 'Logistics', exact: true }).click();
        await page.waitForFunction(() => [...document.querySelectorAll('.work__card')].filter(element => getComputedStyle(element).display !== 'none').length === 2);
        await page.getByRole('button', { name: 'All', exact: true }).click();
        await page.waitForFunction(() => [...document.querySelectorAll('.work__card')].filter(element => getComputedStyle(element).display !== 'none').length === 3);
        const missingAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !link.hash || !document.getElementById(link.hash.slice(1))).map(link => link.getAttribute('href')));
        assert.deepEqual(missingAnchors, []);
        console.log('PASS: section navigation, education scrolling, and project filters');

        assert.equal(await page.locator('#contact-form').evaluate(form => form.checkValidity()), false);
        await page.locator('#contact-name').fill('Portfolio tester');
        await page.locator('#contact-email').fill('tester@example.com');
        await page.locator('#contact-project').fill('Angular project & cloud delivery');
        assert.equal(await page.locator('#contact-form').evaluate(form => form.checkValidity()), true);
        const session = await context.newCDPSession(page);
        await session.send('Page.enable');
        const draft = new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Email draft navigation not requested')), 5000);
            session.on('Page.frameRequestedNavigation', event => {
                if (event.url.startsWith('mailto:')) { clearTimeout(timer); resolve(event.url); }
            });
        });
        await page.getByRole('button', { name: 'Open Email Draft' }).click();
        const mailUrl = await draft;
        assert.ok(mailUrl.startsWith('mailto:rachanapriyadarshnisamal@gmail.com?'));
        assert.ok(decodeURIComponent(mailUrl).includes('Angular project & cloud delivery'));
        console.log('PASS: contact validation and correctly encoded email draft');

        await page.locator('.nav__link[href="#home"]').click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('link', { name: 'Download Resume' }).click();
        const download = await downloadPromise;
        assert.equal(download.suggestedFilename(), 'RPS.pdf');
        assert.equal(await download.failure(), null);
        await checkResume();

        const viewports = [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 640 }];
        await viewports.reduce(async (previous, viewport) => {
            await previous;
            await page.setViewportSize(viewport);
            await page.locator('.nav__link[href="#home"]').click();
            await page.evaluate(() => document.getAnimations().forEach(animation => animation.finish()));
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${viewport.width}px`);
            await page.screenshot({ path: path.join(screenshots, `portfolio-${viewport.width}.png`), fullPage: true });
            await page.getByRole('button', { name: 'Choose theme', exact: true }).click();
            const panel = await page.locator('#theme-panel').boundingBox();
            assert.ok(panel.x >= 0 && panel.x + panel.width <= viewport.width);
            assert.ok(panel.y + panel.height <= viewport.height);
            await page.locator('[data-palette="champagne"]').scrollIntoViewIfNeeded();
            await page.screenshot({ path: path.join(screenshots, `themes-${viewport.width}.png`) });
            await page.keyboard.press('Escape');
        }, Promise.resolve());
        console.log('PASS: desktop, mobile, and narrow mobile layout; sidebar remains in viewport');
        assert.deepEqual(errors, [], 'Browser JavaScript errors');
        console.log(`PASS: no browser JavaScript errors. Screenshots: ${screenshots}`);
    } finally {
        await browser.close();
    }
}

run().catch(error => { console.error(error); process.exitCode = 1; });