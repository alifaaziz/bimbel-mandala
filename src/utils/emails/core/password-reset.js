import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

async function sendPasswordResetEmail(to, resetLink) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const templatePath = path.join(__dirname, 'template', 'password-reset.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    let mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: 'Password Reset Request',
        html: htmlTemplate.replace('{{RESET_LINK}}', resetLink)
    };

    // Send email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}

module.exports = sendPasswordResetEmail;