import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

async function sendOtpEmail(to, otp, name) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const __dirname = path.resolve(path.dirname(''));
    const templatePath = path.join(__dirname, 'src', 'utils', 'emails', 'template', 'otp.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    let mailOptions = {
        from: process.env.SMTP_USER,
        to: to, 
        subject: 'Your OTP Code',
        html: htmlTemplate.replace('{{otp}}', otp).replace('{{name}}', name)
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}

export { sendOtpEmail };