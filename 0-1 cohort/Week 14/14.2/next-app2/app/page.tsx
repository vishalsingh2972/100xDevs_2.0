import axios from "axios";

async function getUserDetails() {
  const response = await axios.get("https://week-13-offline.kirattechnologies.workers.dev/api/v1/user/details")
  return response.data;
}

//async component ~ not possible in React.js, recently introduced in Next.js but even in Next.js only possible for server components and not for client components
export default async function Home() {
  const userData = await getUserDetails();

  return (
    <div>
      Hello
      {userData.email}
      {userData.name}
    </div>
  );
}
