import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

const app = new Hono();

//can also use this instead of using @ts-ignore for c.env.DATABASE_URL and c.env.JWT_SECRET
// const app = new Hono<{
// 	Bindings: {
// 		DATABASE_URL: string,
//    JWT_SECRET: string
// 	}
// }>();

//better routing
app.route('/api/v1/user', userRouter); //all requests coming to '/api/v1/user' get redirected to userRouter
app.route('/api/v1/blog', blogRouter); //all requests coming to '/api/v1/blog' get redirected to blogRouter

export default app