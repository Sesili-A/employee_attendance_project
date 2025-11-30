import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../features/attendance/attendanceSlice";
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
  isSameDay
} from "date-fns";

const statusColors = {
  present: "#2ecc71", // green
  absent: "#e74c3c",  // red
  late: "#f1c40f",    // yellow
  halfday: "orange",  // orange
};

const EmployeeHistory = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.attendance);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("calendar");

  const month = currentMonth.getMonth() + 1;
  const year = currentMonth.getFullYear();

  useEffect(() => {
    dispatch(fetchHistory({ month, year }));
  }, [month, year, dispatch]);

  // BUILD CALENDAR GRID
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);

  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const rows = [];
  let day = startDate;

  while (day <= endDate) {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const dateStr = format(day, "yyyy-MM-dd");

      const record = history.find((rec) => rec.date === dateStr);

      days.push({
        date: new Date(day),
        formatted: format(day, "d"),
        record,
      });

      day = addDays(day, 1);
    }

    rows.push(days);
  }

  const openModal = (rec) => {
    if (rec) {
      setSelectedRecord(rec);
      setShowModal(true);
    }
  };

  return (
    <div className="main-content">
      <div className="card">

        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            className={view === "calendar" ? "active" : ""}
            onClick={() => setView("calendar")}
          >
            Calendar View
          </button>

          <button
            className={view === "table" ? "active" : ""}
            onClick={() => setView("table")}
          >
            Table View
          </button>
        </div>

        {/* -------------------------
            CALENDAR VIEW MODE
        -------------------------- */}
        {view === "calendar" && (
          <>
            <h2>Attendance Calendar</h2>

            {/* Month Navigation */}
            <div className="calendar-nav">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                ◀ Prev
              </button>

              <h3>{format(currentMonth, "MMMM yyyy")}</h3>

              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                Next ▶
              </button>
            </div>

            {/* Week Header */}
            <div className="calendar-header">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="calendar-header-cell">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {rows.map((week, wi) => (
                <div key={wi} className="calendar-row">
                  {week.map((day, di) => {
                    const isCurrent = isSameMonth(day.date, monthStart);
                    const isToday = isSameDay(day.date, new Date());

                    const bg = day.record
                      ? statusColors[day.record.status] || "#ccc"
                      : "#f0f0f0";

                    return (
                      <div
                        key={di}
                        className={`calendar-cell 
                          ${isCurrent ? "" : "disabled"} 
                          ${isToday ? "today" : ""}`}
                        style={{ background: day.record ? bg : "#f0f0f0" }}
                        onClick={() => openModal(day.record)}
                      >
                        <span className="date-label">{day.formatted}</span>
                      </div>
                    );
                  })}
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
          </>
        )}

        {/* -------------------------
            TABLE VIEW MODE
        -------------------------- */}
        {view === "table" && (
          <>
            <h2>Attendance Table</h2>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="table-wrapper">
                <table border="1" width="100%" cellPadding="8">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Total Hours</th>
                    </tr>
                  </thead>

                  <tbody>
                    {history.map((rec) => (
                      <tr key={rec._id}>
                        <td>{rec.date}</td>
                        <td>{rec.status}</td>

                        <td>
                          {rec.checkInTime
                            ? new Date(rec.checkInTime).toLocaleTimeString()
                            : "-"}
                        </td>

                        <td>
                          {rec.checkOutTime
                            ? new Date(rec.checkOutTime).toLocaleTimeString()
                            : "-"}
                        </td>

                        <td>{rec.totalHours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Attendance Details</h3>

              <p><b>Date:</b> {selectedRecord.date}</p>
              <p><b>Status:</b> {selectedRecord.status}</p>

              <p>
                <b>Check-In:</b>{" "}
                {selectedRecord.checkInTime
                  ? new Date(selectedRecord.checkInTime).toLocaleTimeString()
                  : "-"}
              </p>

              <p>
                <b>Check-Out:</b>{" "}
                {selectedRecord.checkOutTime
                  ? new Date(selectedRecord.checkOutTime).toLocaleTimeString()
                  : "-"}
              </p>

              <p><b>Total Hours:</b> {selectedRecord.totalHours}</p>

              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeHistory;
