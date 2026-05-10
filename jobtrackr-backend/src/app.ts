import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.route.js"
import jobRoutes from "./modules/job/job.routes.js";
import { apiLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import 'dotenv/config';
import * as emailService from "./services/email.service.js";
import resumeRoutes from "./modules/resume/resume.routes.js"
import interviewRoutes from "./modules/interview/interview.routes.js"
import prisma from "./config/db.js";

const app = express();

// ✅ Middleware
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(apiLimiter);

// ✅ Routes (FIXED - Added /api prefix)
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/interviews", interviewRoutes);

// ✅ Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ✅ Health check
app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

import { authenticate } from "./middleware/auth.middleware.js";

// ✅ Test Email Endpoints - REQUIRE LOGIN
app.get("/test-email/follow-up", authenticate, async (req: any, res) => {
  console.log("🔵 Test follow-up email endpoint hit!");
  try {
    const userId = req.userId; // From auth middleware

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { jobs: true }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const job = user.jobs[0] || {
      company: "Test Company",
      role: "Software Engineer",
      appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };

    console.log(`📧 Sending follow-up email to: ${user.email}`);
    
    await emailService.sendFollowUpReminder(user.email, {
      company: job.company,
      role: job.role,
      appliedDate: job.appliedDate,
      daysAgo: 7,
    });
    
    console.log("✅ Follow-up email sent successfully!");
    res.json({ 
      success: true, 
      message: `Follow-up reminder sent to YOUR email: ${user.email}`,
      sentTo: user.email
    });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get("/test-email/interview", authenticate, async (req: any, res) => {
  console.log("🔵 Test interview email endpoint hit!");
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { jobs: true }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const interviewJob = user.jobs.find(j => j.status === 'INTERVIEW') || {
      company: "Test Company",
      role: "Software Engineer"
    };

    console.log(`📧 Sending interview reminder to: ${user.email}`);
    
    await emailService.sendInterviewReminder(user.email, {
      company: interviewJob.company,
      role: interviewJob.role,
      interviewDate: tomorrow,
    });
    
    console.log("✅ Interview email sent successfully!");
    res.json({ 
      success: true, 
      message: `Interview reminder sent to YOUR email: ${user.email}`,
      sentTo: user.email,
      interviewDate: tomorrow
    });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get("/test-email/weekly", authenticate, async (req: any, res) => {
  console.log("🔵 Test weekly summary endpoint hit!");
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { jobs: true }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    const stats = {
      totalApplied: user.jobs.filter(j => j.status === 'APPLIED').length,
      interviews: user.jobs.filter(j => j.status === 'INTERVIEW').length,
      offers: user.jobs.filter(j => j.status === 'OFFER').length,
      rejected: user.jobs.filter(j => j.status === 'REJECTED').length,
    };

    const recentJobs = user.jobs
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(job => ({
        company: job.company,
        role: job.role,
        status: job.status
      }));

    console.log(`📧 Sending weekly summary to: ${user.email}`);
    console.log(`📊 Stats:`, stats);
    
    await emailService.sendWeeklySummary(user.email, {
      name: user.name || "User",
      stats,
      recentJobs,
    });
    
    console.log("✅ Weekly summary sent successfully!");
    res.json({ 
      success: true, 
      message: `Weekly summary sent to YOUR email: ${user.email}`,
      sentTo: user.email,
      stats,
      jobsCount: recentJobs.length
    });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ success: false, error: String(error) });
  }
});

// ✅ Error handler (must be last)
app.use(errorHandler);

export default app;
