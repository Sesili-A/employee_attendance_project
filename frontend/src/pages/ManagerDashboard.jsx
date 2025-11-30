import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import {
  fetchAllAttendance,
  fetchTodayStatusAll,
  fetchTeamSummary,
  exportCSV,
} from "../features/attendance/attendanceSlice";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { allRecords, todayAll, teamSummary } = useSelector(
    (state) => state.attendance
  );

  // Filters
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  // Summary filter defaults
  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2025);

  // Initial data load
  useEffect(() => {
    dispatch(fetchAllAttendance({}));
    dispatch(fetchTodayStatusAll());
    dispatch(fetchTeamSummary({ month, year }));
  }, [dispatch, month, year]);

  const handleFilter = () => {
    dispatch(fetchAllAttendance({ employeeId, date, status }));
  };

  const handleCSV = async () => {
    const csv = await dispatch(
      exportCSV({ start: "2025-11-01", end: "2025-11-30", employeeId })
    );

    const blob = new Blob([csv.payload], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance_report.csv";
    link.click();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="main-content">
      <div className="card">
        
        <h2>Manager Dashboard</h2>
          <p>Welcome, {user.name}</p>

          <button onClick={handleLogout}>Logout</button>

          <button 
            style={{ marginTop: "10px", marginBottom: "20px",marginLeft:"30px" }}
            onClick={() => navigate("/manager/calendar")}
          >
            📅 View Calendar
          </button>

          <hr />


        {/* TODAY'S STATUS */}
        <h3>Today's Status</h3>
        {todayAll && (
          <div
            className="card"
            style={{
              background: "#eef7ff",
              border: "1px solid #bcdfff",
              marginBottom: 25,
            }}
          >
            <h4>Present Today</h4>
            <p style={{ fontSize: 22, margin: 0 }}>
              <strong>{todayAll.count}</strong> employees checked in today
            </p>
          </div>
        )}

        <hr />

        {/* TEAM SUMMARY */}
        <h3>Team Summary</h3>
        <div style={{ display: "flex", gap: 20, marginBottom: 25 }}>
          <div className="card" style={{ flex: 1 }}>
            <h4>Total Employees</h4>
            <p style={{ fontSize: 22 }}>{teamSummary?.totalEmployees}</p>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <h4>Total Records</h4>
            <p style={{ fontSize: 22 }}>
              {teamSummary?.totalAttendanceRecords}
            </p>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <h4>Total Hours</h4>
            <p style={{ fontSize: 22 }}>{teamSummary?.totalHours}</p>
          </div>
        </div>

        <hr />

        {/* FILTER SECTION */}
        <h3>Attendance Filters</h3>

        <div className="card" style={{ marginBottom: 25 }}>
          <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
            <input
              placeholder="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Any Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>

            <button onClick={handleFilter}>Apply Filter</button>
          </div>
        </div>

        {/* CSV EXPORT */}
        <button onClick={handleCSV} style={{ marginBottom: 20 }}>
          Export CSV
        </button>

        <hr />

        {/* ALL ATTENDANCE TABLE */}
        <h3>All Attendance Records</h3>
        <div className="table-wrapper">
        <table className="styled-table" border="1" width="100%" cellPadding="8" style={{ marginTop: 15 }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Total Hours</th>
            </tr>
          </thead>

          <tbody>
            {allRecords.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}

            {allRecords.map((rec) => (
              <tr key={rec._id}>
                <td>{rec.userId?.employeeId}</td>
                <td>{rec.userId?.name}</td>
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

      </div>
    </div>
  );
};

export default ManagerDashboard;
