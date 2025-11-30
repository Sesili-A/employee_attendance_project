🚀 Employee Attendance System (MERN)

A complete Employee Attendance Management System built using the MERN stack (MongoDB, Express, React, Node.js).

Employees can mark attendance, view history, and track monthly performance.
Managers can view team attendance, analyze trends through calendars & reports, and export CSV data.

✨ Features Overview
👨‍💻 Employee Features

JWT-based authentication (Login/Register)

Daily check-in & check-out

Auto attendance status:

✔ Present

⚠ Late (after 10:15 AM)

🌓 Half Day (worked < 4 hours)

❌ Absent

Dashboard with today’s attendance

Full attendance history:

🗓 Calendar View (color-coded)

📄 Table View

🔍 Modal for daily details

Monthly summary:

Total days attended

Total hours worked

👩‍💼 Manager Features

Manager login

View attendance of all employees

Filters:

Employee ID

Status (present/late/absent/halfday)

Date

Team summary:

Number of employees

Total attendance records

Total hours worked

Today’s attendance list

Full Manager Attendance Calendar

Shows team-wide statuses per day

Click date → see employee-level breakdown

Reports Page

Advanced filters

Export CSV (with date range & employee ID)

🛠 Tech Stack
Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

bcryptjs

dotenv

morgan

cors

Frontend

React

Redux Toolkit

React Router

Axios

date-fns

Fully responsive layout

📁 Project Structure
attendance_project/
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seeds/seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/axiosClient.js
    │   ├── app/store.js
    │   ├── features/
    │   ├── pages/
    │   ├── styles.css
    │   └── App.js
    └── package.json

⚙️ Environment Setup

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=http://localhost:3000


(An .env.example file is included.)

🚀 Running the Project Locally
1️⃣ Clone the repository
git clone https://github.com/your-username/employee-attendance-system.git
cd employee-attendance-system

2️⃣ Backend Setup
cd backend
npm install
cp .env.example .env   # Update with your values
npm run dev            # or npm start


Backend runs at:

👉 http://localhost:5000

3️⃣ (Optional) Seed the Database
cd backend
npm run seed


This will generate:

👨‍💼 Managers

manager1@example.com
 → manager10@example.com

👨‍🔧 Employees

emp1@example.com
 → emp20@example.com

🗓 Attendance Data

~ 2 months of auto-generated attendance

Weekends excluded

Present / Late / Halfday / Absent

Default password:
Password@123

4️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Frontend runs at:

👉 http://localhost:3000

🔐 Authentication Flow

User logs in

Backend returns JWT

Frontend stores JWT in Redux (and optionally localStorage)

All private requests include:

Authorization: Bearer <token>

📡 API Endpoints
🔑 Auth
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

👤 Employee Attendance
POST /api/attendance/checkin
POST /api/attendance/checkout
GET  /api/attendance/today
GET  /api/attendance/my-history
GET  /api/attendance/my-summary

👩‍💼 Manager Attendance
GET /api/attendance/all
GET /api/attendance/employee/:id
GET /api/attendance/summary
GET /api/attendance/today-status
GET /api/attendance/export

🖼 Screenshots 

Employee Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f0431238-14cf-4bad-98d4-1c6d4deb3df7" />

Check-in / Check-out

Calendar View

Attendance History (table + calendar)

Monthly Summary

Manager Dashboard

Manager Calendar

Reports Page

✅ Project Status
Feature	Status
JWT Authentication	✔ Completed
Check-in / Check-out	✔ Completed
Employee Calendar View	✔ Completed
Monthly Summary	✔ Completed
Manager Dashboard	✔ Completed
Manager Calendar	✔ Completed
Reports + CSV Export	✔ Completed
Seeding Script	✔ Completed
Fully Responsive UI	✔ Completed
📄 .env.example
# Backend server port
PORT=5000

# MongoDB connection string
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# JWT secret
JWT_SECRET=your_super_secret_jwt_key_here

# Allowed frontend domain
CORS_ORIGIN=http://localhost:3000

