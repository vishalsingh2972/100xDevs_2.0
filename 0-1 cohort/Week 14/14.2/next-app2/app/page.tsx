import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { prisma as client } from './db';
import { NewUser } from "./server actions/user";

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
  // NewUser("naina", "talwar"); //server action function call from nextjs backend server component ~ also possible // this is much better than calling axios.post("http://localhost:3000/api/user") here as we would be sending a http call to the backend while being inside the backend, which made no sense

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

//Note 
// By calling NewUser("naina", "talwar") directly in your server component, you're:
// - Avoiding unnecessary HTTP requests: You're not making a POST request to http://localhost:3000/api/user from your server-side code, which would be redundant and inefficient.
// - Improving performance: By skipping the HTTP request, you're reducing the latency and overhead associated with making a request to your own backend.
// - Simplifying code: Your code becomes more straightforward and easier to maintain, as you're not dealing with HTTP requests and responses.
// This approach is a great example of how Next.js enables you to write more efficient, scalable, and maintainable server-side code.

