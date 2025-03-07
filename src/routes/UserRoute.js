import express from "express";
import { getProfile, scheduleClockInReminder } from "../controllers/UserController.js";
import { verifToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         This API uses JWT (JSON Web Token) for authentication. 
 *
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/profile", verifToken, getProfile);

/**
 * @swagger
 * /user/clock-in-reminder:
 *   post:
 *     summary: Schedule a clock-in reminder for all users
 *     description: Sends a clock-in reminder to all users.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Clock-in reminder scheduled for all users.
 *       404:
 *         description: No users found.
 *       500:
 *         description: Server error.
 */
router.post("/clock-in-reminder", scheduleClockInReminder);

// Route test
router.get("/test", (req, res) => {
    res.send("User route is working properly.");
});

export default router;