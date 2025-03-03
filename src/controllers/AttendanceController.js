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

    redis.publish("clockEvents", JSON.stringify({ userId: user_id, eventType: "clockIn", time: clockInTime }));

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

    if (!attendance || attendance.length === 0) {
      return res.status(400).json({ message: "No clock in data found for this user." });
    }

    const latestAttendance = attendance.sort((a, b) => new Date(b.clock_in) - new Date(a.clock_in))[0];

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

    redis.publish("clockEvents", JSON.stringify({ userId: user_id, eventType: "clockOut", time: clockOutTime }));

    res.status(200).json({ message: "Clock-out recorded successfully" });
  } catch (error) {
    console.error("Error clocking out:", error);
    res.status(500).json({ message: "Error recording clock-out", error: error.message });
  }
};

export const getAttendanceByUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const cacheKey = `attendance:${user_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({ attendance: JSON.parse(cachedData) });
    }

    const attendance = await getAttendanceByUserId(user_id);
    await redis.setex(cacheKey, 600, JSON.stringify(attendance));

    res.status(200).json({ attendance });
  } catch (error) {
    console.error("Error getting attendance by user:", error);
    res.status(500).json({ message: "Error fetching attendance history", error: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const cacheKey = "all_attendance";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({ attendance: JSON.parse(cachedData) });
    }

    const attendance = await getAllAttendance();
    await redis.setex(cacheKey, 600, JSON.stringify(attendance));

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
        query: { match: { user_id: user_id } },
      },
    });
    res.status(200).json({ attendance: result.hits.hits.map(hit => hit._source) });
  } catch (error) {
    console.error("Error searching attendance:", error);
    res.status(500).json({ message: "Error searching attendance", error: error.message });
  }
};