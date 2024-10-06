import { Hono } from 'hono'

const app = new Hono()

//user signup
app.post('/api/v1/user/signup', (c) => {
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
