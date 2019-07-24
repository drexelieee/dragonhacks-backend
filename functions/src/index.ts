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
export const submitSponsorForm = functions.https.onCall(async (data: ISponsorForm, context) => {
  let text = `Package: ${data.package}.`;

  if (data.donation > 0) {
    text += `\nAdditional Donation: $${data.donation}.`;
  }

  text += `\nContact Name: ${data.contactName}`;
  text += `\nContact Email: ${data.contactEmail}`;

  if (data.message !== "") {
    text += `\nMessage:\n${data.message}`
  }

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

interface ISponsorForm {
  contactName: string,
  contactEmail: string,
  organization: string,
  message: string,
  donation: number,
  package: string
}
