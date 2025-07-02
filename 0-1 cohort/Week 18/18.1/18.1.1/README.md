- Clone the repo

```jsx
git clone https://github.com/100xdevs-cohort-2/week-17-final-code
```

- npm install
- Run postgres either locally or on the cloud (neon.tech)

```jsx
docker run  -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

- Copy over all .env.example files to .env
- Update .env files everywhere with the right db url - one from paytm_18.1.1
- Go to `packages/db`
  - npx install bcrypt
  - npx prisma migrate dev
  - npx prisma db seed
- Go to `apps/user-app` , run `npm run dev`
- Try logging in using phone - 1111111111 , password - alice (See `seed.ts`)

well the code when ran was providing error that the userId not defined
hence moved to `apps/user-app/app/(dashboard)/dashboard/transfer/page.tsx` and did the code there

Right Now we see the `onramp` transactions that have been `seeded`.
Clicking on this button should initiate a new entry in the `onRampTransactions` table, that is eventually fulfilled by the `bank-webhook` module.

Let’s implement this feature via a server action

- Create a new action in lib/actions/createOnrampTransaction.ts
  now go to `apps/bank-webhook` -> run `npm run dev`
  18.1.1 done

Add a p2p transfer column-> user-app/app/(dashboard)/layout.tsx, user-app/components/SendCard.tsx

Create a new action in lib/actions/p2pTransfer.tsx and add it in SendCard.tsx

Problem with this approch.
Try simulating two request together by adding a 4s sleep timeout in the transaction

## Locking of rows

In postgres, a transaction ensure that either all the statements happen or none. It does not lock rows/ revert a transaction if something from this transaction got updated before the transaction committed (unlike MongoDB)
So we need to explicitly lock the balance row for the sending user so that only one transaction can access it at at time, and the other one waits until the first transaction has committed

## Add P2P transactions table

Update schema.prisma
Run `npx prisma migrate dev --name added_p2p_txn`
Regenerate client `npx prisma generate`
Do a global build (npm run build) (it’s fine if it fails
Add entries to `p2pTransfer` whenever a transfer happens
