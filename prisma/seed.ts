import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.upsert({
    where: { username: "JohnDoe" },
    update: {},
    create: {
      username: "johndoe",
      password: await hash("supersecret", 10),
      preferences: {
        create: {
          classificationModel: "gpt-3.5-turbo-16k",
          extractionModel: "gpt-3.5-turbo-16k",
          analysisModel: "gpt-4",
        },
      },
    },
  });
  console.log(user);
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
