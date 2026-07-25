import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, register } from '../api';

const TickLogo = () => (
  <div className="auth-logo-img">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <polyline points="2,7 5.5,11 12,3" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const AuthForm = ({ type, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isLogin = type === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); setLoading(true);
    try {
      const data = isLogin ? await login(username, password) : await register(username, password);
      if (data.token) {
        localStorage.setItem('user', JSON.stringify({ token: data.token }));
        if (onLogin) onLogin();
        navigate('/');
      } else {
        setMessage(data.message || 'Something went wrong.'); setMessageType('error');
      }
    } catch {
      setMessage('Network error. Please try again.'); setMessageType('error');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-form-card">
        <div className="auth-logo">
          <TickLogo />
          <span className="auth-logo-text">HabitFlow</span>
        </div>
        <h2>{isLogin ? 'Welcome back 👋' : 'Get started '}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to continue your streak.' : 'Start building better habits today.'}
        </p>
        {message && <div className={`message ${messageType}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" required autoFocus />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'} id="password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required style={{ paddingRight: '40px' }}
              />
              <button type="button" onClick={() => setShowPassword(p => !p)} style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-4)', fontSize: '0.95rem', padding: 0
              }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Log in' : 'Create account')}
          </button>
        </form>
        <div className="auth-switch">
          {isLogin ? (<>No account? <Link to="/register">Sign up free</Link></>) : (<>Already have an account? <Link to="/login">Log in</Link></>)}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;