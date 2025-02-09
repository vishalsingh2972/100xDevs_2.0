"use server"; //need to specify use server always for server actions

import { prisma as client } from "../db";

export async function NewUser(username: string, password: string) {
  try {
    const user = await client.user.create({
      data: {
        username: username,
        password: password
      }
    });
    return true; //user able to sign up
  }
  
  catch (e: any) {
    return false; //user not able to sign up
  }
}