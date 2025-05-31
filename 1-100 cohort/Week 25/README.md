# 25.1 Integration and End-to-End Testing

## Some Important Unit Testing Recaps

1. If we have a part of code interacting with DB using APIs.
2. We can mock the part of testing DB calls using Jest, Vitest or Supertest Library. This can be done either:

   - Manually: By seperating the actual server listening code and main logic and testing the main logic using Postman.

   - Automatic: By using Supertest Library, we were able to mock the DB and network calls and test the main logic.

---

## Integration Testing

- Integration Testing is a type of testing where we test the interaction between two or more modules or components.
- Also, If database is not mocked out, it is an Integration Test.
- Good for use cases where we want to test the interaction between different components.

### Unit Tests v/s Integration Tests

| Unit Tests                                        | Integration Tests                                    |
| ------------------------------------------------- | ---------------------------------------------------- |
| Test a single unit of code.                       | Test multiple units of code.                         |
| Mock out any external calls.                      | Doesn't mock any external calls.                     |
| **Use case**: Test the code in isolation.         | **Use case**: Test the code in a real environment.   |
| Faster to execute.                                | Slower to execute.                                   |
| Less complex. (doesn't need to start any service) | More complex. (especially for starting any services) |
| Local Development setup is not required.          | Local Development setup may be required.             |

### Pre-requisites for Integration Testing

Before, we start the Integration Testing, we need to write the code for:

- Bring up the external services.
- Seed data in there.
- Bring down the service when the test suite succeeds/fails

### Intitializing Setup for Integration Testing

1. Initialize the express app.

   <br>

2. Initialize Prisma.

   <br>

3. Create Schema of Tables that we will be having in our app in `/prisma/schema.prisma` file. In our case, we are using `Request` table which contains a sample body of our request.

   <br>

4. Generate the Prisma Client using following command:

   ```bash
   npx prisma generate
   ```

5. Create two files `db.ts` (Stores the Prisma Client and exports it) and `index.ts` (Simple Express app with a simple `/sum` endpoint) inside `src` folder.

   > Note: We have not added the code to listen on a port, since we don't want the tests to use the 'listening code'. So, whenever the tests start -> we don't want the HTTP server to start. Thus, we store listening logic in a seperate file named `bin.ts`.

   <br>

6. To start the server, we will use the following command:

   ```bash
    tsc -b && node dist/bin.js
   ```

   or just use the following command:

   ```bash
    npm run start
   ```

   <p align="center">or</p>

- Simply Go to the `1-intgeration-test` folder to check the code & run the above command to start the server.

<br>

**Setting up the Database**:

1. Install Docker and run the Postgres using Docker locally using the below command:

   ```bash
   docker run --name 100x-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
   ```

2. Inside the `.env` file created for you, replace the `DATABASE_URL` with the below code:

   ```bash
   DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres?schema=public"
   ```

3. Migrate the database using the below command:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Generate the Prisma Client again using the below command:

   ```bash
   npx prisma generate
   ```

5. Try to send a POST request to the `/sum` endpoint using Postman:
   You should get the response as `3`.

   <br>

6. Check the DB and ensure data is going in, through Prisma Studio:
   ```bash
   npx prisma studio
   ```

<br>

### Bootstraping Integration Tests in Vitest

1. Install `Vitest` library using below command:

   ```bash
   npm i vitest
   ```

2. We use a `docker-compose` to make it easier for us to start multiple services at once. Create a `docker-compose.yml` file in the root directory and add the below code:

   ```yml
   version: '3.8'
   services:
   db:
     image: postgres
     restart: always
     environment:
       - POSTGRES_USER=test-postgres
       - POSTGRES_PASSWORD=mysecretpassword
     ports:
       - '5432:5432'
   ```

   > Note: This makes sure we don't use the production database but use a seperate database everytime we run the tests.

   <br>

3. Now, comes the important part! We create a sript to do all the work we just did above and runnning this script should do all the work (from starting the services -> migrating databases -> running the tests -> getting results -> resetting db):

   <br>

   - Create a new script file inside `scripts` named `run-integration.sh`.

      <br>

   - We create another script file named `wait-for-it.sh` which waits for the services to start before running the tests. (This script is taken from [here](https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh)).

     > Note: On a mac, you need to install **`brew install coreutils && alias timeout=gtimeout`** to run the above script.

      <br>

   - If you get permissions denied error: Try giving the file permissions to all the files inside the scripts folder using `chmod +x ./scripts/*`.

      <br>

   - Update the `package.json` to run the script using the below command:

     ```json
     "scripts": {
       "test": "vitest",
       "test:integration": "./scripts/run-integration.sh"
     }
     ```

4. We can also have a `Reset-DB` file to reset the DB before running the tests. Create a `reset-db.ts` file inside the `src/tests/helpers` folder and add the below code:

   ```ts
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   export default async () => {
     await prisma.$transaction([prisma.request.deleteMany()]);
   };
   ```

### Adding Integration Tests

1. Install the `supertest` library using below command:

   ```bash
   npm i -D supertest @types/supertest
   ```

2. Create a test file named `sum.test.ts` inside `src/tests/` folder and add the below code:

   ```ts
   import { describe, expect, it } from 'vitest';
   import { app } from '..';
   import request from 'supertest';

   describe('POST /sum', () => {
     it('should sum add 2 numbers', async () => {
       const { status, body } = await request(app).post('/sum').send({
         a: 1,
         b: 2,
       });
       expect(status).toBe(200);
       expect(body).toEqual({ answer: 3, id: expect.any(Number) });
     });
   });
   ```

3. Try running the test (Make sure your prod DB is running):
   ```bash
   npm run test:integration
   ```

<br>

### <p align ="center">Congratulations 🎉🎉 ! You have successfully written your first Integration Test! </p>

<p align="center">
<img width="800" alt="Screenshot 2024-05-19 at 8 23 05 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/0b1ddbe1-04a9-44d5-81fa-37167de0fc32">
</p>

<br>

### Resetting Database before running Tests

- If we want to reset the database before running each tests/describe block, we can use the `beforeEach` hook in Vitest.

- If we want certain code (in our case, its resetting the DB) to run before all tests (but not before every individual tests), we can use the `beforeAll` hook in Vitest.

---

## Integrating CI/CD Pipeline

1. Create a `.github/workflows/test.yml` which will run the tests on every push or PR to the main branch on github.

2. Put the below code in the `test.yml` file:

   ```yml
    name: CI/CD Pipeline

    on:
    push:
        branches:
        - main
    pull_request:
        branches:
        - main

    jobs:
    test:
        runs-on: ubuntu-latest

        steps:
        - name: Checkout code
        uses: actions/checkout@v2

        - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

        - name: Set up Docker Compose
        uses: docker/setup-qemu-action@v2

        - name: Ensure Docker Compose is available
        run: docker-compose version

        - name: Copy .env.example to .env
        run: cp ./1-integration-test/.env.example ./1-integration-test/.env

        - name: Run integration script # The main script file which sets up the services & tests
        run: cd 1-integration-test && npm run test:integration

   ```

3. Now, everytime there's a push or PR to the main branch, the tests will run automatically and show the results like shown below 👇

   <img width="600" alt="Screenshot 2024-05-19 at 9 10 47 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/35ab9416-7480-47c1-99d1-f6eee521fbcf">


---

## End-to-End Tests

- End-to-End Testing is a type of testing where we test the entire application from start to end.
- In this type of testing, we test both the frontend + backend.
- It lets us open the browser, interact with the app and test the app as a user would.
- Eg: Cypress, Playwright and NightwatchJS.

   <br>

  **Drawbacks**:

- It is slow.
- It is flaky.

   <br>

### Initializing Setup for End-to-End Testing

1. Initialize a seperate project.

   <br>

2. Install Cypress using below command:

   ```bash
   npm install cypress --save-dev
   ```

   <br>

3. Bootstrap Cypress.

   ```bash
   npx cypress open
   ```

   A new app should open. Go through the setup and choose **E2E Testing** -> Choose your browser -> Click on **Scaffold Example Tests**.

   <br>

4. Remove the `cypress/e2e/2-advanced-examples` folder as they contain extra example test files which we don't need.

   <br>

5. Rename the file inside `1-getting-started` to `cms.cy.js` and check the test file to see the working of Cypress testing.

   <br>

6. Run the test using below command:

   ```bash
   npx cypress run --browser chrome --headed
   ```

   or **_just use the below command_**:

   ```bash
    npm run test:e2e
   ```

   <details><summary>Explaining the above command</summary>

   - `npx cypress run`: Runs the cypress tests.
   - `--browser chrome`: Runs the tests on chrome browser. Totally Optional.
   - `--headed`: Runs the tests in a headed mode (i.e. opens the browser and runs the tests). Other option can be `--headless` which runs the tests in a headless mode (i.e. doesn't open the browser and runs the tests in the background).

   </details>

   <br>

   ### <p align="center">Congratulations 🎉🎉! You have successfully setup your first E2E test!</p>
   <p align="center"><img width="800" alt="Screenshot 2024-05-19 at 9 53 03 PM" src="https://github.com/its-id/100x-Cohort-Programs/assets/60315832/5c8588a7-c22a-476f-a6fa-576b669cc344"></p>
