import redis from "../../config/redis.js";
import { clockIn, clockOut, getAttendanceByUserId, getAllAttendance } from "../models/AttendanceModel.js";


export const clockInUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const clockInKey = `attendance:${user_id}:clockin`;

    // Check if already clocked in
    if (await redis.get(clockInKey)) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    // Save to Redis (expires in 1 day) and database
    await redis.set(clockInKey, new Date().toISOString(), "EX", 86400);
    await clockIn(user_id);

    // Clear cache
    await redis.del(`attendance:${user_id}`);
    await redis.del("all_attendance");

    res.status(200).json({ message: "Clock-in recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error recording clock-in", error });
  }
};

export const clockOutUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const clockOutKey = `attendance:${user_id}:clockout`;

    // Check if already clocked out
    if (await redis.get(clockOutKey)) {
      return res.status(400).json({ message: "Already clocked out today" });
    }

    // Save to Redis (expires in 1 day) and database
    await redis.set(clockOutKey, new Date().toISOString(), "EX", 86400);
    await clockOut(user_id);

    // Clear cache
    await redis.del(`attendance:${user_id}`);
    await redis.del("all_attendance");

    res.status(200).json({ message: "Clock-out recorded successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error recording clock-out", error });
  }
};

export const getAttendanceByUser = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Check cache
    const cachedData = await redis.get(`attendance:${user_id}`);
    if (cachedData) {
      return res.status(200).json({ attendance: JSON.parse(cachedData) });
    }

    // Fetch from database and cache
    const attendance = await getAttendanceByUserId(user_id);
    await redis.setex(`attendance:${user_id}`, 600, JSON.stringify(attendance));

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance history", error });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    // Check cache
    const cachedData = await redis.get("all_attendance");
    if (cachedData) {
      return res.status(200).json({ attendance: JSON.parse(cachedData) });
    }

    // Fetch from database and cache
    const attendance = await getAllAttendance();
    await redis.setex("all_attendance", 600, JSON.stringify(attendance));

    res.status(200).json({ attendance });
  } catch (error) {
    res.status(500).json({ message: "Error fetching all users attendance report", error });
  }
};