const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  timeOfDay: { // e.g., 'morning', 'afternoon', 'evening', 'night', 'any'
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night', 'any'],
    default: 'any',
  },
  completions: [
    {
      type: Date,
      default: Date.now,
    },
  ],
  streak: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Habit', HabitSchema);