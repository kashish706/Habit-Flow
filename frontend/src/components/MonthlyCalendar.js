import React, { useState, useEffect } from 'react';

const MonthlyCalendar = ({ habits, selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  useEffect(() => {
    // Update currentMonth if selectedDate changes to a different month
    if (selectedDate.getMonth() !== currentMonth.getMonth() || selectedDate.getFullYear() !== currentMonth.getFullYear()) {
      setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)); // Corrected: used selectedDate.getMonth()
    }
  }, [selectedDate, currentMonth]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const numDays = lastDay.getDate();

    const days = [];
    for (let i = 1; i <= numDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getStartDayOfWeek = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const startDayOfWeek = getStartDayOfWeek(currentMonth);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    onDateSelect(today); // Select today's date
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1)); // Set calendar to today's month
  };

  const isSameDay = (date1, date2) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const hasCompletion = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return habits.some(habit =>
      habit.completions.some(completionDateStr => {
        const compDate = new Date(completionDateStr);
        compDate.setHours(0, 0, 0, 0);
        return isSameDay(normalizedDate, compDate);
      })
    );
  };

  return (
    <div className="calendar-month-view">
      <div className="calendar-header">
        <button onClick={prevMonth} className="calendar-nav-btn">&lt;</button>
        <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={nextMonth} className="calendar-nav-btn">&gt;</button>
      </div>
      <div className="calendar-controls">
        <button onClick={goToToday} className="btn btn-outline btn-today">Today</button>
      </div>
      <div className="calendar-weekdays">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="calendar-grid">
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day-cell empty"></div>
        ))}
        {daysInMonth.map((day, index) => {
          const today = new Date();
          const isToday = isSameDay(day, today);
          const isSelected = isSameDay(day, selectedDate);
          const hasComp = hasCompletion(day);

          let cellClasses = 'calendar-day-cell';
          if (isToday) cellClasses += ' today';
          if (isSelected) cellClasses += ' selected';
          if (hasComp) cellClasses += ' has-completion';

          return (
            <div
              key={index}
              className={cellClasses}
              onClick={() => onDateSelect(day)}
            >
              <span className="day-number">{day.getDate()}</span>
              {hasComp && <div className="completion-indicator"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyCalendar;