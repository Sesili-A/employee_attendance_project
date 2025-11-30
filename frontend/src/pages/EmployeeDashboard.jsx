import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodayStatus,
  checkIn,
  checkOut,
} from "../features/attendance/attendanceSlice";
import { logout } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { today, loading } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);

  // Load today's status
  useEffect(() => {
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  const handleCheckIn = () => dispatch(checkIn());
  const handleCheckOut = () => dispatch(checkOut());

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="main-content">
      <div className="card">
        {/* Header Section */}
        <h2>Employee Dashboard</h2>
        <p>Welcome, {user?.name}</p>

        <button
          onClick={handleLogout}
          style={{ backgroundColor: "red", marginBottom: 20 }}
        >
          Logout
        </button>

        <hr />

        {/* TODAY'S SUMMARY CARDS */}
        <h3>Today's Attendance</h3>

        {loading && <p>Loading...</p>}

        {!loading && today && (
          <>
            {/* Summary Cards */}
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 20,
                flexWrap: "wrap",
              }}
            >
              <div className="card" style={{ flex: 1 }}>
                <h4>Status</h4>
                <p style={{ fontSize: 22 }}>
                  {today?.status ? today.status.toUpperCase() : "Not Marked"}
                </p>
              </div>

              <div className="card" style={{ flex: 1 }}>
                <h4>Check-In</h4>
                <p style={{ fontSize: 20 }}>
                  {today?.checkInTime
                    ? new Date(today.checkInTime).toLocaleTimeString()
                    : "-"}
                </p>
              </div>

              <div className="card" style={{ flex: 1 }}>
                <h4>Check-Out</h4>
                <p style={{ fontSize: 20 }}>
                  {today?.checkOutTime
                    ? new Date(today.checkOutTime).toLocaleTimeString()
                    : "-"}
                </p>
              </div>
            </div>

            {/* Check-In / Check-Out Buttons */}
            <div style={{ marginTop: 25, display: "flex", gap: 12 }}>
              {!today.checkInTime && (
                <button onClick={handleCheckIn}>Check In</button>
              )}

              {today.checkInTime && !today.checkOutTime && (
                <button onClick={handleCheckOut}>Check Out</button>
              )}
            </div>
          </>
        )}

        <hr />

        {/* Navigation Buttons */}
        <div style={{ marginTop: 20 }}>
          <Link className="link-button" to="/employee/history">
            View Attendance History →
          </Link>
          <br />
          <br />
          <Link className="link-button" to="/employee/summary">
            View Monthly Summary →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
