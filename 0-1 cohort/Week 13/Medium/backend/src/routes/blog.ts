import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userid: string
  }
}>();

//common middleware for authentication
blogRouter.use('/*', async (c, next) => {
  //extract user id from the payload of token
  //pass it down to route handlers so it can be used in 'authorId'

  const auth_header = c.req.header("authorization");

  const verified = await verify(auth_header || "", c.env.JWT_SECRET);

  if (verified) {
    c.set('userid', verified.id as string); //extract userid from token and store it in context c, also to avoid ts error specifying that verified.id is of type string
    await next()
  } else {
    c.status(403);
    return c.json({ error: "unauthorised bhaiyaji" });
  }
})

//create a blog
blogRouter.post('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const blog = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: c.get('userid') //use userid stored in context c
    }
  })

  return c.json({
    id: blog.authorId
  })
})

//update a blog
blogRouter.put('/', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const blog = await prisma.post.update({
    where: {
      id: body.id
    },
    data: { //able to change the data fields ~ able to update the title/body of the blog
      title: body.title,
      content: body.content,
    }
  })

  return c.json({
    id: blog.authorId
  })
})

//get a blog given a specific id
blogRouter.get('/:id', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const id = await c.req.param("id");
    const blog = await prisma.post.findFirst({
      where: {
        id: id
      }
    })

    return c.json({
      blog: blog //return complete blog back to the user
    })
  } catch (e) {
    c.status(404);
    return c.json({
      message: "Error while fetching the blog post you requested"
    })
  }
})

//get list of ALL the blogs
//(MUST DO THIS) add pagination ~ means don't return all blogs to the user but return the first 10 blogs back initially and send more in future as they scroll down through the page
blogRouter.get('/get/bulk', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const all_blogs = await prisma.post.findMany();

  return c.json({
    all_blogs //return all blogs back to the user
  })
})