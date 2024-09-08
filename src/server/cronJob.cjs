require('dotenv').config({ path: '../../.env' });
const cron = require('node-cron');
const admin = require('../config/firebase-admin.config.ts');
const sendgrid = require('@sendgrid/mail');

const db = admin.firestore();

const SENDGRID_API_KEY = process.env.REACT_SENDGRID_API_KEY;
const SENDGRID_SUBSCRIPTION_REMINDER_TEMPLATE_ID = process.env.REACT_SENDGRID_SUBSCRIPTION_REMINDER_TEMPLATE_ID;

if (!SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY is not defined.');
    process.exit(1);
  }
  
sendgrid.setApiKey(SENDGRID_API_KEY);

const checkPlanValidityAndSendReminders = async () => {
  try {
    const usersSnapshot = await db.collection('Users').get();
    const now = Date.now();
    const daysInMillis = 26 * 24 * 60 * 60 * 1000; // 26 days in milliseconds

    usersSnapshot.forEach(async (doc) => {
      const userData = doc.data();
      const planSubscribeDate = userData.subscribed_at;

      if (planSubscribeDate) {
        const timeDifference = now - planSubscribeDate;

        if (timeDifference >= daysInMillis && timeDifference < daysInMillis + 24 * 60 * 60 * 1000) {
            const message = {
              to: userData.email,
              from: {
                name: 'WareHouse Team',
                email: 'suprajasrirb@gmail.com',
              },
              templateId: SENDGRID_SUBSCRIPTION_REMINDER_TEMPLATE_ID,
              dynamic_template_data: {
                email: userData.email,
              }
            };
            const response = await sendgrid.send(message);
            console.log(response);
            console.log(`Reminder email sent to ${userData.email}`);
        }
      }
    });
  } catch (error) {
    console.error('Error checking plan validity or sending emails:', error);
  }
};

// Schedule the cron job to run every minute
cron.schedule('* * * * *', checkPlanValidityAndSendReminders);

console.log('Cron job scheduled to run every minute.');