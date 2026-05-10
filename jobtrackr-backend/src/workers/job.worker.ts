import { Worker } from 'bullmq';
import { redis } from '../config/redis.js';
import prisma from '../config/db.js';
import * as emailService from '../services/email.service.js';

// Follow-up reminder worker (runs daily)
export const followUpWorker = new Worker(
  'follow-up-reminders',
  async (job) => {
    console.log('Processing follow-up reminders...');

    // Find jobs that are "APPLIED" for 7+ days with no reminder sent
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const jobsNeedingReminder = await prisma.job.findMany({
      where: {
        status: 'APPLIED',
        appliedDate: {
          lte: sevenDaysAgo,
        },
        OR: [
          { lastReminderSent: null },
          {
            lastReminderSent: {
              lte: sevenDaysAgo, // Don't spam - only remind once per week
            },
          },
        ],
      },
      include: {
        user: true,
      },
    });

    console.log(`Found ${jobsNeedingReminder.length} jobs needing reminders`);

    for (const jobRecord of jobsNeedingReminder) {
      try {
        const daysAgo = Math.floor(
          (Date.now() - jobRecord.appliedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        await emailService.sendFollowUpReminder(jobRecord.user.email, {
          company: jobRecord.company,
          role: jobRecord.role,
          appliedDate: jobRecord.appliedDate,
          daysAgo,
        });

        // Update last reminder sent
        await prisma.job.update({
          where: { id: jobRecord.id },
          data: { lastReminderSent: new Date() },
        });

        console.log(`Sent reminder for ${jobRecord.company} - ${jobRecord.role}`);
      } catch (error) {
        console.error(`Failed to send reminder for job ${jobRecord.id}:`, error);
      }
    }
  },
  { connection: redis }
);

// Interview reminder worker (runs daily)
export const interviewWorker = new Worker(
  'interview-reminders',
  async (job) => {
    console.log('Processing interview reminders...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const endOfTomorrow = new Date(tomorrow);
    endOfTomorrow.setHours(23, 59, 59, 999);

    const upcomingInterviews = await prisma.job.findMany({
      where: {
        status: 'INTERVIEW',
        interviewDate: {
          gte: tomorrow,
          lte: endOfTomorrow,
        },
      },
      include: {
        user: true,
      },
    });

    console.log(`Found ${upcomingInterviews.length} interviews tomorrow`);

    for (const jobRecord of upcomingInterviews) {
      try {
        await emailService.sendInterviewReminder(jobRecord.user.email, {
          company: jobRecord.company,
          role: jobRecord.role,
          interviewDate: jobRecord.interviewDate!,
        });

        console.log(`Sent interview reminder for ${jobRecord.company}`);
      } catch (error) {
        console.error(`Failed to send interview reminder for job ${jobRecord.id}:`, error);
      }
    }
  },
  { connection: redis }
);

// Weekly summary worker
export const weeklySummaryWorker = new Worker(
  'weekly-summary',
  async (job) => {
    console.log('Processing weekly summaries...');

    const users = await prisma.user.findMany();

    for (const user of users) {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const weeklyJobs = await prisma.job.findMany({
          where: {
            userId: user.id,
            createdAt: {
              gte: oneWeekAgo,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        });

        const stats = {
          totalApplied: weeklyJobs.filter((j) => j.status === 'APPLIED').length,
          interviews: weeklyJobs.filter((j) => j.status === 'INTERVIEW').length,
          offers: weeklyJobs.filter((j) => j.status === 'OFFER').length,
          rejected: weeklyJobs.filter((j) => j.status === 'REJECTED').length,
        };

          await emailService.sendWeeklySummary(user.email, {
          name: user.name || 'User', // Provide fallback for null
              stats,
              recentJobs: weeklyJobs.map((j) => ({
              company: j.company,
              role: j.role,
              status: j.status,
    })),
  });

        console.log(`Sent weekly summary to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send weekly summary to ${user.email}:`, error);
      }
    }
  },
  { connection: redis }
);

console.log('✅ Email workers started');