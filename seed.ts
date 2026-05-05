import { prisma } from './src/lib/prisma';
import bcrypt from 'bcryptjs';

async function seed() {
  const email = 'admin@taskflow.com';
  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN'
      },
    });
    console.log("Seeded user:", user.email);
    console.log("Use password:", password);
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
