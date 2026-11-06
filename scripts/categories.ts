import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  "Snacks", "Drinks", "Dairy", "Pantry", "Frozen", 
  "Cleaning", "Personal Care", "Tobacco", "Household", "Other"
];

async function main() {
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }
  console.log("Categories added successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());