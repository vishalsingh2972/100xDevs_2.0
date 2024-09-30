import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  console.log(c);
  return c.text('Hello Hono get!')
})

app.post('/user', (c) => {
  return c.text('Hello Hono post!')
})

export default app
