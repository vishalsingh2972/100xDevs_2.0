
import { publicProcedure, router } from "../trpc";
import { z } from 'zod';
import { isLoggedIn } from "../middleware/user";

export const todoRouter = router({
    todoCreate: publicProcedure
        .input(z.object({
            title: z.string(),
            description: z.string()
        }))
        .use(isLoggedIn)
        .mutation(async (opts) => {
            let title = opts.input.title;
            let description = opts.input.description;
            const newTodo = new opts.ctx.db.Todo({ title, description, done: false, userId: opts.ctx.userId });
            let response = await newTodo.save();

            return {
                id: response.id
            }
        }),
        todoGet: publicProcedure
            .use(isLoggedIn)
            .query(async (opts) => {
                let todos = await opts.ctx.db.Todo.find({
                    userId: opts.ctx.userId
                })
                return todos.map(x => ({
                    title: x.title,
                    description: x.description,
                    done: x.done
                }))
            })
});

 
