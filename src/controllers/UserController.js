import redis from "../../config/redis.js";
import { getUserProfile } from "../models/UserModel.js";
import sendEmail from "../../config/email.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `userProfile:${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({ profile: JSON.parse(cachedData) });
    }

    const profile = await getUserProfile(userId);
    await redis.setex(cacheKey, 3600, JSON.stringify(profile));

    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
};

export const scheduleClockInReminder = async (req, res) => {
  try {
    const { userId, reminderTime, email } = req.body;
    const reminderKey = `clockInReminder:${userId}`;
    const expirationTime = Math.floor((reminderTime - Date.now()) / 1000);

    await redis.set(reminderKey, "reminder", "EX", expirationTime);

    res.status(200).json({ message: "Reminder scheduled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error scheduling reminder", error: error.message });
  }
};

redis.on("pmessage", (pattern, channel, message) => {
    if (message === "expired" && channel.startsWith("__keyevent@0__:expired:clockInReminder:")) {
      const userId = channel.split(":")[3];
      getUserProfile(userId)
        .then((user) => {
          if (user && user.email) {
            sendEmail(user.email, "Clock-in Reminder", "It's time to clock-in guys!");
          } else {
            console.error(`User with ID ${userId} not found or email is missing.`);
          }
        })
        .catch((error) => {
          console.error(`Error getting user profile for ID ${userId}:`, error);
        });
    }
});