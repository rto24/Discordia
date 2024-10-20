import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});

export async function findUser(discordId: string) {
  const result = await pool.query(`SELECT * FROM Person WHERE discord_id = $1`, [discordId]);
  return result.rows[0]; //return existing user info
}

export async function createUser(discordId: string, username: string, email: string) {
  const query = `INSERT INTO Person (discord_id, username, email) VALUES ($1, $2, $3) RETURNING *`;
  const result = await pool.query(query, [discordId, username, email]);
  return result.rows[0]; //return new user added
}

export default pool;