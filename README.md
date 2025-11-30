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

Create a .env file inside the backend folder (see .env.example):

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
CORS_ORIGIN=http://localhost:3000

🚀 Running the Project Locally
1. Clone the repo
git clone https://github.com/your-username/employee-attendance-system.git
cd employee-attendance-system

2. Backend Setup
cd backend
npm install
cp .env.example .env   # then edit .env with your values
npm run dev            # or: npm start


The backend should run on http://localhost:5000

3. Seed Sample Data (optional but recommended)
cd backend
npm run seed


This will create:

10 managers (manager1@example.com …)

20 employees (emp1@example.com …)

Sample attendance data for ~2 months

Default password used in seeding (example):

Password: Password@123


(Update above line if you changed it inside seed.js.)

4. Frontend Setup
cd ../frontend
npm install
npm start


The frontend should run on http://localhost:3000

🔐 Authentication Flow

Users login with email + password

Server returns a JWT token

Frontend stores token in Redux state (and optionally localStorage)

All protected API calls send:

Authorization: Bearer <token>

📡 Main API Endpoints (Backend)

Auth

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me (requires JWT)

Attendance – Employee

POST /api/attendance/checkin

POST /api/attendance/checkout

GET /api/attendance/today

GET /api/attendance/my-history?month=MM&year=YYYY

GET /api/attendance/my-summary?month=MM&year=YYYY

Attendance – Manager

GET /api/attendance/all?employeeId=&date=&status=

GET /api/attendance/employee/:id

GET /api/attendance/summary?month=MM&year=YYYY

GET /api/attendance/today-status

GET /api/attendance/export?start=YYYY-MM-DD&end=YYYY-MM-DD&employeeId=EMP001

📷 Screenshots

(Add your own screenshots here – Employee Dashboard, Manager Dashboard, Calendar, Reports, etc.)

✅ Status

 Authentication & Authorization

 Employee attendance check-in / check-out

 Employee history + summary

 Manager dashboards

 Manager calendar view

 Reports page

 CSV export

 Seed script

 Responsive UI

👤 Author

Your Name – [your.email@example.com
]

Feel free to fork, improve, and extend this Attendance System.


---

## 4️⃣ `.env.example`

**File:** `backend/.env.example`

```env
# Backend server port
PORT=5000

# MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority

# JWT secret for signing tokens
JWT_SECRET=your_super_secret_jwt_key_here

# Allowed origin for CORS (frontend URL)
CORS_ORIGIN=http://localhost:3000
