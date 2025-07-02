import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';
import { User } from '../server/db';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      async headers() {
        return {
            Authorization: "Bearer 1"
        }
      },
    }),
  ],
});

async function main() {
    const user = await trpc.user.signup.mutate({
        username: "harkirat@gmail.com",
        password: "!23456"
    });
    console.log(user.token);
    
    const todo = await trpc.todo.todoCreate.mutate({description: "adsa", title: "asd"});
    console.log(todo);
}

main();