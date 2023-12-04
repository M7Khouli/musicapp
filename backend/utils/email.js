const nodemailer = require('nodemailer');
const dotEnv = require('dotenv');

const catchAsync = require('./catchAsync');

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'SoundScape',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
