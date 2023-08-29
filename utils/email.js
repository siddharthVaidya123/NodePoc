const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transported = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log('-->', process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD)
  const mailOptions = {
    from: 'Sidd',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transported.sendMail(mailOptions);
};

module.exports = sendEmail;
