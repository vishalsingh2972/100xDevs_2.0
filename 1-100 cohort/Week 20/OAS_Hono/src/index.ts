//route handler
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { ParamsSchema } from './inputs';
import { UserSchema } from './outputs';
import { swaggerUI } from '@hono/swagger-ui'

const app = new OpenAPIHono();

const getUserRoute = createRoute({
  method: 'get',
  path: '/user/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: 'Retrieve the user details',
    },
  },
})

const postUserRoute = createRoute({
  method: 'post',
  path: '/user/{id}',
  request: {
    params: ParamsSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema
        }
      },
      description: "Get the users details"
    }
  }
})

app.openapi(getUserRoute, (c) => {
  const { id } = c.req.valid("param");
  return c.json({
    id,
    age: 20,
    name: 'Nandan',
  })
})

app.openapi(postUserRoute, (c) => {
  const { id } = c.req.valid("param");
  return c.json({
    id,
    age: 20,
    name: 'Robi',
  })
})

//auto-generated OpenAPI spec based on the routes defined above will be available at /doc now
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Your development base URL
      description: 'Local development server',
    },
  ],
})

//auto-generated Swagger UI will be now available at /documentation
app.get('/ui', swaggerUI({ url: '/doc' }))

export default app;