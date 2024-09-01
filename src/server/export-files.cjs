require('dotenv').config({ path: '../../.env' });

const express = require('express');
const axios = require('axios');
const archiver = require('archiver');
const stream = require('stream');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
app.use(express.json());

app.post('/export-files', async (req, res) => {
  const { fileDownloadURLs, fileNames } = req.body;
  const zip = archiver('zip');
  const zipStream = new stream.PassThrough();
  zip.pipe(zipStream);

  try {
    for (let i = 0; i < fileDownloadURLs.length; i++) {
      const response = await axios({
        method: 'get',
        url: fileDownloadURLs[i],
        responseType: 'stream'
      });
      zip.append(response.data, { name: fileNames[i] });
    }

    await zip.finalize();

    res.setHeader('Content-Disposition', 'attachment; filename=warehouse_files.zip');
    res.setHeader('Content-Type', 'application/zip');

    zipStream.pipe(res);
  } catch (error) {
    console.error("Error during export process:", error);
    res.status(500).json({ error: 'An error occurred during the export process.' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));