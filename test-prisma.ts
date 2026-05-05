import { prisma } from './src/lib/prisma';

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log("Users in DB:", users);
  } catch (error) {
    console.error("Prisma Error:", error);
  }
}

main();
