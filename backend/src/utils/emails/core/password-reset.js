import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { appEnv } from '../../env.js';

async function sendResetPasswordEmail({ name, email, token }) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const __dirname = path.resolve(path.dirname(''));
  const templatePath = path.join(__dirname, 'src', 'utils', 'emails', 'template', 'password-reset.html');
  const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  const resetPasswordUrl = `${appEnv.FRONTEND_URL}/resetpassword/passwordbaru?token=${token}`;

  let mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Password Reset Request',
    html: htmlTemplate.replace('{{name}}', name).replace('{{resetUrl}}', resetPasswordUrl)
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email: ' + error);
  }
}

export { sendResetPasswordEmail };