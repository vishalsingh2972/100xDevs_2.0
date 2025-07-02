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

# 19.0.2

## Client Side Rendering

Client-side rendering (CSR) is a modern technique used in web development where the rendering of a webpage is performed in the browser using JavaScript. Instead of the server sending a fully rendered HTML page to the client...

A good example of CSR is React.

Let’s see a React project in action:

```bash
npm create vite@latest
# Project name: react-1
npm install
npm run build
cd dist/
serve
```

Open the network tab and notice how the initial HTML file doesn’t have any content. This means that the JS runs and actually populates/renders the contents on the page.  
React (or CSR) makes your life as a developer easy. You write components, JS renders them to the DOM.

## Downsides?

- Not SEO optimized
- User sees a flash before the page renders
- Waterfalling problem

## Server Side Rendering

When the `rendering` process (converting JS components to HTML) happens on the server, it’s called SSR.

- Why SSR?
  - SEO optimizations
  - Gets rid of the waterfalling problem
  - No white flash before you see content

```bash
npx create-next-app
# What is your project named? … offline-4
npm run build
npm run start
```

Open in browser, inspect the code.

Browser <-> Next Server

---

| White page | ----> |   |
|            |       |   |
| Page rendered with user details | index.html populated |   |
| <----- |   |   |

---

## Static Site Generation

If a page uses Static Generation, the page HTML is generated at build time. That means in production, the page HTML is generated when you run `next build`. This HTML will then be reused on each request. It can be cached by a CDN.

## Why?

If you use static site generation, you can defer the `expensive` operation of rendering a page to the `build time` so it only happens once.

## How?

Let’s say you have an endpoint that gives you all the `global` todos of an app.  
By `global todos` we mean that they are the same for all users, and hence this page can be statically generated.

Create a fresh Next project: offline-5  
Create todos/page.tsx  
Try updating the fetch requests

- Clear cache every 10 seconds

```tsx
const res = await fetch("https://sum-server.100xdevs.com/todos", {
  next: { revalidate: 10 },
});
```

- Clear cache in a next action

```tsx
import { revalidateTag } from "next/cache";

const res = await fetch("https://sum-server.100xdevs.com/todos", {
  next: { tags: ["todos"] },
});
```

```tsx
"use server";

import { revalidateTag } from "next/cache";

export default async function revalidate() {
  revalidateTag("todos");
}
```