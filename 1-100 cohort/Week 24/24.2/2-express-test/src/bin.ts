// This file is the entry point to start the server (e.g. for local development or production).
// We keep app.listen() here (in bin.ts) instead of index.ts to separate concerns:
// - so now while testing index.ts exports only the Express app part
// - and bin.ts handles running the server (port binding, logging, etc.) which is not required for/during testing
//
// This avoids accidentally starting the server during tests (which can cause port conflicts and slow tests).
// It also makes the app easier and faster to test, scale, and deploy.
//
// 📌 Note: bin.ts is NOT used for testing.
// It's for personally starting the server locally using: tsc -b && node dist/bin.js
// (instead of tsc -b && node dist/index.js, which would mix main app logic with the code that runs the server)

import { app } from './index';
//import { appWithZod } from './indexWithZod';

//we have seperated the code of running the server from the actual logic
app.listen(3000, () => {
  console.log('Server (app) is running on PORT 3000');
});

app.listen(3001, () => {
  console.log('Server (appWithZod) is running on PORT 3001');
});

//From now on, to run the server, we will run the following command:
// tsc -b && node dist/bin.js