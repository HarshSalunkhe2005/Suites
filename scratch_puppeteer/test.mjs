import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:5174/watermark');
  console.log('Navigated to /watermark');
  
  await page.waitForSelector('input[type="file"]');
  const elementHandle = await page.$('input[type="file"]');
  await elementHandle.uploadFile(path.resolve('./dummy.png'));
  
  console.log('Image uploaded');
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
