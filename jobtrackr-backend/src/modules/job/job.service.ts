import prisma from "../../config/db.js";
import { JobStatus } from "@prisma/client";
import { redis } from "../../config/redis.js";
import * as aiService from "../../services/ai.service.js";

// Add type definition
type CreateJobData = {
  company: string;
  role: string;
  status: string; // Keep as string from frontend
  location?: string;
  jobDescription?: string;
  interviewDate?: string;
};

type UpdateJobData = Partial<CreateJobData>;

// Create a new job with AI skill extraction
export const createJob = async (userId: string, data: CreateJobData) => {
  console.log('📝 Creating job...');
  console.log('Data received:', {
    company: data.company,
    role: data.role,
    hasDescription: !!data.jobDescription,
    descriptionLength: data.jobDescription?.length || 0,
    description: data.jobDescription?.substring(0, 100) + '...'
  });

  const statusEnum = data.status.toUpperCase() as JobStatus;

  const job = await prisma.job.create({
    data: {
      company: data.company,
      role: data.role,
      status: statusEnum, // Use converted enum
      location: data.location,
      jobDescription: data.jobDescription,
      interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
      extractedSkills: [],
      userId,
    },
  });

  console.log('✅ Job created with ID:', job.id);

  // Extract skills using AI in background
  if (data.jobDescription && data.jobDescription.trim().length > 10) {
    console.log('🚀 Starting skill extraction for job:', job.id);
    
    try {
      const skills = await aiService.extractSkillsFromJobDescription(data.jobDescription);
      console.log('📊 Skills extracted:', skills);
      
      await prisma.job.update({
        where: { id: job.id },
        data: { extractedSkills: skills },
      });
      console.log('✅ Skills saved to database');

      console.log('🤖 Generating interview questions...');
      const questions = await aiService.generateInterviewQuestions(
        data.role,
        data.company,
        skills
      );
      console.log('📝 Questions generated:', questions.length);

      await prisma.interviewQuestion.createMany({
        data: questions.map(q => ({
          question: q.question,
          category: q.category,
          difficulty: q.difficulty,
          jobId: job.id,
        })),
      });
      console.log('✅ Questions saved to database');

      console.log(`🎉 Complete! ${skills.length} skills, ${questions.length} questions for ${data.company}`);
    } catch (error) {
      console.error('❌ AI extraction failed:', error);
    }
  } else {
    console.log('⚠️ No job description or too short, skipping extraction');
  }

  // Return the fully updated job with questions
  return prisma.job.findFirst({
    where: { id: job.id },
    include: { interviewQuestions: true },
  });
};

// Analyze existing job on demand
export const analyzeJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId },
  });

  if (!job) throw new Error("Job not found");

  const descriptionToUse = job.jobDescription || `${job.role} at ${job.company}`;

  const skills = await aiService.extractSkillsFromJobDescription(descriptionToUse);

  await prisma.job.update({
    where: { id: jobId },
    data: { extractedSkills: skills },
  });

  // Delete old questions and regenerate
  await prisma.interviewQuestion.deleteMany({ where: { jobId } });

  const questions = await aiService.generateInterviewQuestions(
    job.role,
    job.company,
    skills
  );

  await prisma.interviewQuestion.createMany({
    data: questions.map((q) => ({
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      jobId,
    })),
  });

  console.log(`✅ Re-analyzed ${job.company} — ${skills.length} skills, ${questions.length} questions`);

  return prisma.job.findFirst({
    where: { id: jobId },
    include: { interviewQuestions: true },
  });
};

// Get jobs with pagination and optional filters
export const getJobs = async (
  userId: string,
  options: {
    page: number;
    limit: number;
    status?: string;
    company?: string;
  }
) => {
  const skip = (options.page - 1) * options.limit;

  let statusFilter: JobStatus | undefined = undefined;
  if (options.status) {
    const upperStatus = options.status.toUpperCase();
    if (["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].includes(upperStatus)) {
      statusFilter = upperStatus as JobStatus;
    }
  }

  return prisma.job.findMany({
    where: {
      userId,
      ...(statusFilter && { status: statusFilter }),
      ...(options.company && {
        company: { contains: options.company, mode: "insensitive" },
      }),
    },
    include: { interviewQuestions: true },
    skip,
    take: options.limit,
    orderBy: { createdAt: "desc" },
  });
};

// Get single job with questions and responses
export const getJobById = async (userId: string, jobId: string) => {
  return prisma.job.findFirst({
    where: { id: jobId, userId },
    include: {
      interviewQuestions: {
        include: {
          responses: {
            where: { userId },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });
};

// Update a job
export const updateJob = async (userId: string, jobId: string, data: UpdateJobData) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.userId !== userId) {
    throw new Error("Unauthorized");
  }

  // Convert status string to enum if present
  const updateData: any = { ...data };
  if (data.status) {
    updateData.status = data.status.toUpperCase() as JobStatus;
  }
  if (data.interviewDate) {
    updateData.interviewDate = new Date(data.interviewDate);
  }

  return prisma.job.update({ where: { id: jobId }, data: updateData });
};

// Delete a job
export const deleteJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });

  if (!job || job.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return prisma.job.delete({ where: { id: jobId } });
};

// Get job statistics
export const getJobStats = async (userId: string) => {
  const cacheKey = `job-stats:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const jobs = await prisma.job.findMany({
    where: { userId },
    select: { status: true },
  });

  const stats = {
    total: jobs.length,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  jobs.forEach((job) => {
    stats[job.status.toLowerCase() as keyof typeof stats]++;
  });

  await redis.set(cacheKey, JSON.stringify(stats), "EX", 60);

  return stats;
};