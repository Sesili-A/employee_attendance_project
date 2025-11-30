// frontend/src/pages/ManagerReports.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllAttendance,
  exportCSV,
} from "../features/attendance/attendanceSlice";
import { Link } from "react-router-dom";

const ManagerReports = () => {
  const dispatch = useDispatch();
  const { allRecords } = useSelector((state) => state.attendance);

  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    dispatch(fetchAllAttendance({}));
  }, [dispatch]);

  // Filter records client-side by employee, status, date range
  const filteredRecords = useMemo(() => {
    return allRecords.filter((rec) => {
      if (employeeId && rec.userId?.employeeId !== employeeId) return false;
      if (status && rec.status !== status) return false;

      if (start) {
        if (!rec.date || rec.date < start) return false;
      }
      if (end) {
        if (!rec.date || rec.date > end) return false;
      }

      return true;
    });
  }, [allRecords, employeeId, status, start, end]);

  const handleExport = async () => {
    // CSV export uses backend date range + emp filter
    const resultAction = await dispatch(
      exportCSV({ start, end, employeeId: employeeId || undefined })
    );

    if (!resultAction.payload) return;

    const blob = new Blob([resultAction.payload], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="main-content">
      <div className="card">
        <h2>Reports &amp; Exports</h2>
        <p>Filter attendance data and download CSV reports.</p>

        <div style={{ marginBottom: 16 }}>
          <Link to="/manager">&larr; Back to Manager Dashboard</Link>
        </div>

        {/* FILTERS */}
        <div className="filter-row">
          <div>
            <label>Employee ID</label>
            <input
              placeholder="EMP001"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          <div>
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Any</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="halfday">Half Day</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <div>
            <label>Start Date</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14, marginTop: 6 }}>
          <button onClick={handleExport}>Export Filtered CSV</button>
        </div>

        {/* TABLE */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Emp ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 16, textAlign: "center" }}>
                    No records for selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec._id}>
                    <td>{rec.userId?.name || "-"}</td>
                    <td>{rec.userId?.employeeId || "-"}</td>
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
                    <td>{rec.totalHours ?? "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerReports;
