import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: { type: String }, // "YYYY-MM-DD"
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: { type: String, default: "present" }, // present/absent/late/half-day etc.
    totalHours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
