import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Public Pages
import Home from './pages/public/Home';

// Dashboards
import AdminOverview from './pages/admin/Overview';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import DoctorsList from './pages/patient/DoctorsList';
import PatientRecords from './pages/patient/PatientRecords';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<div className="min-h-screen flex items-center justify-center p-20 text-center"><h2 className="text-2xl font-bold">Forgot Password - Coming Soon</h2></div>} />

          {/* Protected Routes enclosed in Layout */}
          <Route element={<Layout />}>
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminOverview />} />
              <Route path="/admin/doctors" element={<div className="p-8"><h2 className="text-xl font-bold">Manage Doctors</h2></div>} />
              <Route path="/admin/patients" element={<div className="p-8"><h2 className="text-xl font-bold">Manage Patients</h2></div>} />
              <Route path="/admin/appointments" element={<div className="p-8"><h2 className="text-xl font-bold">Manage Appointments</h2></div>} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
            </Route>

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/book" element={<BookAppointment />} />
              <Route path="/patient/records" element={<PatientRecords />} />
              <Route path="/patient/doctors" element={<DoctorsList />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
