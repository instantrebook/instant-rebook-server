import SMTPTransport from "nodemailer/lib/smtp-transport";
import nodemailer from "nodemailer";
import { accountVerifyTemplate, hotelBookingLinkTemplate, messageTemplate } from "../templates/emailVerification.template";
import { SendEmailType, SendUserBookingEmailType, SendUserEmailType } from "../types/email.type";


let transporter: any;

const transporterInit = () => {
    // Define the nodemailer transporter
    transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        secureConnection: false,
        port: 465,
        auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD,
        },
        tls: {
        rejectUnauthorized: true,
        },
    } as SMTPTransport.Options);
};


export const sendUserAccountVerificationEmail = async ({
    emailTo,
    subject,
    otp,
    firstName,
  }: SendEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: "Knowledge Chain",
        to: emailTo,
        subject: subject,
        html: accountVerifyTemplate(otp, firstName!),
      });
      return response;
    } catch (error) {
      throw error;
    }
};


export const sendUserMessageEmail = async ({
    emailTo,
    subject,
    message,
    firstName,
  }: SendUserEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: "Knowledge Chain",
        to: emailTo,
        subject: subject,
        html: messageTemplate(message, firstName!),
      });
      return response;
    } catch (error) {
      throw error;
    }
};


export const sendUserBookingEmail776 = async ({
    emailTo,
    subject,
    message,
  }: SendUserBookingEmailType) => {
    // Init the nodemailer transporter
    transporterInit();
  
    try {
      let response = await transporter.sendMail({
        from: "Knowledge Chain",
        to: emailTo,
        subject: subject,
        html: hotelBookingLinkTemplate(message,),
      });
      return response;
    } catch (error) {
      throw error;
    }
};


