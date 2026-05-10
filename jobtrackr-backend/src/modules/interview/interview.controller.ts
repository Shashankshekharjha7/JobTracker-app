import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import prisma from '../../config/db.js';
import * as aiService from '../../services/ai.service.js';

// Get interview questions for a job
export const getInterviewQuestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, userId: req.userId! },
      include: { interviewQuestions: true },
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json(job.interviewQuestions);
  } catch (error) {
    next(error);
  }
};

// Generate interview questions
export const generateInterviewQuestions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, userId: req.userId! },
      include: { interviewQuestions: true },
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    let skills: string[] = job.extractedSkills;
    if (!skills || skills.length === 0) {
      skills = await aiService.extractSkillsFromJobDescription(
        job.jobDescription || ''
      );
      await prisma.job.update({
        where: { id: jobId },
        data: { extractedSkills: skills },
      });
    }

    const questions = await aiService.generateInterviewQuestions(
      job.role,
      job.company,
      skills
    );

    await prisma.interviewQuestion.createMany({
      data: questions.map((q) => ({
        jobId,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
      })),
    });

    res.json({ generated: questions.length, skills });
  } catch (error) {
    next(error);
  }
};

// Submit interview answer
export const submitAnswer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionId = Array.isArray(req.params.questionId) ? req.params.questionId[0] : req.params.questionId;
    const { answer } = req.body;

    if (!answer) return res.status(400).json({ error: 'Answer is required' });

    const question = await prisma.interviewQuestion.findUnique({
      where: { id: questionId },
      include: {
        job: true,
      },
    });

    if (!question) return res.status(404).json({ error: 'Question not found' });

    const analysis = await aiService.analyzeInterviewAnswer(
      question.question,
      answer,
      question.job.extractedSkills
    );

    const response = await prisma.interviewResponse.create({
      data: {
        questionId,
        userId: req.userId!,
        answer,
        contentScore: analysis.contentScore,
        feedback: `${analysis.feedback}\n\nStrengths: ${analysis.strengths.join(', ')}\n\nImprove: ${analysis.improvements.join(', ')}`,
      },
    });

    res.json({ ...response, analysis });
  } catch (error) {
    next(error);
  }
};

// Get readiness score
export const getReadinessScore = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobId = Array.isArray(req.params.jobId) ? req.params.jobId[0] : req.params.jobId;

    const job = await prisma.job.findFirst({
      where: { id: jobId, userId: req.userId! },
      include: {
        interviewQuestions: {
          include: {
            responses: {
              where: { userId: req.userId! },
            },
          },
        },
      },
    });

    if (!job) return res.status(404).json({ error: 'Job not found' });

    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: { skills: true },
    });

    const allResponses = job.interviewQuestions.flatMap((q) => q.responses);

    const readiness = await aiService.calculateReadinessScore(
      user?.skills || [],
      job.extractedSkills,
      allResponses.map((r) => ({ contentScore: r.contentScore || 0 }))
    );

    res.json(readiness);
  } catch (error) {
    next(error);
  }
};

// Get practice history
export const getPracticeHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const responses = await prisma.interviewResponse.findMany({
      where: { userId: req.userId! },
      include: {
        question: {
          include: { job: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json(responses);
  } catch (error) {
    next(error);
  }
};