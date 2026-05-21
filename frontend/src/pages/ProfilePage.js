import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHabits, getMe } from '../api';

const isSameDay = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const calculateMaxStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;
  const sorted = completions.map(d => { const x = new Date(d); x.setHours(0,0,0,0); return x.getTime(); }).sort((a,b)=>a-b);
  let max = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i] - sorted[i-1]) / 86400000;
    if (diff === 1) { cur++; max = Math.max(max, cur); }
    else if (diff > 1) cur = 1;
  }
  return max;
};

const calculateCurrentStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;
  const sorted = completions.map(d => { const x = new Date(d); x.setHours(0,0,0,0); return x; }).sort((a,b)=>a-b);
  const today = new Date(); today.setHours(0,0,0,0);
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  const last = sorted[sorted.length-1];
  if (!isSameDay(last, today) && !isSameDay(last, yesterday)) return 0;
  let streak = 1;
  for (let i = sorted.length-2; i >= 0; i--) {
    const diff = (sorted[i+1] - sorted[i]) / 86400000;
    if (diff === 1) streak++;
    else if (diff > 1) break;
  }
  return streak;
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
        const habitsData = await getHabits();
        if (Array.isArray(habitsData)) setHabits(habitsData);
      } catch (err) {
        setError('Failed to load profile.');
        if (err?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const totalHabits = habits.length;
  const currentStreak = Math.max(0, ...habits.map(h => calculateCurrentStreak(h.completions)));
  const maxStreak = Math.max(0, ...habits.map(h => calculateMaxStreak(h.completions)));

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="container"><div className="message error">{error}</div></div>;
  if (!user) return null;

  return (
    <div className="container">
      {/* Profile header card */}
      <div className="welcome-card" style={{ marginTop: 0 }}>
        <div>
          <h2>👤 {user.username}</h2>
          <p>Here's your habit overview and stats.</p>
        </div>
        <div className="welcome-badge">Member</div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{totalHabits}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">🔥 {currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">⭐ {maxStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
      </div>

      {/* Profile details */}
      <div className="card">
        <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Account Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500 }}>USERNAME</span>
            <span style={{ fontWeight: 600 }}>{user.username}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500 }}>HABITS TRACKED</span>
            <span style={{ fontWeight: 600 }}>{totalHabits} habit{totalHabits !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;