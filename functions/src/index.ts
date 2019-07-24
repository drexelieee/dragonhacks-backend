import * as functions from 'firebase-functions';
import * as nodemailer from "nodemailer";
import * as admin from "firebase-admin";
import { MailOptions } from 'nodemailer/lib/json-transport';
import { emailAuth } from './.secret/emailAuth';

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: emailAuth
});

/**
 * Generates an email for a sponsorship request.
 * @returns {boolean} indicates success
 */
export const submitSponserForm = functions.https.onCall(async (data: ISponserForm, context) => {
  let text = `Package: ${data.package}.`;

  if (data.donation > 0) {
    text += `\nAdditional Donation: $${data.donation}.`;
  }

  if (data.message !== "") {
    text += `\nMessage: ${data.message}`
  }

  text += `\nContact Name: ${data.contactName}
Contact Email: ${data.contactEmail}`;

  const mailOptions: MailOptions = {
    from: "teamdragonhacks@gmail.com",
    to: "teamdragonhacks@gmail.com",
    subject: `New sponsorship request from ${data.organization}`,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (e) {
    return false;
  }
});

interface ISponserForm {
  contactName: string,
  contactEmail: string,
  organization: string,
  message: string,
  donation: number,
  package: string
}