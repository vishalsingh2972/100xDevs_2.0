import { initTRPC } from "@trpc/server";
const t = initTRPC.create(); //initialise the trpc server, only once per backend
export const router = t.router; //export reuable router, procedure etc
export const publicProcedure = t.procedure;

const t1 = initTRPC
  .context<{
    username?: string;
  }>()
  .create();

export const router1 = t1.router;
export const publicProcedure1 = t1.procedure;
