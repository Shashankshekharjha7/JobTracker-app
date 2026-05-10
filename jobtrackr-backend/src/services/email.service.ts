import nodemailer from 'nodemailer';
import * as emailTemplates from '../utils/emailTemplates.js';

console.log('Email config:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? '***SET***' : 'NOT SET',
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export const sendFollowUpReminder = async (
  userEmail: string,
  jobData: {
    company: string;
    role: string;
    appliedDate: Date;
    daysAgo: number;
  }
) => {
  console.log(`Sending follow-up reminder to ${userEmail}...`);
  const { subject, html } = emailTemplates.followUpReminderEmail(jobData);

  const result = await transporter.sendMail({
    from: `"JobTrackr" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject,
    html,
  });
  
  console.log('✅ Email sent successfully:', result.messageId);
  return result;
};

export const sendInterviewReminder = async (
  userEmail: string,
  jobData: {
    company: string;
    role: string;
    interviewDate: Date;
  }
) => {
  console.log(`Sending interview reminder to ${userEmail}...`);
  const { subject, html } = emailTemplates.interviewReminderEmail(jobData);

  const result = await transporter.sendMail({
    from: `"JobTrackr" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject,
    html,
  });
  
  console.log('✅ Interview reminder sent:', result.messageId);
  return result;
};

export const sendWeeklySummary = async (
  userEmail: string,
  userData: {
    name: string;
    stats: {
      totalApplied: number;
      interviews: number;
      offers: number;
      rejected: number;
    };
    recentJobs: Array<{
      company: string;
      role: string;
      status: string;
    }>;
  }
) => {
  console.log(`Sending weekly summary to ${userEmail}...`);
  const { subject, html } = emailTemplates.weeklySummaryEmail(userData);

  const result = await transporter.sendMail({
    from: `"JobTrackr" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject,
    html,
  });
  
  console.log('✅ Weekly summary sent:', result.messageId);
  return result;
};