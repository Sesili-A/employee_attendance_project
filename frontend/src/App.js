import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeHistory from "./pages/EmployeeHistory";
import EmployeeSummary from "./pages/EmployeeSummary";
import ManagerCalendar from "./pages/ManagerCalendar";


const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    
    <div className="app-container">
      <div className="navbar">Employee Attendance System</div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/employee"
          element={
            <ProtectedRoute role="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default: if logged in employee -> /employee, manager -> /manager, else /login */}
        <Route
          path="/"
          element={<LandingRedirect />}
        />

        <Route
          path="/employee/history"
          element={
          <ProtectedRoute role="employee">
              <EmployeeHistory />
          </ProtectedRoute>
          }
        />

        <Route
          path="/employee/summary"
          element={
            <ProtectedRoute role="employee">
              <EmployeeSummary />
            </ProtectedRoute>
          }
        />
        <Route path="/manager/calendar" element={<ManagerCalendar />} />


      </Routes>
    </div>

    



  );
}

const LandingRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "manager") return <Navigate to="/manager" replace />;

  return <Navigate to="/employee" replace />;
};

export default App;
