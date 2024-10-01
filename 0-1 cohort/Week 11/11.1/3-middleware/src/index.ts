//Creating a simple auth middleware

import { Hono, Next } from 'hono'
import { Context } from 'hono/jsx';

const app = new Hono();

async function authMiddleware(c: any, next: any) {
  //c here is ~ context of this request ~ request(req) and response(res) objects together
  if (c.req.header("Authorization")) {
    // Do validation
    await next();
  } else {
    return c.text("You dont have access");
  }
}

app.use(authMiddleware);

app.get('/', async (c) => {
  // app.get('/', authMiddleware, async (c) => { //also works
  const body = await c.req.parseBody();
  console.log(body);
  console.log(c.req.header("Authorization"));
  console.log(c.req.query("param"));

  return c.json({ msg: "aaaye janaab!" });
})

export default app