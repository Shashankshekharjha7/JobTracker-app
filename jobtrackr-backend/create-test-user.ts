import 'dotenv/config'; // ← Add this at the very top
import prisma from './src/config/db.js';
import bcrypt from 'bcrypt';

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });
    
    console.log('✅ User created successfully!');
    console.log('ID:', user.id);
    console.log('Email:', user.email);
    console.log('Name:', user.name);
    
    return user;
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('❌ User already exists with this email');
      
      // Fetch existing user
      const existingUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' }
      });
      
      console.log('Existing user:', existingUser);
      return existingUser;
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser().catch(console.error);