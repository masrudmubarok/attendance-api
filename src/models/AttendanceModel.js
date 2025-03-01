import pool from "../../config/db.js";

export const clockIn = async (user_id) => {
  await pool.execute(
    "INSERT INTO attendance (user_id, clock_in) VALUES (?, NOW())",
    [user_id]
  );
};

export const clockOut = async (user_id) => {
  const [result] = await pool.execute(
    "UPDATE attendance SET clock_out = NOW() WHERE user_id = ? AND clock_out IS NULL",
    [user_id]
  );
  return result.affectedRows;
};

export const getAttendanceByUserId = async (user_id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM attendance WHERE user_id = ? ORDER BY clock_in DESC",
    [user_id]
  );
  return rows;
};

export const getAllAttendance = async () => {
  const [rows] = await pool.execute(
    `SELECT 
      a.user_id, 
      u.name AS user_name, 
      u.email AS user_email, 
      a.clock_in, 
      a.clock_out 
    FROM attendance a
    JOIN users u ON a.user_id = u.id
    ORDER BY a.clock_in DESC`
  );
  return rows;
};