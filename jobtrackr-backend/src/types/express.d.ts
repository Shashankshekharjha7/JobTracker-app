// src/types/express.d.ts
import { Request } from "express";

export {}; // ensures this file is treated as a module

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email?: string;
      };
    }
  }
}
