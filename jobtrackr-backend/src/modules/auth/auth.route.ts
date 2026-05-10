import express, { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service.js";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";

const router = express.Router();

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface OAuthLoginRequestBody {
  email: string;
  name: string;
  provider: string;
}

router.post("/register", async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Registration failed";
    res.status(400).json({ message: errorMessage });
  }
});

router.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    
    res.json({
      token: result.token,
      userId: result.userId
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    console.error("Login error:", error);
    res.status(401).json({ message: errorMessage });
  }
});

// OAuth login endpoint (for Google/GitHub)
router.post("/oauth-login", async (req: Request<{}, {}, OAuthLoginRequestBody>, res: Response) => {
  try {
    const { email, name, provider } = req.body;
    
    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      // Create new OAuth user (no password)
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: null, // OAuth users don't have passwords
        },
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    
    res.json({
      token,
      userId: user.id
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "OAuth login failed";
    console.error("OAuth login error:", error);
    res.status(500).json({ message: errorMessage });
  }
});

export default router;