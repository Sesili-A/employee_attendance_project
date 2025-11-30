import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodayStatus, checkIn, checkOut } from "../features/attendance/attendanceSlice";
import { logout } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { today, loading } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTodayStatus());
  }, [dispatch]);

  const handleCheckIn = () => {
    dispatch(checkIn());
  };

  const handleCheckOut = () => {
    dispatch(checkOut());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="main-content">
      <div className="card">
        <h2>Employee Dashboard</h2>
        <p>Welcome, {user?.name}</p>

        <button onClick={handleLogout} style={{ marginBottom: 20 }}>
          Logout
        </button>

        <hr />

        <h3>Today's Attendance</h3>

        {loading && <p>Loading...</p>}

        {!loading && today && (
          <div>
            <p><strong>Date:</strong> {today.date}</p>
            <p><strong>Status:</strong> {today.status}</p>
            <p>
              <strong>Check In:</strong>{" "}
              {today.checkInTime ? new Date(today.checkInTime).toLocaleTimeString() : "-"}
            </p>
            <p>
              <strong>Check Out:</strong>{" "}
              {today.checkOutTime ? new Date(today.checkOutTime).toLocaleTimeString() : "-"}
            </p>

            <div style={{ marginTop: 20 }}>
              {!today.checkInTime && (
                <button onClick={handleCheckIn} style={{ marginRight: 10 }}>
                  Check In
                </button>
              )}

              {today.checkInTime && !today.checkOutTime && (
                <button onClick={handleCheckOut}>Check Out</button>
              )}
            </div>
          </div>
        )}

        <hr />

        <Link to="/employee/history">View Attendance History →</Link>
        <br />
        <Link to="/employee/summary" style={{ marginTop: 10 }}>
          View Monthly Summary →
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
