//Unsafe way

//Create a simple Node.js app that lets you put data into the empty table you created in index.ts
//Create a function that let’s you insert data into a table. Make it async, make sure client.connect resolves before u do the insert

//Connecting
import { Client } from 'pg';
import { postgres_connection_string } from './utils/constants';

const client = new Client({
  connectionString: postgres_connection_string
})

//Querying
async function insertData() {
  await client.connect();
  // const result = await client.query(`
  //   INSERT INTO users (username, email, password) 
  //       VALUES ('sahilsingh', 'sahilsinghpanwar@example.com', 'ye_bhi_chalra_miya'
  //   );
  // `);

  const insertQuery = `INSERT INTO users (username, email, password) VALUES ('sahilsingh', 'sahilsinghpanwar@example.com', 'ye_bhi_chalra_miya');`
  const result = await client.query(insertQuery);
  console.log('Insertion success:', result); // Output insertion result

  await client.end(); // Close the connection after everything is done (adding 'await' just for safety so that code below/after this line never gets executed)
}
insertData();
//But, This is an insecure way to store data in your tables as when you expose this functionality eventually via HTTP, someone can do an SQL INJECTION to get access to your data/delete your data.