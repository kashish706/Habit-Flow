import React, { useState } from 'react';
import { Check, Undo2, Pencil, Trash2, X, Save, Clock, Flame } from 'lucide-react';
import { completeHabit, incompleteHabit, deleteHabit, updateHabit } from '../api';

const HabitCard = ({ habit, onHabitUpdate, onHabitDelete, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(habit.name);
  const [editedTimeOfDay, setEditedTimeOfDay] = useState(habit.timeOfDay);

  const today = new Date(selectedDate);
  today.setHours(0, 0, 0, 0);

  const isCompletedToday = habit.completions.some(completionDate => {
    const compDate = new Date(completionDate);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() === today.getTime();
  });

  const handleToggleComplete = async () => {
    const updatedHabit = isCompletedToday
      ? await incompleteHabit(habit._id)
      : await completeHabit(habit._id);
    if (updatedHabit._id) onHabitUpdate(updatedHabit);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      const result = await deleteHabit(habit._id);
      if (result.id) onHabitDelete(habit._id);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedName.trim()) { alert('Habit name cannot be empty.'); return; }
    try {
      const updated = await updateHabit(habit._id, editedName, editedTimeOfDay);
      if (updated._id) { onHabitUpdate(updated); setIsEditing(false); }
      else alert(updated.message || 'Failed to update habit.');
    } catch { alert('Network error while updating habit.'); }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(habit.name);
    setEditedTimeOfDay(habit.timeOfDay);
  };

  return (
    <div className={`habit-card ${isCompletedToday ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="habit-edit-form">
          <div className="form-group">
            <label htmlFor={`edit-name-${habit._id}`}>Name</label>
            <input type="text" id={`edit-name-${habit._id}`} value={editedName} onChange={e => setEditedName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor={`edit-time-${habit._id}`}>Time</label>
            <select id={`edit-time-${habit._id}`} value={editedTimeOfDay} onChange={e => setEditedTimeOfDay(e.target.value)}>
              <option value="any">Anytime</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div className="habit-actions">
            <button className="btn" onClick={handleSaveEdit}><Save size={13} /> Save</button>
            <button className="btn btn-outline" onClick={handleCancelEdit}><X size={13} /> Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="habit-info">
            <h4>{habit.name}</h4>
            <div className="habit-meta">
              <span className="habit-time-badge"><Clock size={10} style={{marginRight:3}} />{habit.timeOfDay === 'any' ? 'Anytime' : habit.timeOfDay}</span>
              {habit.streak > 0 && (
                <span className="habit-streak"><Flame size={11} style={{marginRight:2}} />{habit.streak} days</span>
              )}
            </div>
          </div>
          <div className="habit-actions">
            <button
              className={`btn ${isCompletedToday ? 'btn-success' : ''}`}
              onClick={handleToggleComplete}
              disabled={new Date().setHours(0,0,0,0) < today.getTime()}
            >
              {isCompletedToday ? <><Undo2 size={13} /> Undo</> : <><Check size={13} /> Complete</>}
            </button>
            <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
              <Pencil size={13} /> Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HabitCard;