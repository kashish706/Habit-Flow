import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProgressCalendarPage from './pages/ProgressCalendarPage';
import Navbar from './components/Navbar';
import './index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!JSON.parse(localStorage.getItem('user'))?.token);

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem('token'));
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<DashboardPage isAuthenticated={isAuthenticated} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="/progress-calendar" element={isAuthenticated ? <ProgressCalendarPage /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
