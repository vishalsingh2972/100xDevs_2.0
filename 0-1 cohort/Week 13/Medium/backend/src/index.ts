import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono()

//can also use this instead of using @ts-ignore for c.env.DATABASE_URL
// const app = new Hono<{
// 	Bindings: {
// 		DATABASE_URL: string
// 	}
// }>();

//user signup
app.post('/api/v1/user/signup', async (c) => {
  //console.log(c); console.log(c.req)
  
  const body = await c.req.json(); //c.req.json() only parses the request body

  const prisma = new PrismaClient({
    //@ts-ignore ~ is a TypeScript directive that tells the compiler to ignore the next line of code, but avoid using this as its a bad practise
    datasourceUrl: c.env.DATABASE_URL, //DATABASE_URL environment variable defined in wrangler.toml ~ here env.DATABASE_URL will be replaced with the value from wrangler.toml
  }).$extends(withAccelerate())

  await prisma.user.create({
    data: {
      email: body.email,
      password: body.password
    }
  })
  
  return c.text('signup route')
})

//user signin
app.post('/api/v1/user/signin', (c) => {
  return c.text('signin route')
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
