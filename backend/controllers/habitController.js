const Habit = require('../models/Habit');

// Helper to calculate streak
const calculateStreak = (completions) => {
  if (completions.length === 0) return 0;

  let streak = 0;
  let sortedCompletions = [...completions].sort((a, b) => new Date(b) - new Date(a)); // Sort descending

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  let lastCompletionDate = null;

  // Check if habit was completed today
  if (sortedCompletions.some(date => {
    const compDate = new Date(date);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() === today.getTime();
  })) {
    streak = 1;
    lastCompletionDate = today;
  } else if (sortedCompletions.some(date => {
    const compDate = new Date(date);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() === yesterday.getTime();
  })) {
    // If not completed today, but completed yesterday, streak starts from yesterday
    streak = 1;
    lastCompletionDate = yesterday;
  } else {
    return 0; // No recent completion, streak is 0
  }

  for (let i = 1; i < sortedCompletions.length; i++) {
    const prevDay = new Date(lastCompletionDate);
    prevDay.setDate(lastCompletionDate.getDate() - 1);
    prevDay.setHours(0, 0, 0, 0);

    const currentCompletion = new Date(sortedCompletions[i]);
    currentCompletion.setHours(0, 0, 0, 0);

    if (currentCompletion.getTime() === prevDay.getTime()) {
      streak++;
      lastCompletionDate = currentCompletion;
    } else if (currentCompletion.getTime() < prevDay.getTime()) {
      // If there's a gap, break the streak
      break;
    }
    // If currentCompletion is the same as lastCompletionDate (multiple entries for same day), continue
  }
  return streak;
};


// @desc    Get all habits for a user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  const habits = await Habit.find({ userId: req.user.id });
  res.status(200).json(habits);
};

// @desc    Add a new habit
// @route   POST /api/habits
// @access  Private
const addHabit = async (req, res) => {
  const { name, timeOfDay } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please add a habit name' });
  }

  const habit = await Habit.create({
    userId: req.user.id,
    name,
    timeOfDay: timeOfDay || 'any',
  });

  res.status(201).json(habit);
};

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  const { name, timeOfDay } = req.body;
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  // Make sure the logged in user matches the habit user
  if (habit.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  habit.name = name || habit.name;
  habit.timeOfDay = timeOfDay || habit.timeOfDay;

  const updatedHabit = await habit.save();
  res.status(200).json(updatedHabit);
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  // Make sure the logged in user matches the habit user
  if (habit.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await habit.deleteOne();
  res.status(200).json({ id: req.params.id, message: 'Habit removed' });
};

// @desc    Mark habit as complete for today
// @route   POST /api/habits/:id/complete
// @access  Private
const completeHabit = async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  if (habit.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already completed today
  const alreadyCompletedToday = habit.completions.some(date => {
    const compDate = new Date(date);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() === today.getTime();
  });

  if (!alreadyCompletedToday) {
    habit.completions.push(today);
    habit.streak = calculateStreak(habit.completions);
    await habit.save();
    res.status(200).json(habit);
  } else {
    res.status(400).json({ message: 'Habit already completed for today' });
  }
};

// @desc    Mark habit as incomplete for today (undo completion)
// @route   POST /api/habits/:id/incomplete
// @access  Private
const incompleteHabit = async (req, res) => {
  const habit = await Habit.findById(req.params.id);

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  if (habit.userId.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter out today's completion
  const initialLength = habit.completions.length;
  habit.completions = habit.completions.filter(date => {
    const compDate = new Date(date);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() !== today.getTime();
  });

  if (habit.completions.length < initialLength) {
    habit.streak = calculateStreak(habit.completions);
    await habit.save();
    res.status(200).json(habit);
  } else {
    res.status(400).json({ message: 'Habit was not completed today' });
  }
};


module.exports = {
  getHabits,
  addHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  incompleteHabit,
  calculateStreak // Export for testing if needed
};