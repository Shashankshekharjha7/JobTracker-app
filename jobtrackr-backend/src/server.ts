import 'dotenv/config';
import app from "./app.js";
import * as emailScheduler from './schedulers/email.scheduler.js';
import './workers/job.worker.js'; // Start workers

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    app.listen(PORT, async () => {
      console.log(`🚀 Server running on port ${PORT}`);

      // Start email schedulers
      await emailScheduler.scheduleFollowUpReminders();
      await emailScheduler.scheduleInterviewReminders();
      await emailScheduler.scheduleWeeklySummary();
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
