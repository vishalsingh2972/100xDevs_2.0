import { publicProcedure, router } from "../trpc";
import { z } from 'zod';
import jwt from "jsonwebtoken";
import { SECRET } from "..";
import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "../middleware/user";

export const userRouter = router({
    signup: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async (opts) => {
            let username = opts.input.username;
            let password = opts.input.password;
            let response = await opts.ctx.db.User.insertMany([{
                username,
                password
            }])
            let userId = response[0]._id;
            const token: string = jwt.sign({ userId: userId }, SECRET, { expiresIn: '1h' });

            return {
                token
            }
        }),
    login: publicProcedure
        .input(z.object({
            username: z.string(),
            password: z.string()
        }))
        .mutation(async (opts) => {
            let response = await opts.ctx.db.User.findById(opts.ctx.userId);
            if (!response) {
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }
            const token: string = jwt.sign({ userId: opts.ctx.userId }, SECRET, { expiresIn: '1h' });

            return {
                token
            }
        }),
    me: publicProcedure
        .use(isLoggedIn)
        .query(async (opts) => {
            let response = await opts.ctx.db.User.findById(opts.ctx.userId);
            if (!response) {
                // shouldn't happen
                throw new TRPCError({ code: 'UNAUTHORIZED' });
            }
            return {
                email: response.username || "",
            }
        }),
});

