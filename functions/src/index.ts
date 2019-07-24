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
  let text = `I am interested in the ${data.package} package.`;

  if (data.donation > 0) {
    text += `\nAdditionally, I would like to donate $${data.donation}.`;
  }

  text += `\n\n${data.message}

You can contact me at ${data.contactEmail}

From,
    ${data.contactName}`;

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