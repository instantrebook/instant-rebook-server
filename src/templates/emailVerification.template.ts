
export const accountVerifyTemplate = (otp: string, firstName: string) => `
  <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400&family=Nunito:wght@200;300;400;500;600&display=swap');
        body {
          font-family: sans-serif;
          font-size: 13px;
          background-color: #f4f4f4;
        }
        .container {
          margin: 20px auto;
          max-width: 600px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
        }
        .otp {
          display: inline-block;
          padding: 10px;
          border-radius: 5px;
          background-color: #ddd;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          font-family: 'Inconsolata', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          cursor: pointer;
        }
        p{
            color: #333333;
            font-size: 13px;
            display: block
        }
      </style>
    </head>
    <body>
      <div class="container" style="background-color: #f2f2f2; padding: 20px;display:block">
      <h2 style="color: #333333;text-transform:capitalize">Dear ${firstName},</h2>
      <p style="color: #333333;">We have received a request to verify your account.</p>
      <p style="color: #333333;">Please use the following OTP to verify your account:</p>
        <div class="otp">${otp}</div>
        <p>If you did not request this code, please ignore this email.</p>
        <p style="color: #333333;">Best regards,</p>
        <p style="color: #333333;">Knowledge Chain Team</p>
      </div>
    </body>
  </html>
`;


export const messageTemplate = (message: string, firstName: string) => `
  <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400&family=Nunito:wght@200;300;400;500;600&display=swap');
        body {
          font-family: sans-serif;
          font-size: 13px;
          background-color: #f4f4f4;
        }
        .container {
          margin: 20px auto;
          max-width: 600px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
        }
        .otp {
          display: inline-block;
          padding: 10px;
          border-radius: 5px;
          background-color: #ddd;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5px);
          font-family: 'Inconsolata', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #333333;
          cursor: pointer;
        }
        p{
            color: #333333;
            font-size: 13px;
            display: block
        }
      </style>
    </head>
    <body>
      <div class="container" style="background-color: #f2f2f2; padding: 20px;display:block">
      <h2 style="color: #333333;text-transform:capitalize">Dear ${firstName},</h2>
      <p style="color: #333333;">${message}</p>
       
      <p style="color: #333333;">Best regards,</p>
      <p style="color: #333333;">Knowledge Chain Team</p>
      </div>
    </body>
  </html>
`;


export const hotelBookingLinkTemplate = (bookingLink: string) => `
  <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400&family=Nunito:wght@200;300;400;500;600&display=swap');

        body {
          font-family: sans-serif;
          font-size: 13px;
          background-color: #f4f4f4;
        }

        .container {
          margin: 20px auto;
          max-width: 600px;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }

        .button {
          display: inline-block;
          padding: 12px 20px;
          margin: 10px 0;
          border-radius: 5px;
          background-color: #333333;
          color: #ffffff !important;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .link {
          padding: 10px;
          border-radius: 5px;
          background-color: #eeeeee;
          font-family: 'Inconsolata', monospace;
          font-size: 12px;
          color: #333333;
          word-break: break-all;
        }

        p {
          color: #333333;
          font-size: 13px;
          line-height: 1.6;
        }
      </style>
    </head>

    <body>
      <div class="container">

        <h2 style="color: #333333;">
          Continue Your Hotel Booking
        </h2>

        <p style="color: #333333;">
          You recently started a hotel booking with us.
        </p>

        <p style="color: #333333;">
          Please use the link below to continue your booking and complete your reservation.
        </p>

        <a
          href="${bookingLink}"
          class="button"
          target="_blank"
        >
          Continue Your Booking
        </a>

        <p style="color: #333333;">
          Or copy the link below into your browser:
        </p>

        <div class="link">
          ${bookingLink}
        </div>

        <p style="color: #333333;">
          If you did not start this booking, you can safely ignore this email.
        </p>

        <p style="color: #333333;">
          Best regards,
        </p>

        <p style="color: #333333;">
          Knowledge Chain Team
        </p>

      </div>
    </body>
  </html>
`;