import { initTRPC } from '@trpc/server';
import { Todo, User } from "./db";
 
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<{db: {Todo: typeof Todo, User: typeof User}; userId?: string;}>().create();
 
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
