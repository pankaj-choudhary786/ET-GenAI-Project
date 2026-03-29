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

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('NexusAI SMTP Relay: Connected and Ready for Outbound Emails');
  }
});

export async function sendProspectEmail(prospect, emailData, sequenceIndex) {
  const emailId = uuidv4();
  const trackingPixel = `<img src="${process.env.BACKEND_URL}/track/open/${emailId}" width="1" height="1" />`;
  const bodyWithTracking = emailData.body + trackingPixel;
  
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER, // The most compatible 'from' for Gmail auto-archive
    to: prospect.contactEmail,
    bcc: process.env.GMAIL_USER,
    subject: emailData.subject,
    html: `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">${bodyWithTracking}</div>`
  });

  console.log(`[SMTP] Email successfully relayed for ${prospect.contactEmail}. Response: ${info.response}`);
  console.log(`[SMTP] Google Message-ID: ${info.messageId}`);

  await BehaviorEvent.create({
    userId: prospect.userId,
    entityType: 'prospect',
    entityId: prospect._id,
    emailId,
    eventType: 'email_sent',
    metadata: { subject: emailData.subject }
  });

  return emailId;
}
