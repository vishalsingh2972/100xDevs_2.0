"use client";
// import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react"

export const Appbar = () => {
  // const router = useRouter();

  const session = useSession();
  return <div>
    {/* <button onClick={() => {
      router.push("/api/auth/signin");
    }}>Sign in</button> */}

    <button onClick={() => {
      signIn();
    }}>Sign in</button>

    <button onClick={() => {
      signOut();
    }}>Sign Out</button>

    user details CSR 
    {JSON.stringify(session)}
  </div>
}