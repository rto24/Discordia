import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

export async function findUser(discordId: string) {
  const query = `SELECT * FROM Person WHERE discord_id = $1`;
  const result = await pool.query(query, [discordId]);
  return result.rows[0]; //return existing user info
};

// export async function createUser(discordId: string, username: string, email: string) {
//   const client = await pool.connect();
//   try {
//     await client.query('BEGIN');
//       const currency = 0;
//       const personQuery = `INSERT INTO Person (discord_id, username, email, currency) VALUES ($1, $2, $3, $4) RETURNING *`;
//       const personResult = await client.query(personQuery, [discordId, username, email, currency]);
//       const newUser = personResult.rows[0];

//       const inventoryQuery = `INSERT INTO Inventory (person_id, items) VALUES ($1, $2) RETURNING *`;
//       const inventoryResult = await client.query(inventoryQuery, [newUser.id, []]);
//       const newInventory = inventoryResult.rows[0];

//       await client.query('COMMIT');
//       return { newUser, newInventory };
//   } catch (error) {
//     await client.query('ROLLBACK');
//     console.error(error);
//   } finally {
//     client.release();
//   }
// };

export async function createUser(discordId: string, username: string, email: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const currency = 0;

    const personQuery = `
      INSERT INTO Person (discord_id, username, email, currency)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    const personResult = await client.query(personQuery, [discordId, username, email, currency]);
    const newUser = personResult.rows[0];

    const inventoryQuery = `INSERT INTO Inventory (person_id, items) VALUES ($1, $2) RETURNING *`;
    await client.query(inventoryQuery, [newUser.id, []]);

    await client.query('COMMIT');

    const createdUser = await findUser(newUser.discord_id);
    return createdUser;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

export async function incrementCurrency(discordId: string, amount: number) {
  const user = await findUser(discordId);
  if (user) {
    const newCurrency = Number(user.currency) + amount;
    const query = `UPDATE Person SET currency = $1 WHERE discord_id = $2 RETURNING *`;
    const result = await pool.query(query, [newCurrency, discordId]);
    return result.rows[0];
  } else {
    throw new Error('User not found');
  }
}

export default pool;