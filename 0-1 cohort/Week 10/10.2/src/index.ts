import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Write a function that let’s you insert data in the User table
async function insertUser(email: string, password: string, firstName: string, lastName: string) {
  const result = await prisma.user.create({
    data: {
      email,
      password,
      firstName,
      lastName
    },
    select: { //data printed in result
      id: true,
      lastName: true
    }
  })
  console.log(result);
}

// insertUser("vishal@gmail.com", "123456", "vishal", "singh");
// insertUser("sahil@gmail.com", "999999", "sahil", "singh");
insertUser("lata@gmail.com", "111111", "lata", "panwar");