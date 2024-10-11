import { Hono } from "hono"
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { signUpInput, signInInput } from "@vishalsingh2972/medium-common"

export const userRouter = new Hono();

//can also use this instead of using @ts-ignore for c.env.DATABASE_URL and c.env.JWT_SECRET
// const app = new Hono<{
// 	Bindings: {
// 		DATABASE_URL: string,
//    JWT_SECRET: string
// 	}
// }>();

//user signup
userRouter.post('/signup', async (c) => {
  //console.log(c); console.log(c.req)

  const body = await c.req.json(); //c.req.json() only parses the request body

  //need to sanitize this body first before moving ahead ~ just making sure body follows a certain format that we want
  const { success } = signUpInput.safeParse(body);
  if (!success) {
    c.status(411)
    return c.json({
      message: "inputs are incorrect ji"
    })
  }

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
  const token = await sign({ id: user.id }, c.env.JWT_SECRET); //JWT_SECRET environment variable defined in wrangler.toml

  return c.json({
    jwt: token
  });
})

//user signin
userRouter.post('/signin', async (c) => {
  const body = await c.req.json();
  const { success } = signInInput.safeParse(body);
  if (!success) {
    c.status(411)
    return c.json({
      message: "inputs are incorrect ji"
    })
  }

  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
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