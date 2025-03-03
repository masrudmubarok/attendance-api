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
 *     summary: Schedule a clock-in reminder
 *     description: Schedule a clock-in reminder for the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The user ID.
 *               clockInReminder:
 *                 type: integer
 *                 description: Timestamp for the clock-in reminder.
 *               email:
 *                 type: string
 *                 description: User's email address.
 *             example:
 *               userId: 123
 *               clockInTime: 1678886400000
 *               email: user@example.com
 *     responses:
 *       200:
 *         description: Clock-in reminder scheduled successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/clock-in-reminder", verifToken, scheduleClockInReminder);

// Route test
router.get("/test", (req, res) => {
    res.send("User route is working properly.");
});

export default router;