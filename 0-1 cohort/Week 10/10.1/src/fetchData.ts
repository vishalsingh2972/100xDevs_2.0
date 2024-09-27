//Write a function getUser that lets you fetch data from the database given a email as input.

import { Client } from 'pg';
import { postgres_connection_string } from './utils/constants';

// Async function to fetch user data from the database given an email
async function getUser(email: string) {
  const client = new Client({
    connectionString: postgres_connection_string
  })

  try {
    await client.connect(); // Ensure client connection is established
    const query = 'SELECT * FROM users WHERE email = $1';
    const values = [email];
    const result = await client.query(query, values);
    // const result = await client.query(query, [email]);

    if (result.rows.length > 0) {
      console.log('User found:', result.rows[0]); // Output user data
      return result.rows[0]; // Return the user data
    } else {
      console.log('No user found with the given email.');
      return null; // Return null if no user was found
    }
  } catch (err) {
    console.error('Error during fetching user:', err);
    throw err; // Rethrow or handle error appropriately
  } finally { // The finally block is used to execute code that should run regardless of whether the try block succeeds or the catch block is executed. In this case, the finally block is used to ensure that the database connection is closed, whether an error occurs or not.
    await client.end(); // Close the client connection
  }
}

// Example usage
getUser('vishalsinghpanwar@example.com').catch(console.error);