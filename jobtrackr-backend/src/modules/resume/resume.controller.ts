import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import * as resumeService from './resume.service.js';
import path from 'path';

export const uploadResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const isDefault = req.body.isDefault === 'true';

    const resume = await resumeService.uploadResume(
      req.userId!,
      {
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        filePath: req.file.path,
      },
      tags,
      isDefault
    );

    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resumes = await resumeService.getResumes(req.userId!);
    res.json(resumes);
  } catch (error) {
    next(error);
  }
};

export const downloadResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id; // Fix here
    const resume = await resumeService.getResumeById(req.userId!, id);

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.download(resume.filePath, resume.originalName);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id; // Fix here
    await resumeService.deleteResume(req.userId!, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const setDefaultResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id; // Fix here
    const resume = await resumeService.setDefaultResume(req.userId!, id);
    res.json(resume);
  } catch (error) {
    next(error);
  }
};

export const updateResumeTags = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id; // Fix here
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ error: 'Tags must be an array' });
    }

    const resume = await resumeService.updateResumeTags(req.userId!, id, tags);
    res.json(resume);
  } catch (error) {
    next(error);
  }
};