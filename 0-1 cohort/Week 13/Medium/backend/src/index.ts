import { Hono } from 'hono'
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

const app = new Hono();

//better routing
app.route('/api/v1/user', userRouter); //all requests coming to '/api/v1/user' get redirected to userRouter
app.route('/api/v1/blog', blogRouter); //all requests coming to '/api/v1/blog' get redirected to blogRouter

export default app