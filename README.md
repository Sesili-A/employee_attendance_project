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


⚙️ Environment Variables

Create a .env file inside the backend folder.

You may copy from .env.example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:3000

🚀 Running the Project Locally
1. Clone the Repository
git clone https://github.com/your-username/employee-attendance-system.git
cd employee-attendance-system

2. Backend Setup
cd backend
npm install
cp .env.example .env   # then edit values inside .env
npm run dev            # or npm start


Backend runs at:

👉 http://localhost:5000

3. (Optional but Recommended) Seed Sample Data

Run the seed script:

cd backend
npm run seed


This will automatically generate:

👨‍💼 Managers

10 managers

manager1@example.com

…

manager10@example.com

👨‍🔧 Employees

20 employees

emp1@example.com

…

emp20@example.com

🗓️ Attendance Data

About 2 months of attendance

Includes:

Present

Late

Half Day

Absent

Weekends skipped

🔑 Default Password (from seed.js)
Password@123


(If you changed the password in the seed script, update it here.)

4. Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs at:

👉 http://localhost:3000

🔐 Authentication Flow

User logs in using email + password

Backend returns a signed JWT token

Frontend stores token in:

Redux state

(Optional) localStorage

All protected routes send:

Authorization: Bearer <token>

📡 Backend API Endpoints
🔑 Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

👤 Employee Attendance
POST /api/attendance/checkin
POST /api/attendance/checkout
GET  /api/attendance/today
GET  /api/attendance/my-history?month=MM&year=YYYY
GET  /api/attendance/my-summary?month=MM&year=YYYY

🧑‍💼 Manager Attendance
GET /api/attendance/all?employeeId=&date=&status=
GET /api/attendance/employee/:id
GET /api/attendance/summary?month=MM&year=YYYY
GET /api/attendance/today-status
GET /api/attendance/export?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=EMP001

🖼️ Screenshots

(Add your own screenshots):

Employee Dashboard

Check-in / Check-out

Calendar View

Attendance History

Daily Summary

Manager Dashboard

Manager Calendar

Reports Page

✅ Project Status
Feature	Status
Authentication (JWT)	✔️ Done
Employee Check-In / Check-Out	✔️ Done
Monthly History	✔️ Done
Monthly Summary	✔️ Done
Manager Dashboard	✔️ Done
Manager Calendar View	✔️ Done
Reports Page	✔️ Done
CSV Export	✔️ Done
Seeding Script	✔️ Done
Fully Responsive UI	✔️ Done

📁 .env.example

Create this file inside backend/:

# Backend server port
PORT=5000

# MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT secret for signing authentication tokens
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend domain for CORS
CORS_ORIGIN=http://localhost:3000
# Allowed origin for CORS (frontend URL)
CORS_ORIGIN=http://localhost:3000
