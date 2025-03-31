import { NEXT_AUTH } from "@/app/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(NEXT_AUTH);

export const GET = handler;
export const POST = handler;
//export { handler as GET, handler as POST };