//Write a function updatePassword that lets you update data from the database given a email as input.

import { Client } from 'pg';
import { postgres_connection_string } from './utils/constants';

async function updatePassword(email: string, newPassword: string) {
  const client = new Client({
    connectionString: postgres_connection_string
  });

  try {
    await client.connect();
    const query = `UPDATE users SET password = $1 WHERE email = $2`;
    const values = [newPassword, email];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      console.log(`Password updated successfully`);
      return result.rows[0]; // Return the first row (i.e new updated user data)
    } else {
      console.log(`No user found with the given email`);
      return null;
    }
  } catch (err) {
    console.error(`Error during updating password: ${err}`);
    throw err;
  } finally {
    await client.end();
  }
}

// Example usage
updatePassword('vishalsinghpanwar@example.com', 'main_hu_naya_password').catch(console.error);