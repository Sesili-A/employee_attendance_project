# Employee Attendance System (MERN)

A full-stack Employee Attendance System built with **MongoDB, Express, React, and Node.js**.  
Employees can mark daily attendance (check-in / check-out), view their history & monthly summary;  
Managers can view and filter attendance for all employees, see team summaries, and export CSV reports.

---

## ✨ Features

### 👨‍💻 Employee

- Register & Login (JWT authentication)
- Check-in & Check-out
- Automatic status:
  - `present`
  - `late` (check-in after 10:15 AM)
  - `halfday` (less than 4 hours worked)
  - `absent` (if no entry)
- View **Today’s status** (dashboard)
- View **Attendance History**:
  - Calendar view (color-coded)
  - Table view
  - Click on date → modal with details
- View **Monthly Summary**:
  - Total days
  - Total hours

### 👩‍💼 Manager

- Manager login
- View attendance for **all employees**
- Filter by:
  - Employee ID
  - Status (present / late / halfday / absent)
  - Date / Date range (UI-level filters)
- Team summary:
  - Total employees
  - Total attendance records
  - Total hours worked
- Today’s attendance list
- **Manager Calendar**:
  - Monthly calendar showing aggregated status counts per day
  - Click on date → list of employees & their status for that day
- **Reports Page**:
  - Advanced filters
  - Export CSV (server-generated) with optional date range & employee filter

---

## 🛠 Tech Stack

**Backend**

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- morgan
- cors

**Frontend**

- React
- React Router
- Redux Toolkit
- Axios
- date-fns

---

## 📁 Project Structure (High Level)

```bash
attendance_project/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   │   └── attendanceController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── attendanceRoutes.js
│   ├── seeds/
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axiosClient.js
    │   ├── app/
    │   │   └── store.js
    │   ├── features/
    │   │   ├── auth/authSlice.js
    │   │   └── attendance/attendanceSlice.js
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── EmployeeDashboard.jsx
    │   │   ├── EmployeeHistory.jsx
    │   │   ├── EmployeeSummary.jsx
    │   │   ├── ManagerDashboard.jsx
    │   │   ├── ManagerCalendar.jsx
    │   │   └── ManagerReports.jsx
    │   ├── App.js
    │   ├── index.js
    │   └── styles.css
    └── package.json
