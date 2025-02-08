import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const client = new PrismaClient();

export async function POST(req: NextRequest) {

  //extract body from incoming req data
  //const body = await req.json();, so this means that whatever json data is coming in req, convert it back to its original format and store it in body
  const body = await req.json(); //same work as app.use(express.json()); where data is sent in json format and we use these to parse/change the json data to its original format
  // console.log(body);

  try {
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
      body
    })
  }
  catch (e: any) {
    return NextResponse.json({
      message: e.message
    })

    //also works
    // catch (e) {
    //   return NextResponse.json({
    //     message: (e as Error).message
    //   })
  }
}

export async function GET() {
  try {
    const latestUser = await client.user.findFirst({
      orderBy: {
        id: 'desc' // Get the latest user by ordering by ID in descending order
      }
    });

    return NextResponse.json({
      name: "Piku Banerjee",
      email: latestUser?.username
    })
  }
  catch (e: any) {
    return NextResponse.json({
      message: e.message
    });
  }
}
