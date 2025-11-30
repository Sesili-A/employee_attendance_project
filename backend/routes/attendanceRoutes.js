import express from "express";
import {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyHistory,
  getMySummary,
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendanceCSV,
  getTodayStatusForAll,
} from "../controllers/attendanceController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { requireManager } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// All attendance routes require authentication
router.use(authMiddleware);

/* ============ EMPLOYEE ROUTES ============ */

router.post("/checkin", checkIn);
router.post("/checkout", checkOut);
router.get("/today", getTodayStatus);
router.get("/my-history", getMyHistory);
router.get("/my-summary", getMySummary);

/* ============ MANAGER ROUTES ============ */

// Get all attendance with filters
router.get("/all", requireManager, getAllAttendance);

// Get specific employee attendance
router.get("/employee/:id", requireManager, getEmployeeAttendance);

// Team summary
router.get("/summary", requireManager, getTeamSummary);

// Today status for all employees
router.get("/today-status", requireManager, getTodayStatusForAll);

// Export CSV
router.get("/export", requireManager, exportAttendanceCSV);

export default router;
