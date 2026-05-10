import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET!;

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async ({ name, email, password }: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { name, email, password: hashed }
  });
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  console.log("User found:", user ? "Yes" : "No");
  console.log("Email searching for:", email);
  
  if (!user) throw new Error("Invalid credentials");

  if (!user.password) {
    throw new Error("This account uses OAuth login. Please sign in with Google.");
  }

  const match = await bcrypt.compare(password, user.password);
  
  console.log("Password match:", match);
  
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  // IMPORTANT: Return both token AND userId
  return {
    token,
    userId: user.id
  };
};