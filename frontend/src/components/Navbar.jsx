import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const TickLogo = () => (
  <div className="brand-logo">
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
      <polyline points="2,7 5.5,11 12,3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <TickLogo />
        <span className="brand-name">HabitFlow</span>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/" className={isActive('/')}>
              <LayoutDashboard size={14} /> Dashboard
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/progress-calendar" className={isActive('/progress-calendar')}>
                  <TrendingUp size={14} /> Progress
                </Link>
              </li>
              <li>
                <Link to="/profile" className={isActive('/profile')}>
                  <User size={14} /> Profile
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <LogOut size={14} /> Log out
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/login" className={isActive('/login')}>
                  <LogIn size={14} /> Log in
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-cta">
                  <UserPlus size={14} /> Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;