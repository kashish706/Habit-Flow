import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHabits } from '../api';
import MonthlyCalendar from '../components/MonthlyCalendar';

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

const ProgressCalendarPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHabits();
      if (Array.isArray(data)) setHabits(data);
      else setError(data.message || 'Failed to fetch habits.');
    } catch (err) {
      setError('Failed to fetch habits.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const selectedDay = new Date(selectedDate); selectedDay.setHours(0,0,0,0);
  const habitsForDay = habits.map(h => ({
    ...h,
    isCompletedOnSelectedDay: h.completions.some(d => {
      const c = new Date(d); c.setHours(0,0,0,0);
      return c.getTime() === selectedDay.getTime();
    })
  }));
  const completedCount = habitsForDay.filter(h => h.isCompletedOnSelectedDay).length;
  const overallMaxStreak = Math.max(0, ...habits.map(h => calculateMaxStreak(h.completions)));
  const completionPct = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="container">
      <div className="welcome-card" style={{ marginTop: 0 }}>
        <div>
          <h2>📅 Your Progress</h2>
          <p>Track your habit completion across the month.</p>
        </div>
        <div className="welcome-badge">🔥 Best: {overallMaxStreak} days</div>
      </div>

      {/* Stats for selected day */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{completedCount}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{habits.length}</div>
          <div className="stat-label">Total Habits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{completionPct}%</div>
          <div className="stat-label">
            {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card" style={{ padding: 24 }}>
        {loading && <div className="loading">Loading calendar...</div>}
        {error && <div className="message error">{error}</div>}
        {!loading && !error && (
          <MonthlyCalendar
            habits={habits}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}
      </div>

      {/* Habits for selected day */}
      {!loading && habits.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="habits-section-title" style={{ marginBottom: 14 }}>
            Habits on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {habitsForDay.map(h => (
              <div key={h._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: h.isCompletedOnSelectedDay ? 'var(--green-light)' : 'var(--bg)',
                border: `1px solid ${h.isCompletedOnSelectedDay ? '#c8f0df' : 'var(--border)'}`,
              }}>
                <span style={{ fontWeight: 500, fontSize: '0.93rem' }}>{h.name}</span>
                <span style={{
                  fontSize: '0.78rem', fontWeight: 600, padding: '3px 10px',
                  borderRadius: 99,
                  background: h.isCompletedOnSelectedDay ? 'var(--green)' : 'var(--border)',
                  color: h.isCompletedOnSelectedDay ? 'white' : 'var(--text-muted)',
                }}>
                  {h.isCompletedOnSelectedDay ? '✓ Done' : 'Missed'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCalendarPage;