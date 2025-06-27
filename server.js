const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS for frontend requests
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('pdf'), async (req, res) => {
  try {
    // PDF-to-Word conversion logic here
    res.download('output.docx'); // Send converted file
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('API running on port 3000'));
