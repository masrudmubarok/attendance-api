import redis from "../../config/redis.js";
import { getUserProfile, getAllUsers } from "../models/UserModel.js";
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
    const users = await getAllUsers();

    if (users && users.length > 0) {
      const emails = users
        .filter((user) => user.email)
        .map((user) => user.email);

      if (emails.length > 0) {
        try {
          await sendEmail(emails, "Clock-in Reminder", "It's time to clock-in guys!");
          console.log("Reminder email sent to all users.");
          res.status(200).json({ message: "Reminder email sent to all users." });
        } catch (emailError) {
          console.error("Error sending reminder email to all users:", emailError);
          res.status(500).json({ message: "Error sending reminder email." });
        }
      } else {
        console.warn("No users with valid email addresses found.");
        res.status(404).json({ message: "No users with valid email addresses found." });
      }
    } else {
      res.status(404).json({ message: "No users found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error scheduling reminder email", error: error.message });
  }
};