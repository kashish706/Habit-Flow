import React from 'react';
import HabitCard from './HabitCard';

const HabitList = ({ habits, onHabitUpdate, onHabitDelete, selectedDate }) => {
  return (
    <div className="habit-list">
      {habits.length === 0 ? (
        <p>No habits added yet. Add one above!</p>
      ) : (
        habits.map((habit) => (
          <HabitCard
            key={habit._id}
            habit={habit}
            onHabitUpdate={onHabitUpdate}
            onHabitDelete={onHabitDelete}
            selectedDate={selectedDate}
          />
        ))
      )}
    </div>
  );
};

export default HabitList;