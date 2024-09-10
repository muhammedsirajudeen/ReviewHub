import nodemailer from "nodemailer"
import * as dotenv from "dotenv";
dotenv.config();
let transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail', 'outlook', or custom SMTP settings
    auth: {
      user: 'muhammedsirajudeen29@gmail.com', // Your email address
      pass: process.env.GMAIL_APP_PASSWORD   // Your email password or app-specific password
    }
});

export default transporter