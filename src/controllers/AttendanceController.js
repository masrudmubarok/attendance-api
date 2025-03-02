import redis from "../../config/redis.js";
import elasticsearch from "../../config/elasticsearch.js";
import { clockIn, clockOut, getAttendanceByUserId, getAllAttendance } from "../models/AttendanceModel.js";

export const clockInUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const clockInKey = `attendance:${user_id}:clockin`;

    if (await redis.get(clockInKey)) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    const clockInTime = new Date().toISOString();
    const attendanceId = await clockIn(user_id);

    await redis.set(clockInKey, clockInTime, "EX", 86400);

    await redis.del(`attendance:${user_id}`);
    await redis.del("all_attendance");

    await elasticsearch.index({
      index: "attendance",
      id: attendanceId.toString(),
      body: { user_id, clock_in: clockInTime, attendanceId: attendanceId },
    });

    res.status(200).json({ message: "Clock-in recorded successfully" });
  } catch (error) {
    console.error("Error clocking in:", error);
    res.status(500).json({ message: "Error recording clock-in", error: error.message });
  }
};

export const clockOutUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const clockOutKey = `attendance:${user_id}:clockout`;

    if (await redis.get(clockOutKey)) {
      return res.status(400).json({ message: "Already clocked out today" });
    }

    const clockOutTime = new Date().toISOString();
    const attendance = await getAttendanceByUserId(user_id);
    if(!attendance || attendance.length === 0){
        return res.status(400).json({message: "No clock in data found for this user."});
    }
    const latestAttendance = attendance.sort((a,b) => new Date(b.clock_in) - new Date(a.clock_in))[0];

    await redis.set(clockOutKey, clockOutTime, "EX", 86400);
    const affectedRows = await clockOut(user_id);

    if (affectedRows === 0) {
      return res.status(400).json({ message: "No active clock-in found to clock-out." });
    }

    await redis.del(`attendance:${user_id}`);
    await redis.del("all_attendance");

    await elasticsearch.update({
      index: "attendance",
      id: latestAttendance.attendanceId.toString(),
      body: { doc: { clock_out: clockOutTime } },
    });

    res.status(200).json({ message: "Clock-out recorded successfully" });
  } catch (error) {
    console.error("Error clocking out:", error);
    res.status(500).json({ message: "Error recording clock-out", error: error.message });
  }
};

export const getAttendanceByUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const cachedData = await redis.get(`attendance:${user_id}`);

    if (cachedData) {
      return res.status(200).json({ attendance: JSON.parse(cachedData) });
    }

    const attendance = await getAttendanceByUserId(user_id);
    await redis.setex(`attendance:${user_id}`, 600, JSON.stringify(attendance));

    res.status(200).json({ attendance });
  } catch (error) {
    console.error("Error getting attendance by user:", error);
    res.status(500).json({ message: "Error fetching attendance history", error: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const cachedData = await redis.get("all_attendance");

    if (cachedData) {
      return res.status(200).json({ attendance: JSON.parse(cachedData) });
    }

    const attendance = await getAllAttendance();
    await redis.setex("all_attendance", 600, JSON.stringify(attendance));

    res.status(200).json({ attendance });
  } catch (error) {
    console.error("Error getting all attendance report:", error);
    res.status(500).json({ message: "Error fetching all users attendance report", error: error.message });
  }
};

export const searchAttendance = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await elasticsearch.search({
      index: "attendance",
      body: {
        query: { match: { user_id } },
      },
    });
    res.status(200).json({ attendance: result.hits.hits });
  } catch (error) {
    console.error("Error searching attendance:", error);
    res.status(500).json({ message: "Error searching attendance", error: error.message });
  }
};