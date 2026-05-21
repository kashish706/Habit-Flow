import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, ClipboardList } from 'lucide-react';
import HabitList from '../components/HabitList';
import { getHabits, addHabit, getMe } from '../api';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
};

const DashboardPage = ({ isAuthenticated }) => {
  const [habits, setHabits] = useState([]);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('any');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const getLocalDate = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60 * 1000).toISOString().split('T')[0];
};
  const [selectedDate, setSelectedDate] = useState(getLocalDate());
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    const fetchAll = async () => {
      try {
        const [habitsData, userData] = await Promise.all([getHabits(), getMe()]);
        if (Array.isArray(habitsData)) setHabits(habitsData);
        if (userData?.username) setUsername(userData.username);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchAll();
  }, []); // eslint-disable-line

  const completedToday = habits.filter(h =>
    h.completions.some(d => new Date(d).toDateString() === new Date(selectedDate).toDateString())
  ).length;

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0), 0);
  const completionPct = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const handleAddHabit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { setShowAuthPrompt(true); return; }
    if (!name.trim()) { setMessage('Habit name cannot be empty.'); setMessageType('error'); return; }
    try {
      const data = await addHabit(name, timeOfDay);
      if (data._id) {
        setHabits(prev => [...prev, data]);
        setName(''); setTimeOfDay('any');
        setMessage('Habit added!'); setMessageType('success');
        setTimeout(() => setMessage(''), 2500);
      } else { setMessage(data.message || 'Failed to add.'); setMessageType('error'); }
    } catch { setMessage('Network error.'); setMessageType('error'); }
  };

  const handleHabitUpdate = (updated) => setHabits(prev => prev.map(h => h._id === updated._id ? updated : h));
  const handleHabitDelete = (id) => setHabits(prev => prev.filter(h => h._id !== id));

  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = getGreeting();
  const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : '';

  return (
    <div className="container">
      {showAuthPrompt && (
        <div className="auth-prompt-overlay" onClick={() => setShowAuthPrompt(false)}>
          <div className="auth-prompt-card" onClick={e => e.stopPropagation()}>
            <div className="prompt-icon">🔒</div>
            <h3>Sign in to track habits</h3>
            <p>Create a free account to start building streaks and tracking your daily progress.</p>
            <div className="auth-prompt-buttons">
              <button className="btn btn-outline" onClick={() => navigate('/login')}>Log in</button>
              <button className="btn" onClick={() => navigate('/register')}>Sign up free</button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="welcome-section">
        <div className="welcome-eyebrow">{isAuthenticated ? dateLabel : 'Daily habit tracking'}</div>
        <h1 className="welcome-heading">
          {isAuthenticated ? <>{greeting}, {displayName}! 👋</> : <>Build habits that<br />actually stick.</>}
        </h1>
        {isAuthenticated && bestStreak > 0 && (
          <div className="welcome-streak-pill">🔥 {bestStreak} day streak</div>
        )}
        {!isAuthenticated && (
          <p className="welcome-sub" style={{ marginTop: 8 }}>Track your daily habits and build lasting streaks. Sign up free to get started.</p>
        )}
      </div>

      {/* Stats */}
      {isAuthenticated && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{habits.length}</div>
            <div className="stat-label">Habits</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedToday}</div>
            <div className="stat-label">Done today</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completionPct}%</div>
            <div className="stat-label">Completion</div>
          </div>
        </div>
      )}

      {/* Add Habit */}
      <div className="card habit-form-card">
        <h3><Sparkles size={15} style={{marginRight:6, color:'var(--blue)'}} />Add a new habit</h3>
        {message && <div className={`message ${messageType}`}>{message}</div>}
        <form onSubmit={handleAddHabit}>
          <div className="habit-form-inline">
            <div className="form-group">
              <label htmlFor="habitName">Habit Name</label>
              <input type="text" id="habitName" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Drink water, Read 10 pages..." />
            </div>
            <div className="form-group select-group">
              <label htmlFor="timeOfDay">Time</label>
              <select id="timeOfDay" value={timeOfDay} onChange={e => setTimeOfDay(e.target.value)}>
                <option value="any">Anytime</option>
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
            <button type="submit" className="btn"><Plus size={15} /> Add</button>
          </div>
        </form>
      </div>

      {/* Habit list */}
      {isAuthenticated ? (
        <>
          <div className="habits-section-header">
            <div className="habits-section-title"><ClipboardList size={12} style={{marginRight:5}} />Your habits</div>
            <div className="date-picker-row">
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} max={getLocalDate()} />
            </div>
          </div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <p>No habits yet — add your first one above!</p>
            </div>
          ) : (
            <HabitList habits={habits} onHabitUpdate={handleHabitUpdate} onHabitDelete={handleHabitDelete} selectedDate={selectedDate} />
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p>
            <a href="/register" style={{ color: 'var(--blue-dark)', fontWeight: 700, textDecoration: 'none' }}>Sign up</a>
            {' '}or{' '}
            <a href="/login" style={{ color: 'var(--blue-dark)', fontWeight: 700, textDecoration: 'none' }}>log in</a>
            {' '}to see and track your habits.
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;