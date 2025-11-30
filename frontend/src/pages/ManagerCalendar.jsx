import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
} from "date-fns";
import { Link } from "react-router-dom";

const ManagerCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [attendance, setAttendance] = useState([]);

  const month = currentMonth.getMonth() + 1;
  const year = currentMonth.getFullYear();

  useEffect(() => {
    loadData();
  }, [month, year]);

  const loadData = async () => {
    try {
      const res = await axiosClient.get(
        `/attendance/all?month=${month}&year=${year}`
      );
      setAttendance(res.data.records || []);
    } catch (error) {
      console.error("Failed to load calendar:", error);
    }
  };

  // Build calendar dates
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const rows = [];
  let day = startDate;

  while (day <= endDate) {
    const week = [];

    for (let i = 0; i < 7; i++) {
      const dateStr = format(day, "yyyy-MM-dd");

      // Counts
      const dayRecords = attendance.filter((rec) => rec.date === dateStr);
      const counts = {
        present: dayRecords.filter((r) => r.status === "present").length,
        late: dayRecords.filter((r) => r.status === "late").length,
        half: dayRecords.filter((r) => r.status === "halfday").length,
        absent: dayRecords.filter((r) => r.status === "absent").length,
      };

      week.push({
        date: new Date(day),
        dateNum: format(day, "d"),
        counts,
      });

      day = addDays(day, 1);
    }

    rows.push(week);
  }

  return (
    <div className="manager-calendar-container">
      <div className="manager-calendar-box">
        <h2 className="manager-calendar-title" >Manager Attendance Calendar</h2>

        

        {/* Navigation */}
        <div className="calendar-nav">
          <button
            className="nav-btn"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            ◀ Prev
          </button>

          <h3>{format(currentMonth, "MMMM yyyy")}</h3>

          <button
            className="nav-btn"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            Next ▶
          </button>
        </div>

        {/* Calendar Header */}
        <div className="manager-calendar-header">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="header-cell">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="manager-calendar-grid">
          {rows.map((week, wi) => (
            <div key={wi} className="week-row">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`manager-calendar-cell ${
                    isSameMonth(day.date, monthStart) ? "" : "disabled"
                  }`}
                >
                  {/* Date */}
                  <div className="date-number">{day.dateNum}</div>

                  {/* Attendance Counts */}
                  <div className="day-stats">
                    {day.counts.present > 0 && (
                      <div className="stat present">
                        Present: {day.counts.present}
                      </div>
                    )}
                    {day.counts.late > 0 && (
                      <div className="stat late">
                        Late: {day.counts.late}
                      </div>
                    )}
                    {day.counts.half > 0 && (
                      <div className="stat half">
                        Half: {day.counts.half}
                      </div>
                    )}
                    {day.counts.absent > 0 && (
                      <div className="stat absent">
                        Absent: {day.counts.absent}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* LEGEND */}
            <div className="legend" style={{ marginTop: "20px" }}>
            <div><span className="dot" style={{ background: "#2ecc71" }}></span> Present</div>
            <div><span className="dot" style={{ background: "#f1c40f" }}></span> Late</div>
            <div><span className="dot" style={{ background: "orange" }}></span> Half Day</div>
            <div><span className="dot" style={{ background: "#e74c3c" }}></span> Absent</div>
            </div>

            {/* BUTTON BELOW CALENDAR */}
            <div style={{ marginTop: "30px", textAlign: "center" }}>
            <Link to="/manager">
                <button
                style={{
                    background: "#0a3d62",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "16px"
                }}
                >
                ⬅ Back to Manager Dashboard
                </button>
            </Link>
</div>

      </div>
    </div>
  );
};

export default ManagerCalendar;
