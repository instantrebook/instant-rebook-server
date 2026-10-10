// import * as nodemailer from "nodemailer";

// export const sendEmail = async (to: string, subject: string, html: string) => {
//     try {

//         const transporter = nodemailer.createTransport({
//             host: "smtp-relay.brevo.com",
//             port: 587,
//             secure: false,
//             auth: {
//             user: process.env.BREVO_LOGIN, 
//             pass: process.env.BREVO_SMTP_KEY,
//             },
//         });

//         await transporter.sendMail({
//             from: `"Yawa App Technologies Ltd" <communicationsyawa@gmail.com>`,
//             to,
//             subject,
//             html,
//         });
        
//     } catch (error) {
//         console.error("Bravo Email Error:", error);
//         throw new Error("Failed to send email");
//     }
  
// };





import axios from "axios";

export const sendEmail = async (
    to: string,
    subject: string,
    html: string,
) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "Instant Rebook",
                    email: "greatnexdevteam@gmail.com",
                },
                to: [
                    {
                        email: to,
                    },
                ],
                subject,
                htmlContent: html,
            },
            {
                headers: {
                    "api-key": process.env.BRAVO_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                timeout: 15000,
            },
        );

        console.log(
            "Email sent successfully:",
            response.data,
        );

        return response.data;
    } catch (error: any) {
        console.error(
            "Brevo Email Error:",
            error?.response?.data || error,
        );

        throw new Error("Failed to send email");
    }
};