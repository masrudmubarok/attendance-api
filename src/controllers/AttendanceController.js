import { clockIn, clockOut, getAttendanceByUserId, getAllAttendance } from "../models/AttendanceModel.js";

export const clockInUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    await clockIn(user_id);
    res.status(200).json({ message: "Clock-in recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error recording clock-in", error });
  }
};

export const clockOutUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const affectedRows = await clockOut(user_id);

    if (affectedRows === 0) return res.status(400).json({ message: "No active clock-in found" });

    res.status(200).json({ message: "Clock-out recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error recording clock-out", error });
  }
};

export const getAttendanceByUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const attendance = await getAttendanceByUserId(user_id);
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance history", error });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const attendance = await getAllAttendance();
    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all users attendance report", error });
  }
};