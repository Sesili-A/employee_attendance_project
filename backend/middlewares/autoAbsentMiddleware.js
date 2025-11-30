import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

const getTodayDateStr = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Memory variable to avoid running multiple times
let lastRunDate = null;

const autoAbsentMiddleware = async (req, res, next) => {
  try {
    const today = getTodayDateStr();

    // Already processed today → skip
    if (lastRunDate === today) {
      return next();
    }

    lastRunDate = today; // mark as done

    // Step 1: Get all employees
    const employees = await User.find({ role: "employee" }).lean();

    // Step 2: Get today's attendance
    const todaysRecords = await Attendance.find({ date: today }).lean();

    const attendedUserIds = todaysRecords.map((r) => String(r.userId));

    // Step 3: Mark ABSENT for users missing attendance
    for (const emp of employees) {
      if (!attendedUserIds.includes(String(emp._id))) {
        await Attendance.create({
          userId: emp._id,
          date: today,
          status: "absent",
          checkInTime: null,
          checkOutTime: null,
          totalHours: 0
        });
      }
    }

    console.log("AUTO-ABSENT DONE FOR:", today);

    next();
  } catch (err) {
    console.error("autoAbsentMiddleware error:", err);
    next();
  }
};

export default autoAbsentMiddleware;
