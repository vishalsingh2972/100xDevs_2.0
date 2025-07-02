# GraphQL | 13.08.2024

It is a query language. Competitior to REST (HTTP protocol).
GraphQL is a query language for APIs and a runtime for executing those queries with your data. It provides a more efficient, powerful, and flexible alternative to RESTful APIs by allowing clients to request only the data they need

## Benefits over REST?

1. Fewer requests
2. Data retreival is client side defined
3. Strongly typed

# Defining GraphQL Request

via

1. Fields
2. Arguments
3. Queries
4. Mutations

# Difference b/w HTTP, GraphQL

HTTP-> OutPut schema is defined beforehand
GraphQL-> OutPut schema is defined based on user input

## Types of requests

1. Query - get data
2. Mutation - change data on backend
3. Subscription - listen to data

# Fields

At its simplest, a GraphQL query is just about asking for specific fields on objects. You describe your data needs as a set of fields and the GraphQL server responds with a matching shape of data.

```gql
query Users {
  users(where: { user_id: { _eq: 2 } }) {
    firstname
    lastname
    user_id
    email
  }
}
```

`where: {user_id: {_eq: 2}}` -> Arguments

# Creating a GraphQL Server

1. Write the graphql schema
   Schema represents what kinds of queries/mutations you support and their types.

User Schema-> Similar to OpenAPI file, used for creating client with types

`So we are basically pre defining the request a user can make & we are making a sort of list (graphql schema) & we are letting user request the minimal things which a user have to use and ignoring the rest of extra things in short saving the time & making it legs expensive`

## Types

In GraphQL, a "type" defines the shape of an object you can fetch from your service and the fields it contains.

## input

"Inputs" in GraphQL are special kinds of types that are used for passing data to a mutation or sometimes a query). You can think of them as analogous to function arguments

# Writing a GraphQL Server, client

Use a library that lets you write `resolvers`. Exist in every language. There are many in Node.js
We will learn the simplest and most raw one.

ts server with javascript

```bash
npm install express
npm install express-graphql
npm install graphql
```

client folder

```bash
npm init -y
npm i --save graphql-zeus
npx tsc --init
```

run the server(server)-> `node dist/index.js`