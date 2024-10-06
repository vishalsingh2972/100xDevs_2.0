import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono()

//can also use this instead of using @ts-ignore for c.env.DATABASE_URL and c.env.JWT_SECRET
// const app = new Hono<{
// 	Bindings: {
// 		DATABASE_URL: string,
//    JWT_SECRET: string
// 	}
// }>();

//user signup
app.post('/api/v1/user/signup', async (c) => {
  //console.log(c); console.log(c.req)

  const body = await c.req.json(); //c.req.json() only parses the request body

  // Ideally you shouldn’t store passwords in plaintext. You should hash before storing them
  // Hash password using Web Crypto API
  const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body.password))
  const hashedPassword = Array.from(new Uint8Array(passwordHash), b => b.toString(16).padStart(2, '0')).join('')

  const prisma = new PrismaClient({
    //@ts-ignore ~ is a TypeScript directive that tells the compiler to ignore the next line of code, but avoid using this as its a bad practise
    datasourceUrl: c.env.DATABASE_URL, //DATABASE_URL environment variable defined in wrangler.toml ~ here env.DATABASE_URL will be replaced with the value from wrangler.toml
  }).$extends(withAccelerate())

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hashedPassword // Store hashed password
    }
  })

  //@ts-ignore
  const token = await sign({ id: user.id }, "c.env.JWT_SECRET");

  return c.json({
    jwt: token
  });
})

//user signin
app.post('/api/v1/user/signin', async (c) => {
  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const passwordHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body.password))
    const hashedPassword = Array.from(new Uint8Array(passwordHash), b => b.toString(16).padStart(2, '0')).join('')

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: hashedPassword //compare incoming hashed password with hashed password stored in db
      }
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }

    //@ts-ignore
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token
    });
  }
  catch (e) {
    c.status(403);
    return c.json({ error: "some lafda in generating your JWT" });
  }
})

//common middleware for authentication
app.use('/api/v1/blog/*', async (c, next) => {
  await next()
}) 

//create a blog
app.post('/api/v1/blog', (c) => {
  return c.text('create blog route')
})

//update a blog
app.put('/api/v1/blog', (c) => {
  return c.text('update blog route')
})

//get a blog given a specific id
app.get('/api/v1/blog/:id', (c) => {
  return c.text('get a blog route')
})

//get list of ALL the blogs
app.get('/api/v1/blog/bulk', (c) => {
  return c.text('get all blogs route')
})

export default app
