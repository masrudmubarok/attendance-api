import { Router } from "express";
import { clockInUser, clockOutUser, getAttendanceReport } from "../controllers/AttendanceController.js";
import { authenticateUser } from "../middlewares/AuthMiddleware.js";

const router = Router();

/**
 * @swagger
 * /attend/clock-in:
 *   post:
 *     summary: Clock-in attendance
 *     description: Employees clock in
 *     tags:
 *       - Attendance
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer <your_jwt_token>"
 *         required: true
 *         description: "JWT token for authentication"
 *     responses:
 *       200:
 *         description: clock-in success
 *       400:
 *         description: clock-in failed
 *       500:
 *        description: server error
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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer your_jwt_token"
 *         required: true
 *         description: "JWT token for authentication"
 *     responses:
 *       200:
 *         description: clock-out success
 *       400:
 *         description: already clocked out
 *       500:
 *         description: server error
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
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *           example: "Bearer <your_jwt_token>"
 *         required: true
 *         description: "JWT token for authentication"
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