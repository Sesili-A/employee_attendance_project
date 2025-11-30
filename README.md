Employee Attendance System (MERN)

A full-stack Employee Attendance System built using MongoDB, Express, React, and Node.js.
Employees can mark attendance, view their history & monthly summary.
Managers can monitor team attendance, view reports, and export data.

✨ Features
👨‍💻 Employee

Register & Login (JWT Authentication)

Check-In & Check-Out

Automatic status detection:

present

late (after 10:15 AM)

halfday (worked < 4 hours)

absent (no check-in)

Dashboard with Today’s Status

Attendance History:

Calendar View (color-coded)

Table View

Modal with details

Monthly Summary:

Total days

Total hours worked

👩‍💼 Manager

Manager Login

View attendance of all employees

Filters:

Employee ID

Status (present/late/halfday/absent)

Date

Team Summary:

Total employees

Total attendance records

Total hours worked

Today’s attendance list

Manager Calendar View:

Monthly team view with aggregated counts

Click date → view list of employees

Reports Page:

Advanced filters

CSV Export (with employee & date filters)

🛠 Tech Stack
Backend

Node.js

Express.js

MongoDB + Mongoose

JWT

bcryptjs

dotenv

morgan

cors

Frontend

React

React Router

Redux Toolkit

Axios

date-fns

📁 Project Structure
attendance_project/
├── backend/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
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
    │   ├── api/axiosClient.js
    │   ├── app/store.js
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

Create a .env file in the backend folder.

You can copy from .env.example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:3000

🚀 Running the Project Locally
1️⃣ Clone Repository
git clone https://github.com/your-username/employee-attendance-system.git
cd employee-attendance-system

2️⃣ Backend Setup
cd backend
npm install
cp .env.example .env   # Fill in .env values
npm run dev            # or npm start


Backend runs at:

➡️ http://localhost:5000

3️⃣ Seed Sample Data (Recommended)
cd backend
npm run seed


This will create:

👨‍💼 Managers (10)

manager1@example.com
 → manager10@example.com

👨‍🔧 Employees (20)

emp1@example.com
 → emp20@example.com

🗓 Attendance (2 months)

Present

Late

Half Day

Absent

Weekends skipped

🔑 Default Password (from seed.js)
Password@123

4️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs at:

➡️ http://localhost:3000

🔐 Authentication Flow

User enters email & password

Backend validates & returns JWT

Frontend stores JWT in Redux (and optionally localStorage)

All protected routes send:

Authorization: Bearer <token>

📡 Backend API Endpoints
🔑 Authentication
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

👤 Employee APIs
POST /api/attendance/checkin
POST /api/attendance/checkout
GET  /api/attendance/today
GET  /api/attendance/my-history?month=MM&year=YYYY
GET  /api/attendance/my-summary?month=MM&year=YYYY

👩‍💼 Manager APIs
GET /api/attendance/all
GET /api/attendance/employee/:id
GET /api/attendance/summary?month=MM&year=YYYY
GET /api/attendance/today-status
GET /api/attendance/export?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=EMP001

🖼️ Screenshots

Add screenshots of:

Employee Dashboard

Attendance Calendar

Attendance History Table

Monthly Summary

Manager Dashboard

Manager Calendar

Reports Page

✅ Project Status
Feature	Status
Authentication	✔️ Done
Check-In / Check-Out	✔️ Done
Employee History	✔️ Done
Monthly Summary	✔️ Done
Manager Dashboard	✔️ Done
Manager Calendar	✔️ Done
Reports Page	✔️ Done
CSV Export	✔️ Done
Seed Script	✔️ Done
Responsive UI	✔️ Done
📄 backend/.env.example
# Backend server port
PORT=5000

# MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT secret for signing authentication tokens
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend domain for CORS
CORS_ORIGIN=http://localhost:3000
