import { getServerSession } from "next-auth";

export async function GET() {

  const session = await getServerSession();

  return Response.json({
    session
    //name: session?.user?.name
})
}