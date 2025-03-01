import { Router } from "express";
import { clockInUser, clockOutUser, getAttendanceReport } from "../controllers/AttendanceController.js";
import { authenticateUser } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/clock-in", authenticateUser, clockInUser);
router.post("/clock-out", authenticateUser, clockOutUser);
router.get("/history", authenticateUser , getAttendanceReport);

// Route test
router.get("/test", (req, res) => {
    res.send("Attendance route is working properly.");
  });

export default router;