// scripts/generatePdf.js - Exact 6-Page PDF Generator without Trailing Blanks
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const mdPath = path.join(__dirname, '../USER_GUIDE_AND_DOCUMENTATION.md');
const pdfPath = path.join(__dirname, '../USER_GUIDE_AND_DOCUMENTATION.pdf');

function cleanMarkdownFormatting(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/🟢/g, '[HIGH]')
    .replace(/🟡/g, '[MEDIUM]')
    .replace(/🔴/g, '[LOW/ESCALATED]')
    .replace(/📜/g, '[ACT]')
    .replace(/⚖️/g, '[CASE]')
    .replace(/📑/g, '[CONTRACT]')
    .replace(/🎥/g, '[VIDEO]')
    .replace(/🛡️/g, '[ADMIN]')
    .replace(/🔍/g, '[SEARCH]')
    .replace(/📚/g, '[DOCS]')
    .replace(/📊/g, '[ANALYTICS]')
    .replace(/⭐/g, '[*]')
    .replace(/📌/g, '[TAG]')
    .replace(/📋/g, '[COPY]')
    .replace(/📄/g, '[BRIEF]')
    .replace(/▶️/g, '[PLAY]')
    .replace(/🔥/g, '[PRIORITY]')
    .replace(/✨/g, '')
    .replace(/🚀/g, '')
    .replace(/🍃/g, '')
    .replace(/💡/g, '')
    .replace(/➔/g, '->')
    .replace(/[^\x00-\x7F]/g, '');
}

function generatePdf() {
  console.log('Generating exact PDF from USER_GUIDE_AND_DOCUMENTATION.md...');
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const lines = mdContent.split('\n');

  const doc = new PDFDocument({
    margins: { top: 40, bottom: 40, left: 45, right: 45 },
    size: 'A4',
    bufferPages: true
  });

  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  const PRIMARY = '#0F172A';
  const ACCENT_BLUE = '#1D4ED8';
  const ACCENT_GOLD = '#B45309';
  const TEXT_DARK = '#1E293B';
  const TEXT_MUTED = '#64748B';
  const BG_CODE = '#F8FAFC';

  // Title Banner on Page 1
  doc.rect(45, 40, 505, 75).fill(PRIMARY);
  doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold')
     .text('URBANGAON AI LEGAL SEARCH PLATFORM', 55, 55, { width: 485, align: 'center' });
  doc.fillColor('#E2E8F0').fontSize(10).font('Helvetica')
     .text('Complete User & Technical Documentation Manual — Enterprise Edition', 55, 78, { width: 485, align: 'center' });
  doc.fillColor('#FBBF24').fontSize(9).font('Helvetica-Bold')
     .text('Live MongoDB Atlas Cloud Integration Active', 55, 95, { width: 485, align: 'center' });

  doc.y = 130;
  doc.fillColor(TEXT_DARK);

  let inCodeBlock = false;
  let codeBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // Skip the title line since we rendered the banner
    if (line.startsWith('# URBANGAON AI LEGAL SEARCH PLATFORM')) continue;

    // Handle Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        const codeText = cleanMarkdownFormatting(codeBuffer.join('\n'));
        const neededHeight = (codeBuffer.length * 10.5) + 14;
        
        if (doc.y + neededHeight > doc.page.height - 50) {
          doc.addPage();
        }
        
        const startY = doc.y;
        doc.rect(45, startY, 505, neededHeight).fill(BG_CODE);
        doc.rect(45, startY, 505, neededHeight).stroke('#CBD5E1');
        doc.fillColor('#334155').fontSize(7.8).font('Courier')
           .text(codeText, 52, startY + 6, { width: 490, lineGap: 1 });
        doc.y = startY + neededHeight + 6;
        codeBuffer = [];
      } else {
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Auto page break check
    if (doc.y > doc.page.height - 50) {
      doc.addPage();
    }

    // Headers
    if (line.startsWith('# ')) {
      doc.moveDown(0.5);
      doc.fillColor(PRIMARY).fontSize(12.5).font('Helvetica-Bold')
         .text(cleanMarkdownFormatting(line.replace(/^#\s*/, '')));
      doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(45, doc.y + 2).lineTo(550, doc.y + 2).stroke();
      doc.moveDown(0.25);
    } else if (line.startsWith('## ')) {
      doc.moveDown(0.4);
      doc.fillColor(ACCENT_BLUE).fontSize(11).font('Helvetica-Bold')
         .text(cleanMarkdownFormatting(line.replace(/^##\s*/, '')));
      doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(45, doc.y + 2).lineTo(550, doc.y + 2).stroke();
      doc.moveDown(0.2);
    } else if (line.startsWith('### ')) {
      doc.moveDown(0.35);
      doc.fillColor('#1E293B').fontSize(9.8).font('Helvetica-Bold')
         .text(cleanMarkdownFormatting(line.replace(/^###\s*/, '')));
      doc.moveDown(0.12);
    } else if (line.startsWith('#### ')) {
      doc.moveDown(0.25);
      doc.fillColor(ACCENT_GOLD).fontSize(9).font('Helvetica-Bold')
         .text(cleanMarkdownFormatting(line.replace(/^####\s*/, '')));
      doc.moveDown(0.08);
    } else if (line.startsWith('> ')) {
      // Callout box
      const quoteText = cleanMarkdownFormatting(line.replace(/^>\s*/, ''));
      const startY = doc.y;
      doc.rect(45, startY, 505, 16).fill('#F8FAFC');
      doc.rect(45, startY, 3, 16).fill(ACCENT_GOLD);
      doc.fillColor('#475569').fontSize(8.2).font('Helvetica-Oblique')
         .text(quoteText, 55, startY + 3, { width: 485 });
      doc.y = startY + 20;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Bullet point
      const cleanText = cleanMarkdownFormatting(line.replace(/^[-*]\s*/, ''));
      doc.fillColor(TEXT_DARK).fontSize(8.5).font('Helvetica')
         .text(`•  ${cleanText}`, 55, doc.y, { width: 490, lineGap: 1.2 });
      doc.moveDown(0.08);
    } else if (/^\d+\.\s/.test(line)) {
      // Numbered item
      const cleanText = cleanMarkdownFormatting(line);
      doc.fillColor(TEXT_DARK).fontSize(8.5).font('Helvetica')
         .text(cleanText, 55, doc.y, { width: 490, lineGap: 1.2 });
      doc.moveDown(0.08);
    } else if (line.startsWith('|')) {
      // Table row
      const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length > 0 && !cells[0].includes('---')) {
        const rowText = cleanMarkdownFormatting(cells.join('  |  '));
        doc.fillColor('#334155').fontSize(7.5).font('Courier')
           .text(rowText, 48, doc.y, { width: 500 });
        doc.moveDown(0.08);
      }
    } else if (line.trim() === '---') {
      doc.moveDown(0.15);
      doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(45, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.15);
    } else if (line.trim().length > 0) {
      const cleanText = cleanMarkdownFormatting(line);
      doc.fillColor(TEXT_DARK).fontSize(8.5).font('Helvetica')
         .text(cleanText, 45, doc.y, { width: 505, lineGap: 1.2 });
      doc.moveDown(0.15);
    }
  }

  // Footer Pass: temporarily reduce bottom margin to prevent auto-new-page creation
  const totalPages = doc.bufferedPageRange().count;
  for (let i = 0; i < totalPages; i++) {
    doc.switchToPage(i);
    const prevBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    // Header on pages 2+
    if (i > 0) {
      doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(45, 25).lineTo(550, 25).stroke();
      doc.fillColor(TEXT_MUTED).fontSize(7.2).font('Helvetica')
         .text('URBANGAON AI LEGAL SEARCH PLATFORM — USER & TECHNICAL MANUAL', 45, 14, { width: 505, align: 'left', lineBreak: false });
    }

    // Footer
    doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(45, doc.page.height - 25).lineTo(550, doc.page.height - 25).stroke();
    doc.fillColor(TEXT_MUTED).fontSize(7.2).font('Helvetica')
       .text(`Page ${i + 1} of ${totalPages}`, 45, doc.page.height - 18, { width: 505, align: 'center', lineBreak: false });

    doc.page.margins.bottom = prevBottom;
  }

  doc.end();

  writeStream.on('finish', () => {
    console.log(`✅ Exact ${totalPages}-page PDF generated at: ${pdfPath}`);
  });
}

generatePdf();
