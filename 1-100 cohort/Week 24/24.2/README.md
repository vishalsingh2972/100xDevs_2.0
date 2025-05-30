# Testing in MERN Stack

## What are Tests?

- Tests are a way to ensure that your code is working as expected.
- In a large codebase, it is important to have tests to ensure the changes made do not break the existing code.

    <br>

- For eg: If you have a function that adds two numbers, you can write a test to check if the function is working as expected.

  ```typescript
  //sum.ts
  function add(a, b) {
    return a + b;
  }
  ```

  - You can write a **basic** test to check if the function is working as expected.

    ```typescript
    //sum.test.ts
    if (add(1, 2) === 3) {
      console.log('Test Passed');
    } else {
      console.log('Test Failed');
    }
    ```

## Better Ways of Testing - Test Libraries

## Testing a Simple Node.js App

- Jest is a testing library that is used to test JavaScript code.
- More Info [here](https://jestjs.io/).

**Implementing Jest in a project**:

1.  Setup a Typescript project using `npm init -y && npx tsc --init` or Go to `/1-simple-test` and run `npm install`.

2.  Install Jest. Since we have a typescript project, we install using following command:

    ```bash
    npm install --save-dev ts-jest @jest/globals
    ```

    <details><summary>Explaining above command</summary>

    - `ts-jest`: This is a TypeScript preprocessor with source map support for Jest that lets you use Jest to test projects written in TypeScript.
    - `@jest/globals`: This package provides global variables that are helpful for writing tests.

    </details>

    <br>

3.  Initialize the `jest.config.ts` using below command (Already done in `/1-simple-test`):

    ```bash
    npx ts-jest config:init
    ```

4.  Update the `1-simple-test/package.json` to run the tests using `jest`:

    ```json
    ...
    "scripts": {
        "test": "jest"
    }
    ...
    ```

5.  Create a test file `index.test.ts` in the same directory as the function `index.ts`. Check the code inside to see the implementation of basic tests.

    <details><summary>Explaining key functions</summary>

    - `describe`: This function is used to group tests together.
    - `it`: This function is used to write a test case. It is also known as `test`.
    - `expect`: This function is used to check if the output of the function is as expected.
    </details>

    <br>

6.  Try running the command `npm run test` to check if all the tests are passing.

      <details><summary>Output</summary>

        ```bash

        PASS  src/tests/index.test.ts

        sum module
        ✓ add 1 + 2 equals to 3 (3 ms)
        ✓ should return the sum of negative numbers correctly

        multiply module
        ✓ should work correctly on basic multiplication

        Test Suites: 1 passed, 1 total
        Tests:       3 passed, 3 total
        Snapshots:   0 total
        Time:        1.452 s, estimated 2 s
        Ran all test suites.

        ```

    </details>

## Testing an Express App

### Testing with SuperTest

1. Go to `/2-express-test` and run `npm install`.

2. Install the `jest` and `supertest` with other important libraries using below command:

   ```bash
   npm install --save-dev ts-jest  @jest/globals @types/express
   npm i supertest @types/supertest
   npm install express
   ```

   <details><summary>Explaining above command</summary>

   - `jest`: This is a testing library that is used to test JavaScript code.
   - `supertest`: This is a library that is used to test Express.js applications.
   </details>

   <br>

3. Initialize the `jest.config.js` using below command (Already done in `/2-express-test`):

   ```bash
   npx ts-jest config:init
   ```

4. Update the `2-express-test/package.json` to run the tests using `jest` (Already done in `/2-express-test`):

   ```json
   ...
   "scripts": {
       "test": "jest"
   }
   ...
   ```

5. Now, we will create a simple Express app in `src/index.ts` but we will not write the code for running the server in this file. We will write the code for running the server in a separate file `src/bin.ts`. In this way, we seperate the main application code logic from server running code. This helps the library `supertest` to **test the application without running the server**.

6. Check the tests in `src/tests/index.test.ts` to see how to test the Express app using `supertest`.

7. Run the tests using `npm run test` to check the test cases and their output.

### Adding Zod Validations & some Advanced cases

1. Go to `/2-express-test/src/indexWithZod.ts` and check the code to see how to add Zod validations to the Express app.

2. Go to `/2-express-test/src/tests/indexWithZod.test.ts` and check the code to see how to test the Express app with Zod validations.

3. Run the tests using `npm run test` to check the test cases and their output.

## Moving from Jest to ViTest

## Mocking the Application with Database

- In a real-world full-stack application, we will have a database to store the data. In this case, we will be using Prisma to interact with the database.
- To **unit test** the application, we need to **mock the database** calls or make fake db calls that just let us test the logic of our code (e.g., validation, responses etc).
- Mocking database means: during unit tests, we replace real DB calls (like Prisma) with fake functions that return predictable dummy data, so our test only checks our app’s logic — not the database itself.
- We can do mocking with Jest as well, but here we are using Vitest which is much easier for doing mocking than Jest.

**Adding the Database**:

- Go to `/3-express-with-vitest` and run `npm install`.

- Install & Initialize Prisma and Generate Prisma Client using below commands:

  ```bash
  npm install prisma
  npx prisma init
  npx prisma generate
  ```

- We won't be needing to push the database in this case, as we will not be running the server the with database part in the actual code.

<br>

**Mocking the Database call**:

- Inside the `3-express-with-vitest/src/tests/indexWithPrisma.test.ts`, we will mock the database calls using `jest.mock` function.
