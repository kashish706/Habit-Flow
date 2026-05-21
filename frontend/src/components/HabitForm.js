import React, { useState } from 'react';
import { addHabit } from '../api';

const HabitForm = ({ onHabitAdded }) => {
  const [name, setName] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('any');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!name.trim()) {
      setMessage('Habit name cannot be empty.');
      setMessageType('error');
      return;
    }

    try {
      const data = await addHabit(name, timeOfDay);
      if (data._id) {
        setMessage('Habit added successfully!');
        setMessageType('success');
        setName('');
        setTimeOfDay('any');
        onHabitAdded(data); // Callback to update parent state
      } else {
        setMessage(data.message || 'Failed to add habit.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error or server issue.');
      setMessageType('error');
      console.error('Add habit error:', error);
    }
  };

  return (
    <div className="card habit-form-card">
      <h3>Add New Habit</h3>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="habitName">Habit Name</label>
          <input
            type="text"
            id="habitName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Drink water, Read book"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="timeOfDay">Time of Day</label>
          <select
            id="timeOfDay"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
          >
            <option value="any">Anytime</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
        </div>
        <button type="submit" className="btn">Add Habit</button>
      </form>
    </div>
  );
};

export default HabitForm;