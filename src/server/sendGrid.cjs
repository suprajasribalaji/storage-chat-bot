require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const sendgrid = require('@sendgrid/mail');

const PORT = process.env.PORT || 3000;
const SENDGRID_API_KEY = process.env.REACT_SENDGRID_API_KEY;
const SENDGRID_TEMPLATE_ID = process.env.REACT_SENDGRID_TEMPLATE_ID;

if (!SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not defined.');
    process.exit(1);
}

sendgrid.setApiKey(SENDGRID_API_KEY);

const app = express();
app.use(cors())
app.use(express.json());

app.post('/send-credentials', async (req, res) => {
    try {
        const { to } = req.body;
        const password = 'sample@123';
        const message = {
            to,
            from: {
                name: 'WareHouse Team',
                email: 'suprajasrirb@gmail.com',
            },
            templateId: SENDGRID_TEMPLATE_ID,
            dynamic_template_data: {
                email: to,
                password: password,
                subject: 'Login Credentials',
            }
        };
        await sendgrid.send(message);
        res.status(200).send('Email sent successfully!');
    }  catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
