require('dotenv').config({path: '../../.env'});
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const archiver = require('archiver');
const stream = require('stream');
const cors = require('cors');
const bodyParser = require('body-parser');
const Joi = require('joi');
const helmet = require('helmet');
const os = require('os');
const speakeasy = require('speakeasy');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const sendgrid = require('@sendgrid/mail');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

const admin = require('../src/config/firebase-admin.config.ts');

const SENDGRID_API_KEY = process.env.REACT_SENDGRID_API_KEY;
const SENDGRID_RESET_PASSWORD_TEMPLATE_ID = process.env.REACT_SENDGRID_RESET_PASSWORD_TEMPLATE_ID;
const SENDGRID_SEND_OTP_TEMPLATE_ID = process.env.REACT_SENDGRID_SEND_OTP_TEMPLATE_ID;
const SENDGRID_ELITE_TEMPLATE_ID = process.env.REACT_SENDGRID_ELITE_SUBSCRIBED_TEMPLATE_ID;
const SENDGRID_DELUXE_TEMPLATE_ID = process.env.REACT_SENDGRID_DELUXE_SUBSCRIBED_TEMPLATE_ID;

const razorpayInstance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

if (!SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not defined.');
  process.exit(1);
}

sendgrid.setApiKey(SENDGRID_API_KEY);

const auth = admin.auth();

const getSystemLoad = () => {
  const loadAverage = os.loadavg();
  return loadAverage[0];
};

const HIGH_LOAD_THRESHOLD = 1.5;

const throttle = (req, res, next) => {
  const load = getSystemLoad();
  if (load > HIGH_LOAD_THRESHOLD) {
    res.status(429).send('Service is currently under high load. Please try again later.');
  } else {
    next();
  }
};

app.use(
    helmet({
      frameguard: {
        action: 'deny',
      },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true, 
      xssFilter: true,
    })
  );

app.use(cors({
  origin: ['http://localhost:5000', 'https://warehousevault.netlify.app'],
  credentials: true
}));

app.use(bodyParser.json());

const rateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use(rateLimiter);

app.use(throttle);

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

function wafMiddleware(message) {
    if (message.includes('blocked')) {
      throw new Error('Message contains blocked content');
    }
    return message;
}


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT_WEBSOCKET || 3000;

// WebSocket connection
wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    try {
      const filteredMessage = wafMiddleware(message);
      const parsedMessage = JSON.parse(filteredMessage);
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({ error: 'Invalid message format or blocked content' }));
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Client disconnected: ${code} - ${reason}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start HTTP and WebSocket servers together
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

  


  

const otpStore = {};
const otpLimiter = rateLimit({
  max: 3,
  windowMs: 10 * 60 * 1000,
  message: 'Too many OTP requests, please try again later.',
});

const verificationLimiter = rateLimit({
  max: 3,
  windowMs: 10 * 60 * 1000,
  message: 'Too many OTP verification attempts, please try again later.',
});

app.post('/reset-password', [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;
    const response = await auth.generatePasswordResetLink(email);
    console.log('api response: ', response);
    res.status(202).send(response);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json(error.data);
  }
});

app.post('/send-reset-password-link', [
  body('to').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('link').isURL().withMessage('Invalid link'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  console.log('Received request:', req.body);
  try {
    const { to, link } = req.body;
    const message = {
      to,
      from: {
        name: 'WareHouse Team',
        email: 'suprajasrirb@gmail.com',
      },
      templateId: SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
      dynamic_template_data: {
        email: to,
        link: link,
      }
    };
    const response = await sendgrid.send(message);
    console.log('SendGrid response:', response);
    res.status(202).send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.response ? error.response.body : error.message);
    res.status(500).json(error.data);
  }
});

app.post('/generate-send-otp', [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('nickName').notEmpty().withMessage('Nickname is required').trim().escape(),
], otpLimiter, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email: rawEmail, nickName } = req.body;
    const email = rawEmail.toLowerCase();
    const secret = speakeasy.generateSecret();
    const otp = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      algorithm: 'sha512',
      digits: 6,
    });
    const expiration = Date.now() + 10 * 60 * 1000;
    otpStore[email] = { otp: otp, secret: secret.base32, expiration: expiration };
    const message = {
      to: email,
      from: {
        name: 'WareHouse Team',
        email: 'suprajasrirb@gmail.com',
      },
      templateId: SENDGRID_SEND_OTP_TEMPLATE_ID,
      dynamic_template_data: {
        otp: otp,
        nickName: nickName,
      }
    };
    await sendgrid.send(message);
    res.status(200).json({ success: true, message: 'OTP generated successfully' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ success: false, message: 'Error generating OTP' });
  }
});

app.post('/verify-otp', [
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits').trim().escape(),
], verificationLimiter, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email: rawEmail, otp } = req.body;
    const email = rawEmail.toLowerCase();
    const otpData = otpStore[email];
    if (!otpData) {
      return res.status(400).json({ success: false, message: 'No OTP found for this email' });
    }
    const { secret, expiration } = otpData;
    if (Date.now() > expiration) {
      delete otpStore[email];
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }
    const isValid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      algorithm: 'sha512',
      digits: 6,
      window: 1,
    });
    if (isValid) {
      delete otpStore[email];
      res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
});

app.post('/subscribe', [
  body('plan').isIn(['Elite', 'Deluxe']).withMessage('Invalid plan type').trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { plan } = req.body;
    const amount = (plan === 'Elite') ? 1 : 2;

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      key: process.env.KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      description: 'for testing purpose',
      prefill: {
        name: 'Supraja',
        email: 'suprajasrirb@gmail.com',
        contact: '9600784507',
      },
      notes: {
        address: 'Razorpay Office',
      },
      theme: {
        color: '#008080',
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong.',
      error: error.message,
    });
  }
});

app.post('/verify-payment', [
  body('razorpay_order_id').notEmpty().withMessage('Order ID is required').trim().escape(),
  body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required').trim().escape(),
  body('razorpay_signature').notEmpty().withMessage('Signature is required').trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const hmac = crypto.createHmac('sha256', process.env.KEY_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    try {
      const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);

      const paymentMethod = paymentDetails.method;
      const amount = paymentDetails.amount;

      res.status(200).json({ 
        success: true, 
        message: 'Payment verified successfully', 
        paymentDetails: {
          paymentMethod: paymentMethod,
          amount: amount
        } 
      });
    } catch (error) {
      console.error('Error fetching payment details:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error fetching payment details',
        error: error.message
      });
    }
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Invalid payment signature' 
    });
  }
});

app.post('/send-subscription-invoice', [
  body('subscribedTo').isIn(['Elite', 'Deluxe']).withMessage('Invalid subscription plan').trim().escape(),
  body('orderId').notEmpty().withMessage('Order ID is required').trim().escape(),
  body('fullName').notEmpty().withMessage('Full name is required').trim().escape(),
  body('nickName').notEmpty().withMessage('Nickname is required').trim().escape(),
  body('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('amount').isNumeric().withMessage('Amount must be a number').toFloat(),
  body('validity').notEmpty().withMessage('Validity is required').trim().escape(),
  body('paymentMethod').notEmpty().withMessage('Payment method is required').trim().escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { subscribedTo, orderId, fullName, nickName, email, amount, validity, paymentMethod } = req.body;
    const SENDGRID_SUBSCRIPTION_TEMPLATE_ID = (subscribedTo === 'Elite') ? SENDGRID_ELITE_TEMPLATE_ID : SENDGRID_DELUXE_TEMPLATE_ID;
    const message = {
      to: email,
      from: {
        name: 'WareHouse Team',
        email: 'suprajasrirb@gmail.com',
      },
      templateId: SENDGRID_SUBSCRIPTION_TEMPLATE_ID,
      dynamic_template_data: {
        plan: subscribedTo,
        orderId: orderId,
        fullName: fullName,
        nickName: nickName,
        amount: amount,
        validity: validity,
        paymentMethod: paymentMethod,
      }
    };
    const response = await sendgrid.send(message);
    console.log('SendGrid response:', response);
    res.status(200).send('Invoice sent successfully!');
  } catch (error) {
    console.error('Error sending invoice:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending invoice', 
      error: error.message 
    });
  }
});