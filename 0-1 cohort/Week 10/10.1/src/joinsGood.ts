//fetch me a users details and their address (users table and addresses table is separate)

//Good approach ~ Single Database Query for fetching both users details and their corresponding addresses together using 'JOIN'
import { Client } from 'pg';

// Async function to fetch user data and their address together
async function getUserDetailsWithAddress(userId: string) {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'mysecretpassword',
  });

  try {
    await client.connect();

    // Fetch both user details and their corresponding address details together using 'JOIN'
    const query = `
            SELECT u.id, u.username, u.email, a.city, a.country, a.street, a.pincode
            FROM users u
            JOIN addresses a ON u.id = a.user_id
            WHERE u.id = $1
        `;
    const result = await client.query(query, [userId]);

    if (result.rows.length > 0) {
      console.log('User and address found:', result.rows[0]);
      return result.rows[0];
    } else {
      console.log('No user or address found with the given ID.');
      return null;
    }
  } catch (err) {
    console.error('Error during fetching user and address:', err);
    throw err;
  } finally {
    await client.end();
  }
}
getUserDetailsWithAddress("1");