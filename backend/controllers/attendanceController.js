import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

/**
 * Helper: get today's date in YYYY-MM-DD
 */
const getTodayDateStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
/**
 * Employee: POST /api/attendance/checkin
 */
export const checkIn = async (req, res) => {
  try {
    const userId = req.userId;
    const today = getTodayDateStr();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let attendance = await Attendance.findOne({ userId, date: today });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: "Already checked in for today" });
    }

    const now = new Date();

    // ------------------------------
    // LATE LOGIC (10:15 AM threshold)
    // ------------------------------
    const checkinHour = now.getHours();
    const checkinMinute = now.getMinutes();

    let status = "present";
    if (checkinHour > 10 || (checkinHour === 10 && checkinMinute > 15)) {
      status = "late";
    }

    if (!attendance) {
      // first attendance record of the day
      attendance = await Attendance.create({
        userId,
        date: today,
        checkInTime: now,
        status,
        totalHours: 0,
      });
    } else {
      // updating existing attendance doc
      attendance.checkInTime = now;
      attendance.status = status;
      await attendance.save();
    }

    res.status(200).json({
      message: "Check-in successful",
      attendance,
    });

  } catch (err) {
    console.error("checkIn error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * Employee: POST /api/attendance/checkout
 */
export const checkOut = async (req, res) => {
  try {
    const userId = req.userId;
    const today = getTodayDateStr();

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance || !attendance.checkInTime) {
      return res
        .status(400)
        .json({ message: "No check-in found for today to check out" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out for today" });
    }

    const now = new Date();
    attendance.checkOutTime = now;

    // Calculate hours worked
    const diffMs = now - attendance.checkInTime;
    const hours = diffMs / (1000 * 60 * 60);

    attendance.totalHours = Number(hours.toFixed(2));

    /* -----------------------------
       HALF-DAY LOGIC (NEW)
       ----------------------------- */

    if (attendance.totalHours > 0 && attendance.totalHours < 4) {
      attendance.status = "halfday";
    } else {
      // If status wasn't already set earlier
      if (!attendance.status) {
        attendance.status = "present";
      }
    }

    await attendance.save();

    res.status(200).json({
      message: "Check-out successful",
      attendance,
    });
  } catch (err) {
    console.error("checkOut error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * Employee: GET /api/attendance/today
 */
export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const today = getTodayDateStr();

    const attendance = await Attendance.findOne({ userId, date: today });

    if (!attendance) {
      return res.json({
        date: today,
        status: "not-marked",
        checkInTime: null,
        checkOutTime: null,
      });
    }

    res.json({
      date: today,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      totalHours: attendance.totalHours,
    });
  } catch (err) {
    console.error("getTodayStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Employee: GET /api/attendance/my-history?month=MM&year=YYYY
 */
export const getMyHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    let filter = { userId };

    if (month && year) {
      const monthStr = String(month).padStart(2, "0");
      const prefix = `${year}-${monthStr}`;
      filter.date = { $regex: `^${prefix}` };
    }

    const records = await Attendance.find(filter)
      .sort({ date: -1 })
      .lean();

    res.json({ records });
  } catch (err) {
    console.error("getMyHistory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Employee: GET /api/attendance/my-summary?month=MM&year=YYYY
 */
export const getMySummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { month, year } = req.query;

    let filter = { userId };

    if (month && year) {
      const monthStr = String(month).padStart(2, "0");
      const prefix = `${year}-${monthStr}`;
      filter.date = { $regex: `^${prefix}` };
    }

    const records = await Attendance.find(filter);

    const totalDays = records.length;
    const totalHours = records.reduce(
      (sum, rec) => sum + (rec.totalHours || 0),
      0
    );

    res.json({
      totalDays,
      totalHours: Number(totalHours.toFixed(2)),
    });
  } catch (err) {
    console.error("getMySummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== MANAGER APIS ===================== */

/**
 * Manager: GET /api/attendance/all
 * Optional query: ?employeeId=EMP001&date=2025-11-29&status=present
 */
export const getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (date) {
      filter.date = date; // exact date "YYYY-MM-DD"
    }
    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (!user) {
        return res.json({ records: [] });
      }
      filter.userId = user._id;
    }

    const records = await Attendance.find(filter)
      .populate("userId", "name email employeeId department")
      .sort({ date: -1 })
      .lean();

    res.json({ records });
  } catch (err) {
    console.error("getAllAttendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Manager: GET /api/attendance/employee/:id
 * :id = user _id
 */
export const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "name email employeeId department"
    );
    if (!user) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const records = await Attendance.find({ userId: id })
      .sort({ date: -1 })
      .lean();

    res.json({ user, records });
  } catch (err) {
    console.error("getEmployeeAttendance error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Manager: GET /api/attendance/summary?month=MM&year=YYYY
 */
export const getTeamSummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const filter = {};
    if (month && year) {
      const monthStr = String(month).padStart(2, "0");
      const prefix = `${year}-${monthStr}`;
      filter.date = { $regex: `^${prefix}` };
    }

    const employeesCount = await User.countDocuments({ role: "employee" });
    const records = await Attendance.find(filter);

    const totalHours = records.reduce(
      (sum, rec) => sum + (rec.totalHours || 0),
      0
    );

    res.json({
      totalEmployees: employeesCount,
      totalAttendanceRecords: records.length,
      totalHours: Number(totalHours.toFixed(2)),
    });
  } catch (err) {
    console.error("getTeamSummary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Manager: GET /api/attendance/today-status
 * List who is present today
 */
export const getTodayStatusForAll = async (req, res) => {
  try {
    const today = getTodayDateStr();

    const records = await Attendance.find({ date: today })
      .populate("userId", "name email employeeId department")
      .lean();

    res.json({
      date: today,
      count: records.length,
      records,
    });
  } catch (err) {
    console.error("getTodayStatusForAll error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Manager: GET /api/attendance/export
 * Optional query: ?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=EMP001
 * Returns CSV text
 */
export const exportAttendanceCSV = async (req, res) => {
  try {
    const { start, end, employeeId } = req.query;

    const filter = {};

    if (start && end) {
      filter.date = { $gte: start, $lte: end };
    }

    if (employeeId) {
      const user = await User.findOne({ employeeId });
      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }
      filter.userId = user._id;
    }

    const records = await Attendance.find(filter)
      .populate("userId", "name email employeeId department")
      .sort({ date: 1 });

    const header = [
      "EmployeeName",
      "EmployeeId",
      "Department",
      "Email",
      "Date",
      "Status",
      "CheckInTime",
      "CheckOutTime",
      "TotalHours",
    ];

    const rows = records.map((rec) => {
      const user = rec.userId || {};
      const toIso = (dt) => (dt ? dt.toISOString() : "");
      return [
        user.name || "",
        user.employeeId || "",
        user.department || "",
        user.email || "",
        rec.date || "",
        rec.status || "",
        toIso(rec.checkInTime),
        toIso(rec.checkOutTime),
        rec.totalHours?.toString() || "0",
      ].join(",");
    });

    const csv = [header.join(","), ...rows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance_report.csv");
    res.send(csv);
  } catch (err) {
    console.error("exportAttendanceCSV error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
