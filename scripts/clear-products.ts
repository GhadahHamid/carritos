import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.product.deleteMany({});
  console.log(`🧹 Deleted ${deleted.count} products from the database.`);
}

main().finally(() => prisma.$disconnect());