require('dotenv').config({ path: '../../.env' });
const express = require('express');
const cors = require('cors');
const speakeasy = require('speakeasy');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const sendgrid = require('@sendgrid/mail');
const admin = require('../config/firebase-admin.config.ts');

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
const PORT = process.env.PORT  || 3003;
const app = express();

app.use(cors({ origin: 'http://localhost:5000' }));
app.use(bodyParser.json());

const otpStore = {};

app.post('/reset-password', async (req, res) => {
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

app.post('/send-reset-password-link', async (req, res) => {
  console.log('Received request:', req.body);
  try {
      const { to, link } = req.body; 
      if (!to || !link) {
          return res.status(400).json({ error: 'To and link are required' });
      }       
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

app.post('/subscribe', async (req, res) => {
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

app.post('/verify-payment', async (req, res) => {
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

app.post('/send-subscription-invoice', async (req, res) => {
  console.log('Received request:', req.body);
  try {
      const { subscribedTo, orderId, fullName, nickName, email, amount, validity, paymentMethod, paymentId } = req.body;  
      const SENDGRID_TEMPLATE_ID = (subscribedTo === 'Elite') ? SENDGRID_ELITE_TEMPLATE_ID : SENDGRID_DELUXE_TEMPLATE_ID;
      const message = {
          to: email,
          from: {
              name: 'WareHouse Team',
              email: 'suprajasrirb@gmail.com',
          },
          templateId: SENDGRID_TEMPLATE_ID,
          dynamic_template_data: {
              orderId: orderId,
              fullName: fullName,
              nickName: nickName,
              email: email,
              subscribedTo: subscribedTo,
              paymentMethod: paymentMethod,
              paymentId: paymentId,
              validity: validity,
              amount: amount,
          }
      };
      
      const response = await sendgrid.send(message);
      console.log('SendGrid response:', response);
      res.status(202).send('Email sent successfully!'); 
  } catch (error) {
      console.error('Error sending email:', error.response ? error.response.body : error.message);
      res.status(500).json({ message: 'Error sending email', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));