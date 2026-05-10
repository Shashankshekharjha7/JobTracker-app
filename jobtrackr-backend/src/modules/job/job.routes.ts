import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import * as jobController from "./job.controller.js";

const router = Router();

// All job routes require authentication
router.use(authenticate);

router.post("/", jobController.createJob);
router.get("/", jobController.getJobs);
router.get("/stats", jobController.getJobStats);
router.get("/:id", jobController.getJobById);
router.put("/:id", jobController.updateJob);
router.delete("/:id", jobController.deleteJob);
router.post("/:id/analyze", jobController.analyzeJob);  // ← uses jobController.*

export default router;