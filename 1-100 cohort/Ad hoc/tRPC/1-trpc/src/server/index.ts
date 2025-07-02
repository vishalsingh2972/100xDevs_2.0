import { publicProcedure, router } from "./trpc";
import { z } from "zod";
import { createHTTPServer } from "@trpc/server/adapters/standalone"; // to serve the api

const todoInputType = z.object({
  title: z.string(),
  description: z.string().optional(),
});

const todoInputType2 = z.object({ email: z.string(), password: z.string() });

const appRouter = router({
  // ... procedures defined here
  createTodo: publicProcedure.input(todoInputType).mutation(async (opts) => {
    const title = opts.input.title;
    const description = opts.input.description;
    // do db stuff here
    return {
      id: "1",
    };
  }),
  signUp: publicProcedure.input(todoInputType2).mutation(async (opts) => {
    const email = opts.input.email;
    const password = opts.input.password;
    // do db stuff here
    // do validation here
    let token = "token";
    return {
      token,
    };
  }) /*
  createTodo: publicProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async (opts) => {
      console.log("hi there");
    }),*/,
});

const server = createHTTPServer({
  router: appRouter,
  createContext(opts) {
    let authHeader = opts.req.headers["authorization"];
    console.log(authHeader);
    return {
      authHeader,
      username: "username",
    };
  },
});

server.listen(3000);

export type AppRouter = typeof appRouter;
