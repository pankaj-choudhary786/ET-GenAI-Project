import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import BehaviorEvent from '../models/BehaviorEvent.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export async function sendProspectEmail(prospect, emailData, sequenceIndex) {
  const emailId = uuidv4();
  const trackingPixel = `<img src="${process.env.BACKEND_URL}/track/open/${emailId}" width="1" height="1" />`;
  const bodyWithTracking = emailData.body + trackingPixel;
  
  await transporter.sendMail({
    from: `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
    to: prospect.contactEmail,
    subject: emailData.subject,
    html: `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">${bodyWithTracking}</div>`,
  });

  await BehaviorEvent.create({
    prospectId: prospect._id,
    userId: prospect.ownerId,
    eventType: 'email_sent',
    metadata: { emailId, sequenceIndex, subject: emailData.subject }
  });

  return emailId;
}
