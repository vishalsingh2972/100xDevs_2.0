# Express Adv Topic

- Authentication
- Middlewares
- Global Catches

# Middlewares

- In real world the use case of middlewares is usually to do pre checks, pre-checks are of two types: 1.Authentication Check: Making sure a the user is logged in, 2.Input Validation Check.
  ![alt text](img-3.1/image.png)
- In the above code you can see the return early approach
- The below both conditions are same, not over and it converts to or with negation. Check De Morgan's Laws
  ![alt text](img-3.1/image-1.png)
- Same can be seen for the or case
  ![alt text](img-3.1/image-2.png)
- The below way of writing code violate the D.R.Y principle
  ![alt text](img-3.1/image-3.png)
- Slightly better solution would create a wrapper function
- The Best optimization for this use case in express and other languages is middlewares.
  ![alt text](img-3.1/image-4.png)
- Here you can give the multiple callback functions,
  ![alt text](img-3.1/image-5.png)
- next is function in itself and we call it if we think the things are fine and we can proceed. And next takes care that the control will reach to the next callback in the sequence.
- If you will end the flow after the res is send then it will go on and if you are sending response twice it will cause error.
  ![alt text](img-3.1/image-6.png)
- Rate limitting can be a part of middleware, you can implement it using this. We can control how many request can be processed per second.
  ![alt text](img-3.1/image-7.png)
- DDoS protection is done before the control reaches to the route checks.
- Another good useCase of middlewares is calculating requests
  ![alt text](img-3.1/image-8.png)
- app.use() is a middleware. To get the POST, PUT body parameters we need to use this middleware. Only then you will able to catch the body send in POST, PUT request.
  ![alt text](img-3.1/image-9.png)
- This app.use() will be called for every request, i.e. it is called everywhere in the request process sequence. It is same as explicitly putting the middleware at the start of a specific route.
  ![alt text](img-3.1/image-10.png)
- If we don't call next() the control won't go ahead. It calls the next middleware in the same route
- Do these assignments
  ![alt text](img-3.1/image-11.png)
- Middlewares are called in sequence
  ![alt text](img-3.1/image-27.png)
- Here the below app.use will be called after the request is processed and if we get any error then the error middleware will be called. If error comes no more middlewares will be called and control reaches the global catch.
  ![alt text](img-3.1/image-25.png)
- Look for the use of next() in the route handler?

# Global Catch

![alt text](img-3.1/image-12.png)

- Add it at the end so that if any exception occur it will able to handle it
  ![alt text](img-3.1/image-13.png)
  ![alt text](img-3.1/image-28.png)

# Input Validations - zod

- You can use zod for complex input validations
  ![alt text](img-3.1/image-14.png)
- npm install zod
  ![alt text](img-3.1/image-15.png)
  ![alt text](img-3.1/image-16.png)
  ![alt text](img-3.1/image-17.png)
  ![alt text](img-3.1/image-18.png)
- Assignment
  ![alt text](img-3.1/image-19.png)
  ![alt text](img-3.1/image-20.png)
- look at zod documentation
- schema.parse vs schema.safeParse: parse will throw error if schema validation fails whereas safeParse will not throw an error
  ![alt text](img-3.1/image-21.png)
- Coercion to push someone to do something
  ![alt text](img-3.1/image-22.png)
- Here in the below app.use we are passing the function that is returned by the express.json rather than express.json function.
  ![alt text](img-3.1/image-23.png)
  ![alt text](img-3.1/image-24.png)
- We can't trust the frontend checks so we need server level checks too, because people can try to exploit your server from other api request tools.
- It is a good backend validation library, though you can use it independently too.

# Authentication

![alt text](img-3.1/image-26.png)
