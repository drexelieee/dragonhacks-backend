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
export const submitSponserForm = functions.https.onCall(async (request, context) => {
  // ignore non posts
  if (request.method !== "POST") {
    return false;
  }

  let text = `I am interested in the ${request.body.package} package.`;

  if (request.body.donation > 0) {
    text += `\nAdditionally, I would like to donate $${request.body.donation}.`;
  }

  text += `\n\n${request.body.message}

You can contact me at ${request.body.contactEmail}

From,
    ${request.body.contactName}`;

  const mailOptions: MailOptions = {
    from: "teamdragonhacks@gmail.com",
    to: "teamdragonhacks@gmail.com",
    subject: `New sponsorship request from ${request.body.organization}`,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (e) {
    return false;
  }
});