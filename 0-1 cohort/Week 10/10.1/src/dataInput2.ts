//Secure way

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

//hackers can send something like this where when SQL sees the ; character, it treats it as a statement separator, indicating the end of one statement and the beginning of another. So, in your example, SQL would execute the INSERT statement, and then execute the DROP TABLE statement, which is not what you want
  // const insertQuery = `INSERT INTO users (username, email, password) VALUES ('sahilsingh', 'sahilsinghpanwar@example.com', 'ye_bhi_chalra_miya'); DROP TABLE users; --'`; //❌❌❌ NOT SAFE
  // const result = await client.query(insertQuery); //❌❌❌ NOT SAFE

//hence to avoid/stop such malicious hacks we use
  const insertQuery_Safe = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3);`; //✅✅✅ SAFE
  const result_Safe = await client.query(insertQuery_Safe, ['sahilsingh', 'sahilsinghpanwar@example.com', 'ye_bhi_chalra_miya']); //✅✅✅ SAFE

  // const values = [username, email, password]; //aise bhi likh sakte
  // const result_Safe = await client.query(insertQuery_Safe, values);
  
  console.log('Insertion success:', result_Safe);
  await client.end(); // Close the connection after everything is done (adding 'await' just for safety so that code below/after this line never gets executed)
}
insertData();


