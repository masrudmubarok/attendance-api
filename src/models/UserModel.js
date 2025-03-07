import pool from "../../config/db.js";

export const createUser = async (email, password, name) => {
  const [result] = await pool.execute("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", [email, password, name]);
  return result;
};

export const getUserByEmail = async (email) => {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

export const getUserProfile = async (userId) => {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
    return rows[0];
};

export const getAllUsers = async () => {
  const [rows] = await pool.execute("SELECT * FROM users");
  return rows;
};