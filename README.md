# Medical Clinic Management System

A Modern FullStack Medical Clinic Management System built with React, TailwindCSS, Node.js, Express, and MySQL.

## 🚀 Features
- **Role-based Dashboards:** Dedicated interfaces for Admins, Doctors, and Patients.
- **Authentication:** JWT & bcrypt encrypted secure login.
- **Patient Portal:** Book appointments, manage records, interactive dashboard.
- **Doctor Portal:** View upcoming appointments, update attendance/status.
- **Admin Dashboard:** Overview statistics of the entire platform.
- **Fully Responsive UI:** Premium design using TailwindCSS v4.

---

## 🛠️ Technology Stack
- **Frontend:** React + Vite, Tailwind CSS v4, Lucide React, Axios, React Router Dom
- **Backend:** Node.js, Express, Sequelize ORM, JWT, Bcrypt
- **Database:** MySQL

---

## 📦 Folder Structure
```
c:\website
 ├── client/          # Frontend React Application
 │    ├── src/
 │    │    ├── components/    # Reusable UI (Navbar, Sidebar, Layout)
 │    │    ├── context/       # AuthContext for global state
 │    │    ├── pages/         # Page components (Admin, Patient, Doctor, Auth, Public)
 │    │    ├── App.jsx        # Main application router
 │    │    └── main.jsx       # Entry point
 │    └── vite.config.js
 ├── server/          # Backend Node.js Application
 │    ├── config/        # Database & Environment configuration
 │    ├── controllers/   # Route handlers with business logic
 │    ├── middleware/    # Auth, Role restriction
 │    ├── models/        # Sequelize Models (Schema definitions)
 │    ├── routes/        # Express REST API routes
 │    ├── server.js      # Main Express Server
 │    ├── schema.sql     # Raw SQL initialization schema
 │    └── .env.example   # Example Environment Configuration
 └── README.md
```

---

## 🏃‍♂️ Getting Started

### 1. Database Setup
1. Ensure MySQL server is running.
2. Execute the commands in `server/schema.sql` to create the `clinic_db` database and initial schemas. Note that Sequelize will automatically sync tables, but creating the database is required.

### 2. Backend Setup
```bash
cd server
npm install
```
- Copy `.env.example` to `.env` and fill out your specific MySQL database password and variables.
- Run the server:
```bash
npm run dev
# Server will start on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
```
- Run the React development server:
```bash
npm run dev
# Client will start on http://localhost:5173
```

---

## 🔐 Authentication
*   Patient roles are automatically created during registration via `/register`.
*   Doctors & Admin accounts can be manually inserted in the database or created by API via logged-in Administrator credentials.
