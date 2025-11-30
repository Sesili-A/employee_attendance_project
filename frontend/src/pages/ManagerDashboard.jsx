import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const ManagerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="main-content">
      <div className="card">
        <h2>Manager Dashboard</h2>
        <p>Welcome, {user?.name}</p>
        <button onClick={handleLogout}>Logout</button>
        <p style={{ marginTop: 16 }}>
          (In next step we will add team stats, tables, filters, charts here.)
        </p>
      </div>
    </div>
  );
};

export default ManagerDashboard;
