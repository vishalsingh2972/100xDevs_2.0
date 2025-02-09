import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { prisma as client } from './db';

// async function getUserDetails() {
//   // await new Promise((r) => setTimeout(r, 5000)) //manmade 5 sec speedbreaker

//   const response = await axios.get("http://localhost:3000/api/user");
//   return response.data;
// }

//better fetches
async function getUserDetails() {
  try {
    const latestUser = await client.user.findFirst({
      orderBy: {
        id: 'desc' // Get the latest user by ordering by ID in descending order
      }
    });

    return ({
      name: "Piku Banerjee",
      email: latestUser?.username
    })
  }
  catch (e: any) {
    console.log(e);
  }
}

//async component ~ not possible in React.js, recently introduced in Next.js but even in Next.js only possible for server components and not for client components
export default async function Home() {
  const userData = await getUserDetails();

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="flex justify-center">
        <div className="border p-8 rounded">
          <div>
            Name: {userData?.name}
          </div>
          {userData?.email}
          {/* {userData?.address.city} */}
        </div>
      </div>
    </div>
  );
}
