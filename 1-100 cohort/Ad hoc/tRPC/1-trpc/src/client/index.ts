import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";
//     👆 **type-only** import
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000",

      async headers() {
        return { Authorization: "token" };
      },
    }),
  ],
});

async function main() {
  const result = await trpc.createTodo.mutate({
    title: "My first todo",
  });
  console.log(result);
}

async function main2() {
  const result2 = await trpc.signUp.mutate({
    email: "nU4Rd@example.com",
    password: "password",
  });
  console.log(result2);
}

main();
main2();
