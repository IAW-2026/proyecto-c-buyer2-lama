import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.info("Seed vacio: los compradores se registran desde Clerk.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
