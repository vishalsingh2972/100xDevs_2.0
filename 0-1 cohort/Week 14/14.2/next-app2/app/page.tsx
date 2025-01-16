import axios from "axios";

async function getUserDetails() {
  // await new Promise((r) => setTimeout(r, 5000)) //manmade 5 sec speedbreaker

  const response = await axios.get("http://localhost:3000/api/user");
  return response.data;
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
