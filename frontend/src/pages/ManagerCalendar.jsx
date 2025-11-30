import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAttendance,
  fetchTeamSummary,
} from "../features/attendance/attendanceSlice";

import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, format, isSameMonth, isSameDay
} from "date-fns";

// color map for days
const statusColors = {
  present: "#2ecc71",
  absent: "#e74c3c",
  late: "#f1c40f",
  halfday: "orange",
};

const ManagerCalendar = () => {
  const dispatch = useDispatch();
  const { allRecords } = useSelector((state) => state.attendance);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayEmployees, setDayEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const month = currentMonth.getMonth() + 1;
  const year = currentMonth.getFullYear();

  useEffect(() => {
    dispatch(fetchAllAttendance({ month, year }));
    dispatch(fetchTeamSummary({ month, year }));
  }, [month, year, dispatch]);

  // build calendar
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let day = startDate;

  while (day <= endDate) {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const dateString = format(day, "yyyy-MM-dd");
      const recs = allRecords.filter((r) => r.date === dateString);

      let cellColor = "#f0f0f0";

      if (recs.length > 0) {
        if (recs.some((r) => r.status === "halfday")) cellColor = statusColors.halfday;
        else if (recs.some((r) => r.status === "late")) cellColor = statusColors.late;
        else if (recs.some((r) => r.status === "present")) cellColor = statusColors.present;
      } else {
        cellColor = statusColors.absent;
      }

      days.push({
        date: new Date(day),
        formatted: format(day, "d"),
        records: recs,
        color: cellColor,
      });

      day = addDays(day, 1);
    }

    rows.push(days);
  }

  const openModal = (cell) => {
    setSelectedDate(cell.date);
    setDayEmployees(cell.records);
    setShowModal(true);
  };

  return (
    <div className="main-content">
      <div className="card">

        <h2>Manager Attendance Calendar</h2>

        {/* Month nav */}
        <div className="calendar-nav">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            ◀ Prev
          </button>

          <h3>{format(currentMonth, "MMMM yyyy")}</h3>

          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            Next ▶
          </button>
        </div>

        {/* Week header */}
        <div className="calendar-header">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="calendar-header-cell">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="calendar-grid">
          {rows.map((week, wi) => (
            <div key={wi} className="calendar-row">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className={`calendar-cell ${
                    isSameMonth(cell.date, monthStart) ? "" : "disabled"
                  } ${isSameDay(cell.date, new Date()) ? "today" : ""}`}
                  style={{ background: cell.color }}
                  onClick={() => openModal(cell)}
                >
                  <span className="date-label">{cell.formatted}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="legend">
          <div><span className="dot" style={{ background: "#2ecc71" }}></span> Present</div>
          <div><span className="dot" style={{ background: "#e74c3c" }}></span> Absent</div>
          <div><span className="dot" style={{ background: "#f1c40f" }}></span> Late</div>
          <div><span className="dot" style={{ background: "orange" }}></span> Half Day</div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{format(selectedDate, "yyyy-MM-dd")}</h3>
              <h4>Employee Attendance:</h4>

              {dayEmployees.length === 0 ? (
                <p>No attendance records</p>
              ) : (
                dayEmployees.map((rec) => (
                  <div key={rec._id} style={{ marginBottom: 10 }}>
                    <p><b>{rec.userId?.name}</b> ({rec.userId?.employeeId})</p>
                    <p>Status: {rec.status}</p>
                    <p>
                      Check-In:{" "}
                      {rec.checkInTime
                        ? new Date(rec.checkInTime).toLocaleTimeString()
                        : "-"}
                    </p>
                    <p>
                      Check-Out:{" "}
                      {rec.checkOutTime
                        ? new Date(rec.checkOutTime).toLocaleTimeString()
                        : "-"}
                    </p>
                    <p>Total Hours: {rec.totalHours}</p>
                    <hr />
                  </div>
                ))
              )}

              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManagerCalendar;
