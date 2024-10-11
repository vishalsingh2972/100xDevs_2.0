import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

export const blogRouter = new Hono();

//common middleware for authentication
blogRouter.use('/*', async (c, next) => {
  //extract user id from the payload of token
  //pass it down to route handlers so it can be used in 'authorId'
  
  const auth_header = c.req.header("authorization");
  //@ts-ignore
  const verified = await verify(auth_header, c.env.JWT_SECRET);

  if (verified.id) {
    await next()
  } else {
    c.status(403);
    return c.json({ error: "unauthorised bhaiyaji" });
  }
})

//create a blog
blogRouter.post('/', async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: '1'
    }
  })

  return c.text('create blog route')
})

//update a blog
blogRouter.put('/', (c) => {
  return c.text('update blog route')
})

//get a blog given a specific id
blogRouter.get('/:id', (c) => {
  return c.text('get a blog route')
})

//get list of ALL the blogs
blogRouter.get('/bulk', (c) => {
  return c.text('get all blogs route')
})