import { Hono } from 'hono'

const app = new Hono()

// app.get('/', (c) => {
//   console.log(c); console.log(' ');
//   console.log(c.req); console.log(' ');
//   console.log(c.res);
//   return c.text('Hello Hono get!')
// })
// app.post('/user', (c) => {
//   return c.text('Hello Hono post!')
// })

//Getting inputs from user
app.get('/', async (c) => {
  const body = await c.req.json()
  console.log('body : ', body);
  console.log('Authorization header : ', c.req.header("Authorization"));
  console.log('Query parameter : ', c.req.query("param"));

  return c.text('Hello Hono!')
})

export default app