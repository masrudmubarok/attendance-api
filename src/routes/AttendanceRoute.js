import { Router } from "express";
import { clockInUser, clockOutUser, getAttendanceReport, searchAttendance, getAttendanceByUser } from "../controllers/AttendanceController.js";
import { verifToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

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
 */

/**
 * @swagger
 * /attend/clock-in:
 *   post:
 *     summary: Clock-in attendance
 *     description: Employees clock in
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clock-in success
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       400:
 *         description: Clock-in failed
 *       500:
 *         description: Server error
 */
router.post("/clock-in", verifToken, clockInUser);

/**
 * @swagger
 * /attend/clock-out:
 *   post:
 *     summary: Clock-out attendance
 *     description: Employees clock out
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clock-out success
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       400:
 *         description: Already clocked out
 *       500:
 *         description: Server error
 */
router.post("/clock-out", verifToken, clockOutUser);

/**
 * @swagger
 * /attend/report:
 *   get:
 *     summary: Get attendance report
 *     description: Retrieve the attendance history of all users
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance history
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/report", verifToken, getAttendanceReport);

/**
 * @swagger
 * /attend/search:
 *   get:
 *     summary: Search attendance by user ID and/or date range
 *     description: Search attendance records by user ID and/or date range
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: User ID to search for
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the search (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the search (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance records
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/search", verifToken, searchAttendance);

/**
 * @swagger
 * /attend/user:
 *   get:
 *     summary: Get attendance by user
 *     description: Retrieve the attendance history of the authenticated user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved attendance history
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/user", verifToken, getAttendanceByUser);

// Test Route
router.get("/test", (req, res) => {
  res.send("Attendance route is working properly.");
});

export default router;