const express = require('express');
const axios = require('axios');
const archiver = require('archiver');
const stream = require('stream');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Joi = require('joi');
const expressWaf = require('express-waf');

const PORT = process.env.EXPORT_FILE_PORT  || 3002;

app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));
app.use(bodyParser.json());

const wafOptions = {
  blockMode: true,
  rules: [
    {
      type: 'sql-injection',
      action: 'block',
    },
    {
      type: 'xss',
      action: 'block',
    },
    {
      type: 'csrf',
      action: 'block',
    },
    {
      type: 'directory-traversal',
      action: 'block',
    },
    {
      type: 'local-file-inclusion',
      action: 'block',
    },
    {
      type: 'remote-file-inclusion',
      action: 'block',
    },
    {
      type: 'command-injection',
      action: 'block',
    },
    {
      type: 'code-injection',
      action: 'block',
    },
    {
      type: 'http-header-injection',
      action: 'block',
    },
    {
      type: 'http-method-override',
      action: 'block',
    },
    {
      type: 'http-protocol-violation',
      action: 'block',
    },
    {
      type: 'http-response-splitting',
      action: 'block',
    },
    {
      type: 'http-request-smuggling',
      action: 'block',
    },
    {
      type: 'http-request-flooding',
      action: 'block',
    },
    {
      type: 'brute-force',
      action: 'block',
    },
    {
      type: 'rate-limiting',
      action: 'block',
    },
    {
      type: 'user-agent-blocking',
      action: 'block',
    },
    {
      type: 'ip-blocking',
      action: 'block',
    },
    {
      type: 'geo-blocking',
      action: 'block',
    },
    {
      type: 'bot-detection',
      action: 'block',
    },
  ],
};

app.use(expressWaf(wafOptions));

const schema = Joi.object({
  fileDownloadURLs: Joi.array().items(Joi.string().uri()).required(),
  fileNames: Joi.array().items(Joi.string()).required()
});

app.post('/export-files', async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Invalid request data' });
  }
  const { fileDownloadURLs, fileNames } = req.body;
  const zip = archiver('zip');
  const zipStream = new stream.PassThrough();
  zip.pipe(zipStream);

  try {
    for (let i = 0; i < fileDownloadURLs.length; i++) {
      try {
        const response = await axios({
          method: 'get',
          url: fileDownloadURLs[i],
          responseType: 'stream'
        });
        zip.append(response.data, { name: fileNames[i] });
      } catch (fileError) {
        console.error(`Error downloading file ${fileNames[i]}:`, fileError);
        return res.status(500).json({ error: `Error downloading file ${fileNames[i]}` });
      }
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