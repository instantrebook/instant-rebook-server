export type SendEmailType = {
    emailTo: string;
    subject: string;
    otp: string;
    firstName?: string;
};

export type SendUserEmailType = {
    emailTo: string;
    subject: string;
    message: string;
    firstName?: string;
};

export type SendUserBookingEmailType = {
    emailTo: string;
    subject: string;
    message: string;
};