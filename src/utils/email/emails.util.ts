import { hotelBookingLinkTemplate } from "../../templates/emailVerification.template";
import { SendUserBookingEmailType } from "../../types/email.type";
import { sendEmail } from "./bravoEmail.utl";
import { recieptEmailTemplate } from "./customer.recieptEmail.util";

function createEmailTemplate(subject: string, body: string): string {
  const logoUrl =
    'https://yawa-app.s3.eu-central-1.amazonaws.com/bf763e08-96fb-41cf-8133-897577a41e09.jpeg'; // Replace with your actual logo URL
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        animation: fadeIn 2s ease-in;
      }
      .email-container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #fff;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .header img {
        width: 100%;
        border-radius: 8px 8px 0 0;
        height: 200px;
        object-fit: contain;
      }
      .content {
        padding: 20px;
        color: #333333;
        line-height: 1.6;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 0.9em;
        color: #888888;
      }
      .highlight {
        color: #03BDE9;
      }
      .button {
        display: inline-block;
        padding: 10px 20px;
        margin: 20px 0;
        background-color: #03BDE9;
        color: #fff;
        text-decoration: none;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img src="${logoUrl}" alt="Rebook Logo">
      </div>
      <div class="content">
        ${body}
      </div>
      <div class="footer">
        Best regards,<br>
        <span class="highlight">Rebook Team</span>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Email content templates
const emailTemplates = {
  emailVerification: (code: number, name: string) =>
    createEmailTemplate(
      'Your OTP Code for Rebook Registration',
      `<p>Hello ${name},</p>
    <p>To complete your registration on the Rebook App, please use the One-Time Password (OTP) below:</p>
    <h2 class="highlight">${code}</h2>
    <p>This code is valid for the next 15 minutes. Please do not share it with anyone for your security.</p>
    <p>If you didn’t request this code, please ignore this email or contact our support team immediately at support@rebook.com.ng or 07013580030.</p>
    <p>Thank you for choosing Rebook to stay safe!</p>
    `,
    ),
  forgotPassword: (otp: number) =>
    createEmailTemplate(
      'ForgotPassword Code for Rebook',
      `<p>Hello there,</p>
    <p>We've sent you a forgotPassword code to complete your reset your password. Please enter the code below to proceed:</p>
    <h2 class="highlight">OTP: ${otp}</h2>
    <p>This code is valid for 15 minutes. If you didn't request this code, please ignore this email.</p>`,
    ),
  welcome: (name: string) =>
    createEmailTemplate(
      'Welcome to YAWA: Your Safety, Our Priority!',
      `<p>Hello ${name}</p>
      <p>Welcome to Rebook, your trusted partner for early warning, situational awareness, and emergency reporting. We’re thrilled to have you join our growing community dedicated to making Nigeria safer for everyone</p>
      <p>With Rebook, you can:</p>
      <ul>
      <li>Report emergencies and get real-time assistance.</li>
      <li>Stay updated on critical safety alerts in your area.</li>
      <li>Connect with your safety circle for instant support.</li>
      </ul>
      <b>Get started now by exploring the app and setting up your safety circle.</b>
      <p>Together, we can create safer communities! If you have any questions or need assistance, feel free to contact us at <a href="mailto:upport@yawaapp.com.ng">support@yawaapp.com.ng</a> or 07013580030.</p>
      <p>
      Staysafe,<br>
      The YAWA Team
      </p>
      `,
    ),

};


// Functions to verify email
async function sendVerificationEmail(
  email: string,
  emailVerificationCode: number,
  name: string
): Promise<void> {
  try {
    const html = emailTemplates.emailVerification(emailVerificationCode, name);
    sendEmail(email, 'Your OTP Code for YAWA Registration', html)
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

async function sendForgotPasswordEmail(
  email: string,
  emailVerificationCode: number,
): Promise<void> {
  try {
    const html = emailTemplates.forgotPassword(emailVerificationCode);
    sendEmail(email, 'Your OTP Code for Rebook Reset password', html)
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  try {
    const html = emailTemplates.welcome(name);
    sendEmail(email, 'Welcome to YAWA: Your Safety, Our Priority!', html)
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

async function sendRecieptEmail(
  email: string,
  {id, guest, name, checkIn, checkOut, hotelName, hotelPhone, clientPhone, totalPrice}:
  {id: string, guest: string, name: string, checkIn: string, checkOut: string, hotelName: string, hotelPhone: string, clientPhone: string, totalPrice: number}
): Promise<void> {
  try {
    const html = recieptEmailTemplate(id, guest, name, checkIn, checkOut, hotelName, hotelPhone, clientPhone, totalPrice);
    sendEmail(email, 'Receipt for Rebook Booking', html)
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export const sendUserBookingEmail = async ({
    emailTo,
    subject,
    message,
  }: SendUserBookingEmailType) => {

    try {
      const html = hotelBookingLinkTemplate(message,)

      sendEmail(emailTo, subject, html)
    } catch (error) {
      throw error;
    }
};



export {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgotPasswordEmail,
    sendRecieptEmail
};