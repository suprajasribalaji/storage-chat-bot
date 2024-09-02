require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const speakeasy = require('speakeasy');
const sendgrid = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.REACT_SENDGRID_API_KEY;
const SENDGRID_TEMPLATE_ID = process.env.REACT_SENDGRID_SEND_OTP_TEMPLATE_ID;

if (!SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not defined.');
  process.exit(1);
}

sendgrid.setApiKey(SENDGRID_API_KEY);

const PORT = process.env.MFA_PORT  || 3003;
const app = express();

app.use(express.json());
app.use(cors());

const otpStore = {};

app.post('/generate-send-otp', async (req, res) => {
  try {
    const { email: rawEmail, nickName } = req.body;
    if (!rawEmail || !nickName) {
      return res.status(400).json({ success: false, message: 'Email and nickName are required' });
    }
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
        templateId: SENDGRID_TEMPLATE_ID,
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

app.post('/verify-otp', (req, res) => {
  try {
    const { email: rawEmail, otp } = req.body;
    if (!rawEmail || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));