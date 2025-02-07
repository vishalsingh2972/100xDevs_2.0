import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient();

export async function POST(req: NextRequest) {

  //extract body from incoming req data
  const body = await req.json();
  //console.log(body);

  const user = await client.user.create({
    data: {
      username: body.username,
      password: body.password
    }
  });

  //store the body data in the database

  //header
  // console.log(req.headers.get("authorization"));

  //query params
  // console.log(req.nextUrl.searchParams.get("name"));

  return NextResponse.json({ //or Response.json also works
    message: "You are logged in"
  })
}

export function GET() {
  return Response.json({ name: "Piku Banerjee", email: "piku@gmail.com" })
}
