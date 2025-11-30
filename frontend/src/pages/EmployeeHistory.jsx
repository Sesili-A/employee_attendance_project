import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHistory } from "../features/attendance/attendanceSlice";
import { Link } from "react-router-dom";

const EmployeeHistory = () => {
  const dispatch = useDispatch();
  const { history, loading } = useSelector((state) => state.attendance);

  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2025);

  useEffect(() => {
    dispatch(fetchHistory({ month, year }));
  }, [dispatch, month, year]);

  return (
    <div className="main-content">
      <div className="card">
        <h2>Attendance History</h2>

        <div style={{ marginBottom: 20 }}>
          <label>Month:</label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {m + 1}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: 10 }}>Year:</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ width: 80 }}
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
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
        )}

        <Link to="/employee" style={{ display: "block", marginTop: 20 }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default EmployeeHistory;
