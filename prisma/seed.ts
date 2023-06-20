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
