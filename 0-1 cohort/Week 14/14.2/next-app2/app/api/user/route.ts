import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  
  //extract body from incoming req data
  const body = await req.json();
  //console.log(body)

  //store the body data in the database

  return Response.json({
    message: "You are logged in"
  })
}

export function GET() {
  return Response.json({ name: "Piku Banerjee", email: "piku@gmail.com" })
}
