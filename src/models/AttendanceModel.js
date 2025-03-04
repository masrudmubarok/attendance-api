import pool from "../../config/db.js";

export const clockIn = async (user_id, clockInTime) => {
  const [result] = await pool.execute(
    "INSERT INTO attendance (user_id, clock_in) VALUES (?, ?)",
    [user_id, clockInTime]
  );
  const attendanceId = result.insertId;
  return attendanceId;
};

export const clockOut = async (user_id, clockOutTime) => {
  const [result] = await pool.execute(
    "UPDATE attendance SET clock_out = ? WHERE user_id = ? AND clock_out IS NULL",
    [clockOutTime, user_id]
  );
  return result.affectedRows;
};

export const getAttendanceByUserId = async (user_id) => {
  const [rows] = await pool.execute(
    `SELECT 
      a.id as attendanceId,
      a.user_id,
      u.name AS user_name, 
      u.email AS user_email, 
      a.clock_in, 
      a.clock_out 
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.user_id = ? 
    ORDER BY a.clock_in DESC`,
    [user_id]
  );
  return rows;
};

export const getAllAttendance = async () => {
  const [rows] = await pool.execute(
    `SELECT 
      a.id as attendanceId,
      a.user_id, 
      u.name AS user_name, 
      u.email AS user_email, 
      a.clock_in, 
      a.clock_out 
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.clock_in DESC`
  );
  return rows;
};