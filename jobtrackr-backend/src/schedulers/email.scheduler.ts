import { Queue } from 'bullmq';
import { redis } from '../config/redis.js';

const followUpQueue = new Queue('follow-up-reminders', { connection: redis });
const interviewQueue = new Queue('interview-reminders', { connection: redis });
const weeklySummaryQueue = new Queue('weekly-summary', { connection: redis });

// Schedule follow-up reminders - runs daily at 9 AM
export const scheduleFollowUpReminders = async () => {
  await followUpQueue.add(
    'check-follow-ups',
    {},
    {
      repeat: {
        pattern: '0 9 * * *', // Every day at 9 AM
      },
    }
  );
  console.log('✅ Follow-up reminders scheduled (daily at 9 AM)');
};

// Schedule interview reminders - runs daily at 6 PM
export const scheduleInterviewReminders = async () => {
  await interviewQueue.add(
    'check-interviews',
    {},
    {
      repeat: {
        pattern: '0 18 * * *', // Every day at 6 PM
      },
    }
  );
  console.log('✅ Interview reminders scheduled (daily at 6 PM)');
};

// Schedule weekly summary - runs every Monday at 9 AM
export const scheduleWeeklySummary = async () => {
  await weeklySummaryQueue.add(
    'send-summary',
    {},
    {
      repeat: {
        pattern: '0 9 * * 1', // Every Monday at 9 AM
      },
    }
  );
  console.log('✅ Weekly summary scheduled (Mondays at 9 AM)');
};