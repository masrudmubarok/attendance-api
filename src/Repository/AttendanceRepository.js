const db = require("../../config").db;
const Attendance = require("../Entity/AttendanceEntity");

module.exports = {
  createAttendance: async ({ userId, clockIn }) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO attendance (user_id, clock_in) VALUES (?, ?)",
        [userId, clockIn]
      );
      const attendance = await module.exports.getAttendanceById(result.insertId);
      return attendance;
    } catch (error) {
      console.error("Error createing new attendance:", error);
      throw new Error("Database connection error");
    }
  },

  updateAttendance: async ({ id, clockOut }) => {
    try {
      await db.execute(
        "UPDATE attendance SET clock_out = ? WHERE id = ?",
        [clockOut, id]
      );
      const attendance = await module.exports.getAttendanceById(id);
      return attendance;
    } catch (error) {
      console.error("Error updating attendance:", error);
      throw new Error("Database connection error");
    }
  },

  getAttendanceById: async (id) => {
    try {
      const [rows] = await db.execute("SELECT * FROM attendance WHERE id = ?", [id]);
      if (rows.length) {
        const row = rows[0];
        return new Attendance(row.id, row.user_id, row.clock_in, row.clock_out); // Return entity
      }
      return null;
    } catch (error) {
      console.error("Error getting attendance by id:", error);
      throw new Error("Database conection error");
    }
  },

  getAttendanceReport: async (userId, startDate, endDate) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM attendance WHERE user_id = ? AND clock_in BETWEEN ? AND ?",
        [userId, startDate, endDate]
      );
      return rows.map(row => new Attendance(row.id, row.user_id, row.clock_in, row.clock_out)); // Return array of entities
    } catch (error) {
      console.error("Error getting attendance report:", error);
      throw new Error("Database connection error");
    }
  },
};