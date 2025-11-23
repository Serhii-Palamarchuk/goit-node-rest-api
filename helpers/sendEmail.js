import nodemailer from "nodemailer";
import "dotenv/config";

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

const config = {
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: true, // true для 465, false для інших портів
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(config);

const sendEmail = async (data) => {
  const email = { ...data, from: SMTP_USER };
  await transporter.sendMail(email);
  return true;
};

export default sendEmail;
