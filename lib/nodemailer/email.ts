import nodemailer from 'nodemailer';

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 465, // Utilisez 465 pour SSL ou 587 pour TLS/STARTTLS
    tls: {
      rejectUnauthorized: false // Utile si vous rencontrez des problèmes de certificat
    },
    secure: true,
    auth: {
      user: process.env.GMAIL_USER, // ton email Gmail
      pass: process.env.GMAIL_APP_PASSWORD, // mot de passe d'application
    },
  });
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
