import puppeteer from 'puppeteer';
import fs from 'fs';

fs.writeFileSync('dummy.pdf', '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 0 >>\nstream\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000213 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n255\n%%EOF');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  fs.writeFileSync('dummy2.pdf', fs.readFileSync('dummy.pdf'));
  
  console.log("Navigating to merger...");
  await page.goto('http://localhost:5173/pdf-merge', { waitUntil: 'networkidle2' });
  
  const fileInput = await page.$('input[type=file]');
  await fileInput.uploadFile('dummy.pdf', 'dummy2.pdf');
  
  await page.click('button.btn-primary');
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Navigating to compressor...");
  await page.goto('http://localhost:5173/pdf-compress', { waitUntil: 'networkidle2' });
  
  const fileInput2 = await page.$('input[type=file]');
  await fileInput2.uploadFile('dummy.pdf');
  
  await page.click('button.btn-primary');
  await new Promise(r => setTimeout(r, 2000));

  await browser.close();
  console.log("Done");
})();
