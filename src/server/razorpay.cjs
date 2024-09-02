require('dotenv').config({path: '../../.env'});
const Razorpay = require('razorpay');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const sendgrid = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.REACT_SENDGRID_API_KEY;
const SENDGRID_ELITE_TEMPLATE_ID = process.env.REACT_SENDGRID_ELITE_SUBSCRIBED_TEMPLATE_ID;
const SENDGRID_DELUXE_TEMPLATE_ID = process.env.REACT_SENDGRID_DELUXE_SUBSCRIBED_TEMPLATE_ID;

if (!SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not defined.');
    process.exit(1);
}

sendgrid.setApiKey(SENDGRID_API_KEY);

const app = express();
const PORT = process.env.RAZORPAY_PORT || 3004;

app.use(cors({ origin: 'http://localhost:5000' }));
app.use(bodyParser.json());

const razorpayInstance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
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

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));