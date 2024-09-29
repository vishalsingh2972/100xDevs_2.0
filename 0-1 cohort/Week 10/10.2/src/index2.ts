import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Write a function that let’s you update data in the User table
interface UpdateParams { //type-check for second argument in function updateUser
  firstName: string;
  lastName: string;
}

// async function updateUser(email: string, firstName: String, lastName: String) //direct attack ~ also works
async function updateUser(email: string, {
  firstName,
  lastName
}: UpdateParams) {
  const result = await prisma.user.update({
    where: { email: email }, //which user to change
    data: { //updated data
      firstName,
      lastName
    }
  })
  console.log(result);
}

updateUser("chom@gmail.com", {
  firstName: "lalu prasad",
  lastName: "yadav"
});

// updateUser("chom@gmail.com", "lalu prasad", "yadav"); //direct attack ~ also works