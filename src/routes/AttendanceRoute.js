import { Router } from "express";
import { clockInUser, clockOutUser, getAttendanceReport } from "../controllers/AttendanceController.js";
import { authenticateUser } from "../middlewares/AuthMiddleware.js";

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
 *
 * /attend/clock-in:
 *   post:
 *     summary: Clock-in attendance
 *     description: Employees clock in
 *     tags:
 *       - Attendance
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
router.post("/clock-in", authenticateUser, clockInUser);

/**
 * @swagger
 * /attend/clock-out:
 *   post:
 *     summary: Clock-out attendance
 *     description: Employees clock out
 *     tags:
 *       - Attendance
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
router.post("/clock-out", authenticateUser, clockOutUser);

/**
 * @swagger
 * /attend/report:
 *   get:
 *     summary: Get attendance report
 *     description: Retrieve the attendance history of the authenticated user
 *     tags:
 *       - Attendance
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
router.get("/report", authenticateUser, getAttendanceReport);

// Route test
router.get("/test", (req, res) => {
    res.send("Attendance route is working properly.");
});

export default router;
