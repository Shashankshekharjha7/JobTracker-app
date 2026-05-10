// import { Worker } from 'bullmq';
// import { redis } from '../config/redis.js';
// import prisma from '../config/db.js';
// import * as emailService from '../services/email.service.js';

// // ✅ Define job type
// type InterviewJob = {
//   sessionId: string;
// };

// // ─────────────────────────────────────────────
// // 📧 Interview Reminder Worker (FIXED)
// // ─────────────────────────────────────────────
// const interviewReminderWorker = new Worker<InterviewJob>(
//   'interviewReminders',
//   async (job) => {
//     try {
//       const { sessionId } = job.data;

//       const session = await prisma.interviewSession.findUnique({
//         where: { id: sessionId },
//         include: { user: true, admin: true },
//       });

//       if (!session || session.status !== 'SCHEDULED') return;

//       // ✅ Ensure emails exist
//       if (!session.user.email || !session.admin.email) {
//         console.warn('⚠️ Missing email for session:', sessionId);
//         return;
//       }

//       // ✅ FIX: use NEW function
//       await Promise.all([
//         emailService.sendInterviewSessionReminder(session.user.email, {
//           title: session.title,
//           startsIn: '30 minutes',
//           joinUrl: `${process.env.FRONTEND_URL}/interview/${session.id}`,
//         }),
//         emailService.sendInterviewSessionReminder(session.admin.email, {
//           title: session.title,
//           startsIn: '30 minutes',
//           joinUrl: `${process.env.FRONTEND_URL}/interview/${session.id}/admin`,
//         }),
//       ]);

//       console.log(`✅ Sent reminder for interview ${sessionId}`);
//     } catch (error) {
//       console.error('❌ Reminder worker error:', error);
//     }
//   },
//   { connection: redis }
// );


// // ─────────────────────────────────────────────
// // ⏱ Auto-start Interview Worker (UNCHANGED)
// // ─────────────────────────────────────────────
// const interviewAutoStartWorker = new Worker<InterviewJob>(
//   'interviewAutoStart',
//   async (job) => {
//     try {
//       const { sessionId } = job.data;

//       await prisma.interviewSession.update({
//         where: { id: sessionId },
//         data: { status: 'IN_PROGRESS' },
//       });

//       console.log(`✅ Interview ${sessionId} started automatically`);
//     } catch (error) {
//       console.error('❌ Auto-start worker error:', error);
//     }
//   },
//   { connection: redis }
// );