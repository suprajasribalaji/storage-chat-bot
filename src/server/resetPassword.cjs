require('dotenv').config({path: '../../.env'});
const express = require('express');
const cors = require('cors');
const admin = require('../config/firebase-admin.config.ts');
const sendgrid = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.REACT_SENDGRID_API_KEY;
const SENDGRID_TEMPLATE_ID = process.env.REACT_SENDGRID_RESET_PASSWORD_TEMPLATE_ID;

if (!SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not defined.');
    process.exit(1);
}

sendgrid.setApiKey(SENDGRID_API_KEY);

const auth = admin.auth();
const PORT = process.env.PORT  || 3001;
const app = express();

app.use(cors());
app.use(express.json());

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
            templateId: SENDGRID_TEMPLATE_ID,
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
