# PayTM Clone Project

This week's code can be found in a seperate repository [here](https://github.com/its-id/paytm-end-to-end/tree/main).

- **Week 17.1**

  - Architecture & UI/UX.
  - Slides 👉 [here](https://projects.100xdevs.com/tracks/Paytm/paytm17-1) till slide 14.
    <br>

- **Week 17.2**
  - Setting up MonoRepo.
  - Authentication.
  - Prisma & DB Setup.
  - Transaction and Webhooks.
  - Slides 👉 [here](https://projects.100xdevs.com/tracks/Paytm/paytm17-1) after slide 14.

# Feature planning

## User login

Auth (In this case, probably email/phone)
On ramp from bank, off ramp to bank
Support transfers via phone number/name
Support scanning a QR code for transferring to merchants

## Merchant login

Login with google
Generate a QR Code for acceptance
Merchants get an alert/notification on payment
Merchant gets money offramped to bank every 2 days

UI/UX (End User)
Login
Landing page
User Home page
User Transfer page

UI/UX (Merchant)

## Hot paths

Send money to someone
Withdraw balance of merchant
Withdraw balance of user back to bank
Webhooks from banks to transfer in money

## Stack

Frontend and Backend - Next.js (or Backend)
Express - Auxilary backends
Turborepo
Postgres Database
Prisma ORM
Tailwind

1. Initialise the app

```bash
 npx create-turbo@latest

>>> TURBOREPO

>>> Welcome to Turborepo! Let's get you set up with a new codebase.

? Where would you like to create your turborepo? paytm-live
? Which package manager do you want to use? npm workspaces
```

delete docs app,rename other folder to user
add tailwind to user-app

```bash
cd apps/user-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

cd ../merchant-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

update tailwind.config.js, global.css

2. Adding Prisma - 1:00:00
   Create a new packages/db folder
   Initialise package.json

```bash
npm init -y
npx tsc --init
```

package.json->
update the name of package - "@paytm/db"

tsconfig.json->
delete tsconfig.json content

copy ui/tsconfig.json into it

update packages/db/tsconfig.json

run this into db folder

```bash
npx prisma init
```

& now generate the table format in db/prisma/schema.prisma
intialise the db using docker

```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

add your database credentials in .env file and run ->

```bash
npx prisma migrate dev --name init
```

generate the client->

```bash
npx prisma generate
```

intialise a `index.ts` file in `db` folder and update `exports` in `package.json` file
now run `npm install` globally

add a .env file in packages/db and put your database credentials

```bash
npx prisma migrate dev
```

generate prisma client

```bash
npx prisma generate
```

install npm and run through root folder

```bash
npm install
npm run dev
```

1. Cloning the repo
2. npm install
3. cd packages/db
4. Adding a -env file with the database url, getting a database from neon. tech/docker
5. npx prisma migrate dev
6. npx prisma generate
7. Add -env file to app/user-app
8. npm run dev

`npx prisma studio` - to visualise the tables

remaining in week 18
