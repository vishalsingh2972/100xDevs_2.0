import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Write a function that let’s you fetch the details of a user given their email

async function getUser(email: string) {
  const result = await prisma.user.findFirst({
    where: { //which user to fetch
      email: email
    }
  })
  console.log(result);
}

getUser("vishal@gmail.com");