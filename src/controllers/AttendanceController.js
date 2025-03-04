import redis from "../../config/redis.js";
import elasticsearch from "../../config/elasticsearch.js";
import { clockIn, clockOut, getAttendanceByUserId, getAllAttendance } from "../models/AttendanceModel.js";
import { getUserProfile } from "../models/UserModel.js";
import moment from "moment-timezone";

export const clockInUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const clockInKey = `attendance:${user_id}:clockin`;

    if (await redis.get(clockInKey)) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    const timezone = req.body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const clockInTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");

    const attendanceId = await clockIn(user_id, clockInTime);

    const user = await getUserProfile(user_id);

    await redis.set(clockInKey, clockInTime, "EX", 86400);

    await redis.del(`attendance:${user_id}`);
    await redis.del("all_attendance");

    const attendanceData = {
      user_id: user_id,
      user_name: user.name,
      user_email: user.email,
      clock_in: clockInTime,
      clock_out: null,
      attendanceId: attendanceId,
    };

    await elasticsearch.index({
      index: "attendance",
      id: attendanceId.toString(),
      body: attendanceData,
    });

    await redis.setex(`attendance:${attendanceId}`, 600, JSON.stringify(attendanceData));

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

    const timezone = req.body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    const clockOutTime = moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss");

    const attendance = await getAttendanceByUser(user_id);

    if (!attendance || attendance.length === 0) {
      return res.status(400).json({ message: "No clock in data found for this user." });
    }

    const latestAttendance = attendance.sort((a, b) => new Date(b.clock_in) - new Date(a.clock_in))[0];

    await redis.set(clockOutKey, clockOutTime, "EX", 86400);
    const affectedRows = await clockOut(user_id, clockOutTime);

    if (affectedRows === 0) {
      return res.status(400).json({ message: "No active clock-in found to clock-out." });
    }

    await redis.del(`attendance:${user_id}`);
    await redis.del("all_attendance");

    const updatedAttendanceData = {
      ...JSON.parse(await redis.get(`attendance:${latestAttendance.attendanceId}`)),
      clock_out: clockOutTime,
    };

    await elasticsearch.update({
      index: "attendance",
      id: latestAttendance.attendanceId.toString(),
      body: { doc: { clock_out: clockOutTime } },
    });

    await redis.setex(`attendance:${latestAttendance.attendanceId}`, 600, JSON.stringify(updatedAttendanceData));

    redis.publish("clockEvents", JSON.stringify({ userId: user_id, eventType: "clockOut", time: clockOutTime }));

    res.status(200).json({ message: "Clock-out recorded successfully" });
  } catch (error) {
    console.error("Error clocking out:", error);
    res.status(500).json({ message: "Error recording clock-out", error: error.message });
  }
};

export const getAttendanceByUser = async (user_id, req, res) => {
  try {
    const cacheKey = `attendance:user:${user_id}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      if (res) {
        return res.status(200).json({ attendance: parsedData });
      } else {
        return parsedData;
      }
    }

    const attendance = await getAttendanceByUserId(user_id);

    if (!attendance || attendance.length === 0) {
      const dbAttendance = await getAllAttendance();
      const filteredAttendance = dbAttendance.filter(item => item.user_id === user_id);
      if (filteredAttendance.length === 0) {
        if (res) {
          return res.status(404).json({ message: "Attendance not found." });
        } else {
          return null;
        }
      }
      await redis.setex(cacheKey, 600, JSON.stringify(filteredAttendance));
      if (res) {
        return res.status(200).json({ attendance: filteredAttendance });
      } else {
        return filteredAttendance;
      }
    }

    const attendanceData = {
      user_id: attendance[0].user_id,
      user_name: attendance[0].user_name,
      user_email: attendance[0].user_email,
      clock_in: attendance[0].clock_in,
      clock_out: attendance[0].clock_out,
      attendanceId: attendance[0].attendanceId,
    };
    const attendanceArray = [attendanceData];

    await redis.setex(cacheKey, 600, JSON.stringify(attendanceArray));

    if (res) {
      return res.status(200).json({ attendance: attendanceArray });
    } else {
      return attendanceArray;
    }
  } catch (error) {
    console.error("Error getting attendance by user id:", error);
    if (res) {
      return res.status(500).json({ message: "Error fetching attendance history", error: error.message });
    } else {
      return null;
    }
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
    const { user_id, startDate, endDate } = req.query;
    const query = {
      bool: {
        must: [],
      },
    };

    if (user_id) {
      query.bool.must.push({ match: { user_id: user_id } });
    }

    if (startDate && endDate) {
      query.bool.must.push({
        range: {
          clock_in: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    }

    const result = await elasticsearch.search({
      index: "attendance",
      body: { query },
    });

    res.status(200).json({ attendance: result.hits.hits.map(hit => hit._source) });
  } catch (error) {
    console.error("Error searching attendance:", error);
    res.status(500).json({ message: "Error searching attendance", error: error.message });
  }
};