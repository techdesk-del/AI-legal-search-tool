// scripts/generateCeoPdf.js - Executive PDF Generator via Headless Chrome / Edge
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlPath = path.join(__dirname, 'ceo_deck_template.html');
const pdfPath = path.join(__dirname, '../CEO_PRESENTATION_DOCUMENTATION.pdf');

function generateCeoPdf() {
  console.log('Generating executive-grade publication PDF for CEO presentation...');

  // Locate Chrome or Edge
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  let browserPath = candidates.find(p => fs.existsSync(p));

  if (!browserPath) {
    console.error('Neither Google Chrome nor Microsoft Edge was found in standard locations.');
    process.exit(1);
  }

  console.log(`Using rendering engine: ${browserPath}`);

  const cmd = `"${browserPath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
    const stats = fs.statSync(pdfPath);
    console.log(`✅ Pristine Executive PDF successfully generated: ${pdfPath} (${stats.size} bytes)`);
  } catch (err) {
    console.error('Error rendering PDF:', err.message);
    process.exit(1);
  }
}

generateCeoPdf();
