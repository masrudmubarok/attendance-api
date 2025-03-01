import pool from "../../config/db.js";

const createUserTable = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

await createUserTable();

export const createUser = async (email, password, name) => {
  const [result] = await pool.execute("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", [email, password, name]);
  return result;
};

export const getUserByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};