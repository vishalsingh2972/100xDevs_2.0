import { z } from '@hono/zod-openapi';

const ParamsSchema = z.object({
  id: z.string().min(3).max(10).openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '12345',
    }),
})

export default app