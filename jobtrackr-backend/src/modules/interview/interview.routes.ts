import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import * as interviewController from './interview.controller.js';

const router = Router();

router.use(authenticate);

// Get interview questions for a job
router.get('/jobs/:jobId/questions', interviewController.getInterviewQuestions);



// Submit answer and get AI feedback
router.post('/questions/:questionId/answer', interviewController.submitAnswer);

// Get readiness score for a job
router.get('/jobs/:jobId/readiness', interviewController.getReadinessScore);

// Get practice history
router.get('/practice-history', interviewController.getPracticeHistory);

export default router;