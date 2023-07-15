import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();
async function main() {
  await prisma.user.upsert({
    where: { name: "demo" },
    update: {},
    create: {
      name: "demo",
      password: await hash("demo-password", 10),
      preferences: {
        create: {
          classificationModel: "gpt-3.5-turbo-16k",
          extractionModel: "gpt-3.5-turbo-16k",
          analysisModel: "gpt-4",
        },
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
