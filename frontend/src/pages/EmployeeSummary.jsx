import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSummary } from "../features/attendance/attendanceSlice";
import { useNavigate } from "react-router-dom";

const EmployeeSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { summary, loading } = useSelector((state) => state.attendance);

  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2025);

  useEffect(() => {
    dispatch(fetchSummary({ month, year }));
  }, [month, year, dispatch]);

  return (
    <div className="main-content">
      <div className="card">
        <h2>Monthly Summary</h2>

        {/* Month-Year Selector */}
        <div style={{ marginBottom: 20 }}>
          <label>Month: </label>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {m + 1}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: 10 }}>Year: </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{ width: 90 }}
          />
        </div>

        {/* Summary Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : summary ? (
          <div style={{ display: "flex", gap: 20 }}>
            <div className="card" style={{ flex: 1, textAlign: "center" }}>
              <h4>Total Days Present</h4>
              <p style={{ fontSize: 22 }}>{summary.totalDays}</p>
            </div>

            <div className="card" style={{ flex: 1, textAlign: "center" }}>
              <h4>Total Hours Worked</h4>
              <p style={{ fontSize: 22 }}>{summary.totalHours}</p>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}

        {/* Back Button */}
        <button
          style={{ marginTop: 25, background: "#555" }}
          onClick={() => navigate("/employee")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EmployeeSummary;
