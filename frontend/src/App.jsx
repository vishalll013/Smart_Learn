import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Interactive from './pages/Interactive';
import QuizCenter from './pages/QuizCenter';
import Games from './pages/Games';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';

// Dashboards
import StudentDashboard from './pages/Dashboards/StudentDashboard';
import ParentDashboard from './pages/Dashboards/ParentDashboard';
import TeacherDashboard from './pages/Dashboards/TeacherDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';

// Protected Route wrapper to simulate redirects if wanted
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#f0f9ff] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
          {/* Main Navigation */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/interactive" element={<Interactive />} />
              <Route path="/quizzes" element={<QuizCenter />} />
              <Route path="/games" element={<Games />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Role Dashboards (Protected / Simulated fallback) */}
              <Route path="/dashboard/student" element={<StudentDashboard />} />
              <Route path="/dashboard/parent" element={<ParentDashboard />} />
              <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
              
              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Footer Component */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
