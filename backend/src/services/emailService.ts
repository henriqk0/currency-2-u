import nodemailer from 'nodemailer';
import { NumberTuple } from '../types/acronymWithValueTuple';

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function sendEmail(to: string, data: NumberTuple) {
  console.log({
    EMAIL_USER: process.env.EMAIL_USER,
    GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD ? 'OK' : 'MISSING',
  });

  try {
    const info = await transporter.sendMail({
      from: '"Curreny price alert" <seu-email@verificado.com>', 
      to: to,
      subject: "Time to Movement! Check the new value for your desired currency.",
      html: `
        <h1>New checked values:</h1>
        <p><b>Your disired currency was custing, in its monetary base, </b> ${JSON.stringify(data[1])}</p>
      `,
    });

    console.log("E-mail sent: %s", info.messageId);
  } catch (error) {
    console.error("Error:", error);
    throw error; 
  }
}