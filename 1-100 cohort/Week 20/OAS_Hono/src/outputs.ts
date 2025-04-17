import { z } from '@hono/zod-openapi';

//outputs that user will get from the routes
export const UserSchema = z.object({
  name: z.string().min(3).max(10).openapi({
    example: 'Johnny Doe'
  }),
  age: z.number().int().openapi({
    example: 25
  }),
  id: z.string().min(3).max(10).openapi({
    example: '86'
  })
})