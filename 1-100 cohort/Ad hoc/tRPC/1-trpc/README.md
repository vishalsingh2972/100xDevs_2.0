# What is RPC

RPC stands for `remote procedure call` . As the name suggests, it lets you call a function in on a different process/server/backend and get back a response from it.

## Why remote procedure call?

This is how we’ve made our backends talk to each other until now.
We send out an `http request` , get back a response

There are a few flaws in this approach

1. No types. You don’t know what is the shape of the data you will get back. You might be able to share types between 2 Node.js backends somehow, but if the other backend is in `Rust`, then you cant get back the types from it
2. We use JSON to `serialize` and `deserialize` data
3. We have to know what `axios` is , or what `fetch` is . We need to understand HTTP and how to call it
4. Not language agnostic at all. We have to use a different library in Java, go, rust to send an http request to the server

Why trpc

1. Automatic types on FE and BE
2. Generic code that can be converted to Express, NextJS backend

How does it do it->
Hosting trpc with Adapters

Don't worry about HTTP/REST implementation details

# Vocabulary

Procedure ↗ - API endpoint - can be a query, mutation, or subscription.
Query - A procedure that gets some data.
Mutation - A procedure that creates, updates, or deletes some data.
Subscription ↗ - A procedure that creates a persistent connection and listens to changes.
Router ↗ - A collection of procedures (and/or other routers) under a shared namespace.
Context ↗ - Stuff that every procedure can access. Commonly used for things like session state and database connections.
Middleware ↗ - A function that can run code before and after a procedure. Can modify context.
Validation ↗ - "Does this input data contain the right stuff?".

Express Endpoint->

```js
app.get("/todo", (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  // po database stuff
  res.json({
    title: title,
    description: description,
    done: false,
    id: 1,
  });
});
```

TRPC Endpoint->

```ts
const appRouter = router({
  todoCreate: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    )
    .query(async (opts) => {
      let title = opts.input.title;
      let description = opts.input.description;
      // do database logic
      return {
        id: 1,
        title: title,
        description: description,
      };
    }),
});
```

```bash
npm init -y
npx tsc --init
npm install @trpc/server@next @trpc/client@next
npm install zod
```

make a server and client folder->

```bash
mkdir src
cd src
mkdir client server
```

Generally there are 3 steps->

1. init trpc
2. Define your router
3. Use the adapter to serve the API

create a Router(server/trpc.ts, server/index.ts file) which is equivalent to a Endpoint- in Express.
Serve the API using the adapter.

setup a trpc Client(client/index.ts) which is equivalent to a Express Client.

compile and run->

```bash
tsc -b
node dist/server/index.js
node dist/client/index.js
```

# Context

Your context holds data that all of your tRPC procedures will have access to, and is a great place to put things like database connections or authentication information.
Setting up the context is done in 2 steps, defining the type during initialization and then creating the runtime context for each request.