//Write a function deleteUser that lets you delete user row in the table from the database given a email and password as input.

import { Client } from 'pg';
import { postgres_connection_string } from './utils/constants';

async function deleteUser(email: string, password: string) {
  const client = new Client({
    connectionString: postgres_connection_string
  });

  try {
    await client.connect();
    const query = `DELETE FROM users WHERE email = $1 AND password = $2`;
    const values = [email, password];
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      console.log(`User deleted successfully`);
      return true;
    } else {
      console.log(`No user found with the given email and password`);
      return false;
    }
  } catch (err) {
    console.error(`Error during deleting user: ${err}`);
    throw err;
  } finally {
    await client.end();
  }
}

// Example usage
deleteUser('vfvffrff', 'fffcc').catch(console.error);
// console.log('User deleted : ', deleteUser('vfvffrff', 'fffcc').catch(console.error));