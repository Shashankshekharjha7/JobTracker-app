import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware.js';
import { upload } from '../../config/upload.js';
import * as resumeController from './resume.controller.js';

const router = Router();

// All resume routes require authentication
router.use(authenticate);

// Upload resume
router.post('/', upload.single('resume'), resumeController.uploadResume);

// Get all user's resumes
router.get('/', resumeController.getResumes);

// Download resume
router.get('/:id/download', resumeController.downloadResume);

// Delete resume
router.delete('/:id', resumeController.deleteResume);

// Set default resume
router.patch('/:id/default', resumeController.setDefaultResume);

// Update resume tags
router.patch('/:id/tags', resumeController.updateResumeTags);

export default router;