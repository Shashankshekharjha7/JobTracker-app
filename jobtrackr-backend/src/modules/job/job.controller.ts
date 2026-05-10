import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware.js";
import * as JobService from "./job.service.js";

/* =========================
   Types
========================= */

interface JobParams {
  id: string;
}

interface GetJobsQuery {
  page?: string;
  limit?: string;
  status?: string;
  company?: string;
}

/* =========================
   Create a new job
========================= */
export const createJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // ✅ Fixed - include all fields
const { company, role, status, location, jobDescription, interviewDate } = req.body;

const job = await JobService.createJob(req.userId!, {
  company,
  role,
  status: status || "APPLIED",
  location: location || "",
  jobDescription: jobDescription || undefined,
  interviewDate: interviewDate || undefined,
});

    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

/* =========================
   Get jobs (pagination + filter)
========================= */
export const getJobs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = "1", limit = "10", status, company } = req.query;

    const jobs = await JobService.getJobs(req.userId!, {
      page: Number(page),
      limit: Number(limit),
      status: status as string | undefined,
      company: company as string | undefined,
    });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

/* =========================
   Get job stats
========================= */
export const getJobStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await JobService.getJobStats(req.userId!);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};



/* =========================
   Update a job
========================= */
export const updateJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    // ✅ Fixed updateJob
const { company, role, status, location, jobDescription, interviewDate } = req.body;

const updatedJob = await JobService.updateJob(req.userId!, id, {
  company,
  role,
  status,
  location,
  jobDescription,
  interviewDate,
});

    res.json(updatedJob);
  } catch (err) {
    next(err);
  }
};

/* =========================
   Delete a job
========================= */
export const deleteJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const deletedJob = await JobService.deleteJob(req.userId!, id);
    res.json(deletedJob);
  } catch (err) {
    next(err);
  }
};

// Add this to your controller
export const getJobById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    
    const job = await JobService.getJobById(req.userId!, id); // Uses the service function

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

export const analyzeJob = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const job = await JobService.analyzeJob(req.userId!, id);
    res.json(job);
  } catch (err) {
    next(err);
  }
};