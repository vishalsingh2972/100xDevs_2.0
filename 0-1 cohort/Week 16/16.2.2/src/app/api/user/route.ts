import { NEXT_AUTH } from "@/app/lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {

  const session = await getServerSession(NEXT_AUTH);

  return Response.json({
    session
    //name: session?.user?.name
})
}