const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const mammoth = require('mammoth');

const app = express();
app.use(cors());

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// API endpoint
app.post('/convert', upload.single('pdf'), async (req, res) => {
  try {
    const { path: pdfPath } = req.file;
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Extract text (simplified; adjust for your needs)
    const pages = pdfDoc.getPages();
    let text = '';
    for (const page of pages) {
      text += await page.getText();
    }

    // Convert to DOCX
    const result = await mammoth.extractRawText({ text });
    const outputPath = path.join(__dirname, 'output.docx');
    fs.writeFileSync(outputPath, result.value);

    // Send the file
    res.download(outputPath, 'converted.docx', () => {
      // Cleanup
      fs.unlinkSync(pdfPath);
      fs.unlinkSync(outputPath);
    });
  } catch (err) {
    res.status(500).json({ error: 'Conversion failed: ' + err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
