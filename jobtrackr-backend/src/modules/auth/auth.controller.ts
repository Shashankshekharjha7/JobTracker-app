import { Request, Response } from "express";
import * as authService from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = await authService.loginUser(req.body);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
