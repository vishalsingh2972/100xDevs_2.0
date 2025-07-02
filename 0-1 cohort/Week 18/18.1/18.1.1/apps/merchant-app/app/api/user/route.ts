import { NextResponse } from "next/server";
//import { PrismaClient } from "@repo/db/client";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export const GET = async () => {
  await client.user.create({
    data: {
      email: "asd",
      name: "adsads",
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
};

