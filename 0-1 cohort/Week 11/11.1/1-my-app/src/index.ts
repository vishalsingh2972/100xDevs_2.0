/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

//deploy the worker ~ npx wrangler login
//account details ~ npx wrangler whoami

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// return new Response('Hello World bittu!');
		return Response.json({
			message: "hey bittu, this has been deployed"
		});
	},
} satisfies ExportedHandler<Env>;

//routing in Cloudflare environment (the ugly way ~ without any libraries/frameworks)
// export default {
// 	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
// 		console.log(request);
// 		// console.log(request.body);
// 		// console.log(request.headers);

// 		if (request.method === "GET") {
// 			return Response.json({
// 				message: "you sent a get request"
// 			});
// 		} else {
// 			return Response.json({
// 				message: "you did not send a get request"
// 			});
// 		}
// 	},
// };
