import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Write a function that let’s you delete data in the User table by taking email and password as input
async function deleteUser(email: string, password: string) {
  const result = await prisma.user.delete({
    where: { //which user to delete
      email: email,
      password: password
    }
  });
  console.log(result);
}

deleteUser("chom@gmail.com", "111111");