import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../server';
import jwt from "jsonwebtoken";
export const SECRET = 'SECr3t';
import { User , Todo} from "../../../server/db";

function createContext(opts: any) {
    let authHeader = opts.req.headers["authorization"];

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        console.log(token);
        return new Promise<{db: {Todo: typeof Todo, User: typeof User}, userId?: string}>((resolve) => {
            jwt.verify(token, SECRET, (err: any, user: any) => {
                if (user) {
                    resolve({userId: user.userId as string, db: {Todo, User}});
                } else {
                    resolve({db: {Todo, User}});
                }
            });
        })
    }

    return {
        db: {Todo, User},
    }
}
// @see https://nextjs.org/docs/api-routes/introduction
export default createNextApiHandler({
  router: appRouter,
  createContext,
});