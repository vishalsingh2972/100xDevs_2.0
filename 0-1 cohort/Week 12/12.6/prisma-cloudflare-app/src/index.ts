import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

//Connect to Prisma Accelerate pool
export interface Env {
	DATABASE_URL: string
}

export default {
//Enable Prisma Accelerate for pooling
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const prisma = new PrismaClient({
			datasourceUrl: env.DATABASE_URL,
		}).$extends(withAccelerate()) //$extends(withAccelerate()) method is used to enable the Accelerate extension for connection pooling

//Define the data to be added first to the pool and then eventually to the table in the db
		const response = await prisma.log.create({
			data: {
				level: 'Info',
				message: `hey chom`,
				meta: {
					headers: JSON.stringify(request.headers),
				}
			},
		})

		console.log(JSON.stringify(response))

		//return new Response('hogaya ra!')
		return Response.json(response) //return Response.json(response); is returning the data that was just inserted into the database back to the frontend
	}
}