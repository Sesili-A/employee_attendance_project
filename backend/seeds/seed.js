import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✔ MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};

// Utility
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateCheckTimes = (status, dateStr) => {
  const date = new Date(dateStr);

  if (status === "absent") {
    return { checkIn: null, checkOut: null, hours: 0 };
  }

  let checkIn, checkOut;

  if (status === "present") {
    const hour = 9;
    const minute = Math.floor(Math.random() * 45);
    checkIn = new Date(date.setHours(hour, minute, 0, 0));

    const workHours = 6 + Math.random() * 3; // 6–9 hours
    checkOut = new Date(checkIn.getTime() + workHours * 3600000);
    return { checkIn, checkOut, hours: Number(workHours.toFixed(2)) };
  }

  if (status === "late") {
    const hour = 10;
    const minute = 15 + Math.floor(Math.random() * 30);
    checkIn = new Date(date.setHours(hour, minute, 0, 0));

    const workHours = 5 + Math.random() * 2; // 5–7 hours
    checkOut = new Date(checkIn.getTime() + workHours * 3600000);
    return { checkIn, checkOut, hours: Number(workHours.toFixed(2)) };
  }

  if (status === "halfday") {
    const hour = 9 + Math.floor(Math.random() * 2); // 9–11 AM
    const minute = Math.floor(Math.random() * 59);
    checkIn = new Date(date.setHours(hour, minute, 0, 0));

    const workHours = 2 + Math.random() * 1.5; // 2–3.5 hours
    checkOut = new Date(checkIn.getTime() + workHours * 3600000);
    return { checkIn, checkOut, hours: Number(workHours.toFixed(2)) };
  }

  return { checkIn: null, checkOut: null, hours: 0 };
};

const seed = async () => {
  await connectDB();

  console.log("✔ Gathering all employees…");
  const employees = await User.find({ role: "employee" });

  if (employees.length === 0) {
    console.log("❌ No employees found. Run user seeder first.");
    process.exit();
  }

  console.log(`✔ ${employees.length} employees found`);

  /* ----------------------------------------
        GENERATE ATTENDANCE: SEPT + OCT 2025
  ---------------------------------------- */

  const start = new Date("2025-09-01");
  const end = new Date("2025-11-28");

  const dayList = [];
  let d = start;

  while (d <= end) {
    const day = d.getDay(); // 0 = Sun, 6 = Sat

    if (day !== 0 && day !== 6) {
      // Weekdays only
      dayList.push(d.toISOString().split("T")[0]);
    }
    d = new Date(d.getTime() + 86400000);
  }

  console.log(`✔ Working days to generate: ${dayList.length}`);

  const statuses = [
    "present",
    "present",
    "present",
    "late",
    "halfday",
    "present",
    "absent",
  ];

  let insertedCount = 0;

  console.log("✔ Generating attendance records…");

  for (const user of employees) {
    for (const dateStr of dayList) {
      const exists = await Attendance.findOne({ userId: user._id, date: dateStr });
      if (exists) continue;

      const status = rand(statuses);
      const { checkIn, checkOut, hours } = generateCheckTimes(status, dateStr);

      await Attendance.create({
        userId: user._id,
        date: dateStr,
        status,
        checkInTime: checkIn,
        checkOutTime: checkOut,
        totalHours: hours,
      });

      insertedCount++;
    }
  }

  console.log(`🎉 Inserted ${insertedCount} attendance records`);
  console.log("✔ September + October 2025 data completed");
  console.log("✔ Weekends skipped");
  console.log("✔ No existing data deleted");

  process.exit();
};

seed();
