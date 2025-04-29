import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

async function sendTutorVerificationEmail(to, password) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const __dirname = path.resolve(path.dirname(''));
    const templatePath = path.join(__dirname, 'src', 'utils', 'emails', 'template', 'tutor.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    const personalizedHtml = htmlTemplate
        .replace('{{email}}', to)
        .replace('{{password}}', password);

    let mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: 'Selamat Datang di Bimbingan Belajar Mandala!',
        html: personalizedHtml
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email: ' + error);
    }
}

export { sendTutorVerificationEmail };