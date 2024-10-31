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

export async function createUser(discordId: string, username: string, email: string) {
  const currency = 0;
  const query = `INSERT INTO Person (discord_id, username, email, currency) VALUES ($1, $2, $3, $4) RETURNING *`;
  const result = await pool.query(query, [discordId, username, email, currency]);
  return result.rows[0]; //return new user added
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