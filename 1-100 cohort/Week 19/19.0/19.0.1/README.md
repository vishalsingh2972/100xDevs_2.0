# 19.0.1

## What are middlewares?

- Middlewares are code that runs before/after your request handler.

It’s commonly used for things like:

- Analytics
- Authentication
- Redirecting the user

```bash
mkdir week_19/offline-1
cd week_19/offline-1
npm init -y
npx tsc --init
mkdir src
touch src/index.ts
npm install express @types/express
```

Change the rootDir to src, outDir to dist in tsconfig.json.  
2 files: index.ts, index2.ts -> local middleware by book, like previous one.

Now middlewares in Next.js

## Middlewares + Next.js

Middleware allows you to run code before a request is completed.  
Then, based on the incoming request, you can modify the response by:

1. rewriting
2. redirecting
3. modifying the request or response headers
4. or responding directly.

- Use cases:
  - Authentication and Authorization: Ensure user identity and check session cookies before granting access to specific pages or API routes.
  - Logging and Analytics: Capture and analyze request data for insights before processing by the page or API.

```bash
npx create-next-app
# What is your project named? … offline-2
```

Create middleware.ts in the root folder. Only 1 middleware.ts file is allowed, but you can import from other files for logic functionality for cleaner management of middlewares.

```bash
cd offline-2
touch middleware.ts
```

We have not provided any routes; Next.js understands this by itself.

Create a request count middleware to track only requests that start with /api.  
Add a dummy API route (api/user/route.ts).

Update middleware.ts.

## Selectively running middlewares

Update middleware.ts, api/user/route.ts, signin/page.tsx, add the respective code.  
Now visit http://localhost:3000/signin by running the app in dev mode: `npm run dev`.