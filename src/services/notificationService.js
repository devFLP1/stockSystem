require('dotenv').config()
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.PUSH_NOTIFICATION_EMAIL_SERVICE,
  auth: {
    user: process.env.PUSH_NOTIFICATION_EMAIL,
    pass: process.env.PUSH_NOTIFICATION_EMAIL_PASSWORD
  }
});

function sendNotification(email, subject, message) {
  const mailOptions = {
    from: process.env.PUSH_NOTIFICATION_EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendNotification
};